import db, { schema } from './index';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Helper: Create dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function main() {
    console.log('🌱 Starting OpenFare database seed (Drizzle/SQLite)...\n');

    try {
        // Clear existing data (optional, but good for idempotency if running on fresh DB loop)
        // In SQLite, we can just delete from tables. Be careful with foreign keys order.
        // For now, assuming fresh DB or just appending. Drizzle push might wrap it.

        // ============================================================================
        // USERS (1 Admin + 5 Passengers)
        // ============================================================================
        console.log('👥 Creating users...');

        const hashedAdminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
        const hashedUserPassword = await bcrypt.hash('user123', SALT_ROUNDS);

        // Helper to upsert user (using OnConflict do nothing for now since it's fresh)
        const insertUser = async (email: string, role: 'ADMIN' | 'USER', name: string, passwordHash: string) => {
            const [user] = await db.insert(schema.users).values({
                email,
                password: passwordHash,
                role,
                name
            }).onConflictDoUpdate({ target: schema.users.email, set: { name } }).returning();
            return user;
        };

        const admin = await insertUser('admin@openfare.gov', 'ADMIN', 'Regulatory Admin', hashedAdminPassword);

        const userEmails = [
            'rajesh.kumar@gmail.com', 'priya.sharma@gmail.com',
            'amit.patel@gmail.com', 'sneha.reddy@gmail.com', 'vikram.singh@gmail.com'
        ];
        const userNames = [
            'Rajesh Kumar', 'Priya Sharma',
            'Amit Patel', 'Sneha Reddy', 'Vikram Singh'
        ];

        const users = [];
        for (let i = 0; i < userEmails.length; i++) {
            const u = await insertUser(userEmails[i], 'USER', userNames[i], hashedUserPassword);
            users.push(u);
        }

        console.log(`✅ Created ${users.length + 1} users\n`);

        // ============================================================================
        // OPERATORS
        // ============================================================================
        console.log('🚌 Creating operators...');

        const insertOperator = async (data: typeof schema.operators.$inferInsert) => {
            const [op] = await db.insert(schema.operators).values(data)
                .onConflictDoUpdate({ target: schema.operators.name, set: { trustScore: data.trustScore } })
                .returning();
            return op;
        };

        const vrlTravels = await insertOperator({ name: 'VRL Travels', trustScore: 98.5, complaintCount: 2, avgRefundTime: 8 });
        const kaveriTravels = await insertOperator({ name: 'Kaveri Travels', trustScore: 85.0, complaintCount: 8, avgRefundTime: 24 });
        const orangeTravels = await insertOperator({ name: 'Orange Travels', trustScore: 82.0, complaintCount: 12, avgRefundTime: 30 });
        const srsTravels = await insertOperator({ name: 'SRS Travels', trustScore: 65.0, complaintCount: 24, avgRefundTime: 55 });
        const nationalExpress = await insertOperator({ name: 'National Express', trustScore: 58.0, complaintCount: 31, avgRefundTime: 72 });

        console.log('✅ Created 5 operators\n');

        // ============================================================================
        // POLICIES
        // ============================================================================
        const generousPolicy = JSON.stringify({
            '0-24h': '100% Refund',
            '24-48h': '75% Refund',
            '>48h': '50% Refund'
        });
        const standardPolicy = JSON.stringify({
            '0-12h': '100% Refund',
            '12-24h': '50% Refund',
            '>24h': 'No Refund'
        });
        const strictPolicy = JSON.stringify({
            '0-6h': '100% Refund',
            '6-12h': '50% Refund',
            '>12h': 'No Refund'
        });

        // ============================================================================
        // TICKETS
        // ============================================================================
        console.log('🎫 Creating tickets...');

        // Helper to create ticket and optionally refund
        const createTicket = async (
            pnr: string,
            opId: string,
            userId: string | undefined, // Added userId
            status: 'BOOKED' | 'CANCELLED',
            policy: string,
            refundData?: { amount: number, deadline?: Date, status: 'INITIATED' | 'COMPLETED', createdAgo: number, processedAgo?: number }
        ) => {
            // Create Ticket
            const [ticket] = await db.insert(schema.tickets).values({
                pnr,
                operatorId: opId,
                userId: userId, // Link to user
                status,
                cancellationPolicy: policy,
                refundAmount: refundData ? refundData.amount : null,
                refundDeadline: refundData && refundData.deadline ? refundData.deadline : null,
            }).onConflictDoNothing().returning();

            if (!ticket) return null; // Already exists

            // Create Refund if applicable
            if (refundData) {
                await db.insert(schema.refunds).values({
                    ticketId: ticket.id,
                    status: refundData.status,
                    amount: refundData.amount,
                    createdAt: hoursAgo(refundData.createdAgo),
                    processedAt: refundData.processedAgo ? hoursAgo(refundData.processedAgo) : null
                });
            }
            return ticket;
        };

        // Distribute tickets among users (cycling through them)
        // users[0] = Rajesh, [1] = Priya, [2] = Amit, [3] = Sneha, [4] = Vikram

        // BOOKED
        await createTicket('RB101', vrlTravels.id, users[0].id, 'BOOKED', generousPolicy);
        await createTicket('RB102', kaveriTravels.id, users[1].id, 'BOOKED', standardPolicy);
        await createTicket('RB103', orangeTravels.id, users[2].id, 'BOOKED', standardPolicy);
        await createTicket('RB104', srsTravels.id, users[3].id, 'BOOKED', strictPolicy);
        await createTicket('RB105', nationalExpress.id, users[4].id, 'BOOKED', strictPolicy);
        await createTicket('RB106', vrlTravels.id, users[0].id, 'BOOKED', generousPolicy);

        // CANCELLED - INITIATED
        await createTicket('RB107', vrlTravels.id, users[1].id, 'CANCELLED', generousPolicy, { amount: 1200, deadline: daysFromNow(2), status: 'INITIATED', createdAgo: 6 });
        await createTicket('RB108', kaveriTravels.id, users[2].id, 'CANCELLED', standardPolicy, { amount: 850, deadline: daysFromNow(1), status: 'INITIATED', createdAgo: 20 });
        await createTicket('RB109', orangeTravels.id, users[3].id, 'CANCELLED', standardPolicy, { amount: 950, deadline: daysFromNow(1), status: 'INITIATED', createdAgo: 35 });

        // SLA Violations
        await createTicket('RB110', srsTravels.id, users[0].id, 'CANCELLED', strictPolicy, { amount: 750, deadline: daysAgo(1), status: 'INITIATED', createdAgo: 55 });
        await createTicket('RB111', nationalExpress.id, users[1].id, 'CANCELLED', strictPolicy, { amount: 1100, deadline: daysAgo(2), status: 'INITIATED', createdAgo: 80 });
        await createTicket('RB112', srsTravels.id, users[2].id, 'CANCELLED', strictPolicy, { amount: 680, deadline: daysAgo(1), status: 'INITIATED', createdAgo: 60 });
        await createTicket('RB113', nationalExpress.id, users[3].id, 'CANCELLED', strictPolicy, { amount: 920, deadline: daysAgo(1), status: 'INITIATED', createdAgo: 70 });

        // REFUNDED - COMPLETED
        await createTicket('RB114', vrlTravels.id, users[2].id, 'CANCELLED', generousPolicy, { amount: 1350, deadline: daysAgo(3), status: 'COMPLETED', createdAgo: 72, processedAgo: 67 });
        await createTicket('RB115', kaveriTravels.id, users[3].id, 'CANCELLED', standardPolicy, { amount: 780, deadline: daysAgo(4), status: 'COMPLETED', createdAgo: 96, processedAgo: 78 });
        await createTicket('RB116', orangeTravels.id, users[4].id, 'CANCELLED', standardPolicy, { amount: 890, deadline: daysAgo(5), status: 'COMPLETED', createdAgo: 120, processedAgo: 92 });
        await createTicket('RB117', vrlTravels.id, users[0].id, 'CANCELLED', generousPolicy, { amount: 1150, deadline: daysAgo(6), status: 'COMPLETED', createdAgo: 144, processedAgo: 137 });
        await createTicket('RB118', kaveriTravels.id, users[0].id, 'CANCELLED', standardPolicy, { amount: 820, deadline: daysAgo(7), status: 'COMPLETED', createdAgo: 168, processedAgo: 146 });

        console.log('✅ Created tickets and refunds\n');

        // ============================================================================
        // COMPLAINTS & MESSAGES
        // ============================================================================
        console.log('📢 Creating complaints...');

        const createComplaint = async (
            pnr: string,
            opId: string,
            userId: string | undefined, // userId can be undefined if user not found, but we seeded them
            reason: string,
            status: 'PENDING' | 'OPEN' | 'RESOLVED' | 'ESCALATED',
            createdAgoHours: number,
            messagesData: { senderId: string, content: string, createdAgoHours: number }[] = []
        ) => {
            if (!userId) return;

            const [complaint] = await db.insert(schema.complaints).values({
                pnr,
                operatorId: opId,
                userId,
                reason,
                status,
                createdAt: hoursAgo(createdAgoHours),
                updatedAt: hoursAgo(createdAgoHours)
            }).returning();

            for (const msg of messagesData) {
                await db.insert(schema.messages).values({
                    complaintId: complaint.id,
                    senderId: msg.senderId,
                    content: msg.content,
                    createdAt: hoursAgo(msg.createdAgoHours)
                });
            }
        };

        // We rely on users array index matching the original seed
        // users[0] = Rajesh, [1] = Priya, [2] = Amit, [3] = Sneha, [4] = Vikram

        await createComplaint('RB110', srsTravels.id, users[0].id, 'Refund Delay - Exceeded 48 hour SLA', 'OPEN', 50, [
            { senderId: users[0].id, content: 'My refund has been pending for over 50 hours. This is unacceptable.', createdAgoHours: 50 },
            { senderId: admin.id, content: 'We are escalating this to the operator.', createdAgoHours: 48 }
        ]);

        await createComplaint('RB111', nationalExpress.id, users[1].id, 'Refund Delay - Severe SLA violation', 'ESCALATED', 75, [
            { senderId: users[1].id, content: 'Over 3 days and no refund!', createdAgoHours: 75 },
            { senderId: admin.id, content: 'Escalated to regulatory authorities.', createdAgoHours: 70 }
        ]);

        await createComplaint('RB112', srsTravels.id, users[2].id, 'Refund Delay', 'PENDING', 55);
        await createComplaint('RB113', nationalExpress.id, users[3].id, 'Refund Delay - No response', 'OPEN', 65);
        await createComplaint('RB108', kaveriTravels.id, users[4].id, 'Refund Delay - Approaching SLA', 'RESOLVED', 18);
        await createComplaint('RB109', orangeTravels.id, users[0].id, 'Refund Delay - Slow processing', 'RESOLVED', 30);

        // Policy violations
        await createComplaint('RB104', srsTravels.id, users[1].id, 'Policy Violation - Changed terms', 'OPEN', 48);
        await createComplaint('RB105', nationalExpress.id, users[2].id, 'Policy Violation - Refund mismatch', 'ESCALATED', 72);
        await createComplaint('RB115', kaveriTravels.id, users[3].id, 'Policy Violation - Incorrect percentage', 'RESOLVED', 120);
        await createComplaint('RB116', orangeTravels.id, users[4].id, 'Policy Violation - Hidden charges', 'RESOLVED', 144);

        console.log('✅ Created complaints\n');

        // ============================================================================
        // SLA CONFIG & TRUST SCORE LOGS
        // ============================================================================
        console.log('⚙️ Creating SLA configs and logs...');

        await db.insert(schema.slaConfig).values([
            { id: 'refund-timeout', type: 'REFUND_TIMEOUT', threshold: 48, penalty: 0.5 },
            { id: 'complaint-response', type: 'COMPLAINT_RESPONSE', threshold: 24, penalty: 0.2 }
        ]).onConflictDoNothing();

        await db.insert(schema.trustScoreLogs).values([
            { operatorId: vrlTravels.id, oldScore: 99.0, newScore: 98.5, reason: 'Minor complaint', createdAt: daysAgo(4) },
            { operatorId: srsTravels.id, oldScore: 70.0, newScore: 67.5, reason: 'SLA Violation RB110', createdAt: hoursAgo(50) },
            { operatorId: srsTravels.id, oldScore: 67.5, newScore: 65.0, reason: 'SLA Violation RB112', createdAt: hoursAgo(55) },
            { operatorId: nationalExpress.id, oldScore: 65.0, newScore: 62.0, reason: 'SLA Violation RB111', createdAt: hoursAgo(75) }
        ]);

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

main();
