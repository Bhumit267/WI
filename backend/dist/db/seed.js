"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("./index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
// Helper: Create dates relative to now
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Starting OpenFare database seed (Drizzle/SQLite)...\n');
        try {
            // Clear existing data (optional, but good for idempotency if running on fresh DB loop)
            // In SQLite, we can just delete from tables. Be careful with foreign keys order.
            // For now, assuming fresh DB or just appending. Drizzle push might wrap it.
            // ============================================================================
            // USERS (1 Admin + 5 Passengers)
            // ============================================================================
            console.log('👥 Creating users...');
            const hashedAdminPassword = yield bcrypt_1.default.hash('admin123', SALT_ROUNDS);
            const hashedUserPassword = yield bcrypt_1.default.hash('user123', SALT_ROUNDS);
            // Helper to upsert user (using OnConflict do nothing for now since it's fresh)
            const insertUser = (email, role, name, passwordHash) => __awaiter(this, void 0, void 0, function* () {
                const [user] = yield index_1.default.insert(index_1.schema.users).values({
                    email,
                    password: passwordHash,
                    role,
                    name
                }).onConflictDoUpdate({ target: index_1.schema.users.email, set: { name } }).returning();
                return user;
            });
            const admin = yield insertUser('admin@openfare.gov', 'ADMIN', 'Regulatory Admin', hashedAdminPassword);
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
                const u = yield insertUser(userEmails[i], 'USER', userNames[i], hashedUserPassword);
                users.push(u);
            }
            console.log(`✅ Created ${users.length + 1} users\n`);
            // ============================================================================
            // OPERATORS
            // ============================================================================
            console.log('🚌 Creating operators...');
            const insertOperator = (data) => __awaiter(this, void 0, void 0, function* () {
                const [op] = yield index_1.default.insert(index_1.schema.operators).values(data)
                    .onConflictDoUpdate({ target: index_1.schema.operators.name, set: { trustScore: data.trustScore } })
                    .returning();
                return op;
            });
            const vrlTravels = yield insertOperator({ name: 'VRL Travels', trustScore: 98.5, complaintCount: 2, avgRefundTime: 8 });
            const kaveriTravels = yield insertOperator({ name: 'Kaveri Travels', trustScore: 85.0, complaintCount: 8, avgRefundTime: 24 });
            const orangeTravels = yield insertOperator({ name: 'Orange Travels', trustScore: 82.0, complaintCount: 12, avgRefundTime: 30 });
            const srsTravels = yield insertOperator({ name: 'SRS Travels', trustScore: 65.0, complaintCount: 24, avgRefundTime: 55 });
            const nationalExpress = yield insertOperator({ name: 'National Express', trustScore: 58.0, complaintCount: 31, avgRefundTime: 72 });
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
            const createTicket = (pnr, opId, userId, // Added userId
            status, policy, refundData) => __awaiter(this, void 0, void 0, function* () {
                // Create Ticket
                const [ticket] = yield index_1.default.insert(index_1.schema.tickets).values({
                    pnr,
                    operatorId: opId,
                    userId: userId, // Link to user
                    status,
                    cancellationPolicy: policy,
                    refundAmount: refundData ? refundData.amount : null,
                    refundDeadline: refundData && refundData.deadline ? refundData.deadline : null,
                }).onConflictDoNothing().returning();
                if (!ticket)
                    return null; // Already exists
                // Create Refund if applicable
                if (refundData) {
                    yield index_1.default.insert(index_1.schema.refunds).values({
                        ticketId: ticket.id,
                        status: refundData.status,
                        amount: refundData.amount,
                        createdAt: hoursAgo(refundData.createdAgo),
                        processedAt: refundData.processedAgo ? hoursAgo(refundData.processedAgo) : null
                    });
                }
                return ticket;
            });
            // Distribute tickets among users (cycling through them)
            // users[0] = Rajesh, [1] = Priya, [2] = Amit, [3] = Sneha, [4] = Vikram
            // BOOKED
            yield createTicket('RB101', vrlTravels.id, users[0].id, 'BOOKED', generousPolicy);
            yield createTicket('RB102', kaveriTravels.id, users[1].id, 'BOOKED', standardPolicy);
            yield createTicket('RB103', orangeTravels.id, users[2].id, 'BOOKED', standardPolicy);
            yield createTicket('RB104', srsTravels.id, users[3].id, 'BOOKED', strictPolicy);
            yield createTicket('RB105', nationalExpress.id, users[4].id, 'BOOKED', strictPolicy);
            yield createTicket('RB106', vrlTravels.id, users[0].id, 'BOOKED', generousPolicy);
            // CANCELLED - INITIATED
            yield createTicket('RB107', vrlTravels.id, users[1].id, 'CANCELLED', generousPolicy, { amount: 1200, deadline: daysFromNow(2), status: 'INITIATED', createdAgo: 6 });
            yield createTicket('RB108', kaveriTravels.id, users[2].id, 'CANCELLED', standardPolicy, { amount: 850, deadline: daysFromNow(1), status: 'INITIATED', createdAgo: 20 });
            yield createTicket('RB109', orangeTravels.id, users[3].id, 'CANCELLED', standardPolicy, { amount: 950, deadline: daysFromNow(1), status: 'INITIATED', createdAgo: 35 });
            // SLA Violations
            yield createTicket('RB110', srsTravels.id, users[0].id, 'CANCELLED', strictPolicy, { amount: 750, deadline: daysAgo(1), status: 'INITIATED', createdAgo: 55 });
            yield createTicket('RB111', nationalExpress.id, users[1].id, 'CANCELLED', strictPolicy, { amount: 1100, deadline: daysAgo(2), status: 'INITIATED', createdAgo: 80 });
            yield createTicket('RB112', srsTravels.id, users[2].id, 'CANCELLED', strictPolicy, { amount: 680, deadline: daysAgo(1), status: 'INITIATED', createdAgo: 60 });
            yield createTicket('RB113', nationalExpress.id, users[3].id, 'CANCELLED', strictPolicy, { amount: 920, deadline: daysAgo(1), status: 'INITIATED', createdAgo: 70 });
            // REFUNDED - COMPLETED
            yield createTicket('RB114', vrlTravels.id, users[2].id, 'CANCELLED', generousPolicy, { amount: 1350, deadline: daysAgo(3), status: 'COMPLETED', createdAgo: 72, processedAgo: 67 });
            yield createTicket('RB115', kaveriTravels.id, users[3].id, 'CANCELLED', standardPolicy, { amount: 780, deadline: daysAgo(4), status: 'COMPLETED', createdAgo: 96, processedAgo: 78 });
            yield createTicket('RB116', orangeTravels.id, users[4].id, 'CANCELLED', standardPolicy, { amount: 890, deadline: daysAgo(5), status: 'COMPLETED', createdAgo: 120, processedAgo: 92 });
            yield createTicket('RB117', vrlTravels.id, users[0].id, 'CANCELLED', generousPolicy, { amount: 1150, deadline: daysAgo(6), status: 'COMPLETED', createdAgo: 144, processedAgo: 137 });
            yield createTicket('RB118', kaveriTravels.id, users[0].id, 'CANCELLED', standardPolicy, { amount: 820, deadline: daysAgo(7), status: 'COMPLETED', createdAgo: 168, processedAgo: 146 });
            console.log('✅ Created tickets and refunds\n');
            // ============================================================================
            // COMPLAINTS & MESSAGES
            // ============================================================================
            console.log('📢 Creating complaints...');
            const createComplaint = (pnr_1, opId_1, userId_1, reason_1, status_1, createdAgoHours_1, ...args_1) => __awaiter(this, [pnr_1, opId_1, userId_1, reason_1, status_1, createdAgoHours_1, ...args_1], void 0, function* (pnr, opId, userId, // userId can be undefined if user not found, but we seeded them
            reason, status, createdAgoHours, messagesData = []) {
                if (!userId)
                    return;
                const [complaint] = yield index_1.default.insert(index_1.schema.complaints).values({
                    pnr,
                    operatorId: opId,
                    userId,
                    reason,
                    status,
                    createdAt: hoursAgo(createdAgoHours),
                    updatedAt: hoursAgo(createdAgoHours)
                }).returning();
                for (const msg of messagesData) {
                    yield index_1.default.insert(index_1.schema.messages).values({
                        complaintId: complaint.id,
                        senderId: msg.senderId,
                        content: msg.content,
                        createdAt: hoursAgo(msg.createdAgoHours)
                    });
                }
            });
            // We rely on users array index matching the original seed
            // users[0] = Rajesh, [1] = Priya, [2] = Amit, [3] = Sneha, [4] = Vikram
            yield createComplaint('RB110', srsTravels.id, users[0].id, 'Refund Delay - Exceeded 48 hour SLA', 'OPEN', 50, [
                { senderId: users[0].id, content: 'My refund has been pending for over 50 hours. This is unacceptable.', createdAgoHours: 50 },
                { senderId: admin.id, content: 'We are escalating this to the operator.', createdAgoHours: 48 }
            ]);
            yield createComplaint('RB111', nationalExpress.id, users[1].id, 'Refund Delay - Severe SLA violation', 'ESCALATED', 75, [
                { senderId: users[1].id, content: 'Over 3 days and no refund!', createdAgoHours: 75 },
                { senderId: admin.id, content: 'Escalated to regulatory authorities.', createdAgoHours: 70 }
            ]);
            yield createComplaint('RB112', srsTravels.id, users[2].id, 'Refund Delay', 'PENDING', 55);
            yield createComplaint('RB113', nationalExpress.id, users[3].id, 'Refund Delay - No response', 'OPEN', 65);
            yield createComplaint('RB108', kaveriTravels.id, users[4].id, 'Refund Delay - Approaching SLA', 'RESOLVED', 18);
            yield createComplaint('RB109', orangeTravels.id, users[0].id, 'Refund Delay - Slow processing', 'RESOLVED', 30);
            // Policy violations
            yield createComplaint('RB104', srsTravels.id, users[1].id, 'Policy Violation - Changed terms', 'OPEN', 48);
            yield createComplaint('RB105', nationalExpress.id, users[2].id, 'Policy Violation - Refund mismatch', 'ESCALATED', 72);
            yield createComplaint('RB115', kaveriTravels.id, users[3].id, 'Policy Violation - Incorrect percentage', 'RESOLVED', 120);
            yield createComplaint('RB116', orangeTravels.id, users[4].id, 'Policy Violation - Hidden charges', 'RESOLVED', 144);
            console.log('✅ Created complaints\n');
            // ============================================================================
            // SLA CONFIG & TRUST SCORE LOGS
            // ============================================================================
            console.log('⚙️ Creating SLA configs and logs...');
            yield index_1.default.insert(index_1.schema.slaConfig).values([
                { id: 'refund-timeout', type: 'REFUND_TIMEOUT', threshold: 48, penalty: 0.5 },
                { id: 'complaint-response', type: 'COMPLAINT_RESPONSE', threshold: 24, penalty: 0.2 }
            ]).onConflictDoNothing();
            yield index_1.default.insert(index_1.schema.trustScoreLogs).values([
                { operatorId: vrlTravels.id, oldScore: 99.0, newScore: 98.5, reason: 'Minor complaint', createdAt: daysAgo(4) },
                { operatorId: srsTravels.id, oldScore: 70.0, newScore: 67.5, reason: 'SLA Violation RB110', createdAt: hoursAgo(50) },
                { operatorId: srsTravels.id, oldScore: 67.5, newScore: 65.0, reason: 'SLA Violation RB112', createdAt: hoursAgo(55) },
                { operatorId: nationalExpress.id, oldScore: 65.0, newScore: 62.0, reason: 'SLA Violation RB111', createdAt: hoursAgo(75) }
            ]);
            console.log('✅ Seeding completed successfully!');
        }
        catch (error) {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        }
    });
}
main();
