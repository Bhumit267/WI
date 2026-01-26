import { AlertTriangle } from 'lucide-react';

export function DemoBanner() {
    return (
        <div className="bg-amber-100 border-b border-amber-200 py-2 px-4 text-center">
            <div className="container flex items-center justify-center gap-2 text-sm font-medium text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                <span>DEMO MODE: This is a government reference implementation using simulated data. No real bookings or refunds are processed.</span>
            </div>
        </div>
    );
}
