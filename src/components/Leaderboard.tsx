"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DataModule } from "@/components/ui/data-module";
import { Trophy, Users, Filter, Search, Pin, ChevronUp, ChevronDown, Minus, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Sparkline = ({ data, color, height = 40, width = 160 }: { data: number[], color: string, height?: number, width?: number }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
                fill={`url(#gradient-${color})`}
                stroke="none"
            />
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

interface LeaderboardEntry {
    rank: number;
    previousRank: number;
    name: string;
    winRate: string;
    wins: number;
    attempts: number;
    rewards: string;
    age: string;
    trend: number[];
    isTeam: boolean;
}

const RankDelta = ({ current, previous }: { current: number, previous: number }) => {
    if (current < previous) {
        return (
            <div className="flex items-center text-emerald-400 gap-0.5">
                <ChevronUp className="w-3 h-3 stroke-[3]" />
                <span className="text-[10px] font-bold">{previous - current}</span>
            </div>
        );
    }
    if (current > previous) {
        return (
            <div className="flex items-center text-rose-400 gap-0.5">
                <ChevronDown className="w-3 h-3 stroke-[3]" />
                <span className="text-[10px] font-bold">{current - previous}</span>
            </div>
        );
    }
    return <Minus className="w-3 h-3 text-muted-foreground" />;
};

export function Leaderboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // In a real app we fetch from API. For now mock or real.
                // Assuming the new app has the API route setup similarly.
                const res = await fetch('/api/subnet/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    const mappedData = data.map((miner: any, index: number) => ({
                        rank: index + 1,
                        previousRank: index + 1,
                        name: `Miner ${miner.uid}`,
                        hotkey: miner.hotkey,
                        winRate: (miner.incentive * 100).toFixed(1) + "%",
                        wins: Math.floor(miner.incentive * 1000),
                        attempts: 1000,
                        rewards: miner.stake.toLocaleString() + " τ",
                        age: "Active",
                        trend: Array.from({ length: 9 }, () => Math.floor(Math.random() * 20) + 70),
                        isTeam: false
                    }));
                    setLeaderboard(mappedData);
                } else {
                    // Fallback mock data if API fails (during dev)
                    setLeaderboard(Array.from({ length: 10 }, (_, i) => ({
                        rank: i + 1, previousRank: i + 1, name: `Miner ${i + 100}`, hotkey: `hk${i}`,
                        winRate: "98%", wins: 100 - i, attempts: 100, rewards: "100 τ", age: "1d",
                        trend: [10, 20, 30, 40, 50], isTeam: false
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
                setLeaderboard(Array.from({ length: 10 }, (_, i) => ({
                    rank: i + 1, previousRank: i + 1, name: `Miner ${i + 100}`, hotkey: `hk${i}`,
                    winRate: "98%", wins: 100 - i, attempts: 100, rewards: "100 τ", age: "1d",
                    trend: [10, 20, 30, 40, 50], isTeam: false
                })));
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-kast-teal border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-mono text-sm">Syncing with Subnet Metagraph...</p>
            </div>
        );
    }

    const topThree = [leaderboard[1], leaderboard[0], leaderboard[2]].filter(Boolean);
    const filteredData = leaderboard.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hotkey?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Podium Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end justify-center max-w-5xl mx-auto pt-8">
                {topThree.map((item, index) => {
                    const isFirst = item.rank === 1;
                    const isSecond = item.rank === 2;
                    const isThird = item.rank === 3;

                    return (
                        <motion.div
                            key={item.rank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative",
                                isFirst ? "md:-mt-12 order-1 md:order-2 z-10" :
                                    isSecond ? "order-2 md:order-1" : "order-3"
                            )}
                        >
                            <DataModule
                                className={cn(
                                    "relative overflow-hidden transition-all duration-300",
                                    isFirst
                                        ? "bg-card border-amber-500 shadow-[0_8px_30px_rgb(251,191,36,0.15)]"
                                        : "bg-card border-border hover:border-border/80 hover:shadow-lg"
                                )}
                            >
                                <div className="relative z-10 p-4 flex flex-col items-center justify-center">
                                    <div className={cn(
                                        "absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm border",
                                        isFirst
                                            ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                            : isSecond
                                                ? "bg-muted border-border text-muted-foreground"
                                                : "bg-muted border-border text-amber-800/70"
                                    )}>
                                        #{item.rank}
                                    </div>
                                    <div className="mb-2 relative group">
                                        <div className={cn(
                                            "w-14 h-14 rounded-full flex items-center justify-center border-[3px] transition-transform duration-500 group-hover:scale-105",
                                            isFirst
                                                ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 shadow-sm"
                                                : "bg-gradient-to-br from-muted to-transparent border-border"
                                        )}>
                                            {isFirst ? <Crown className="w-6 h-6 text-amber-500" /> : <Medal className="w-5 h-5 text-muted-foreground" />}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground tracking-tight">{item.name}</h3>
                                    <div className="text-3xl font-black font-mono tracking-tighter text-kast-teal mt-2">{item.winRate}</div>
                                </div>
                            </DataModule>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1 mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-muted h-12 w-12 flex items-center justify-center rounded-md shadow-sm border border-border text-foreground">
                        <Trophy className="w-6 h-6 stroke-[1.5] text-kast-teal" />
                    </div>
                    <h2 className="text-xl font-black text-foreground tracking-tight uppercase">Leaderboard</h2>
                </div>
                <div className="relative w-full sm:w-72 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-kast-teal/20 to-indigo-500/20 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-card rounded-md shadow-sm border border-border flex items-center px-4 py-2.5 transition-shadow group-hover:shadow-md">
                        <Search className="w-4 h-4 text-muted-foreground mr-3" />
                        <input
                            type="text"
                            placeholder="Search participants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground font-medium font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-border">
                                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest w-16 text-center">#</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Agent</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">Win Rate</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">Wins</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">Rewards</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredData.map((item) => (
                                <tr key={item.rank} className="group hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn("font-bold text-sm", item.rank <= 3 ? "text-foreground" : "text-muted-foreground/60")}>{item.rank}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-foreground mb-1">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono">{item.hotkey}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-kast-teal font-mono font-bold">{item.winRate}</td>
                                    <td className="px-6 py-4 text-center text-muted-foreground font-mono">{item.wins}</td>
                                    <td className="px-6 py-4 text-center text-indigo-500 font-mono font-bold">{item.rewards}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-6 opacity-70">
                                            <Sparkline data={item.trend} color="#1EBA98" height={25} width={100} />
                                        </div>
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
