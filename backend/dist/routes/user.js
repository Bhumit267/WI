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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../middleware/auth");
const db_1 = __importStar(require("../db"));
const router = (0, express_1.Router)();
// Middleware to ensure user role
const ensureUser = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'USER') {
        return res.status(403).json({ error: 'Access denied. User role required.' });
    }
    next();
};
/**
 * GET /api/user/dashboard
 * Fetch dashboard data: user profile, tickets, refunds, complaints
 */
router.get('/dashboard', auth_1.verifyToken, ensureUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        // 1. Fetch User Profile
        const user = yield db_1.default.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(db_1.schema.users.id, userId),
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
        const userTickets = yield db_1.default.query.tickets.findMany({
            where: (0, drizzle_orm_1.eq)(db_1.schema.tickets.userId, userId),
            with: {
                operator: true,
                refunds: true
            },
            orderBy: [(0, drizzle_orm_1.desc)(db_1.schema.tickets.createdAt)]
        });
        // 3. Fetch User Complaints
        const userComplaints = yield db_1.default.query.complaints.findMany({
            where: (0, drizzle_orm_1.eq)(db_1.schema.complaints.userId, userId),
            with: {
                operator: true
            },
            orderBy: [(0, drizzle_orm_1.desc)(db_1.schema.complaints.createdAt)]
        });
        res.json({
            user,
            tickets: userTickets,
            complaints: userComplaints
        });
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
/**
 * POST /api/user/complaint
 * File a new complaint
 */
router.post('/complaint', auth_1.verifyToken, ensureUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { pnr, operatorId, reason, description } = req.body;
        // Validation
        if (!pnr || !operatorId || !reason || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Verify PNR belongs to a ticket (optional: check ownership if strictly required, but PNR is unique)
        // For now, simple insert
        const [complaint] = yield db_1.default.insert(db_1.schema.complaints).values({
            userId,
            pnr,
            operatorId,
            reason,
            status: 'PENDING'
        }).returning();
        // Add the message (description)
        yield db_1.default.insert(db_1.schema.messages).values({
            complaintId: complaint.id,
            senderId: userId,
            content: description,
            read: false
        });
        res.status(201).json({
            message: 'Complaint filed successfully',
            complaintId: complaint.id
        });
    }
    catch (error) {
        console.error('Complaint filing error:', error);
        res.status(500).json({ error: 'Failed to file complaint. Ensure PNR matches a valid ticket.' });
    }
}));
exports.default = router;
