'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, AlertCircle, CheckCircle2, Clock, Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Types aligning with backend response
interface Refund {
    amount: number;
    status: 'INITIATED' | 'COMPLETED';
    processedAt: string | null;
    createdAt: string;
}

interface Operator {
    id: string;
    name: string;
}

interface Ticket {
    id: string;
    pnr: string;
    status: 'BOOKED' | 'CANCELLED';
    refundAmount: number | null;
    operator: Operator;
    refunds: Refund[];
    cancellationPolicy: string;
}

interface Complaint {
    id: string;
    pnr: string;
    reason: string;
    status: 'PENDING' | 'OPEN' | 'RESOLVED' | 'ESCALATED';
    createdAt: string;
    operator: Operator;
}

interface DashboardData {
    user: {
        name: string;
        email: string;
    };
    tickets: Ticket[];
    complaints: Complaint[];
}

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Redirect if not logged in (handled by Layout ideally, but double check here)
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading, router]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/user/dashboard', {
                credentials: 'include' // Send auth cookies
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch dashboard data');
            }

            const jsonData = await res.json();
            setData(jsonData);
        } catch (err) {
            console.error(err);
            setError('Could not load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-8 text-center text-red-600">
                <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">{error}</h2>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    if (!data) return null;

    // Calculate Refund Stats
    const refunds = data.tickets.flatMap(t => t.refunds);
    const totalRefunded = refunds
        .filter(r => r.status === 'COMPLETED')
        .reduce((sum, r) => sum + r.amount, 0);

    const pendingRefunds = refunds.filter(r => r.status === 'INITIATED');
    const completedRefunds = refunds.filter(r => r.status === 'COMPLETED');
    // Simplified checks for violations (would need date logic, assuming mock data tracks this or we simplify)
    // For this UI, let's just count pending ones as "processing"

    return (
        <div className="container py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {data.user.name}</h1>
                    <p className="text-slate-500">Track your refunds and manage complaints efficiently.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/new-complaint">
                        <Plus className="mr-2 h-4 w-4" /> File New Complaint
                    </Link>
                </Button>
            </div>

            {/* Refund Overview */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Refund Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending Card */}
                    <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-amber-500" /> Pending Refunds
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingRefunds.length}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                Totaling ₹{pendingRefunds.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Completed Card */}
                    <Card className="border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Completed Refunds
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedRefunds.length}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                Successfully credited to source
                            </p>
                        </CardContent>
                    </Card>

                    {/* Violation Mock Card (Or Total Value) */}
                    <Card className="border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 flex items-center">
                                <RefreshCcw className="mr-2 h-4 w-4 text-blue-600" /> Total Refunded
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{totalRefunded.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                Lifetime refund value
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Recent Complaints */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">My Complaints</h2>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Complaint ID</TableHead>
                                    <TableHead>PNR</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Operator</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.complaints.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                            No complaints found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.complaints.map((complaint) => (
                                        <TableRow key={complaint.id}>
                                            <TableCell className="font-mono text-xs">{complaint.id.slice(0, 8)}...</TableCell>
                                            <TableCell className="font-medium">{complaint.pnr}</TableCell>
                                            <TableCell>{complaint.reason}</TableCell>
                                            <TableCell>{complaint.operator.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        complaint.status === 'RESOLVED' ? 'default' :
                                                            complaint.status === 'PENDING' ? 'secondary' :
                                                                'destructive'
                                                    }
                                                    className={
                                                        complaint.status === 'RESOLVED' ? 'bg-green-600 hover:bg-green-700' :
                                                            complaint.status === 'PENDING' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                                                                ''
                                                    }
                                                >
                                                    {complaint.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>

            {/* Recent Tickets / Refund Status Details */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Tickets & Refund Status</h2>
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PNR</TableHead>
                                    <TableHead>Operator</TableHead>
                                    <TableHead>Booking Status</TableHead>
                                    <TableHead>Refund Status</TableHead>
                                    <TableHead className="text-right">Refund Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.tickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                            No tickets found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.tickets.slice(0, 5).map((ticket) => {
                                        const refund = ticket.refunds[0]; // Assuming 1 refund per ticket for display
                                        return (
                                            <TableRow key={ticket.id}>
                                                <TableCell className="font-medium">{ticket.pnr}</TableCell>
                                                <TableCell>{ticket.operator.name}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ticket.status === 'BOOKED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {refund ? (
                                                        <span className={`inline-flex items-center gap-1 text-sm ${refund.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'
                                                            }`}>
                                                            {refund.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                            {refund.status}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {refund ? `₹${refund.amount}` : '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
