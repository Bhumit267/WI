'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    email: string;
    role: 'ADMIN' | 'USER';
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: 'ADMIN' | 'USER') => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem('openfare_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: 'ADMIN' | 'USER') => {
        const newUser = {
            email,
            role,
            name: role === 'ADMIN' ? 'System Administrator' : 'Verified Passenger'
        };
        setUser(newUser);
        localStorage.setItem('openfare_user', JSON.stringify(newUser));
        router.refresh();

        if (role === 'ADMIN') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('openfare_user');
        router.push('/login');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
