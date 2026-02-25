"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw, ShieldCheck } from "lucide-react";
import { AuditReportView, Report } from "@/components/AuditReportView";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export default function AuditReportPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReport = () => {
            setLoading(true);
            try {
                // Try to find in localStorage tasks matching the ID
                const tasksString = localStorage.getItem('tasks');
                let foundTask = null;

                if (tasksString) {
                    const tasks = JSON.parse(tasksString);
                    foundTask = tasks.find((t: any) => t.id === params.id);
                }

                // Default code if none found (fallback)
                const codeContent = foundTask?.code || `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE FUNCTION
    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        // REENTRANCY HERE
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= _amount;
    }
}`;

                // Generate smart mock findings based on the code content
                // If it's the default SimpleVault, map correctly.
                const findings: any[] = [];

                if (codeContent.includes("function withdraw")) {
                    findings.push({
                        id: "1",
                        title: "Reentrancy Vulnerability",
                        description: "The function `withdraw` allows an external call to the caller via `msg.sender.call` before updating the user's balance. A malicious contract can exploit this by defining a fallback function that recursively calls back into `withdraw` before the first invocation completes, effectively draining the contract's funds.",
                        impact: "An attacker can drain the entire balance of the contract. This is a critical severity issue that directly leads to loss of funds.",
                        remediation: "Implement the Checks-Effects-Interactions pattern. Ensure that all state changes (e.g., deducting the balance) happen BEFORE any external calls. Alternatively, use OpenZeppelin's `ReentrancyGuard` modifier.",
                        cvss: 9.8,
                        severity: "critical",
                        confidence: 0.98,
                        location: "L15",
                        file: "SimpleVault.sol",
                        status: "open"
                    });
                } else {
                    // Generic fallback findings
                    findings.push({
                        id: "1",
                        title: "Potential Reentrancy",
                        description: "State changes detected after external calls.",
                        impact: "Potential loss of funds if the external call target is malicious.",
                        remediation: "Move state updates before external calls.",
                        cvss: 8.5,
                        severity: "critical",
                        confidence: 0.98,
                        location: "L1",
                        file: "Contract.sol",
                        status: "open"
                    });
                }

                // Add more generic findings for demonstration
                findings.push({
                    id: "2",
                    title: "Unchecked Return Value",
                    description: "The low-level call `address.call` returns a boolean indicating success or failure. This return value is not checked in the code, which means the transaction could fail silently while the contract state assumes it succeeded.",
                    impact: "The contract may end up in an inconsistent state where it believes it has sent funds when it actually hasn't, leading to accounting errors or locked funds.",
                    remediation: "Always check the return value of low-level calls. require(success, \"Transfer failed\");",
                    cvss: 7.5,
                    severity: "high",
                    confidence: 0.95,
                    location: "L8",
                    file: "SimpleVault.sol",
                    status: "open"
                });

                const finalReport: Report = {
                    project_id: params.id as string,
                    files_analyzed: 1,
                    total_findings: findings.length,
                    timestamp: foundTask?.createdAt || new Date().toISOString(),
                    code: codeContent,
                    findings: findings
                };

                setReport(finalReport);
            } catch (e) {
                console.error("Failed to load report", e);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadReport();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-kast-teal border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground font-mono text-sm animate-pulse">Decrypting Audit Report...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold mb-4">Report Not Found</h1>
                <Link href="/benchmark/solidity-suite">
                    <Button variant="outline">Return to Workspace</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <div className="border-b-2 border-border bg-background">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/benchmark/solidity-suite">
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-muted">
                                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground tracking-tight">Audit Report</h1>
                                <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                                    ID: {report.project_id.substring(0, 8)} • Found {report.total_findings} vulnerabilities
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="outline" className="h-10 border-zinc-300 hover:bg-muted text-foreground">
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                        <Link href="/benchmark/solidity-suite">
                            <Button className="h-10 bg-foreground text-background hover:bg-foreground/90 font-bold">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                New Scan
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                <AuditReportView report={report} />
            </div>
        </div>
    );
}
