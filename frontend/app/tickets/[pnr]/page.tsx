'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock Data for frontend demo until backend is connected
const MOCK_DB: Record<string, any> = {
    'RB101': {
        pnr: 'RB101',
        status: 'BOOKED',
        operator: 'Kaveri Travels',
        trustScore: 4.8,
        amount: 1200,
        policy: { '0-12h': '100%', '12-24h': '50%', '>24h': '0%' },
        timeline: [
            { status: 'Booked', date: '2023-10-25 10:00 AM', completed: true },
        ]
    },
    'RB102': {
        pnr: 'RB102',
        status: 'CANCELLED',
        operator: 'Kaveri Travels',
        trustScore: 4.8,
        amount: 1200,
        refundAmount: 600,
        refundDeadline: '2023-10-28',
        policy: { '0-12h': '100%', '12-24h': '50%', '>24h': '0%' },
        timeline: [
            { status: 'Booked', date: '2023-10-25 10:00 AM', completed: true },
            { status: 'Cancelled', date: '2023-10-26 02:00 PM', completed: true },
            { status: 'Refund Initiated', date: '2023-10-26 02:05 PM', completed: true },
            { status: 'Bank Processing', date: 'Estimated: 2023-10-28', completed: false },
        ]
    },
    'RB103': {
        pnr: 'RB103',
        status: 'REFUNDED',
        operator: 'VRL Logistics',
        trustScore: 3.2,
        amount: 850,
        refundAmount: 850,
        policy: { 'Anytime': '100%' },
        timeline: [
            { status: 'Booked', date: '2023-10-20 08:00 AM', completed: true },
            { status: 'Cancelled', date: '2023-10-21 09:00 AM', completed: true },
            { status: 'Refund Initiated', date: '2023-10-21 09:15 AM', completed: true },
            { status: 'Refund Completed', date: '2023-10-21 11:30 AM', completed: true },
        ]
    }
};

export default function TicketPage() {
    const params = useParams();
    const pnr = typeof params.pnr === 'string' ? params.pnr : '';
    const data = MOCK_DB[pnr];

    if (!data) {
        return (
            <div className="container flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">PNR Not Found</h2>
                    <p className="text-slate-500 mb-4">We could not find any record for {pnr}</p>
                    <Link href="/lookup"><Button>Try Again</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-4xl space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">PNR: {data.pnr}</h1>
                    <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span>Operator: <Link href={`/operators/${data.operator}`} className="text-primary hover:underline">{data.operator}</Link></span>
                        <Badge variant={data.trustScore >= 4.0 ? "default" : "destructive"} className={data.trustScore >= 4.0 ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                            Trust Score: {data.trustScore}/5.0
                        </Badge>
                    </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1 border-2">
                    {data.status}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Timeline */}
                <Card className="md:col-span-2 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Refund Tracker
                        </CardTitle>
                        <CardDescription>Immutable audit trail of your ticket lifecycle.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                            {data.timeline.map((step: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-8"
                                >
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}>
                                        {step.completed && <CheckCircle2 className="w-3 h-3 text-white absolute top-0 left-0" />}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</p>
                                        <p className="text-sm text-slate-500">{step.date}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Refund Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Refund Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Ticket Amount</span>
                            <span className="font-medium">₹{data.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Refund Amount</span>
                            <span className={`font-bold ${data.refundAmount ? 'text-green-600' : 'text-slate-400'}`}>
                                {data.refundAmount ? `₹${data.refundAmount}` : 'N/A'}
                            </span>
                        </div>
                        {data.refundDeadline && (
                            <div className="p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-sm flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>
                                    <strong>Deadline:</strong> Operator must settle by {data.refundDeadline} or face penalty.
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Policy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Locked Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(data.policy).map(([time, refund]: [string, any]) => (
                                <div key={time} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                    <span className="text-sm font-medium text-slate-600">{time} before dep.</span>
                                    <span className="text-sm font-bold text-slate-900">{refund} Refund</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-4 text-center">
                            This policy was cryptographically locked at booking time.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
