"use client";

import { motion } from "framer-motion";
import { BarChart, Gauge, Target, Zap, Play, ArrowRight, Settings, Database, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataModule } from "@/components/ui/data-module";
import { Button } from "@/components/ui/button";

// Benchmark Stats Card
const StatCard = ({ icon: Icon, title, value, subtext, color }: any) => (
    <DataModule className={cn(
        "relative overflow-hidden group p-5 border transition-all duration-300 hover:shadow-md bg-card backdrop-blur-xl",
        color === "indigo" ? "border-border hover:border-kast-teal/30" :
            color === "emerald" ? "border-border hover:border-emerald-500/30" :
                color === "violet" ? "border-border hover:border-purple-500/30" :
                    "border-border hover:border-border/80"
    )}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <div className="text-2xl font-bold text-foreground font-sans mb-1">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground font-medium">{subtext}</p>}
            </div>
            <div className={cn(
                "p-2 rounded-lg",
                color === "indigo" ? "bg-muted text-kast-teal" :
                    color === "emerald" ? "bg-muted text-emerald-400" :
                        color === "violet" ? "bg-muted text-purple-400" :
                            "bg-muted text-muted-foreground"
            )}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </DataModule>
);

// Benchmark Item Row
const BenchmarkItem = ({ name, status, score, latency, cost, type }: any) => (
    <div className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-kast-teal/30 hover:shadow-sm transition-all">
        <div className="flex items-center gap-4">
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center border",
                type === 'core' ? "bg-muted border-border text-kast-teal" :
                    type === 'edge' ? "bg-muted border-border text-amber-400" :
                        "bg-muted border-border text-muted-foreground"
            )}>
                <Database className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-foreground">{name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm",
                        status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                    )}>
                        {status}
                    </span>
                    <span className="text-xs text-muted-foreground">{type === 'core' ? 'Core Dataset' : 'Edge Cases'}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="text-right">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Score</div>
                <div className="text-sm font-mono font-bold text-foreground">{score || '-'}</div>
            </div>
            <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Avg Latency</div>
                <div className="text-sm font-mono font-bold text-muted-foreground">{latency || '-'}</div>
            </div>
            <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Cost</div>
                <div className="text-sm font-mono font-bold text-muted-foreground">{cost || '-'}</div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
);

export function OptimizationBenchmark() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto px-4"
        >
            <div className="relative mb-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-kast-teal/20 blur-3xl rounded-full scale-150 animate-pulse" />

                <div className="relative bg-card p-6 rounded-2xl shadow-xl border border-border ring-4 ring-muted">
                    <BarChart className="w-12 h-12 text-kast-teal" />
                </div>

                {/* Floating elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 -top-4 bg-background p-2.5 rounded-xl shadow-lg border border-border"
                >
                    <Target className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-6 -bottom-2 bg-background p-2.5 rounded-xl shadow-lg border border-border"
                >
                    <Settings className="w-5 h-5 text-amber-400" />
                </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                Audit Suite <span className="text-red-500">Coming Soon</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We're building a comprehensive evaluation engine to audit your agents against
                standardized security suites like <span className="font-semibold text-foreground">OpenAI EVMBench</span>, <span className="font-semibold text-foreground">SCSVS-CODE</span>, and <span className="font-semibold text-foreground">SWC-Registry</span>.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Development in Progress
            </div>
        </motion.div>
    );
}
