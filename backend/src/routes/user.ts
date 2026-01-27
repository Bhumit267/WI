import { Router, Response } from 'express';
import { eq, desc, and } from 'drizzle-orm';
import { verifyToken, AuthRequest } from '../middleware/auth';
import db, { schema } from '../db';

const router = Router();

// Middleware to ensure user role
const ensureUser = (req: AuthRequest, res: Response, next: Function) => {
    if (req.user?.role !== 'USER') {
        return res.status(403).json({ error: 'Access denied. User role required.' });
    }
    next();
};

/**
 * GET /api/user/dashboard
 * Fetch dashboard data: user profile, tickets, refunds, complaints
 */
router.get('/dashboard', verifyToken, ensureUser, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        // 1. Fetch User Profile
        const user = await db.query.users.findFirst({
            where: eq(schema.users.id, userId),
            columns: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Fetch Tickets associated with the user (including Refund & Operator details)
        const userTickets = await db.query.tickets.findMany({
            where: eq(schema.tickets.userId, userId),
            with: {
                operator: true,
                refunds: true
            },
            orderBy: [desc(schema.tickets.createdAt)]
        });

        // 3. Fetch User Complaints
        const userComplaints = await db.query.complaints.findMany({
            where: eq(schema.complaints.userId, userId),
            with: {
                operator: true
            },
            orderBy: [desc(schema.complaints.createdAt)]
        });

        res.json({
            user,
            tickets: userTickets,
            complaints: userComplaints
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/user/complaint
 * File a new complaint
 */
router.post('/complaint', verifyToken, ensureUser, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { pnr, operatorId, reason, description } = req.body;

        // Validation
        if (!pnr || !operatorId || !reason || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Verify PNR belongs to a ticket (optional: check ownership if strictly required, but PNR is unique)
        // For now, simple insert

        const [complaint] = await db.insert(schema.complaints).values({
            userId,
            pnr,
            operatorId,
            reason,
            status: 'PENDING'
        }).returning();

        // Add the message (description)
        await db.insert(schema.messages).values({
            complaintId: complaint.id,
            senderId: userId,
            content: description,
            read: false
        });

        res.status(201).json({
            message: 'Complaint filed successfully',
            complaintId: complaint.id
        });

    } catch (error) {
        console.error('Complaint filing error:', error);
        res.status(500).json({ error: 'Failed to file complaint. Ensure PNR matches a valid ticket.' });
    }
});

export default router;
