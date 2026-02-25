"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor, { OnMount } from "@monaco-editor/react";
import {
    Folder, FileCode, Upload, Github, Play, ChevronRight, ChevronDown,
    Settings, X, Shield, Terminal, Zap, FileJson,
    Maximize2, Minimize2, MoreHorizontal, Activity, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Challenges } from "@/components/Challenges";
import { Submissions } from "@/components/Submissions";
import { Registration } from "@/components/Registration";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface FileNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    path: string;
}

export function Playground() {
    const { theme } = useTheme();
    const [sidebarTab, setSidebarTab] = useState<'files' | 'challenges' | 'submissions'>('challenges');
    const [playgroundType, setPlaygroundType] = useState<'standard' | 'evm-bench'>('standard');
    const [evalMode, setEvalMode] = useState<'detect' | 'patch' | 'exploit'>('detect');
    const [activeChallenge, setActiveChallenge] = useState<any>(null);
    const [files, setFiles] = useState<FileNode[]>([
        { name: "Start.sol", type: "file", path: "/Start.sol", content: "// Select a challenge to load code..." }
    ]);
    const [activeFile, setActiveFile] = useState<string>("/Start.sol");
    const [code, setCode] = useState("// Select a challenge to begin auditing...");
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [showRegistration, setShowRegistration] = useState(false);

    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        setIsEditorReady(true);
    };

    const handleSelectChallenge = (challenge: any) => {
        setActiveChallenge(challenge);
        const taskCode = challenge.code || `// ${challenge.name} - Challenge
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }
}`;
        setCode(taskCode);
        setActiveFile(`/${challenge.name.replace(/\s+/g, '')}.sol`);
        setFiles([{ name: `${challenge.name}.sol`, type: "file", path: `/${challenge.name}.sol`, content: taskCode }]);
        setSidebarTab("files");

        if (challenge.isEVMBench && challenge.modes?.length > 0) {
            setEvalMode(challenge.modes[0]);
        }
    };

    const runAudit = async () => {
        setIsRunning(true);
        const modeLabel = evalMode.charAt(0).toUpperCase() + evalMode.slice(1);
        setLogs([
            `Initializing ${modeLabel} Mode for ${activeChallenge?.name || 'Sandbox'}...`,
            playgroundType === 'evm-bench' ? "Loading EVMBench Test Harness..." : "Initializing Audit Agent Swarm...",
            "Analyzing Source Units...",
            evalMode === 'patch' ? "Identifying Patch Candidates..." : evalMode === 'exploit' ? "Synthesizing Exploit Payload..." : "Deep Scanning for Vulnerabilities..."
        ]);

        // Mock delay
        await new Promise(r => setTimeout(r, 2000));

        if (evalMode === 'detect') {
            setLogs(prev => [...prev, "Vulnerability Found: Access Control / Logic Error", "Consensus Reached: 98% Confidence"]);
        } else if (evalMode === 'patch') {
            setLogs(prev => [...prev, "Patch Generated: Added Access Control modifier", "Verifying Patch Integrity...", "Validation Passed: Vulnerability Eliminated"]);
        } else {
            setLogs(prev => [...prev, "Exploit Synthesized", "Testing Exploit against Sandbox...", "Result: SUCCESS - Contract Drained"]);
        }
        setIsRunning(false);
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-background text-foreground font-sans">
            {/* Left Sidebar */}
            <div className="w-80 flex flex-col border-r border-border bg-card/50">
                {/* Benchmark Selector */}
                <div className="p-3 border-b border-white/5 bg-muted/20">
                    <div className="flex bg-black/40 rounded-lg p-1">
                        <button
                            onClick={() => setPlaygroundType('standard')}
                            className={cn(
                                "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                                playgroundType === 'standard' ? "bg-kast-teal text-background" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setPlaygroundType('evm-bench')}
                            className={cn(
                                "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                                playgroundType === 'evm-bench' ? "bg-kast-teal text-background" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            EVMBench
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center border-b border-white/10">
                    <button
                        onClick={() => setSidebarTab('challenges')}
                        className={cn("flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors", sidebarTab === 'challenges' ? "text-kast-teal border-b-2 border-kast-teal bg-muted" : "text-muted-foreground hover:text-foreground")}
                    >
                        Challenges
                    </button>
                    <button
                        onClick={() => setSidebarTab('files')}
                        className={cn("flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors", sidebarTab === 'files' ? "text-kast-teal border-b-2 border-kast-teal bg-muted" : "text-muted-foreground hover:text-foreground")}
                    >
                        Files
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {sidebarTab === 'challenges' && <Challenges onSelectChallenge={handleSelectChallenge} type={playgroundType} />}

                    {sidebarTab === 'files' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">
                                <span>Project Files</span>
                                <Settings className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-1">
                                {files.map(file => (
                                    <div
                                        key={file.path}
                                        onClick={() => setActiveFile(file.path)}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors text-sm font-mono",
                                            activeFile === file.path ? "bg-kast-teal/10 text-kast-teal" : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                                        )}
                                    >
                                        <FileCode className="w-4 h-4" />
                                        {file.name}
                                    </div>
                                ))}
                            </div>

                            {activeChallenge?.description && (
                                <div className="mt-6 p-3 bg-muted/40 rounded-lg border border-border/50">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-kast-teal mb-2">Task Description</div>
                                    <div className="text-xs text-muted-foreground leading-relaxed">{activeChallenge.description}</div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-border mt-4">
                                <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground border-dashed border-border/50">
                                    <Github className="w-4 h-4" /> Import from GitHub
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                            <FileCode className="w-4 h-4 text-kast-teal" />
                            <span>{activeFile.replace('/', '')}</span>
                        </div>

                        {/* Mode Selector - Only for EVMBench or when specialized */}
                        {(playgroundType === 'evm-bench' || activeChallenge?.isEVMBench) && (
                            <div className="flex items-center bg-black/40 rounded-md p-0.5 border border-white/5">
                                {['detect', 'patch', 'exploit'].map((m) => {
                                    const isAvailable = !activeChallenge?.isEVMBench || activeChallenge.modes?.includes(m);
                                    return (
                                        <button
                                            key={m}
                                            disabled={!isAvailable}
                                            onClick={() => setEvalMode(m as any)}
                                            className={cn(
                                                "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all",
                                                evalMode === m ? "bg-kast-teal text-background shadow-lg" : "text-muted-foreground hover:text-foreground",
                                                !isAvailable && "opacity-30 cursor-not-allowed"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button
                            className="h-8 bg-kast-teal text-background hover:bg-foreground hover:text-background font-bold text-xs uppercase tracking-wider gap-2"
                            onClick={runAudit}
                            disabled={isRunning}
                        >
                            {isRunning ? <Zap className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                            {isRunning ? "Scanning..." : "Start Security Scan"}
                        </Button>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="sol"
                        language="sol"
                        theme={theme === 'dark' ? "vs-dark" : "light"}
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "Geist Mono, monospace",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16 }
                        }}
                    />
                </div>

                {/* Terminal / Logs */}
                <div className="h-48 border-t border-border bg-card flex flex-col">
                    <div className="h-8 border-b border-border flex items-center px-4 bg-muted gap-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5" /> Terminal
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> Output
                        </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1">
                        {logs.length === 0 && <div className="text-zinc-600 italic">Ready to audit.</div>}
                        {logs.map((log, i) => (
                            <div key={i} className="text-zinc-300 border-l-2 border-zinc-800 pl-2">
                                <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar (Validators/Status) */}
            <div className="w-64 flex flex-col border-l border-border bg-card/50">
                <div className="p-4 border-b border-border">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Network Consensus</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-zinc-900 rounded border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Active Validators</div>
                            <div className="text-xl font-bold text-foreground font-mono">64/64</div>
                        </div>
                        <div className="p-3 bg-zinc-900 rounded border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Mean Confidence</div>
                            <div className="text-xl font-bold text-emerald-400 font-mono">98.5%</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Trust Signals</h3>
                    <div className="text-xs text-zinc-500">
                        Real-time consensus verification by 64 distributed notes.
                    </div>
                </div>
            </div>

            <Registration isOpen={showRegistration} onClose={() => setShowRegistration(false)} onRegister={() => { }} />
        </div>
    )
}
