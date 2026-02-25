"use client";

import { motion } from "framer-motion";
import { Users, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Validator {
    rank: number;
    name: string;
    uid: number;
    hotkey: string;
    stake: string;
    trust: number;
    status: 'online' | 'offline';
}

export function Validators() {
    const [validators, setValidators] = useState<Validator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchValidators = async () => {
            try {
                // Mock or Real fetch
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
                } else {
                    // Mock
                    setValidators(Array.from({ length: 5 }, (_, i) => ({
                        rank: i + 1, name: `Validator ${i + 1}`, uid: i + 1, hotkey: `hk${i}`, stake: "100k τ", trust: 98, status: 'online'
                    })));
                }
            } catch (error) {
                setValidators(Array.from({ length: 5 }, (_, i) => ({
                    rank: i + 1, name: `Validator ${i + 1}`, uid: i + 1, hotkey: `hk${i}`, stake: "100k τ", trust: 98, status: 'online'
                })));
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
            <div className="flex items-center justify-between py-8 px-2 border-b border-border mb-4">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center border border-border shadow-sm">
                        <Users className="w-7 h-7 stroke-[1.5] text-kast-teal" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-foreground tracking-tight uppercase font-sans mb-1">Security Nodes</h2>
                        <p className="text-sm text-muted-foreground font-medium tracking-wide">Top auditing nodes by stake</p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-sans">
                                <th className="px-8 py-5 text-center w-20">#</th>
                                <th className="px-8 py-5">Validator</th>
                                <th className="px-8 py-5">UID</th>
                                <th className="px-8 py-5">Hotkey</th>
                                <th className="px-8 py-5 text-right">Stake</th>
                                <th className="px-8 py-5">Trust Score</th>
                                <th className="px-8 py-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {validators.map((validator) => (
                                <tr key={validator.rank} className="group hover:bg-muted/50 transition-all duration-200">
                                    <td className="px-8 py-6 text-center font-mono font-bold text-sm text-amber-500">{validator.rank}</td>
                                    <td className="px-8 py-6 font-bold text-sm text-foreground">{validator.name}</td>
                                    <td className="px-8 py-6 text-sm font-mono font-bold text-muted-foreground">{validator.uid}</td>
                                    <td className="px-8 py-6 text-xs text-muted-foreground font-mono">{validator.hotkey}</td>
                                    <td className="px-8 py-6 text-right font-bold text-sm text-muted-foreground font-mono">{validator.stake}</td>
                                    <td className="px-8 py-6 font-bold text-muted-foreground font-mono">{validator.trust}%</td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{validator.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
