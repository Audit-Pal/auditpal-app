"use client";

import { useState, useEffect } from "react";
import { Link } from "lucide-react";
import {
    Shield,
    FileCode,
    Lock as LockIcon,
    ArrowLeft,
    Download,
    Terminal,
    AlertTriangle,
    CheckCircle2,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export interface Finding {
    id: string;
    title: string;
    description: string;
    impact: string; // New field
    remediation: string; // Renamed/New field for detailed text
    cvss: number; // New field
    severity: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
    location: string; // e.g., "L42" or "42"
    file: string;
    status: string;
}

export interface Report {
    project_id: string;
    files_analyzed: number;
    findings: Finding[];
    total_findings: number;
    timestamp: string;
    code?: string; // Optional: The simplified content of the main file for display
}

interface AuditReportViewProps {
    report: Report;
    onInfo?: () => void;
}

export function AuditReportView({ report }: AuditReportViewProps) {
    const { theme } = useTheme();
    const [selectedFinding, setSelectedFinding] = useState<Finding | null>(
        report.findings.length > 0 ? report.findings[0] : null
    );
    const [editorMounted, setEditorMounted] = useState(false);
    const [editorInstance, setEditorInstance] = useState<any>(null);

    // Calculate counts
    const criticalCount = report.findings.filter(f => f.severity === 'critical').length;
    const highCount = report.findings.filter(f => f.severity === 'high').length;
    const mediumCount = report.findings.filter(f => f.severity === 'medium').length;
    const lowCount = report.findings.filter(f => f.severity === 'low').length;

    // Handle Editor Mount
    const handleEditorDidMount = (editor: any, monaco: any) => {
        setEditorInstance(editor);
        setEditorMounted(true);
    };

    // Effect to highlight line
    useEffect(() => {
        if (editorInstance && selectedFinding) {
            const lineNum = parseInt(selectedFinding.location.replace(/\D/g, '')) || 1;
            editorInstance.revealLineInCenter(lineNum);

            const decorations = editorInstance.deltaDecorations([], [
                {
                    range: {
                        startLineNumber: lineNum,
                        startColumn: 1,
                        endLineNumber: lineNum,
                        endColumn: 1000
                    },
                    options: {
                        isWholeLine: true,
                        className: 'myContentClass',
                        glyphMarginClassName: 'myGlyphMarginClass',
                        inlineClassName: selectedFinding.severity === 'critical' ? 'bg-red-500/10' :
                            selectedFinding.severity === 'high' ? 'bg-orange-500/10' : 'bg-amber-500/10'
                    }
                }
            ]);
            return () => {
                editorInstance.deltaDecorations(decorations, []);
            };
        }
    }, [editorInstance, selectedFinding]);


    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-180px)]">
            {/* Left Column: List */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-120px)]">
                <div className="p-0 space-y-4">
                    <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Summary</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col p-3 rounded-lg bg-red-500/5 border-2 border-red-500/20">
                            <span className="text-red-500 font-bold text-xs tracking-wide">CRITICAL</span>
                            <span className="text-foreground font-mono font-bold text-xl">{criticalCount}</span>
                        </div>
                        <div className="flex flex-col p-3 rounded-lg bg-orange-500/5 border-2 border-orange-500/20">
                            <span className="text-orange-500 font-bold text-xs tracking-wide">HIGH</span>
                            <span className="text-foreground font-mono font-bold text-xl">{highCount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-muted/20 border-2 border-border rounded-lg overflow-hidden">
                    <div className="p-3 border-b-2 border-border bg-muted/30">
                        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Vulnerabilities</h3>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-1">
                        {report.findings.map(finding => (
                            <button
                                key={finding.id}
                                onClick={() => setSelectedFinding(finding)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border-2 transition-all duration-200 group relative overflow-hidden",
                                    selectedFinding?.id === finding.id
                                        ? "bg-muted/50 border-border"
                                        : "bg-transparent border-transparent hover:bg-muted/30"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-[2px]",
                                        finding.severity === 'critical' ? "text-red-500 bg-red-500/10" :
                                            finding.severity === 'high' ? "text-orange-500 bg-orange-500/10" :
                                                "text-amber-500 bg-amber-500/10"
                                    )}>
                                        {finding.severity}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">CVSS {finding.cvss}</span>
                                </div>
                                <div className="text-xs font-bold text-foreground/70 group-hover:text-foreground truncate">
                                    {finding.title}
                                </div>
                                {selectedFinding?.id === finding.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-kast-teal" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Detail */}
            <div className="flex-1 bg-background border-2 border-border rounded-lg overflow-hidden flex flex-col shadow-lg">
                {selectedFinding ? (
                    <>
                        <div className="bg-background border-b-2 border-border">
                            <div className="p-6 pb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">{selectedFinding.title}</h2>
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                                                <FileCode className="w-3.5 h-3.5" />
                                                {selectedFinding.file}:{selectedFinding.location}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Shield className="w-3.5 h-3.5" />
                                                CVSS: <span className={cn(
                                                    "font-bold",
                                                    selectedFinding.cvss >= 9 ? "text-red-500" :
                                                        selectedFinding.cvss >= 7 ? "text-orange-500" : "text-amber-500"
                                                )}>{selectedFinding.cvss}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded text-white font-bold text-[10px] uppercase tracking-wider border",
                                        selectedFinding.severity === 'critical' ? "bg-red-500 border-red-600" :
                                            selectedFinding.severity === 'high' ? "bg-orange-500 border-orange-600" :
                                                "bg-amber-500 border-amber-600"
                                    )}>
                                        {selectedFinding.severity}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-2 border-border">
                                    <div className="md:col-span-2 space-y-3">
                                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            Vulnerability Analysis
                                        </h3>
                                        <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedFinding.description}
                                        </p>

                                        <div className="mt-4 pt-4 border-t border-border">
                                            <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Impact</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {selectedFinding.impact}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-emerald-500/5 p-4 rounded-lg border-2 border-emerald-500/20">
                                        <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3" /> Recommendation
                                        </h3>
                                        <p className="text-foreground/80 text-sm leading-relaxed">
                                            {selectedFinding.remediation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative bg-muted/10 flex flex-col min-h-[600px]">
                            <div className="h-10 bg-muted/20 border-b-2 border-border flex items-center px-6 justify-between shrink-0">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <FileCode className="w-3 h-3" />
                                    Source Context
                                </span>
                            </div>
                            <div className="flex-1 relative w-full h-full overflow-hidden">
                                <MonacoEditor
                                    height="100%"
                                    width="100%"
                                    language="sol"
                                    theme={theme === "dark" ? "vs-dark" : "light"}
                                    value={report.code || "// Code not available"}
                                    onMount={handleEditorDidMount}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        lineNumbers: "on",
                                        glyphMargin: false, // Cleaner look
                                        folding: true,
                                        fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                                        renderLineHighlight: "all",
                                        scrollBeyondLastLine: false,
                                        contextmenu: false,
                                        padding: { top: 16, bottom: 16 },
                                        automaticLayout: true, // Fixes resizing/layout issues
                                        scrollbar: {
                                            vertical: 'visible',
                                            horizontal: 'visible',
                                            useShadows: false,
                                            verticalScrollbarSize: 10,
                                        },
                                        overviewRulerLanes: 0,
                                        hideCursorInOverviewRuler: true,
                                        overviewRulerBorder: false,
                                    }}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a vulnerability to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
