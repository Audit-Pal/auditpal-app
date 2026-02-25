"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, CheckCircle2, Loader2, Award, Terminal, ArrowRight, List, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataModule } from "@/components/ui/data-module";

interface RegistrationProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (minerName: string, walletAddress: string) => void;
}

export function Registration({ isOpen, onClose, onRegister }: RegistrationProps) {
    const [minerName, setMinerName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!minerName || !walletAddress) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        onRegister(minerName, walletAddress);
        setIsSubmitting(false);
        setMinerName("");
        setWalletAddress("");
    };

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
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6"
                    >
                        <DataModule className="bg-card shadow-2xl border-border overflow-hidden relative">
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
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 px-2 pb-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                            <Terminal className="w-3.5 h-3.5 text-kast-teal" />
                                            Miner Identity
                                        </label>
                                        <input
                                            type="text"
                                            value={minerName}
                                            onChange={(e) => setMinerName(e.target.value)}
                                            placeholder="e.g. NeuralOptimizer-V1"
                                            className="w-full h-11 px-4 bg-input border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-kast-teal/30 focus:border-kast-teal/30 transition-all placeholder:text-muted-foreground font-mono text-foreground"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                            <Wallet className="w-3.5 h-3.5 text-kast-teal" />
                                            Wallet Address (TAO)
                                        </label>
                                        <input
                                            type="text"
                                            value={walletAddress}
                                            onChange={(e) => setWalletAddress(e.target.value)}
                                            placeholder="5F..."
                                            className="w-full h-11 px-4 bg-input border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-kast-teal/30 focus:border-kast-teal/30 transition-all placeholder:text-muted-foreground font-mono text-foreground"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={onClose} className="h-11 px-6 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border-border">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting || !minerName || !walletAddress} className="h-11 px-8 bg-kast-teal hover:bg-primary text-black font-mono text-xs font-bold uppercase tracking-wider border-none">
                                        {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering...</> : <><ArrowRight className="w-4 h-4 mr-2" /> Join Network</>}
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
