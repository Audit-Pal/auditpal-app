"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Shield,
    CheckCircle2,
    Zap,
    FileText,
    Code,
    Search,
    Bug,
    ArrowRight,
    ChevronDown,
    Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface OptimizationOverviewProps {
    onStartNew: () => void;
    onRegister: () => void;
    isRegistered: boolean;
}

const sidebarNav = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "capabilities", label: "Capabilities", icon: Zap },
    { id: "process", label: "How it Works", icon: Terminal },
    { id: "report", label: "Sample Report", icon: FileText },
];

export function OptimizationOverview({ onStartNew, onRegister, isRegistered }: OptimizationOverviewProps) {
    const [activeSection, setActiveSection] = useState("overview");

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-10% 0px -50% 0px",
            threshold: 0.1,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sidebarNav.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* 1. Left Sidebar: Navigation (Sticky) */}
                <aside className="lg:col-span-3 hidden lg:block">
                    <nav className="sticky top-24 space-y-1">
                        {sidebarNav.map((item, i) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={i}
                                    onClick={() => scrollToSection(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left group",
                                        isActive
                                            ? "bg-kast-teal/10 text-kast-teal font-semibold"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                    <span className="leading-tight">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* 2. Main Content */}
                <main className="lg:col-span-9 space-y-16">

                    {/* Mobile Navigation (Dropdown) */}
                    <div className="lg:hidden mb-6">
                        <div className="relative">
                            <select
                                value={activeSection}
                                onChange={(e) => scrollToSection(e.target.value)}
                                className="w-full appearance-none bg-card border border-border rounded-lg py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-kast-teal/50"
                            >
                                {sidebarNav.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Overview Section */}
                    <section id="overview" className="scroll-mt-24 space-y-6">
                        <div className="prose prose-invert max-w-none text-lg text-muted-foreground leading-relaxed">
                            <p>
                                <strong className="text-foreground">AuditPal Solbench-30</strong> is the premier security suite for EVM smart contracts.
                                Instead of relying on a single auditor, we leverage a consensus of <strong className="text-foreground">AI Agents</strong> to scan your code, finding vulnerabilities that traditional tools miss.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <Button onClick={onStartNew} className="bg-kast-teal text-background hover:bg-foreground hover:text-background font-bold rounded-full border-none">
                                    Start Security Scan <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button variant="outline" className="border-border text-foreground hover:bg-muted rounded-full">
                                    View Sample Report
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="p-4 bg-muted bg-opacity-30 rounded-xl border border-border">
                                <div className="text-kast-teal mb-2"><Zap className="w-6 h-6" /></div>
                                <div className="font-bold text-foreground">Instant Results</div>
                                <div className="text-xs text-muted-foreground mt-1">Full audit in &lt; 15 minutes</div>
                            </div>
                            <div className="p-4 bg-muted bg-opacity-30 rounded-xl border border-border">
                                <div className="text-indigo-400 mb-2"><Shield className="w-6 h-6" /></div>
                                <div className="font-bold text-foreground">Deep Semantics</div>
                                <div className="text-xs text-muted-foreground mt-1">Finds logic errors, not just syntax</div>
                            </div>
                            <div className="p-4 bg-muted bg-opacity-30 rounded-xl border border-border">
                                <div className="text-emerald-400 mb-2"><CheckCircle2 className="w-6 h-6" /></div>
                                <div className="font-bold text-foreground">Zero False Positives</div>
                                <div className="text-xs text-muted-foreground mt-1">Consensus-verified findings</div>
                            </div>
                        </div>
                    </section>

                    {/* Capabilities Section */}
                    <section id="capabilities" className="scroll-mt-24 space-y-8">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <Zap className="w-6 h-6 text-kast-teal" />
                            Suite Capabilities
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border border-border rounded-2xl bg-muted bg-opacity-30 hover:border-kast-teal/30 transition-colors">
                                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <Bug className="w-4 h-4 text-rose-500" /> Vulnerability Detection
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-500 rounded-full mt-2" /> Reentrancy Attacks</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-500 rounded-full mt-2" /> Integer Overflow/Underflow</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-500 rounded-full mt-2" /> Access Control Flaws</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-rose-500 rounded-full mt-2" /> Unchecked Return Values</li>
                                </ul>
                            </div>
                            <div className="p-6 border border-border rounded-2xl bg-muted bg-opacity-30 hover:border-kast-teal/30 transition-colors">
                                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <Search className="w-4 h-4 text-blue-400" /> Logic Analysis
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full mt-2" /> Business Logic Bypass</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full mt-2" /> Price Manipulation Oracle</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full mt-2" /> Flash Loan Susceptibility</li>
                                    <li className="flex items-start gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full mt-2" /> Governance Voting Rigging</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How it Works Section */}
                    <section id="process" className="scroll-mt-24 space-y-8">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <Terminal className="w-6 h-6 text-kast-teal" />
                            How It Works
                        </h2>
                        <div className="relative border-l border-border pl-8 space-y-12">
                            <div className="relative">
                                <div className="absolute -left-[39px] top-0 w-6 h-6 bg-background border border-kast-teal rounded-full flex items-center justify-center text-[10px] font-bold text-kast-teal">1</div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Upload Contracts</h3>
                                <p className="text-muted-foreground">Paste your Solidity code or connect a GitHub repository. We support single files and multi-file projects.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[39px] top-0 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">2</div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">AI Consensus Scan</h3>
                                <p className="text-muted-foreground">Multiple specialized auditing agents analyze your code in parallel. They cross-verify findings to eliminate false positives.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[39px] top-0 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">3</div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Get Actionable Report</h3>
                                <p className="text-muted-foreground">Receive a detailed JSON and PDF report with exact lines of code, severity levels, and suggested fixes.</p>
                            </div>
                        </div>
                    </section>

                    {/* Sample Report Section */}
                    <section id="report" className="scroll-mt-24 space-y-8">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <FileText className="w-6 h-6 text-kast-teal" />
                            Sample Findings
                        </h2>
                        <div className="p-6 bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
                            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                                <Code className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">scan_results.json</span>
                            </div>
                            <pre className="font-mono text-sm text-muted-foreground leading-relaxed overflow-x-auto">
                                {`{
  "severity": "HIGH",
  "type": "Reentrancy",
  "location": "Vault.sol:42",
  "description": "External call to 'msg.sender' before state update allow re-entry.",
  "recommendation": "Implement Checks-Effects-Interactions pattern or use ReentrancyGuard."
}`}
                            </pre>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
