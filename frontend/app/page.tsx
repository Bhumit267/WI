'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Clock, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-4">
                  Official Transparency Platform
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-900">
                  Fair Refunds. <span className="text-primary">Transparent Travel.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl mt-4">
                  OpenFare is the independent transparency layer for intercity bus travel.
                  Verify cancellation policies, track refunds, and check operator trust scores.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-x-4"
              >
                <Link href="/lookup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Check Your Refund <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/transparency">
                  <Button variant="outline" size="lg">
                    How it Works
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-slate-50/50">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Locked Policies</h3>
                <p className="text-slate-500">
                  Cancellation policies are cryptographically locked at the time of booking. Operators cannot change them later.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-slate-50/50">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Refund Timeline</h3>
                <p className="text-slate-500">
                  Track every step of your refund from cancellation to bank settlement. Transparent audit trails.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-slate-50/50">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Trust Scores</h3>
                <p className="text-slate-500">
                  Real-time performance metrics for every operator. driven by verified passenger data and complaint resolution.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-slate-500 text-center">
          © 2026 OpenFare Transparency Platform. Not a booking agent.
        </p>
      </footer>
    </div>
  );
}
