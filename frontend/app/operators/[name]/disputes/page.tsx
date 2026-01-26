'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from 'next/link';

// Mock Data
const MOCK_DISPUTES = [
    { id: 'D-101', date: '2023-11-01', type: 'Refund Delay', status: 'Resolved', resolutionTime: '12h' },
    { id: 'D-105', date: '2023-10-25', type: 'Policy Violation', status: 'Escalated', resolutionTime: 'Pending' },
    { id: 'D-112', date: '2023-09-15', type: 'Hidden Charges', status: 'Resolved', resolutionTime: '48h' },
];

export default function OperatorDisputesPage() {
    const params = useParams();
    const name = typeof params.name === 'string' ? decodeURIComponent(params.name) : 'Operator';

    return (
        <div className="container py-12 space-y-8 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href={`/operators/${name}`} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{name}: Dispute History</h1>
                    <p className="text-slate-500">Public record of validated grievances.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Disputes (L90D)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">14</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Escalation Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">7.1%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Avg Resolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">22h</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Resolution Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_DISPUTES.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell className="font-medium">{d.id}</TableCell>
                                    <TableCell>{d.date}</TableCell>
                                    <TableCell>{d.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={d.status === 'Resolved' ? 'outline' : 'destructive'}>{d.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{d.resolutionTime}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
