"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizationWorkspace } from "@/components/OptimizationWorkspace";
import { OptimizationOverview } from "@/components/OptimizationOverview";
import { OptimizationSubmissions } from "@/components/OptimizationSubmissions";
import { PenTool, List, LayoutDashboard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { OptimizationRegistration, RegistrationSuccessModal } from "@/components/OptimizationRegistration";

import { useParams, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoginGate } from "@/components/auth/LoginGate";

export default function OptimizePage() {
    const params = useParams();
    const benchmarkId = params.id as string;
    const searchParams = useSearchParams();
    const initialView = searchParams.get("view") === "history" ? "history" : "workspace";
    const [activeView, setActiveView] = useState<'workspace' | 'history'>(initialView);
    const { theme } = useTheme();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


    const handleRegister = (name: string, wallet: string) => {
        console.log("Registered:", name, wallet);
        setIsRegistered(true);
        setShowRegistration(false);
        setShowSuccess(true);
    };

    const isWorkspace = activeView === 'workspace';

    return (
        <div className="min-h-screen relative pt-12 bg-background text-foreground transition-colors duration-300">
            <div className="w-full">


                {/* 2. Top Navigation Bar (Slim) */}
                <div className="border-b-2 px-8 transition-colors duration-300 bg-background border-border shadow-sm sticky top-0 z-50">
                    <div className="container mx-auto flex items-start justify-between pt-3 pb-1">
                        <div className="flex items-center gap-10">
                            {/* Logo */}
                            <Link href="/" className="flex items-start gap-3 group pr-8 border-r-2 border-border">
                                <div className="relative h-8 w-8 overflow-hidden rounded-md">
                                    <img
                                        src="/audis.jpg"
                                        alt="AuditPal Logo"
                                        className="h-full w-full object-contain opacity-90 hover:opacity-100 transition-opacity dark:invert"
                                    />
                                </div>
                                <span className="font-sans font-black text-xl tracking-tighter group-hover:text-kast-teal transition-colors text-foreground">AuditPal</span>
                            </Link>

                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 transition-all group pr-8 border-r-2 text-muted-foreground hover:text-foreground border-border hover:bg-muted/50 px-2 py-1 rounded-md"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                            </Link>

                            <div className="flex items-center gap-4 ml-4">
                                <button
                                    onClick={() => setActiveView('workspace')}
                                    className={cn(
                                        "h-14 px-8 text-xs font-black uppercase tracking-widest transition-all relative flex items-center gap-2.5",
                                        isWorkspace ? "text-kast-teal" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <PenTool className="w-4 h-4" />
                                    Audit Workspace
                                    {activeView === 'workspace' && (
                                        <motion.div layoutId="nav-glow" className="absolute bottom-0 left-0 right-0 h-[3px] bg-kast-teal shadow-[0_0_12px_rgba(30,186,152,0.6)]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveView('history')}
                                    className={cn(
                                        "h-14 px-8 text-xs font-black uppercase tracking-widest transition-all relative flex items-center gap-2.5",
                                        !isWorkspace ? "text-kast-teal" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                    Audit History
                                    {activeView === 'history' && (
                                        <motion.div layoutId="nav-glow" className="absolute bottom-0 left-0 right-0 h-[3px] bg-kast-teal shadow-[0_0_12px_rgba(30,186,152,0.6)]" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* 3. Main Content Container */}
                <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl 2xl:max-w-[1600px] min-h-screen">


                    <AnimatePresence mode="wait">
                        {activeView === 'history' ? (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <LoginGate title="View Your Audits" description="Sign in to see your previous audit reports and analysis history.">
                                    <OptimizationSubmissions onBack={() => setActiveView('workspace')} benchmarkId={benchmarkId} />
                                </LoginGate>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="workspace"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <OptimizationWorkspace onViewHistory={() => setActiveView('history')} benchmarkId={benchmarkId} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <OptimizationRegistration
                    isOpen={showRegistration}
                    onClose={() => setShowRegistration(false)}
                    onRegister={handleRegister}
                />

                <RegistrationSuccessModal
                    isOpen={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        setActiveView('workspace');
                    }}
                />
            </div>
        </div>
    );
}
