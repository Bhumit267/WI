'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Filter } from 'lucide-react';

const COMPLAINTS = [
    { id: 1, operator: 'Kaveri Travels', reason: 'Refund not received after 48h', status: 'Resolved', date: '2 days ago' },
    { id: 2, operator: 'VRL Logistics', reason: 'Hidden cancellation charges', status: 'Under Review', date: '5 hours ago' },
    { id: 3, operator: 'SRS Travels', reason: 'Policy violation', status: 'Escalated', date: '1 day ago' },
];

export default function ComplaintsPage() {
    return (
        <div className="container py-8 max-w-4xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Public Complaints Registry</h1>
                    <p className="text-slate-500">Transparent log of passenger grievances and resolutions.</p>
                </div>
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>

            <div className="space-y-4">
                {COMPLAINTS.map((complaint) => (
                    <Card key={complaint.id} className="bg-white hover:bg-slate-50 transition-colors">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{complaint.operator}</h3>
                                    <Badge variant="outline" className={`${complaint.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                            complaint.status === 'Escalated' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {complaint.status}
                                    </Badge>
                                </div>
                                <p className="text-slate-600">{complaint.reason}</p>
                                <p className="text-xs text-slate-400">{complaint.date}</p>
                            </div>
                            <Button variant="ghost" size="sm">View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                <ShieldAlert className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                    <h4 className="font-semibold text-blue-900">How to file a complaint?</h4>
                    <p className="text-sm text-blue-800">
                        Complaints can only be filed by verified passengers using their PNR on the <a href="/lookup" className="underline">Lookup Page</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
