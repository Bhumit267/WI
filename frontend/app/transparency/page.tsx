'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TransparencyPage() {
    return (
        <div className="container py-8 max-w-3xl space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">How OpenFare Works</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    OpenFare operates as an independent, government-grade transparency layer. We do not sell tickets.
                    Our mission is to ensure every passenger receives their legally mandated refund on time.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Trust Score Calculation</h2>
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <p>The Trust Score (0-5.0) is calculated based on three weighted factors:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Refund Speed (50%)</strong>: Percentage of refunds processed within 48 hours.</li>
                            <li><strong>Policy Adherence (30%)</strong>: Frequency of arbitrary policy changes (zero tolerance).</li>
                            <li><strong>Complaint Resolution (20%)</strong>: Ratio of resolved vs. pending complaints.</li>
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Data Policy</h2>
                <Card>
                    <CardContent className="p-6">
                        <p>
                            All refund data is immutable. Once a ticket is marked "Cancelled", the refund clock starts.
                            Operators cannot delete or hide delay records. This data is shared with regulators weekly.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
