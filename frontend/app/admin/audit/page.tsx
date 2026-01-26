'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Scroll, User, AlertCircle } from "lucide-react";

// Mock Data
const MOCK_LOGS = [
    { id: 'LOG-001', action: 'RESOLVE_COMPLAINT', target: 'Complaint #1', admin: 'sysadmin', justification: 'User confirmed refund receipt', timestamp: '2023-11-01 10:00 AM' },
    { id: 'LOG-002', action: 'UPDATE_TRUST_SCORE', target: 'Kaveri Travels', admin: 'system_cron', justification: 'SLA Recalculation', timestamp: '2023-11-01 00:00 AM' },
    { id: 'LOG-003', action: 'SUSPEND_OPERATOR', target: 'VRL Logistics', admin: 'senior_regulator', justification: 'Multiple Policy Violations', timestamp: '2023-10-28 04:30 PM' },
];

export default function AuditLogPage() {
    return (
        <div className="container py-12 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">System Audit Logs</h1>
                    <p className="text-xl text-slate-500">Immutable record of all administrative actions.</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
                    <Scroll className="w-4 h-4" /> Export Data (CSV)
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Actions requiring justification are highlighted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Log ID</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead>Justification</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_LOGS.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs text-slate-500">{log.id}</TableCell>
                                    <TableCell className="text-sm">{log.timestamp}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.target}</TableCell>
                                    <TableCell className="text-sm flex items-center gap-2">
                                        <User className="w-3 h-3 text-slate-400" /> {log.admin}
                                    </TableCell>
                                    <TableCell className="text-sm italic text-slate-600">"{log.justification}"</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
