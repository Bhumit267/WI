'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, FileWarning, Loader2 } from 'lucide-react';

export default function AdminPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== 'ADMIN') {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Regulator Dashboard</h1>
                <Button variant="destructive">Download Compliance Report</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Delayed Refunds
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-900">142</div>
                        <p className="text-red-600 font-medium">Violating 48h SLA</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-700 flex items-center gap-2">
                            <FileWarning className="w-5 h-5" /> Pending Complaints
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">58</div>
                        <p className="text-slate-500">Awaiting Operator Response</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-700">Avg Market Trust</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">4.1/5.0</div>
                        <p className="text-slate-500">Stable (+0.2%)</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Worst Performing Operators (Last 30 Days)</CardTitle>
                    <CardDescription>Operators with highest refund failure rate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Operator Name</TableHead>
                                <TableHead>Refund Failures</TableHead>
                                <TableHead>Avg Delay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">VRL Logistics</TableCell>
                                <TableCell>24</TableCell>
                                <TableCell>72h</TableCell>
                                <TableCell><span className="text-red-600 font-bold">Critical</span></TableCell>
                                <TableCell className="text-right"><Button variant="outline" size="sm">Issue Notice</Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">SRS Travels</TableCell>
                                <TableCell>11</TableCell>
                                <TableCell>54h</TableCell>
                                <TableCell><span className="text-amber-600 font-bold">Warning</span></TableCell>
                                <TableCell className="text-right"><Button variant="outline" size="sm">Audit</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
