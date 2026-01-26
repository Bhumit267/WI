import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            email: 'admin@gmail.com',
            password: 'admin123', // In production, hash this!
            role: 'ADMIN',
            name: 'System Administrator'
        },
    });

    const user = await prisma.user.upsert({
        where: { email: 'user1@gmail.com' },
        update: {},
        create: {
            email: 'user1@gmail.com',
            password: 'user123', // In production, hash this!
            role: 'USER',
            name: 'Verified Passenger'
        },
    });

    console.log({ admin, user });

    // Create Operator
    const operator = await prisma.operator.upsert({
        where: { name: 'Kaveri Travels' },
        update: {},
        create: {
            name: 'Kaveri Travels',
            trustScore: 4.8,
            complaintCount: 12,
            avgRefundTime: 24, // hours
        },
    });

    console.log({ operator });

    // Create Tickets
    // RB101: Active Ticket
    const ticket1 = await prisma.ticket.upsert({
        where: { pnr: 'RB101' },
        update: {},
        create: {
            pnr: 'RB101',
            operatorId: operator.id,
            status: 'BOOKED',
            cancellationPolicy: JSON.stringify({
                '0-12h': '100% Refund',
                '12-24h': '50% Refund',
                '>24h': 'No Refund'
            }),
        },
    });

    // RB102: Cancelled, Refund Initiated
    const ticket2 = await prisma.ticket.upsert({
        where: { pnr: 'RB102' },
        update: {},
        create: {
            pnr: 'RB102',
            operatorId: operator.id,
            status: 'CANCELLED',
            refundAmount: 500,
            refundDeadline: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
            cancellationPolicy: JSON.stringify({
                '0-12h': '100% Refund',
                '12-24h': '50% Refund',
                '>24h': 'No Refund'
            }),
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 500
                }
            }
        },
    });

    // RB103: Refunded
    const ticket3 = await prisma.ticket.upsert({
        where: { pnr: 'RB103' },
        update: {},
        create: {
            pnr: 'RB103',
            operatorId: operator.id,
            status: 'CANCELLED',
            refundAmount: 850,
            refundDeadline: new Date(),
            cancellationPolicy: JSON.stringify({
                '0-12h': '100% Refund',
                '12-24h': '50% Refund',
                '>24h': 'No Refund'
            }),
            refunds: {
                create: {
                    status: 'COMPLETED',
                    amount: 850,
                    processedAt: new Date()
                }
            }
        },
    });

    // Create Complaint with Messages
    const complaint = await prisma.complaint.upsert({
        where: { id: 'demo-complaint' },
        update: {},
        create: {
            id: 'demo-complaint',
            pnr: 'RB102',
            operatorId: operator.id,
            userId: user.id,
            reason: 'Refund amount mismatch',
            status: 'OPEN',
            messages: {
                create: [
                    { senderId: user.id, content: 'I was promised 100% refund but got 50%.' },
                    { senderId: admin.id, content: 'We are investigating with the operator. Please hold.' }
                ]
            }
        }
    });

    console.log({ ticket1, ticket2, ticket3, complaint });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
