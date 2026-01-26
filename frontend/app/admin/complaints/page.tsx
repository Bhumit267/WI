'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, X } from 'lucide-react';

const MOCK_ALL_COMPLAINTS = [
    { id: '1', pnr: 'RB102', user: 'user1@gmail.com', operator: 'Kaveri Travels', reason: 'Refund amount mismatch', status: 'OPEN', date: '2 days ago' },
    { id: '2', pnr: 'RB103', user: 'user2@gmail.com', operator: 'VRL', reason: 'Bus cancelled but no refund', status: 'Resolved', date: '5 days ago' },
];

export default function AdminComplaintsPage() {
    return (
        <div className="container py-8 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Complaints Management</h1>

            <div className="space-y-4">
                {MOCK_ALL_COMPLAINTS.map((c) => (
                    <Card key={c.id} className="hover:bg-slate-50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {c.user} <span className="text-slate-400 mx-2">|</span> {c.pnr}
                            </CardTitle>
                            <Badge variant={c.status === 'OPEN' ? 'destructive' : 'outline'}>{c.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-2">Against: {c.operator}</p>
                            <p className="text-slate-800 font-medium mb-4">{c.reason}</p>
                            <div className="flex justify-end gap-2">
                                <Link href={`/admin/complaints/${c.id}`}>
                                    <Button size="sm">
                                        <MessageSquare className="mr-2 h-4 w-4" /> Message User
                                    </Button>
                                </Link>
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                    <Check className="mr-2 h-4 w-4" /> Resolve
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
