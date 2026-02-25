"use client";

import { motion } from "framer-motion";
import { NeuralBackground } from "@/components/ui/neural-background";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { DataModule } from "@/components/ui/data-module";

export default function LandingPage() {
    return (
        <div className="relative overflow-hidden flex flex-col justify-center h-[calc(100vh-12rem)]">
            <NeuralBackground />

            {/* Hero Section */}
            <section className="relative container mx-auto px-4 text-center z-10 flex-1 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-mono uppercase tracking-widest mb-4 hover:bg-emerald-500/20 transition-colors cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Under Construction
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] drop-shadow-2xl">
                        AI Consensus for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-kast-teal to-emerald-400">
                            Smart Contract Security
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        AuditPal leverages a decentralized network of AI agents to find vulnerabilities in your Solidity code with unprecedented accuracy.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link href="/dashboard">
                            <Button size="lg" className="h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all rounded-full font-bold shadow-lg w-full sm:w-auto">
                                Start Audit <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
}
