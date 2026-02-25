"use client";

import { motion } from "framer-motion";
import { Search, FileType, Check, AlertCircle, X, Clock, ArrowLeft, Download, RotateCcw, Eye, Shield, BarChart3, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Consumer-friendly Audit type
interface Audit {
    id: string;
    fileName: string;
    date: string;
    relativeDate: string;
    securityScore: number;
    duration: string; // e.g. "2m 14s"
    vulnerabilities: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    status: 'passed' | 'issues_found' | 'running' | 'failed';
}

// Function to calculate score based on vulnerabilities
const calculateScore = (vulnerabilities: Audit['vulnerabilities']): number => {
    const weights = {
        critical: 20,
        high: 10,
        medium: 5,
        low: 1
    };

    const penalty = (
        (vulnerabilities.critical * weights.critical) +
        (vulnerabilities.high * weights.high) +
        (vulnerabilities.medium * weights.medium) +
        (vulnerabilities.low * weights.low)
    );

    return Math.max(0, 100 - penalty);
};

// Mock data for consumer audits (Scores are now calculated dynamically)
const rawAuditsData: Omit<Audit, 'securityScore'>[] = [
    {
        id: "1",
        fileName: "StakingPool_V2.sol",
        date: "2026-02-02",
        relativeDate: "2 mins ago",
        duration: "4m 12s",
        vulnerabilities: { critical: 2, high: 3, medium: 1, low: 0 },
        status: "issues_found",
    },
    {
        id: "2",
        fileName: "GovernanceToken.sol",
        date: "2026-02-02",
        relativeDate: "4 hours ago",
        duration: "2m 45s",
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 2 },
        status: "passed",
    },
    {
        id: "3",
        fileName: "VestingVault.sol",
        date: "2026-02-01",
        relativeDate: "1 day ago",
        duration: "5m 30s",
        vulnerabilities: { critical: 0, high: 1, medium: 3, low: 2 },
        status: "issues_found",
    },
    {
        id: "4",
        fileName: "SwapRouter.sol",
        date: "2026-02-01",
        relativeDate: "2 days ago",
        duration: "3m 15s",
        vulnerabilities: { critical: 0, high: 0, medium: 1, low: 1 },
        status: "passed",
    },
    {
        id: "5",
        fileName: "LiquidityPool.sol",
        date: "2026-01-30",
        relativeDate: "3 days ago",
        duration: "Processing...",
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
        status: "running",
    },
];

const auditsData: Audit[] = rawAuditsData.map(audit => ({
    ...audit,
    securityScore: audit.status === 'running' ? 0 : calculateScore(audit.vulnerabilities)
}));

const StatusBadge = ({ status, score }: { status: Audit['status']; score: number }) => {
    switch (status) {
        case 'passed':
            return (
                <div className="flex items-center gap-2 text-emerald-500">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium text-muted-foreground">Passed</span>
                </div>
            );
        case 'issues_found':
            return (
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", score < 50 ? "bg-rose-500" : "bg-amber-500")} />
                    <span className="text-sm font-medium text-muted-foreground">
                        {score < 50 ? "Critical Issues" : "Needs Review"}
                    </span>
                </div>
            );
        case 'running':
            return (
                <div className="flex items-center gap-2 text-blue-500">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium text-muted-foreground">Running...</span>
                </div>
            );
        case 'failed':
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium text-muted-foreground">Failed</span>
                </div>
            );
    }
};

const VulnerabilitySummary = ({ vulns }: { vulns: Audit['vulnerabilities'] }) => {
    const total = vulns.critical + vulns.high + vulns.medium + vulns.low;
    if (total === 0) {
        return <span className="text-zinc-600 text-sm font-medium">—</span>;
    }

    return (
        <div className="flex items-center gap-2">
            {vulns.critical > 0 && (
                <div className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-1.5" title="Critical Vulnerabilities">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {vulns.critical}
                </div>
            )}
            {vulns.high > 0 && (
                <div className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium flex items-center gap-1.5" title="High Severity Vulnerabilities">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {vulns.high}
                </div>
            )}
            {vulns.medium > 0 && (
                <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1.5" title="Medium Severity Vulnerabilities">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {vulns.medium}
                </div>
            )}
            {vulns.low > 0 && (
                <div className="px-2 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-xs font-medium flex items-center gap-1.5" title="Low Severity Vulnerabilities">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    {vulns.low}
                </div>
            )}
        </div>
    );
};

