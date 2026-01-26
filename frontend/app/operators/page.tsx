import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bus, Clock } from "lucide-react";

const MOCK_OPERATORS = [
    { id: '1', name: 'Kaveri Travels', trustScore: 4.8, avgRefund: 24, badges: ['Fast Refund', 'Verified Policy'] },
    { id: '2', name: 'VRL Logistics', trustScore: 3.2, avgRefund: 72, badges: [] },
    { id: '3', name: 'Orange Travels', trustScore: 4.5, avgRefund: 12, badges: ['Fast Refund'] },
];

export default function OperatorsPage() {
    return (
        <div className="container py-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Partner Operators</h1>
                <p className="text-xl text-slate-500">
                    Transparent performance metrics for all intercity bus operators.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {MOCK_OPERATORS.map((op) => (
                    <Card key={op.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                    <Bus className="w-6 h-6" />
                                </div>
                                <Badge variant={op.trustScore >= 4.0 ? "default" : "destructive"} className={op.trustScore >= 4.0 ? "bg-green-600" : ""}>
                                    {op.trustScore}/5.0 Trust
                                </Badge>
                            </div>
                            <CardTitle>{op.name}</CardTitle>
                            <CardDescription>
                                Avg Refund: {op.avgRefund}h
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {op.badges.map(b => (
                                    <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                                ))}
                                {op.badges.length === 0 && <span className="text-xs text-slate-400">No active badges</span>}
                            </div>
                            <div className="pt-4 border-t flex flex-col gap-2">
                                <Link href={`/operators/${op.name}`} className="w-full">
                                    <button className="w-full text-sm font-medium text-blue-600 hover:bg-blue-50 py-2 rounded transition-colors border border-blue-200">
                                        View Profile
                                    </button>
                                </Link>
                                <Link href={`/operators/${op.name}/disputes`} className="w-full">
                                    <button className="w-full text-sm font-medium text-slate-600 hover:bg-slate-50 py-2 rounded transition-colors border">
                                        Dispute History
                                    </button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
