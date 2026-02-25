"use client";

import { motion } from "framer-motion";
import { Search, Filter, CheckCircle2, XCircle, Clock, List, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Submission {
    id: string;
    minerId: string;
    agentId: string;
    status: 'graded' | 'failed' | 'submitted' | 'running';
    score: string;
    accuracy: string;
    compression: string;
    tokens: string;
    message: string;
    timestamp: string;
    version: string;
}

const StatusBadge = ({ status }: { status: Submission['status'] }) => {
    switch (status) {
        case 'graded':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Graded
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3 h-3" />
                    Failed
                </span>
            );
        case 'submitted':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Clock className="w-3 h-3 animate-pulse" />
                    Submitted
                </span>
            );
        case 'running':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Clock className="w-3 h-3 animate-spin" />
                    Running
                </span>
            );
    }
};

export function Submissions() {
    const [filter, setFilter] = useState<'all' | 'graded' | 'failed'>('all');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        const fetchRecentActivity = async () => {
            // Mock Data
            const mockSubmissions: Submission[] = [
                { id: "1", minerId: "305817", agentId: "audit-v1", status: "graded", score: "0.98", accuracy: "99%", compression: "0.2", tokens: "400", message: "Audit Passed", timestamp: "Just now", version: "v1.0" },
                { id: "2", minerId: "302911", agentId: "sec-bot", status: "failed", score: "0.00", accuracy: "-", compression: "-", tokens: "-", message: "Timeout", timestamp: "5m ago", version: "v1.0" }
            ];
            setSubmissions(mockSubmissions);
            setLoading(false);
        };
        fetchRecentActivity();
    }, []);

    const filteredSubmissions = submissions.filter(item =>
        filter === 'all' ? true : item.status === filter
    );

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
            className="space-y-6 pb-20"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-lg shadow-sm border border-border text-muted-foreground">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-4">
                        {['all', 'graded', 'failed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={cn(
                                    "text-sm font-bold tracking-wide transition-colors uppercase font-mono px-1 pb-1",
                                    filter === f ? "text-kast-teal border-b border-kast-teal" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-card backdrop-blur-md rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest font-sans">
                                <th className="px-6 py-4">Submission ID</th>
                                <th className="px-6 py-3">Agent ID</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Message</th>
                                <th className="px-6 py-3 text-center">Score</th>
                                <th className="px-6 py-3 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredSubmissions.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3 font-mono font-bold text-xs text-foreground">#{sub.minerId}</td>
                                    <td className="px-6 py-3 font-mono font-bold text-xs text-primary">{sub.agentId}</td>
                                    <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">{sub.message}</td>
                                    <td className="px-6 py-4 text-center font-bold text-foreground">{sub.score}</td>
                                    <td className="px-6 py-4 text-right text-xs text-muted-foreground">{sub.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
