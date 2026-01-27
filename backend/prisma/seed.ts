import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * OpenFare Mock Database Seed
 * 
 * This seed creates a comprehensive, realistic dataset for SaaS demos, dashboards, and analytics.
 * 
 * DATA SUMMARY:
 * - 5 Operators (distinct behavior profiles: excellent, average, poor)
 * - 18 Tickets (6 BOOKED, 7 CANCELLED, 5 REFUNDED)
 * - 12 Refunds (6 SLA-compliant, 4 SLA-violated, 2 in-progress)
 * - 16 Complaints (varied types and statuses)
 * - 12+ Audit Logs (admin actions)
 * - 8 Trust Score Logs (operator performance tracking)
 * - 6 Users (1 admin, 5 passengers)
 */

// Helper: Create dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function main() {
    console.log('🌱 Starting OpenFare database seed...\n');

    // ============================================================================
    // USERS (1 Admin + 5 Passengers)
    // ============================================================================
    console.log('👥 Creating users...');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@openfare.gov' },
        update: {},
        create: {
            email: 'admin@openfare.gov',
            password: 'admin123', // In production, hash this!
            role: 'ADMIN',
            name: 'Regulatory Admin'
        },
    });

    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'rajesh.kumar@gmail.com' },
            update: {},
            create: {
                email: 'rajesh.kumar@gmail.com',
                password: 'user123',
                role: 'USER',
                name: 'Rajesh Kumar'
            },
        }),
        prisma.user.upsert({
            where: { email: 'priya.sharma@gmail.com' },
            update: {},
            create: {
                email: 'priya.sharma@gmail.com',
                password: 'user123',
                role: 'USER',
                name: 'Priya Sharma'
            },
        }),
        prisma.user.upsert({
            where: { email: 'amit.patel@gmail.com' },
            update: {},
            create: {
                email: 'amit.patel@gmail.com',
                password: 'user123',
                role: 'USER',
                name: 'Amit Patel'
            },
        }),
        prisma.user.upsert({
            where: { email: 'sneha.reddy@gmail.com' },
            update: {},
            create: {
                email: 'sneha.reddy@gmail.com',
                password: 'user123',
                role: 'USER',
                name: 'Sneha Reddy'
            },
        }),
        prisma.user.upsert({
            where: { email: 'vikram.singh@gmail.com' },
            update: {},
            create: {
                email: 'vikram.singh@gmail.com',
                password: 'user123',
                role: 'USER',
                name: 'Vikram Singh'
            },
        }),
    ]);

    console.log(`✅ Created ${users.length + 1} users\n`);

    // ============================================================================
    // OPERATORS (5 with distinct behavior profiles)
    // ============================================================================
    console.log('🚌 Creating operators...');

    // EXCELLENT PERFORMER: Fast refunds, minimal complaints
    const vrlTravels = await prisma.operator.upsert({
        where: { name: 'VRL Travels' },
        update: {},
        create: {
            name: 'VRL Travels',
            trustScore: 98.5,
            complaintCount: 2,
            avgRefundTime: 8, // 8 hours - excellent
        },
    });

    // AVERAGE PERFORMER 1: Standard service
    const kaveriTravels = await prisma.operator.upsert({
        where: { name: 'Kaveri Travels' },
        update: {},
        create: {
            name: 'Kaveri Travels',
            trustScore: 85.0,
            complaintCount: 8,
            avgRefundTime: 24, // 24 hours - acceptable
        },
    });

    // AVERAGE PERFORMER 2: Slightly slower
    const orangeTravels = await prisma.operator.upsert({
        where: { name: 'Orange Travels' },
        update: {},
        create: {
            name: 'Orange Travels',
            trustScore: 82.0,
            complaintCount: 12,
            avgRefundTime: 30, // 30 hours - borderline
        },
    });

    // POOR PERFORMER 1: SLA violations
    const srsTravels = await prisma.operator.upsert({
        where: { name: 'SRS Travels' },
        update: {},
        create: {
            name: 'SRS Travels',
            trustScore: 65.0,
            complaintCount: 24,
            avgRefundTime: 55, // 55 hours - SLA violation
        },
    });

    // POOR PERFORMER 2: Frequent SLA violations, high complaints
    const nationalExpress = await prisma.operator.upsert({
        where: { name: 'National Express' },
        update: {},
        create: {
            name: 'National Express',
            trustScore: 58.0,
            complaintCount: 31,
            avgRefundTime: 72, // 72 hours - severe SLA violation
        },
    });

    console.log('✅ Created 5 operators with distinct profiles\n');

    // ============================================================================
    // CANCELLATION POLICIES (Operator-specific)
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
    // TICKETS (18 total: 6 BOOKED, 7 CANCELLED, 5 REFUNDED)
    // ============================================================================
    console.log('🎫 Creating tickets...');

    // --- BOOKED TICKETS (6) ---
    const ticket1 = await prisma.ticket.upsert({
        where: { pnr: 'RB101' },
        update: {},
        create: {
            pnr: 'RB101',
            operatorId: vrlTravels.id,
            status: 'BOOKED',
            cancellationPolicy: generousPolicy,
        },
    });

    const ticket2 = await prisma.ticket.upsert({
        where: { pnr: 'RB102' },
        update: {},
        create: {
            pnr: 'RB102',
            operatorId: kaveriTravels.id,
            status: 'BOOKED',
            cancellationPolicy: standardPolicy,
        },
    });

    const ticket3 = await prisma.ticket.upsert({
        where: { pnr: 'RB103' },
        update: {},
        create: {
            pnr: 'RB103',
            operatorId: orangeTravels.id,
            status: 'BOOKED',
            cancellationPolicy: standardPolicy,
        },
    });

    const ticket4 = await prisma.ticket.upsert({
        where: { pnr: 'RB104' },
        update: {},
        create: {
            pnr: 'RB104',
            operatorId: srsTravels.id,
            status: 'BOOKED',
            cancellationPolicy: strictPolicy,
        },
    });

    const ticket5 = await prisma.ticket.upsert({
        where: { pnr: 'RB105' },
        update: {},
        create: {
            pnr: 'RB105',
            operatorId: nationalExpress.id,
            status: 'BOOKED',
            cancellationPolicy: strictPolicy,
        },
    });

    const ticket6 = await prisma.ticket.upsert({
        where: { pnr: 'RB106' },
        update: {},
        create: {
            pnr: 'RB106',
            operatorId: vrlTravels.id,
            status: 'BOOKED',
            cancellationPolicy: generousPolicy,
        },
    });

    // --- CANCELLED TICKETS WITH REFUNDS IN PROGRESS (7) ---

    // VRL: Fast refund (SLA compliant - 6 hours)
    const ticket7 = await prisma.ticket.upsert({
        where: { pnr: 'RB107' },
        update: {},
        create: {
            pnr: 'RB107',
            operatorId: vrlTravels.id,
            status: 'CANCELLED',
            refundAmount: 1200,
            refundDeadline: daysFromNow(2),
            cancellationPolicy: generousPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 1200,
                    createdAt: hoursAgo(6),
                }
            }
        },
    });

    // Kaveri: Standard refund (SLA compliant - 20 hours)
    const ticket8 = await prisma.ticket.upsert({
        where: { pnr: 'RB108' },
        update: {},
        create: {
            pnr: 'RB108',
            operatorId: kaveriTravels.id,
            status: 'CANCELLED',
            refundAmount: 850,
            refundDeadline: daysFromNow(1),
            cancellationPolicy: standardPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 850,
                    createdAt: hoursAgo(20),
                }
            }
        },
    });

    // Orange: Borderline refund (SLA compliant - 35 hours)
    const ticket9 = await prisma.ticket.upsert({
        where: { pnr: 'RB109' },
        update: {},
        create: {
            pnr: 'RB109',
            operatorId: orangeTravels.id,
            status: 'CANCELLED',
            refundAmount: 950,
            refundDeadline: daysFromNow(1),
            cancellationPolicy: standardPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 950,
                    createdAt: hoursAgo(35),
                }
            }
        },
    });

    // SRS: SLA VIOLATION (55 hours - still pending)
    const ticket10 = await prisma.ticket.upsert({
        where: { pnr: 'RB110' },
        update: {},
        create: {
            pnr: 'RB110',
            operatorId: srsTravels.id,
            status: 'CANCELLED',
            refundAmount: 750,
            refundDeadline: daysAgo(1), // Deadline passed!
            cancellationPolicy: strictPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 750,
                    createdAt: hoursAgo(55), // SLA violation
                }
            }
        },
    });

    // National Express: SEVERE SLA VIOLATION (80 hours)
    const ticket11 = await prisma.ticket.upsert({
        where: { pnr: 'RB111' },
        update: {},
        create: {
            pnr: 'RB111',
            operatorId: nationalExpress.id,
            status: 'CANCELLED',
            refundAmount: 1100,
            refundDeadline: daysAgo(2), // Deadline long passed!
            cancellationPolicy: strictPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 1100,
                    createdAt: hoursAgo(80), // Severe SLA violation
                }
            }
        },
    });

    // SRS: Another SLA violation (60 hours)
    const ticket12 = await prisma.ticket.upsert({
        where: { pnr: 'RB112' },
        update: {},
        create: {
            pnr: 'RB112',
            operatorId: srsTravels.id,
            status: 'CANCELLED',
            refundAmount: 680,
            refundDeadline: daysAgo(1),
            cancellationPolicy: strictPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 680,
                    createdAt: hoursAgo(60), // SLA violation
                }
            }
        },
    });

    // National Express: Third SLA violation (70 hours)
    const ticket13 = await prisma.ticket.upsert({
        where: { pnr: 'RB113' },
        update: {},
        create: {
            pnr: 'RB113',
            operatorId: nationalExpress.id,
            status: 'CANCELLED',
            refundAmount: 920,
            refundDeadline: daysAgo(1),
            cancellationPolicy: strictPolicy,
            refunds: {
                create: {
                    status: 'INITIATED',
                    amount: 920,
                    createdAt: hoursAgo(70), // SLA violation
                }
            }
        },
    });

    // --- REFUNDED TICKETS (5 - completed) ---

    // VRL: Fast completion (5 hours)
    const ticket14 = await prisma.ticket.upsert({
        where: { pnr: 'RB114' },
        update: {},
        create: {
            pnr: 'RB114',
            operatorId: vrlTravels.id,
            status: 'CANCELLED',
            refundAmount: 1350,
            refundDeadline: daysAgo(3),
            cancellationPolicy: generousPolicy,
            refunds: {
                create: {
                    status: 'COMPLETED',
                    amount: 1350,
                    createdAt: daysAgo(3),
                    processedAt: hoursAgo(67), // 5 hours to complete
                }
            }
        },
    });

    // Kaveri: Standard completion (18 hours)
    const ticket15 = await prisma.ticket.upsert({
        where: { pnr: 'RB115' },
        update: {},
        create: {
            pnr: 'RB115',
            operatorId: kaveriTravels.id,
            status: 'CANCELLED',
            refundAmount: 780,
            refundDeadline: daysAgo(4),
            cancellationPolicy: standardPolicy,
            refunds: {
                create: {
                    status: 'COMPLETED',
                    amount: 780,
                    createdAt: daysAgo(4),
                    processedAt: hoursAgo(78), // 18 hours to complete
                }
            }
        },
    });

    // Orange: Acceptable completion (28 hours)
    const ticket16 = await prisma.ticket.upsert({
        where: { pnr: 'RB116' },
        update: {},
        create: {
            pnr: 'RB116',
            operatorId: orangeTravels.id,
            status: 'CANCELLED',
            refundAmount: 890,
            refundDeadline: daysAgo(5),
            cancellationPolicy: standardPolicy,
            refunds: {
                create: {
                    status: 'COMPLETED',
                    amount: 890,
                    createdAt: daysAgo(5),
                    processedAt: hoursAgo(92), // 28 hours to complete
                }
            }
        },
    });

    // VRL: Another fast completion (7 hours)
    const ticket17 = await prisma.ticket.upsert({
        where: { pnr: 'RB117' },
        update: {},
        create: {
            pnr: 'RB117',
            operatorId: vrlTravels.id,
            status: 'CANCELLED',
            refundAmount: 1150,
            refundDeadline: daysAgo(6),
            cancellationPolicy: generousPolicy,
            refunds: {
                create: {
                    status: 'COMPLETED',
                    amount: 1150,
                    createdAt: daysAgo(6),
                    processedAt: hoursAgo(137), // 7 hours to complete
                }
            }
        },
    });

    // Kaveri: Standard completion (22 hours)
    const ticket18 = await prisma.ticket.upsert({
        where: { pnr: 'RB118' },
        update: {},
        create: {
            pnr: 'RB118',
            operatorId: kaveriTravels.id,
            status: 'CANCELLED',
            refundAmount: 820,
            refundDeadline: daysAgo(7),
            cancellationPolicy: standardPolicy,
            refunds: {
                create: {
                    status: 'COMPLETED',
                    amount: 820,
                    createdAt: daysAgo(7),
                    processedAt: hoursAgo(146), // 22 hours to complete
                }
            }
        },
    });

    console.log('✅ Created 18 tickets (6 BOOKED, 7 CANCELLED, 5 REFUNDED)\n');

    // ============================================================================
    // COMPLAINTS (16 total with varied types and statuses)
    // ============================================================================
    console.log('📢 Creating complaints...');

    // REFUND DELAY complaints (6)
    await prisma.complaint.create({
        data: {
            pnr: 'RB110',
            operatorId: srsTravels.id,
            userId: users[0].id,
            reason: 'Refund Delay - Exceeded 48 hour SLA',
            status: 'OPEN',
            createdAt: hoursAgo(50),
            messages: {
                create: [
                    { senderId: users[0].id, content: 'My refund has been pending for over 50 hours. This is unacceptable.', createdAt: hoursAgo(50) },
                    { senderId: admin.id, content: 'We are escalating this to the operator. You should receive your refund within 24 hours.', createdAt: hoursAgo(48) }
                ]
            }
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB111',
            operatorId: nationalExpress.id,
            userId: users[1].id,
            reason: 'Refund Delay - Severe SLA violation',
            status: 'ESCALATED',
            createdAt: hoursAgo(75),
            messages: {
                create: [
                    { senderId: users[1].id, content: 'It has been over 3 days and I still have not received my refund!', createdAt: hoursAgo(75) },
                    { senderId: admin.id, content: 'This has been escalated to regulatory authorities. We will ensure resolution.', createdAt: hoursAgo(70) }
                ]
            }
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB112',
            operatorId: srsTravels.id,
            userId: users[2].id,
            reason: 'Refund Delay',
            status: 'PENDING',
            createdAt: hoursAgo(55),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB113',
            operatorId: nationalExpress.id,
            userId: users[3].id,
            reason: 'Refund Delay - No response from operator',
            status: 'OPEN',
            createdAt: hoursAgo(65),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB108',
            operatorId: kaveriTravels.id,
            userId: users[4].id,
            reason: 'Refund Delay - Approaching SLA deadline',
            status: 'RESOLVED',
            createdAt: hoursAgo(18),
            updatedAt: hoursAgo(2),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB109',
            operatorId: orangeTravels.id,
            userId: users[0].id,
            reason: 'Refund Delay - Slow processing',
            status: 'RESOLVED',
            createdAt: hoursAgo(30),
            updatedAt: hoursAgo(5),
        }
    });

    // POLICY VIOLATION complaints (4)
    await prisma.complaint.create({
        data: {
            pnr: 'RB104',
            operatorId: srsTravels.id,
            userId: users[1].id,
            reason: 'Policy Violation - Operator changed cancellation terms after booking',
            status: 'OPEN',
            createdAt: daysAgo(2),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB105',
            operatorId: nationalExpress.id,
            userId: users[2].id,
            reason: 'Policy Violation - Refund amount does not match policy',
            status: 'ESCALATED',
            createdAt: daysAgo(3),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB115',
            operatorId: kaveriTravels.id,
            userId: users[3].id,
            reason: 'Policy Violation - Incorrect refund percentage applied',
            status: 'RESOLVED',
            createdAt: daysAgo(5),
            updatedAt: daysAgo(4),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB116',
            operatorId: orangeTravels.id,
            userId: users[4].id,
            reason: 'Policy Violation - Hidden cancellation charges',
            status: 'RESOLVED',
            createdAt: daysAgo(6),
            updatedAt: daysAgo(5),
        }
    });

    // STAFF BEHAVIOR complaints (3)
    await prisma.complaint.create({
        data: {
            pnr: 'RB103',
            operatorId: orangeTravels.id,
            userId: users[0].id,
            reason: 'Staff Behavior - Rude customer service representative',
            status: 'PENDING',
            createdAt: daysAgo(1),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB112',
            operatorId: srsTravels.id,
            userId: users[1].id,
            reason: 'Staff Behavior - Unhelpful and dismissive staff',
            status: 'OPEN',
            createdAt: daysAgo(2),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB114',
            operatorId: vrlTravels.id,
            userId: users[2].id,
            reason: 'Staff Behavior - Minor communication issue',
            status: 'RESOLVED',
            createdAt: daysAgo(4),
            updatedAt: daysAgo(3),
        }
    });

    // INCORRECT AMOUNT complaints (3)
    await prisma.complaint.create({
        data: {
            pnr: 'RB115',
            operatorId: kaveriTravels.id,
            userId: users[3].id,
            reason: 'Incorrect Amount - Received ₹500 instead of ₹780',
            status: 'PENDING',
            createdAt: daysAgo(4),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB116',
            operatorId: orangeTravels.id,
            userId: users[4].id,
            reason: 'Incorrect Amount - Partial refund without explanation',
            status: 'OPEN',
            createdAt: daysAgo(5),
        }
    });

    await prisma.complaint.create({
        data: {
            pnr: 'RB118',
            operatorId: kaveriTravels.id,
            userId: users[0].id,
            reason: 'Incorrect Amount - Deduction not mentioned in policy',
            status: 'RESOLVED',
            createdAt: daysAgo(7),
            updatedAt: daysAgo(6),
        }
    });

    console.log('✅ Created 16 complaints (varied types and statuses)\n');

    // ============================================================================
    // SLA CONFIGURATION
    // ============================================================================
    console.log('⚙️ Creating SLA configs...');

    await prisma.sLAConfig.upsert({
        where: { id: 'refund-timeout' },
        update: {},
        create: {
            id: 'refund-timeout',
            type: 'REFUND_TIMEOUT',
            threshold: 48, // 48 hours
            penalty: 0.5, // -0.5 trust score per violation
        }
    });

    await prisma.sLAConfig.upsert({
        where: { id: 'complaint-response' },
        update: {},
        create: {
            id: 'complaint-response',
            type: 'COMPLAINT_RESPONSE',
            threshold: 24, // 24 hours
            penalty: 0.2, // -0.2 trust score per violation
        }
    });

    console.log('✅ Created SLA configs\n');

    // ============================================================================
    // TRUST SCORE LOGS (8 entries tracking operator performance changes)
    // ============================================================================
    console.log('📊 Creating trust score logs...');

    await prisma.trustScoreLog.createMany({
        data: [
            // VRL Travels - Excellent performer, minor adjustment
            {
                operatorId: vrlTravels.id,
                oldScore: 99.0,
                newScore: 98.5,
                reason: 'Minor customer service complaint resolved',
                createdAt: daysAgo(4),
            },
            // SRS Travels - SLA violations
            {
                operatorId: srsTravels.id,
                oldScore: 70.0,
                newScore: 67.5,
                reason: 'SLA Violation - Refund PNR RB110 exceeded 48 hours',
                createdAt: hoursAgo(50),
            },
            {
                operatorId: srsTravels.id,
                oldScore: 67.5,
                newScore: 65.0,
                reason: 'SLA Violation - Refund PNR RB112 exceeded 48 hours',
                createdAt: hoursAgo(55),
            },
            // National Express - Multiple violations
            {
                operatorId: nationalExpress.id,
                oldScore: 65.0,
                newScore: 62.0,
                reason: 'SLA Violation - Refund PNR RB111 exceeded 48 hours',
                createdAt: hoursAgo(75),
            },
            {
                operatorId: nationalExpress.id,
                oldScore: 62.0,
                newScore: 60.0,
                reason: 'Complaint Escalation - Policy violation on PNR RB105',
                createdAt: daysAgo(3),
            },
            {
                operatorId: nationalExpress.id,
                oldScore: 60.0,
                newScore: 58.0,
                reason: 'SLA Violation - Refund PNR RB113 exceeded 48 hours',
                createdAt: hoursAgo(65),
            },
            // Orange Travels - Borderline performance
            {
                operatorId: orangeTravels.id,
                oldScore: 84.0,
                newScore: 82.0,
                reason: 'Multiple complaints regarding staff behavior and refund delays',
                createdAt: daysAgo(6),
            },
            // Kaveri Travels - Stable performance
            {
                operatorId: kaveriTravels.id,
                oldScore: 86.0,
                newScore: 85.0,
                reason: 'Minor policy violation complaint resolved',
                createdAt: daysAgo(5),
            },
        ]
    });

    console.log('✅ Created 8 trust score logs\n');

    // ============================================================================
    // AUDIT LOGS (12+ entries showing admin oversight)
    // ============================================================================
    console.log('📝 Creating audit logs...');

    await prisma.auditLog.createMany({
        data: [
            {
                action: 'SYSTEM_INIT',
                targetId: 'SYSTEM',
                details: 'OpenFare database initialized with production-quality demo data',
                performedBy: admin.id,
                justification: 'Initial system setup',
                createdAt: daysAgo(7),
            },
            {
                action: 'COMPLAINT_APPROVED',
                targetId: 'RB111',
                details: 'Complaint escalated to regulatory authorities - Severe SLA violation by National Express',
                performedBy: admin.id,
                justification: 'Refund pending for 80+ hours, customer distress',
                createdAt: hoursAgo(70),
            },
            {
                action: 'TRUST_SCORE_RECALCULATED',
                targetId: nationalExpress.id,
                details: 'Trust score reduced from 60.0 to 58.0 due to SLA violation',
                performedBy: admin.id,
                justification: 'Automated penalty for exceeding refund SLA',
                createdAt: hoursAgo(65),
            },
            {
                action: 'SLA_VIOLATION_FLAGGED',
                targetId: 'RB110',
                details: 'SRS Travels flagged for SLA violation - Refund pending 55+ hours',
                performedBy: admin.id,
                justification: 'Exceeded 48-hour refund SLA threshold',
                createdAt: hoursAgo(50),
            },
            {
                action: 'COMPLAINT_RESOLVED',
                targetId: 'RB108',
                details: 'Refund delay complaint resolved - Customer received full refund',
                performedBy: admin.id,
                justification: 'Operator processed refund after admin intervention',
                createdAt: hoursAgo(2),
            },
            {
                action: 'COMPLAINT_RESOLVED',
                targetId: 'RB109',
                details: 'Refund delay complaint resolved - Orange Travels completed payment',
                performedBy: admin.id,
                justification: 'Refund completed within acceptable timeframe',
                createdAt: hoursAgo(5),
            },
            {
                action: 'OPERATOR_WARNING_ISSUED',
                targetId: srsTravels.id,
                details: 'Warning issued to SRS Travels for repeated SLA violations',
                performedBy: admin.id,
                justification: 'Multiple refunds exceeding 48-hour threshold',
                createdAt: hoursAgo(55),
            },
            {
                action: 'COMPLAINT_APPROVED',
                targetId: 'RB105',
                details: 'Policy violation complaint escalated - National Express',
                performedBy: admin.id,
                justification: 'Refund amount does not match locked cancellation policy',
                createdAt: daysAgo(3),
            },
            {
                action: 'COMPLAINT_RESOLVED',
                targetId: 'RB115',
                details: 'Policy violation resolved - Kaveri Travels issued correct refund',
                performedBy: admin.id,
                justification: 'Operator acknowledged error and corrected payment',
                createdAt: daysAgo(4),
            },
            {
                action: 'COMPLAINT_RESOLVED',
                targetId: 'RB116',
                details: 'Hidden charges complaint resolved - Orange Travels refunded fees',
                performedBy: admin.id,
                justification: 'Charges not disclosed in cancellation policy',
                createdAt: daysAgo(5),
            },
            {
                action: 'TRUST_SCORE_RECALCULATED',
                targetId: orangeTravels.id,
                details: 'Trust score reduced from 84.0 to 82.0',
                performedBy: admin.id,
                justification: 'Multiple customer complaints regarding service quality',
                createdAt: daysAgo(6),
            },
            {
                action: 'COMPLAINT_RESOLVED',
                targetId: 'RB118',
                details: 'Incorrect amount complaint resolved - Kaveri Travels paid difference',
                performedBy: admin.id,
                justification: 'Deduction error corrected by operator',
                createdAt: daysAgo(6),
            },
        ]
    });

    console.log('✅ Created 12 audit logs\n');

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!\n');
    console.log('📊 DATA SUMMARY:');
    console.log('   • 6 Users (1 admin, 5 passengers)');
    console.log('   • 5 Operators (distinct behavior profiles)');
    console.log('   • 18 Tickets (6 BOOKED, 7 CANCELLED, 5 REFUNDED)');
    console.log('   • 12 Refunds (6 compliant, 4 violated, 2 pending)');
    console.log('   • 16 Complaints (varied types and statuses)');
    console.log('   • 8 Trust Score Logs');
    console.log('   • 12 Audit Logs');
    console.log('   • 2 SLA Configs\n');
    console.log('🎯 OPERATOR PROFILES:');
    console.log('   ✅ VRL Travels: 98.5 score (excellent)');
    console.log('   ✅ Kaveri Travels: 85.0 score (average)');
    console.log('   ⚠️  Orange Travels: 82.0 score (average)');
    console.log('   ❌ SRS Travels: 65.0 score (poor - SLA violations)');
    console.log('   ❌ National Express: 58.0 score (poor - severe violations)\n');
    console.log('🚨 SLA VIOLATIONS:');
    console.log('   • RB110 (SRS): 55 hours');
    console.log('   • RB111 (National): 80 hours');
    console.log('   • RB112 (SRS): 60 hours');
    console.log('   • RB113 (National): 70 hours\n');
    console.log('═══════════════════════════════════════════════════════════');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
