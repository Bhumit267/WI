'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MessageSquare } from 'lucide-react';

const MOCK_MY_COMPLAINTS = [
    { id: '1', pnr: 'RB102', operator: 'Kaveri Travels', reason: 'Refund amount mismatch', status: 'OPEN', date: '2 days ago' },
];

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return <div className="p-8">Please Login</div>;

    return (
        <div className="container py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
                    <p className="text-slate-500">Track your grievances and resolutions.</p>
                </div>
                <Link href="/dashboard/new">
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> New Complaint</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {MOCK_MY_COMPLAINTS.map((c) => (
                    <Card key={c.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg">PNR: {c.pnr}</CardTitle>
                                <Badge variant={c.status === 'OPEN' ? 'default' : 'secondary'}>{c.status}</Badge>
                            </div>
                            <CardDescription>{c.operator} • {c.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 mb-4">{c.reason}</p>
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm">
                                    <MessageSquare className="mr-2 h-4 w-4" /> View Messages
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {MOCK_MY_COMPLAINTS.length === 0 && (
                    <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                        No active complaints found.
                    </div>
                )}
            </div>
        </div>
    );
}
