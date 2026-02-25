"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, CheckCircle2, Loader2, Award, Terminal, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataModule } from "@/components/ui/data-module";

interface OptimizationRegistrationProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (minerName: string, walletAddress: string) => void;
}

export function OptimizationRegistration({ isOpen, onClose, onRegister }: OptimizationRegistrationProps) {
    const [step, setStep] = useState(1);
    const [minerName, setMinerName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [hotkey, setHotkey] = useState("");
    const [securityFocus, setSecurityFocus] = useState("Vulnerability Search");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!minerName || !walletAddress) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        onRegister(minerName, walletAddress);
        setIsSubmitting(false);
        setStep(1); // Reset for next time
    };

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
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6"
                    >
                        <DataModule className="bg-card shadow-2xl border-border overflow-hidden relative">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 relative z-10 px-2 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-kast-teal/10 flex items-center justify-center border border-kast-teal/20">
                                        <Terminal className="w-5 h-5 text-kast-teal" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Miner Registration</h2>
                                        <p className="text-xs text-muted-foreground font-mono mt-0.5">PROTOCOL_V2_ENCRYPTED</p>
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
                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 px-2 pb-2">
                                <div className="bg-card border border-border rounded-xl p-6 mb-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block italic">Miner Hotkey</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Paste your Bittensor hotkey address"
                                                    className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-kast-teal/50"
                                                    value={hotkey}
                                                    onChange={(e) => setHotkey(e.target.value)}
                                                />
                                                <Button variant="outline" className="h-full px-4 border-border text-muted-foreground" type="button">
                                                    <Search className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-2">Required for rewarding mechanism and identity verification.</p>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block italic">Security Focus</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Vulnerability Search", "Logic Verification", "Gas Optimization", "Protocol Design"].map(tag => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => setSecurityFocus(tag)}
                                                        className={cn(
                                                            "px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left",
                                                            securityFocus === tag
                                                                ? "bg-kast-teal/10 border-kast-teal text-kast-teal"
                                                                : "bg-muted/30 border-border text-muted-foreground hover:border-kast-teal/50 hover:text-foreground"
                                                        )}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="h-11 px-6 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent border-border"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !minerName || !walletAddress}
                                        className="h-11 px-8 bg-kast-teal hover:bg-background text-background hover:text-foreground font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-kast-teal/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none border-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                Join Network <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DataModule>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function RegistrationSuccessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
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

                            <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight mb-2">Registration Complete</h2>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Your miner profile has been successfully created. You can now start optimizing prompts and submitting solutions to the network.
                            </p>

                            <Button
                                onClick={onClose}
                                className="w-full h-11 bg-kast-teal text-background hover:bg-foreground hover:text-background font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border-none"
                            >
                                Start Optimizing
                            </Button>
                        </DataModule>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
