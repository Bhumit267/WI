'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Note: Need to verify if textarea component exists or use standard HTML
import { useAuth } from '@/context/auth-context';

export default function NewComplaintPage() {
    const [pnr, setPnr] = useState('');
    const [reason, setReason] = useState('');
    const router = useRouter();
    const { user } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API to create complaint
        alert('Complaint Submitted for ' + pnr);
        router.push('/dashboard');
    };

    return (
        <div className="container max-w-2xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle>File a New Complaint</CardTitle>
                    <CardDescription>Tell us what went wrong. We will audit the operator.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="pnr">PNR Number</Label>
                            <Input
                                id="pnr"
                                placeholder="e.g. RB102"
                                value={pnr}
                                onChange={(e) => setPnr(e.target.value)}
                                required
                            />
                            <p className="text-xs text-slate-500">Must be a valid PNR generated in the last 6 months.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Issue Description</Label>
                            <Textarea
                                id="reason"
                                placeholder="Describe the issue (e.g. Refund not received, hidden charges)..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit">Submit Complaint</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
