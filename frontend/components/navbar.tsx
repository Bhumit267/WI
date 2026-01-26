'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function Navbar() {
    const { user, logout } = useAuth();

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
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <User className="w-4 h-4" />
                                {user.name}
                            </div>
                            {user.role === 'ADMIN' ? (
                                <Link href="/admin">
                                    <Button variant="secondary" size="sm">Dashboard</Button>
                                </Link>
                            ) : (
                                <Link href="/dashboard">
                                    <Button variant="secondary" size="sm">My Complaints</Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm">Sign In</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
