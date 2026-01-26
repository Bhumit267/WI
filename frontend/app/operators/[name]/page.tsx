'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Clock, ThumbsDown, Award } from 'lucide-react';

const MOCK_OPERATORS: Record<string, any> = {
    'Kaveri Travels': {
        name: 'Kaveri Travels',
        trustScore: 4.8,
        complaints: 12,
        avgRefundTime: 24, // hours
        badges: ['Fast Refund', 'Verified Policy'],
    },
    'VRL Logistics': {
        name: 'VRL Logistics',
        trustScore: 3.2,
        complaints: 45,
        avgRefundTime: 72,
        badges: ['Verified Policy'],
    }
};

export default function OperatorPage() {
    const params = useParams();
    const name = typeof params.name === 'string' ? decodeURIComponent(params.name) : '';
    const data = MOCK_OPERATORS[name];

    if (!data) {
        return <div className="p-8 text-center">Operator Not Found</div>;
    }

    return (
        <div className="container py-8 max-w-4xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
                    <p className="text-slate-500">Official Operator Profile & Trust Audit</p>
                </div>
                <div className="flex gap-2">
                    {data.badges.map((badge: string) => (
                        <Badge key={badge} variant="secondary" className="text-sm">
                            <Award className="w-3 h-3 mr-1" /> {badge}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-1 md:col-span-1 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" /> Trust Score
                        </CardTitle>
                        <CardDescription>Overall reliability rating</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="text-5xl font-bold text-slate-900">{data.trustScore}</div>
                        <div className="text-sm text-slate-500 mt-2">out of 5.0</div>
                        <Progress value={data.trustScore * 20} className="w-full mt-4 h-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-secondary" /> Refund Speed
                        </CardTitle>
                        <CardDescription>Average processing time</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="text-4xl font-bold text-slate-900">{data.avgRefundTime}h</div>
                        <div className="text-sm text-slate-500 mt-2">Average Settlement</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ThumbsDown className="w-5 h-5 text-destructive" /> Complaints
                        </CardTitle>
                        <CardDescription>Last 30 days volune</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="text-4xl font-bold text-slate-900">{data.complaints}</div>
                        <div className="text-sm text-slate-500 mt-2">Pending Resolution</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
