'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShieldAlert, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LookupPage() {
    const [pnr, setPnr] = useState('');
    const router = useRouter();

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        if (pnr) {
            router.push(`/tickets/${pnr}`);
        }
    };

    const demoPnrs = ['RB101', 'RB102', 'RB103'];

    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-slate-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="border-t-4 border-t-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Search className="text-primary h-6 w-6" />
                            Trace Your Refund
                        </CardTitle>
                        <CardDescription>
                            Enter your booking PNR to see real-time refund status and cancellation proof.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLookup} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Enter PNR (e.g., RB101)"
                                    value={pnr}
                                    onChange={(e) => setPnr(e.target.value)}
                                    className="text-lg py-6"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                                Trace Ticket
                            </Button>
                        </form>

                        <div className="mt-6">
                            <p className="text-xs text-slate-500 mb-2 font-semibold">TRY DEMO PNRs:</p>
                            <div className="flex gap-2">
                                {demoPnrs.map((demo) => (
                                    <Button
                                        key={demo}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPnr(demo)}
                                        className="text-xs"
                                    >
                                        {demo}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t p-4">
                        <div className="flex items-start gap-2 text-xs text-slate-500">
                            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                            <p>
                                OpenFare does not sell tickets. We provide transparency for bookings made on partner platforms.
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
