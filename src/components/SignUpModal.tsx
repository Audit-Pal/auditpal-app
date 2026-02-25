"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, CheckCircle2, Loader2, Github, Mail, ArrowRight, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataModule } from "@/components/ui/data-module";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUp: (displayName: string, method: 'wallet' | 'github' | 'google') => void;
}

export function SignUpModal({ isOpen, onClose, onSignUp }: SignUpModalProps) {
    const [displayName, setDisplayName] = useState("");
    const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'github' | 'google' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!displayName || !selectedMethod) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSignUp(displayName, selectedMethod);
        setIsSubmitting(false);
        setDisplayName("");
        setSelectedMethod(null);
    };

    const authMethods = [
        { id: 'wallet' as const, label: 'Connect Wallet', icon: Wallet, description: 'TAO / Ethereum' },
        { id: 'github' as const, label: 'GitHub', icon: Github, description: 'Sign in with GitHub' },
        { id: 'google' as const, label: 'Google', icon: Mail, description: 'Sign in with Google' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
                    >
                        <DataModule className="bg-card shadow-2xl border-border overflow-hidden relative">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 relative z-10 px-2 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-kast-teal/10 flex items-center justify-center border border-kast-teal/20">
                                        <Shield className="w-5 h-5 text-kast-teal" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground tracking-tight">Secure Your Workspace</h2>
                                        <p className="text-xs text-muted-foreground mt-0.5">Save audits, access history, get reports</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="relative z-10 space-y-5 px-2 pb-2">
                                {/* Display Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-kast-teal" />
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your name or organization"
                                        className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-kast-teal/30 focus:border-kast-teal/30 transition-all placeholder:text-muted-foreground/50 text-foreground"
                                    />
                                </div>

                                {/* Auth Methods */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Sign in with
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {authMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedMethod(method.id)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                                                    selectedMethod === method.id
                                                        ? "bg-kast-teal/10 border-kast-teal/50 text-kast-teal"
                                                        : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                                                )}
                                            >
                                                <method.icon className="w-5 h-5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="bg-accent/50 rounded-lg p-3 border border-border">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-2">What you get:</p>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            Unlimited audit history
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            GitHub integration
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            Downloadable PDF reports
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit */}
                                <div className="pt-2 flex items-center justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="h-10 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent border-border"
                                    >
                                        Maybe Later
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !displayName || !selectedMethod}
                                        className="h-10 px-6 bg-kast-teal hover:bg-foreground text-background hover:text-background text-xs font-bold uppercase tracking-wider shadow-lg shadow-kast-teal/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none border-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                Create Account <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DataModule>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function SignUpSuccessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
                    >
                        <DataModule className="bg-card shadow-2xl border-kast-teal/20 relative overflow-hidden text-center p-8">
                            <div className="w-16 h-16 bg-kast-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-kast-teal border border-kast-teal/20 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">Account Created!</h2>
                            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                Your workspace is now secure. All audits will be saved to your account for easy access anytime.
                            </p>

                            <Button
                                onClick={onClose}
                                className="w-full h-11 bg-kast-teal text-background hover:bg-foreground hover:text-background font-bold text-xs uppercase tracking-wider transition-all duration-300 border-none"
                            >
                                Continue Auditing
                            </Button>
                        </DataModule>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Guest Prompt - appears after a guest audit
export function SaveWorkPrompt({ onSignUp, onDismiss }: { onSignUp: () => void, onDismiss: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
            <DataModule className="bg-card border-kast-teal/30 shadow-2xl shadow-kast-teal/10 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-kast-teal/10 flex items-center justify-center border border-kast-teal/20 shrink-0">
                        <Shield className="w-5 h-5 text-kast-teal" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground mb-1">Save Your Audit?</h3>
                        <p className="text-xs text-muted-foreground mb-3">Create a free account to keep this audit in your history and enable PDF exports.</p>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={onSignUp}
                                size="sm"
                                className="h-8 px-4 bg-kast-teal text-background hover:bg-foreground hover:text-background text-[10px] font-bold uppercase tracking-wider"
                            >
                                Sign Up Free
                            </Button>
                            <Button
                                onClick={onDismiss}
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-wider"
                            >
                                Not Now
                            </Button>
                        </div>
                    </div>
                    <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </DataModule>
        </motion.div>
    );
}
