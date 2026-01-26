'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <Link href="/" className="text-xl font-bold tracking-tight text-primary">
                        OpenFare
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/lookup" className="text-sm font-medium hover:text-primary transition-colors">
                        Lookup PNR
                    </Link>
                    <Link href="/complaints" className="text-sm font-medium hover:text-primary transition-colors">
                        Complaints
                    </Link>
                    <Link href="/transparency" className="text-sm font-medium hover:text-primary transition-colors">
                        Transparency
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="sm">Admin Login</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
