"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Lock, Unlock, ArrowRight, Shield, AlertTriangle, CheckCircle2, FileCode, ChevronRight, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const cleanName = (name: string): string => {
    let cleaned = name.replace(/^\d{4}\.\d{2}\.\d{2}\s*-\s*Final\s*-\s*/i, '');
    cleaned = cleaned.replace(/^Final\s*-\s*/i, '');
    cleaned = cleaned.replace(/\s*Audit Report$/i, '');
    return cleaned.trim();
};

import { EVMBenchTasks } from "@/lib/evmbench-data";

export function Challenges({ onSelectChallenge, type = 'standard' }: {
    onSelectChallenge: (challenge: any) => void,
    type?: 'standard' | 'evm-bench'
}) {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(type === 'standard');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (type === 'evm-bench') {
            const evmChallenges = EVMBenchTasks.map(task => ({
                id: task.id,
                name: task.name,
                description: task.description,
                vulnerabilityType: task.vulnerabilityType,
                difficulty: task.severity === 'critical' ? 'Critical' : task.severity === 'high' ? 'High' : 'Medium',
                code: task.code,
                modes: task.modes,
                date: new Date().toISOString(),
                isEVMBench: true
            }));
            setChallenges(evmChallenges);
            setLoading(false);
            return;
        }

        const fetchChallenges = async () => {
            try {
                const res = await fetch('https://audit-api-two.vercel.app/api/challenges');
                if (res.ok) {
                    const data = await res.json();
                    const processed = data.map((c: any) => ({
                        ...c,
                        name: cleanName(c.name),
                        difficulty: "High", // Mock
                        status: "active"
                    })).slice(0, 20); // Limit to 20 for now
                    setChallenges(processed);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, [type]);

    const filtered = challenges.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading challenges...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border shadow-sm">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search challenges..."
                    className="bg-transparent border-none focus:outline-none text-foreground w-full placeholder:text-muted-foreground"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((challenge) => (
                    <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-card border border-border rounded-xl p-6 hover:border-kast-teal/50 hover:bg-accent transition-all cursor-pointer group shadow-sm"
                        onClick={() => onSelectChallenge(challenge)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-kast-teal transition-colors border border-transparent group-hover:border-kast-teal/20">
                                <Shield className="w-5 h-5" />
                            </div>
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-border">{challenge.difficulty}</Badge>
                        </div>
                        <h3 className="text-foreground font-bold text-lg mb-2 line-clamp-1" title={challenge.name}>{challenge.name}</h3>
                        {challenge.isEVMBench && (
                            <div className="mb-3">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-kast-teal border-kast-teal/30">{challenge.vulnerabilityType}</Badge>
                            </div>
                        )}
                        <p className="text-muted-foreground text-xs font-mono mb-4 flex items-center gap-2">
                            <FileCode className="w-3 h-3 text-kast-teal" /> Solidity
                            <span className="w-1 h-1 rounded-full bg-border" />
                            {challenge.isEVMBench ? "EVMBench" : new Date(challenge.date).toLocaleDateString()}
                        </p>
                        <Button className="w-full bg-muted hover:bg-kast-teal hover:text-black text-foreground border border-border transition-colors group-hover:border-kast-teal/30">
                            Start Audit
                        </Button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