const ScoreDisplay = ({ score, status }: { score: number; status: Audit['status'] }) => {
    if (status === 'running') {
        return <span className="text-zinc-700 text-sm font-mono">--</span>;
    }
    return (
        <div className={cn(
            "font-mono text-lg font-bold",
            score >= 90 ? "text-emerald-500" :
                score >= 70 ? "text-amber-500" :
                    score >= 50 ? "text-orange-500" : "text-rose-500"
        )}>
            {score}
        </div>
    );
};

interface OptimizationSubmissionsProps {
    onBack?: () => void;
    benchmarkId?: string;
}

export function OptimizationSubmissions({ onBack, benchmarkId }: OptimizationSubmissionsProps) {
    const [filter, setFilter] = useState<'all' | 'passed' | 'issues'>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const filteredAudits = auditsData.filter(audit => {
        const matchesFilter = filter === 'all'
            || (filter === 'passed' && audit.status === 'passed')
            || (filter === 'issues' && (audit.status === 'issues_found' || audit.status === 'failed'));
        const matchesSearch = audit.fileName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    }).sort((a, b) => {
        if (sortBy === "newest") return 0; // Already sorted by mock data order (assuming newest first)
        if (sortBy === "score_desc") return b.securityScore - a.securityScore;
        if (sortBy === "score_asc") return a.securityScore - b.securityScore;
        return 0;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-20"
        >
            {/* Header / Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="h-9 gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back</span>
                        </Button>
                    )}

                    <h2 className="text-lg font-medium text-foreground hidden sm:block">Audit History</h2>

                    <div className="w-[1px] h-6 bg-border mx-2 hidden sm:block" />

                    {/* Tabs - Minimal Text */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                filter === 'all' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('passed')}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                filter === 'passed' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            Passed
                        </button>
                        <button
                            onClick={() => setFilter('issues')}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                filter === 'issues' ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            Issues
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Simple Sort Dropdown */}
                    <div className="w-40">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-9 bg-transparent border-input text-sm text-muted-foreground font-medium focus:ring-0">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                                <SelectItem value="newest" className="text-sm text-muted-foreground focus:text-foreground focus:bg-accent">Newest First</SelectItem>
                                <SelectItem value="score_desc" className="text-sm text-muted-foreground focus:text-foreground focus:bg-accent">Highest Score</SelectItem>
                                <SelectItem value="score_asc" className="text-sm text-muted-foreground focus:text-foreground focus:bg-accent">Lowest Score</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filter by filename..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 bg-transparent border border-input rounded-md py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-ring transition-colors placeholder:text-muted-foreground text-foreground"
                        />
                    </div>
                </div>
            </div>

            {/* Audits List */}
            <div className="border-t border-border">
                {/* Header Row */}
                <div className="hidden lg:flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="flex-1">File Name</div>
                    <div className="flex items-center gap-10">
                        <div className="w-[130px]">Status</div>
                        <div className="w-[160px]">Findings</div>
                        <div className="w-[50px] text-right">Score</div>
                        <div className="w-[100px]"></div>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {filteredAudits.length === 0 ? (
                        <div className="text-center py-24 text-muted-foreground">
                            <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No audits found.</p>
                            <Button
                                variant="link"
                                className="text-foreground mt-1 h-auto p-0 text-sm underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
                                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        filteredAudits.map((audit) => (
                            <div
                                key={audit.id}
                                className="group hover:bg-muted/30 transition-colors py-4 px-4"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* File Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="text-muted-foreground">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-foreground text-base truncate">
                                                    {audit.fileName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span>{audit.relativeDate}</span>
                                                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                                                <span>Duration: {audit.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metrics - Minimalist Grid */}
                                    <div className="flex items-center gap-10 text-sm">

                                        {/* Status */}
                                        <div className="w-[130px]">
                                            <StatusBadge status={audit.status} score={audit.securityScore} />
                                        </div>

                                        {/* Vulnerabilities */}
                                        <div className="w-[160px] hidden md:block">
                                            <VulnerabilitySummary vulns={audit.vulnerabilities} />
                                        </div>

                                        {/* Score */}
                                        <div className="w-[50px] text-right">
                                            <ScoreDisplay score={audit.securityScore} status={audit.status} />
                                        </div>

                                        {/* Actions */}
                                        <div className="w-[100px] flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-foreground hover:bg-transparent h-8 px-2 font-medium"
                                            >
                                                View Report
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}
