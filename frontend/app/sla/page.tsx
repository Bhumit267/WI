import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, ShieldAlert } from "lucide-react";

export default function SLAPage() {
    return (
        <div className="container py-12 space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-slate-900">Service Level Agreements (SLA)</h1>
            <p className="text-xl text-slate-500">
                OpenFare enforces strict timelines. Operators who violate these SLAs suffer immediate Trust Score deductions.
            </p>

            <div className="space-y-6">
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /> Refund Processing Time</CardTitle>
                                <CardDescription>Time from 'Cancellation' to 'Bank Gateway Handoff'</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-lg">48 Hours</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-bold text-slate-700 min-w-[100px]">Goal:</span>
                            <span>Process within 24 hours.</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-bold text-slate-700 min-w-[100px]">Violation:</span>
                            <span className="text-red-600 font-medium"> &gt; 48 Hours</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm bg-red-50 p-2 rounded">
                            <span className="font-bold text-red-800 min-w-[100px]">Penalty:</span>
                            <span className="text-red-700">-0.5 Trust Score deduction per violation.</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Complaint Response</CardTitle>
                                <CardDescription>Time to acknowledge a user grievance</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-lg">24 Hours</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-bold text-slate-700 min-w-[100px]">Goal:</span>
                            <span>Acknowledge immediately (Auto-response). Human review within 12h.</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm bg-orange-50 p-2 rounded">
                            <span className="font-bold text-orange-800 min-w-[100px]">Penalty:</span>
                            <span className="text-orange-700">-0.2 Trust Score deduction per late response.</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-600">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-600" /> Policy Tampering</CardTitle>
                                <CardDescription>Attempting to alter a locked policy retroactively</CardDescription>
                            </div>
                            <Badge variant="destructive" className="text-lg">Zero Tolerance</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm bg-red-100 p-2 rounded border border-red-200">
                            <span className="font-bold text-red-900 min-w-[100px]">Action:</span>
                            <span className="text-red-800 font-bold">Immediate Suspension of Operator Account.</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
