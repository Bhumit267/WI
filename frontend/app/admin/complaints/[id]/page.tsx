'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, ShieldCheck, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MOCK_MESSAGES = [
    { id: 1, sender: 'USER', text: 'I was promised 100% refund but got 50%.', time: '2 days ago' },
    { id: 2, sender: 'ADMIN', text: 'We are investigating with the operator. Please hold.', time: '1 day ago' },
];

export default function ComplaintDetailPage() {
    const params = useParams();
    const [reply, setReply] = useState('');
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [justification, setJustification] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSend = () => {
        if (!reply.trim()) return;
        setMessages([...messages, { id: Date.now(), sender: 'ADMIN', text: reply, time: 'Just now' }]);
        setReply('');
    };

    const handleResolve = () => {
        if (!justification.trim()) return;
        // TODO: Call API to resolve
        alert(`Complaint Resolved. Justification: "${justification}" logged to Audit Trail.`);
        setIsDialogOpen(false);
    };

    return (
        <div className="container py-8 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Complaint #{params.id}
                        <Badge>OPEN</Badge>
                    </h1>
                    <p className="text-slate-500">Refund Dispute • RB102</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Mark Resolved</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Resolution</DialogTitle>
                            <DialogDescription>
                                This action will be logged in the immutable Audit Trail. Please provide a justification.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                            <Label htmlFor="justification">Reason for Resolution</Label>
                            <Input
                                id="justification"
                                placeholder="e.g. Refund verified by bank statement..."
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleResolve} disabled={!justification.trim()}>Confirm Resolve</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b bg-slate-50">
                    <CardTitle className="text-sm font-medium text-slate-500">Direct Message History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'ADMIN' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ADMIN' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    {msg.sender === 'ADMIN' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={`p-3 rounded-lg text-sm ${msg.sender === 'ADMIN' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                                    <p>{msg.text}</p>
                                    <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'ADMIN' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <div className="flex w-full gap-2">
                        <Input
                            placeholder="Type your reply..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button size="icon" onClick={handleSend}><Send className="w-4 h-4" /></Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
