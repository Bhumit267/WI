import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// HELPER: Current timestamp
const now = sql`(strftime('%s', 'now') * 1000)`;

// ============================================================================
// USERS
// ============================================================================
export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role').notNull(), // 'USER', 'ADMIN'
    name: text('name'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// OPERATORS
// ============================================================================
export const operators = sqliteTable('operators', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull().unique(),
    trustScore: real('trust_score').default(100.0),
    complaintCount: integer('complaint_count').default(0),
    avgRefundTime: integer('avg_refund_time').default(0), // in hours
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// TICKETS
// ============================================================================
export const tickets = sqliteTable('tickets', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    pnr: text('pnr').notNull().unique(),
    operatorId: text('operator_id').notNull().references(() => operators.id),
    userId: text('user_id').references(() => users.id), // Added for User Dashboard
    status: text('status').notNull(), // 'BOOKED', 'CANCELLED'
    refundAmount: real('refund_amount'),
    refundDeadline: integer('refund_deadline', { mode: 'timestamp' }),
    cancellationPolicy: text('cancellation_policy').notNull(), // JSON string
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// REFUNDS
// ============================================================================
export const refunds = sqliteTable('refunds', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticketId: text('ticket_id').notNull().references(() => tickets.id),
    status: text('status').notNull(), // 'INITIATED', 'COMPLETED'
    amount: real('amount').notNull(),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// COMPLAINTS
// ============================================================================
export const complaints = sqliteTable('complaints', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    pnr: text('pnr').notNull().references(() => tickets.pnr),
    operatorId: text('operator_id').notNull().references(() => operators.id),
    userId: text('user_id').references(() => users.id),
    reason: text('reason').notNull(),
    status: text('status').notNull(), // 'PENDING', 'OPEN', 'RESOLVED', 'ESCALATED'
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// MESSAGES
// ============================================================================
export const messages = sqliteTable('messages', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    complaintId: text('complaint_id').notNull().references(() => complaints.id),
    senderId: text('sender_id').notNull().references(() => users.id),
    content: text('content').notNull(),
    read: integer('read', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// AUDIT LOGS
// ============================================================================
export const auditLogs = sqliteTable('audit_logs', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    action: text('action').notNull(), // 'RESOLVE_COMPLAINT', etc.
    targetId: text('target_id').notNull(),
    details: text('details').notNull(),
    justification: text('justification'),
    performedBy: text('performed_by').notNull().references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// TRUST SCORE LOGS
// ============================================================================
export const trustScoreLogs = sqliteTable('trust_score_logs', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    operatorId: text('operator_id').notNull().references(() => operators.id),
    oldScore: real('old_score').notNull(),
    newScore: real('new_score').notNull(),
    reason: text('reason').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(now),
});

// ============================================================================
// SLA CONFIG
// ============================================================================
export const slaConfig = sqliteTable('sla_config', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: text('type').notNull(), // 'REFUND_TIMEOUT', etc.
    threshold: integer('threshold').notNull(),
    penalty: real('penalty').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(now),
});
