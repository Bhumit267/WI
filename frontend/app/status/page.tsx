import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Activity, Database, Server } from "lucide-react";

export default function StatusPage() {
    return (
        <div className="container py-12 space-y-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-900">System Status</h1>

            <Card className="bg-green-50 border-green-200">
                <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div>
                            <h2 className="text-lg font-bold text-green-900">All Systems Operational</h2>
                            <p className="text-green-700">Last updated: Just now</p>
                        </div>
                    </div>
                    <Badge className="bg-green-600 hover:bg-green-700">99.99% Uptime</Badge>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-700">Detailed Audit Database (Postgres)</span>
                    </div>
                    <span className="text-green-600 font-bold text-sm">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-700">Trust Score Engine</span>
                    </div>
                    <span className="text-green-600 font-bold text-sm">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-700">Operator Gateway API</span>
                    </div>
                    <span className="text-green-600 font-bold text-sm">Operational</span>
                </div>
            </div>

            <div className="pt-8 border-t text-sm text-slate-500">
                <h3 className="font-bold mb-2">Scheduled Maintenance</h3>
                <p>No maintenance scheduled for the next 7 days.</p>
            </div>
        </div>
    );
}
