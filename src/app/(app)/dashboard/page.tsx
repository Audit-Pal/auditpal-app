"use client";

import { Button } from "@/components/ui/button";
import {
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LoginGate } from "@/components/auth/LoginGate";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Dashboard() {
    return (
        <LoginGate title="View Your Dashboard" description="Sign in to view your audits, security scores, and workspace activity.">
            <div className="min-h-screen bg-background text-foreground font-mono text-sm selection:bg-primary selection:text-primary-foreground">

                {/* Header - Aligned with Sidebar (h-16) */}
                <div className="h-16 flex items-center justify-end px-8 border-b border-border">
                    <div className="flex items-center gap-6">

                        <ThemeToggle />
                        <Link href="/benchmark/solidity-suite">
                            <button className="h-10 px-6 bg-primary text-primary-foreground hover:opacity-90 font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 rounded-md">
                                <Plus className="w-3 h-3" /> New Audit
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-8 space-y-16">

                    {/* Metrics - Pure Typography */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                        <MetricItem
                            label="Total Audits"
                            value="12"
                            detail="+2 this cycle"
                        />
                        <MetricItem
                            label="Vulnerabilities"
                            value="03"
                            detail="Action Required"
                        />
                        <MetricItem
                            label="Risk Score"
                            value="84"
                            detail="+5% improved"
                        />
                        <MetricItem
                            label="Avg. Time"
                            value="4h"
                            detail="Top 5% speed"
                        />
                    </div>

                    {/* Main Data Table */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Activity</h2>
                            <Link href="/audits" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5">
                                View Full History
                            </Link>
                        </div>

                        <div className="border-t border-border">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 py-4 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <div className="col-span-4 pl-2">Filename</div>
                                <div className="col-span-2">Commit</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Score</div>
                                <div className="col-span-2 text-right pr-2">Age</div>
                            </div>

                            {/* Table Rows */}
                            <TableRow
                                name="StakingPool_V2.sol"
                                commit="8a2b9d"
                                status="Critical"
                                score={45}
                                age="2m"
                            />
                            <TableRow
                                name="GovernanceToken.sol"
                                commit="7f1c4e"
                                status="Passed"
                                score={98}
                                age="4h"
                            />
                            <TableRow
                                name="VestingVault.sol"
                                commit="3d9g21"
                                status="Warning"
                                score={72}
                                age="1d"
                            />
                            <TableRow
                                name="SwapRouter.sol"
                                commit="2b8a1c"
                                status="Passed"
                                score={94}
                                age="2d"
                            />
                            <TableRow
                                name="LiquidityManager.sol"
                                commit="9c4e2f"
                                status="Passed"
                                score={91}
                                age="3d"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LoginGate>
    );
}

function MetricItem({ label, value, detail }: any) {
    return (
        <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className="text-4xl font-medium tracking-tighter text-foreground">{value}</div>
            <div className="text-xs font-mono text-muted-foreground">{detail}</div>
        </div>
    );
}

function TableRow({ name, commit, status, score, age }: any) {
    return (
        <div className="grid grid-cols-12 py-4 border-b border-border items-center hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className="col-span-4 pl-2 text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                {name}
            </div>
            <div className="col-span-2 font-mono text-xs text-muted-foreground">
                #{commit}
            </div>
            <div className="col-span-2">
                <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    status === "Critical" ? "text-destructive bg-destructive/10 px-2 py-1 rounded" :
                        status === "Warning" ? "text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded" :
                            "text-muted-foreground"
                )}>
                    {status}
                </span>
            </div>
            <div className="col-span-2 font-mono text-sm text-muted-foreground">
                {score} <span className="text-muted-foreground/50 text-xs">/ 100</span>
            </div>
            <div className="col-span-2 text-right pr-2 font-mono text-xs text-muted-foreground">
                {age}
            </div>
        </div>
    );
}
