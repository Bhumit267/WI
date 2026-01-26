import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Eye, Trash2, Server } from "lucide-react";

export default function DataTransparencyPage() {
    return (
        <div className="container py-12 space-y-8 max-w-4xl">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Data Transparency</h1>
                <p className="text-xl text-slate-500">
                    You own your data. Here is exactly what we collect, why we need it, and when we destroy it.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Database className="w-5 h-5 text-blue-600" /> Stored Data</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                        PNR Number, Ticket Status, Operator Name, Refund Amount. This is the minimum needed to perform an audit.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Eye className="w-5 h-5 text-green-600" /> Public Data</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                        Operator Trust Scores, Anonymized Complaint Stats, Policy Performance Metrics. No personal user data is public.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Trash2 className="w-5 h-5 text-red-600" /> Never Collected</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                        Credit Card Numbers, UPI PINs, Bank Account Balances, Geolocation History.
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Data Retention Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data Type</TableHead>
                                <TableHead>Retention Period</TableHead>
                                <TableHead>Action After Expiry</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Ticket / PNR Records</TableCell>
                                <TableCell>1 Year</TableCell>
                                <TableCell>Hard Deleted</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">User Complaints</TableCell>
                                <TableCell>3 Years</TableCell>
                                <TableCell>Anonymized for Statistics</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Admin Audit Logs</TableCell>
                                <TableCell>7 Years</TableCell>
                                <TableCell>Archived (Legal Compliance)</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-slate-50 p-6 rounded-lg border text-sm text-slate-600 flex gap-4">
                <Server className="w-6 h-6 shrink-0 text-slate-400" />
                <div>
                    <p className="font-bold text-slate-900 mb-1">Infrastructure Sovereignty</p>
                    <p>All data is hosted on government-compliant servers within the country. No data leaves national borders.</p>
                </div>
            </div>
        </div>
    );
}
