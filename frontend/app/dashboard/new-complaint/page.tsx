'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
    id: string;
    pnr: string;
    operator: {
        id: string;
        name: string;
    };
}

export default function NewComplaintPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [selectedPnr, setSelectedPnr] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // Derived State
    const selectedTicket = tickets.find(t => t.pnr === selectedPnr);

    useEffect(() => {
        // Fetch tickets to populate dropdown
        const fetchTickets = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/user/dashboard', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setTickets(data.tickets);
                }
            } catch (error) {
                console.error('Failed to load tickets', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !category || !description) return;

        setSubmitting(true);

        try {
            const res = await fetch('http://localhost:4000/api/user/complaint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    pnr: selectedPnr,
                    operatorId: selectedTicket.operator.id,
                    reason: category,
                    description
                })
            });

            if (!res.ok) throw new Error('Failed to submit');

            router.push('/dashboard');
        } catch (error) {
            alert('Error submitting complaint. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading ticket details...</div>;

    return (
        <div className="container max-w-2xl py-8">
            <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-2 transition-all">
                <Link href="/dashboard">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>File a New Complaint</CardTitle>
                    <CardDescription>
                        Submit a formal complaint regarding your journey or refund process.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* PNR Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="pnr">Select Ticket (PNR)</Label>
                            <Select onValueChange={setSelectedPnr} value={selectedPnr}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select PNR" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tickets.map(ticket => (
                                        <SelectItem key={ticket.id} value={ticket.pnr}>
                                            {ticket.pnr} ({ticket.operator.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Operator (Read Only) */}
                        <div className="space-y-2">
                            <Label>Operator</Label>
                            <Input
                                value={selectedTicket?.operator.name || 'Auto-filled based on PNR'}
                                disabled
                                className="bg-slate-50"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Complaint Category</Label>
                            <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Refund Delay">Refund Delay</SelectItem>
                                    <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                                    <SelectItem value="Staff Behavior">Staff Behavior</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Please provide details..."
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t p-6 bg-slate-50">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!selectedPnr || submitting}>
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
