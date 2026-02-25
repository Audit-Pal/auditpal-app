"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Circle, MoreHorizontal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Validator {
    rank: number;
    name: string;
    uid: number;
    hotkey: string;
    stake: string;
    trust: number;
    status: 'online' | 'offline';
}

import { useState, useEffect } from "react";

export function OptimizationValidator() {
    const [validators, setValidators] = useState<Validator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchValidators = async () => {
            try {
                const res = await fetch('/api/subnet/validators');
                if (res.ok) {
                    const data = await res.json();

                    const mapped: Validator[] = data.map((val: any, index: number) => ({
                        rank: index + 1,
                        name: val.uid === 1 ? "Opentensor Foundation" : `Validator ${val.uid}`,
                        uid: val.uid,
                        hotkey: val.hotkey,
                        stake: (val.stake / 1_000_000).toFixed(2) + "M τ",
                        trust: Math.round(val.trust * 100),
                        status: 'online' as const
                    }));
                    setValidators(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch validators:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchValidators();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kast-teal"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-20 max-w-6xl mx-auto"
        >
            {/* Header Section */}
            <div className="flex items-center justify-between py-8 px-2 border-b border-border mb-4">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center border border-border shadow-sm">
                        <Users className="w-7 h-7 text-kast-teal" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-foreground tracking-tight uppercase font-sans mb-1">Security Nodes</h2>
                        <p className="text-sm text-muted-foreground font-medium tracking-wide">Top auditing nodes by stake</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-md border border-border shadow-2xl relative z-10 rounded-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{validators.length} Active</span>
                    </div>
                </div>
            </div>

            {/* Validator List Table */}
            <div className="bg-background rounded-xl border border-border shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-border">
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-20 text-center font-sans">#</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Validator</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">UID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Hotkey</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right font-sans">Stake</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-64 font-sans">Trust Score</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right font-sans">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {validators.map((validator) => (
                                <tr key={validator.rank} className="group hover:bg-accent/20 transition-all duration-200">
                                    <td className="px-8 py-6 text-center">
                                        <span className={cn(
                                            "font-mono font-bold text-sm",
                                            validator.rank === 1 ? "text-amber-500" :
                                                validator.rank === 2 ? "text-amber-500/80" :
                                                    validator.rank === 3 ? "text-amber-500/60" : "text-muted-foreground"
                                        )}>
                                            {validator.rank}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-sm text-foreground font-sans tracking-tight group-hover:text-kast-teal transition-colors">
                                            {validator.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-mono font-bold text-muted-foreground">
                                            {validator.uid}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-accent/10 text-muted-foreground font-mono font-medium tracking-tight">
                                            {validator.hotkey}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="font-bold text-sm text-muted-foreground font-mono tracking-tight">
                                            {validator.stake}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-muted-foreground font-mono tracking-tight">
                                                {validator.trust}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full shadow-sm",
                                                validator.status === 'online' ? "bg-emerald-400" : "bg-muted"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider font-sans",
                                                validator.status === 'online' ? "text-emerald-400" : "text-zinc-500"
                                            )}>
                                                {validator.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-widest gap-2">
                    View Network Stats <ExternalLink className="w-3 h-3" />
                </Button>
            </div>
        </motion.div>
    );
}
