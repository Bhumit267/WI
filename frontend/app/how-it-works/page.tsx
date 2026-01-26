import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Lock, Search, ShieldCheck, Banknote } from "lucide-react";

export default function HowItWorksPage() {
    return (
        <div className="container py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">How OpenFare Works</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    We act as a neutral "Trust Layer" between you and the bus operator, ensuring every refund promise is visible and enforceable.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />

                <Card className="bg-white relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto bg-blue-50 p-3 rounded-full w-fit mb-2">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle>Policy Lock</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-slate-600">
                        When you book a ticket, the operator's cancellation policy is "locked" in our system. They cannot change it later to deny you a refund.
                    </CardContent>
                </Card>

                <Card className="bg-white relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto bg-blue-50 p-3 rounded-full w-fit mb-2">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle>PNR Lookup</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-slate-600">
                        If you cancel, you can enter your PNR here. We instantly retrieve the locked policy and calculate exactly what you are owed.
                    </CardContent>
                </Card>

                <Card className="bg-white relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto bg-blue-50 p-3 rounded-full w-fit mb-2">
                            <Banknote className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle>Refund Audit</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-slate-600">
                        We track the refund status in real-time. If an operator delays payment beyond 48 hours, it is flagged as a "Violation".
                    </CardContent>
                </Card>

                <Card className="bg-white relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto bg-blue-50 p-3 rounded-full w-fit mb-2">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle>Trust Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-slate-600">
                        Violations lower the operator's public Trust Score. Good performance earns badges like "Fast Refund", helping good operators stand out.
                    </CardContent>
                </Card>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border">
                <h2 className="text-2xl font-bold mb-4">Limitations & Scope</h2>
                <ul className="space-y-2 list-disc pl-5 text-slate-700">
                    <li>We do **not** sell tickets or handle money directly. We are an informational audit layer.</li>
                    <li>Refunds are processed by the original payment gateway; we track the *status* of that signal.</li>
                    <li>Data is retained for 1 year for audit purposes, then anonymized.</li>
                </ul>
            </div>
        </div>
    );
}
