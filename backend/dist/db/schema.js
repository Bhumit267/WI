"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slaConfig = exports.trustScoreLogs = exports.auditLogs = exports.messages = exports.complaints = exports.refunds = exports.tickets = exports.operators = exports.users = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
// HELPER: Current timestamp
const now = (0, drizzle_orm_1.sql) `(strftime('%s', 'now') * 1000)`;
// ============================================================================
// USERS
// ============================================================================
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: (0, sqlite_core_1.text)('email').notNull().unique(),
    password: (0, sqlite_core_1.text)('password').notNull(),
    role: (0, sqlite_core_1.text)('role').notNull(), // 'USER', 'ADMIN'
    name: (0, sqlite_core_1.text)('name'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// OPERATORS
// ============================================================================
exports.operators = (0, sqlite_core_1.sqliteTable)('operators', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: (0, sqlite_core_1.text)('name').notNull().unique(),
    trustScore: (0, sqlite_core_1.real)('trust_score').default(100.0),
    complaintCount: (0, sqlite_core_1.integer)('complaint_count').default(0),
    avgRefundTime: (0, sqlite_core_1.integer)('avg_refund_time').default(0), // in hours
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// TICKETS
// ============================================================================
exports.tickets = (0, sqlite_core_1.sqliteTable)('tickets', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    pnr: (0, sqlite_core_1.text)('pnr').notNull().unique(),
    operatorId: (0, sqlite_core_1.text)('operator_id').notNull().references(() => exports.operators.id),
    userId: (0, sqlite_core_1.text)('user_id').references(() => exports.users.id), // Added for User Dashboard
    status: (0, sqlite_core_1.text)('status').notNull(), // 'BOOKED', 'CANCELLED'
    refundAmount: (0, sqlite_core_1.real)('refund_amount'),
    refundDeadline: (0, sqlite_core_1.integer)('refund_deadline', { mode: 'timestamp' }),
    cancellationPolicy: (0, sqlite_core_1.text)('cancellation_policy').notNull(), // JSON string
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// REFUNDS
// ============================================================================
exports.refunds = (0, sqlite_core_1.sqliteTable)('refunds', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticketId: (0, sqlite_core_1.text)('ticket_id').notNull().references(() => exports.tickets.id),
    status: (0, sqlite_core_1.text)('status').notNull(), // 'INITIATED', 'COMPLETED'
    amount: (0, sqlite_core_1.real)('amount').notNull(),
    processedAt: (0, sqlite_core_1.integer)('processed_at', { mode: 'timestamp' }),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// COMPLAINTS
// ============================================================================
exports.complaints = (0, sqlite_core_1.sqliteTable)('complaints', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    pnr: (0, sqlite_core_1.text)('pnr').notNull().references(() => exports.tickets.pnr),
    operatorId: (0, sqlite_core_1.text)('operator_id').notNull().references(() => exports.operators.id),
    userId: (0, sqlite_core_1.text)('user_id').references(() => exports.users.id),
    reason: (0, sqlite_core_1.text)('reason').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(), // 'PENDING', 'OPEN', 'RESOLVED', 'ESCALATED'
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// MESSAGES
// ============================================================================
exports.messages = (0, sqlite_core_1.sqliteTable)('messages', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    complaintId: (0, sqlite_core_1.text)('complaint_id').notNull().references(() => exports.complaints.id),
    senderId: (0, sqlite_core_1.text)('sender_id').notNull().references(() => exports.users.id),
    content: (0, sqlite_core_1.text)('content').notNull(),
    read: (0, sqlite_core_1.integer)('read', { mode: 'boolean' }).default(false),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// AUDIT LOGS
// ============================================================================
exports.auditLogs = (0, sqlite_core_1.sqliteTable)('audit_logs', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    action: (0, sqlite_core_1.text)('action').notNull(), // 'RESOLVE_COMPLAINT', etc.
    targetId: (0, sqlite_core_1.text)('target_id').notNull(),
    details: (0, sqlite_core_1.text)('details').notNull(),
    justification: (0, sqlite_core_1.text)('justification'),
    performedBy: (0, sqlite_core_1.text)('performed_by').notNull().references(() => exports.users.id),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// TRUST SCORE LOGS
// ============================================================================
exports.trustScoreLogs = (0, sqlite_core_1.sqliteTable)('trust_score_logs', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    operatorId: (0, sqlite_core_1.text)('operator_id').notNull().references(() => exports.operators.id),
    oldScore: (0, sqlite_core_1.real)('old_score').notNull(),
    newScore: (0, sqlite_core_1.real)('new_score').notNull(),
    reason: (0, sqlite_core_1.text)('reason').notNull(),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).default(now),
});
// ============================================================================
// SLA CONFIG
// ============================================================================
exports.slaConfig = (0, sqlite_core_1.sqliteTable)('sla_config', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: (0, sqlite_core_1.text)('type').notNull(), // 'REFUND_TIMEOUT', etc.
    threshold: (0, sqlite_core_1.integer)('threshold').notNull(),
    penalty: (0, sqlite_core_1.real)('penalty').notNull(),
    updatedAt: (0, sqlite_core_1.integer)('updated_at', { mode: 'timestamp' }).default(now),
});
