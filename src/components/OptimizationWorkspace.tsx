"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Code, Activity, Plus, X, Target, Zap, FileCode, Play, Terminal, CheckCircle2, AlertTriangle, Layers, MonitorPlay, Search, GitBranch, Settings, ChevronRight, ChevronDown, Check, Loader2, List, Lock as LockIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { DataModule } from "@/components/ui/data-module";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Challenge } from "@/components/OptimizationChallenges";
import { VulnerabilityFindings } from "@/components/VulnerabilityFindings";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// Helper to extract owner/repo from GitHub URL
const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
        return { owner: match[1], repo: match[2].replace('.git', '') };
    }
    return null;
};

interface OptimizationWorkspaceProps {
    challenge?: Challenge | null;
    onClose?: () => void;
    onViewHistory?: () => void;
    benchmarkId?: string;
}

const agentGroups = [
    {
        name: "Core Security",
        agents: [
            { id: "gov", name: "Governance & Economics", standard: "SCSVS-GOV", agent: "GovGuard" },
            { id: "auth", name: "Authentication & Access", standard: "SCSVS-AUTH", agent: "AccessAI" },
            { id: "crypto", name: "Cryptography & Math", standard: "SCSVS-CRYP", agent: "MathSentry" },
        ]
    },
    {
        name: "Logic & Flow",
        agents: [
            { id: "logic", name: "Business Logic", standard: "SCSVS-LOGI", agent: "LogicCheck" },
            { id: "reentrancy", name: "Reentrancy & Calls", standard: "SCSVS-CALL", agent: "CallSentry" },
            { id: "overflow", name: "Overflow & Math", standard: "SCSVS-MATH", agent: "NumGuard" },
        ]
    },
    {
        name: "Optimization",
        agents: [
            { id: "gas", name: "Gas Optimization", standard: "SCSVS-GAS", agent: "GasGuru" },
            { id: "proxy", name: "Proxy & Upgradeability", standard: "SCSVS-PROX", agent: "ProxyGuard" },
        ]
    }
];

const steps = [
    { id: 1, label: "Compiler Verification", duration: "1.2s" },
    { id: 2, label: "Static Analysis", duration: "2.5s" },
    { id: 3, label: "Symbolic Execution", duration: "3.8s" },
    { id: 4, label: "Vulnerability Scan", duration: "1.5s" },
    { id: 5, label: "Generating Report", duration: "0.5s" },

];


interface Finding {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    confidence: number;
    location: string;
    file: string;
    status: string;
}

interface Report {
    project_id: string;
    files_analyzed: number;
    findings: Finding[];
    total_findings: number;
    timestamp: string;
}

export function OptimizationWorkspace({ challenge, onClose, onViewHistory, benchmarkId }: OptimizationWorkspaceProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [contractCode, setContractCode] = useState(`// SPDX-License-Identifier: MIT
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
}`);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [expandedGroups, setExpandedGroups] = useState<string[]>(["Core Security", "Logic & Flow", "Optimization"]);

    // Challenge-related state
    const [challengeInfo, setChallengeInfo] = useState<{
        name: string;
        repoUrl?: string; // Optional for local uploads
        commit?: string;
        platform: string;
        owner?: string;
        repo?: string;
        isLocal?: boolean;
    } | null>(null);
    const [loadingChallenge, setLoadingChallenge] = useState(false);
    const [fileTree, setFileTree] = useState<{ path: string; type: string; sha?: string; content?: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [sidebarTab, setSidebarTab] = useState<'files' | 'agents'>('agents');

    // Manual Import State
    const [githubImportUrl, setGithubImportUrl] = useState("");
    const [githubImportError, setGithubImportError] = useState<string | null>(null);

    // Report State
    const [report, setReport] = useState<Report | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [activeFinding, setActiveFinding] = useState<Finding | null>(null);
    const [showReport, setShowReport] = useState(false);

    // Fetch file content from GitHub
    const fetchGithubFile = async (owner: string, repo: string, path: string, commit: string) => {
        try {
            const url = `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch file');
            return await res.text();
        } catch (err) {
            console.error('Error fetching file:', err);
            return '// Error loading file content';
        }
    };

    // Effect to load challenge data when a challenge is provided
    useEffect(() => {
        if (challenge && challenge.codebases?.length > 0) {
            const codebase = challenge.codebases[0];
            const parsed = parseGitHubUrl(codebase.repo_url);

            if (parsed) {
                setLoadingChallenge(true);
                setFetchError(null);
                setChallengeInfo({
                    name: challenge.name,
                    repoUrl: codebase.repo_url,
                    commit: codebase.commit,
                    platform: challenge.platform,
                    owner: parsed.owner,
                    repo: parsed.repo
                });
                setSidebarTab('files'); // Switch to files tab automatically

                // Fetch repository tree from GitHub API
                const fetchTree = async () => {
                    try {
                        const treeUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${codebase.commit}?recursive=1`;
                        const res = await fetch(treeUrl);

                        if (!res.ok) {
                            // Try with 'main' branch if commit fails
                            const mainRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/main?recursive=1`);
                            if (!mainRes.ok) throw new Error('Failed to fetch tree');
                            const data = await mainRes.json();
                            return data.tree || [];
                        }

                        const data = await res.json();
                        return data.tree || [];
                    } catch (err) {
                        console.error('Error fetching tree:', err);
                        setFetchError('Could not fetch repository structure');
                        return [];
                    }
                };

                fetchTree().then(async (tree) => {
                    // STRICT filtering for .sol files ONLY
                    const solFiles = tree
                        .filter((item: any) => item.type === 'blob' && item.path.endsWith('.sol'))
                        .slice(0, 50);

                    setFileTree(solFiles);

                    // Auto-load first .sol file if available
                    if (solFiles.length > 0) {
                        const first = solFiles[0];
                        setSelectedFile(first.path);
                        const content = await fetchGithubFile(parsed.owner, parsed.repo, first.path, codebase.commit || 'main');
                        setContractCode(content);
                    } else {
                        setContractCode('// No Solidity (.sol) files found in this repository.');
                    }
                    setLoadingChallenge(false);

                    // --- AUTOMATED REPORT FETCHING ---
                    // Fetch report AFTER tree is loaded or in parallel
                    const fetchReport = async () => {
                        setLoadingReport(true);
                        setReport(null);
                        try {
                            const apiUrl = 'https://audit-api-two.vercel.app';
                            const res = await fetch(`${apiUrl}/api/challenges/report/${challenge.project_id}`);
                            if (res.ok) {
                                const data = await res.json();
                                setReport(data);
                            } else {
                                console.log('No existing report found for this challenge.');
                            }
                        } catch (error) {
                            console.error("Error fetching report:", error);
                        } finally {
                            setLoadingReport(false);
                        }
                    };
                    fetchReport();
                });
            }
        }
    }, [challenge]);



    // Handle Load Example
    const handleLoadExample = () => {
        setLoadingChallenge(true);
        setTimeout(() => {
            const vaultCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SecurityBase.sol";
import "./Token.sol";
import "./Registry.sol";
import "./Constants.sol";

/**
 * @title VulnerableVault
 * @dev A high-yield vault designed for liquidity providers with a known reentrancy vulnerability.
 */
contract VulnerableVault is SecurityBase {
    mapping(address => uint) public balances;
    Token public rewardToken;
    Registry public registry;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _rewardToken, address _registry) {
        rewardToken = Token(_rewardToken);
        registry = Registry(_registry);
    }

    function deposit() public payable {
        require(msg.value >= Constants.MIN_DEPOSIT, "Below minimum deposit");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @dev Vulnerable withdraw function. The state update (balances[msg.sender] -= _amount)
     * happens AFTER the external call, allowing for reentrancy attacks.
     */
    function withdraw(uint _amount) public nonReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // External call to sender. If sender is a contract, it can call back into this function.
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        // Vulnerability: State update happens after external call
        balances[msg.sender] -= _amount;
        emit Withdrawn(msg.sender, _amount);
    }

    function emergencyExit() external {
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}`;

            const tokenCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Token
 * @dev Implementation of a standard ERC20-like token for reward distribution.
 */
contract Token {
    string public name = "AuditPal Rewards";
    string public symbol = "APR";
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10**18;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Allowance exceeded");
        balances[from] -= amount;
        balances[to] += amount;
        allowances[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
}`;

            const securityBaseCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SecurityBase
 * @dev Provides reentrancy protection and ownership management.
 */
abstract contract SecurityBase {
    bool private locked;
    address public owner;

    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        owner = newOwner;
    }
}`;

            const governanceCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

/**
 * @title Governance
 * @dev Simple DAO implementation for system parameters configuration.
 */
contract Governance {
    Token public votingToken;
    uint256 public proposalCount;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    constructor(address _token) {
        votingToken = Token(_token);
    }

    function createProposal(string memory _description) public {
        require(votingToken.balances(msg.sender) > 0, "No voting power");
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false
        });
    }

    function vote(uint256 _id, bool _support) public {
        Proposal storage p = proposals[_id];
        require(!hasVoted[_id][msg.sender], "Already voted");
        uint256 weight = votingToken.balances(msg.sender);
        
        if (_support) p.votesFor += weight;
        else p.votesAgainst += weight;
        
        hasVoted[_id][msg.sender] = true;
    }
}`;

            const treasuryCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SecurityBase.sol";

/**
 * @title Treasury
 * @dev Manages accumulated fees and system liquidity.
 */
contract Treasury is SecurityBase {
    uint256 public totalReserves;
    
    receive() external payable {
        totalReserves += msg.value;
    }

    function withdrawReserves(uint256 _amount) external onlyOwner {
        require(_amount <= totalReserves, "Insufficient reserves");
        totalReserves -= _amount;
        payable(owner).transfer(_amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}`;

            const oracleCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SecurityBase.sol";

/**
 * @title Oracle
 * @dev Mock decentralized price feed simulation.
 */
contract Oracle is SecurityBase {
    mapping(bytes32 => uint256) public prices;
    mapping(bytes32 => uint256) public lastUpdated;

    event PriceUpdated(bytes32 indexed symbol, uint256 price, uint256 timestamp);

    function updatePrice(string memory _symbol, uint256 _price) external onlyOwner {
        bytes32 symbolHash = keccak256(abi.encodePacked(_symbol));
        prices[symbolHash] = _price;
        lastUpdated[symbolHash] = block.timestamp;
        emit PriceUpdated(symbolHash, _price, block.timestamp);
    }

    function getPrice(string memory _symbol) public view returns (uint256) {
        bytes32 symbolHash = keccak256(abi.encodePacked(_symbol));
        require(lastUpdated[symbolHash] > block.timestamp - 1 hours, "Price feed stale");
        return prices[symbolHash];
    }
}`;

            const lendingPoolCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SecurityBase.sol";
import "./Oracle.sol";
import "./Token.sol";

/**
 * @title LendingPool
 * @dev Manages lending and borrowing with collateralization checks.
 */
contract LendingPool is SecurityBase {
    Oracle public priceOracle;
    Token public asset;
    
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public debt;

    constructor(address _oracle, address _asset) {
        priceOracle = Oracle(_oracle);
        asset = Token(_asset);
    }

    function depositCollateral() public payable {
        collateral[msg.sender] += msg.value;
    }

    function borrow(uint256 _amount) public nonReentrant {
        uint256 ethPrice = priceOracle.getPrice("ETH");
        uint256 collateralValue = (collateral[msg.sender] * ethPrice) / 1e18;
        require(collateralValue >= (_amount * 150) / 100, "Insufficient collateral");
        
        debt[msg.sender] += _amount;
        asset.transfer(msg.sender, _amount);
    }
}`;

            const registryCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SecurityBase.sol";

/**
 * @title Registry
 * @dev Global system registry to manage contract pointers.
 */
contract Registry is SecurityBase {
    mapping(bytes32 => address) public addresses;

    function setAddress(string memory _name, address _addr) external onlyOwner {
        require(_addr != address(0), "Invalid address");
        addresses[keccak256(abi.encodePacked(_name))] = _addr;
    }

    function getAddress(string memory _name) public view returns (address) {
        address addr = addresses[keccak256(abi.encodePacked(_name))];
        require(addr != address(0), "Address not registered");
        return addr;
    }
}`;

            const constantsCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Constants
 * @dev Global system constants and shared configuration.
 */
library Constants {
    uint256 public constant MIN_DEPOSIT = 0.1 ether;
    uint256 public constant MAX_LEVERAGE = 5;
    uint256 public constant LIQUIDATION_THRESHOLD = 120; // 120%
    uint256 public constant PROTOCOL_FEE = 30; // 0.3%
    
    string public constant VERSION = "1.0.0-Beta";
    
    function calculateFee(uint256 _amount) internal pure returns (uint256) {
        return (_amount * PROTOCOL_FEE) / 10000;
    }
}`;

            setChallengeInfo({
                name: "AuditPal DeFi Ecosystem",
                repoUrl: "https://github.com/auditpal/enterprise-defi",
                commit: "v1.0.4-production",
                platform: "example",
                owner: "auditpal",
                repo: "enterprise-defi",
                isLocal: true
            });

            const exampleFiles = [
                { path: "VulnerableVault.sol", type: "blob", content: vaultCode },
                { path: "Token.sol", type: "blob", content: tokenCode },
                { path: "SecurityBase.sol", type: "blob", content: securityBaseCode },
                { path: "Governance.sol", type: "blob", content: governanceCode },
                { path: "Treasury.sol", type: "blob", content: treasuryCode },
                { path: "Oracle.sol", type: "blob", content: oracleCode },
                { path: "LendingPool.sol", type: "blob", content: lendingPoolCode },
                { path: "Registry.sol", type: "blob", content: registryCode },
                { path: "Constants.sol", type: "blob", content: constantsCode }
            ];

            setFileTree(exampleFiles);
            setSelectedFile("VulnerableVault.sol");
            setContractCode(vaultCode);
            setSidebarTab('files');
            setLoadingChallenge(false);
        }, 800);
    };

    // Handle Manual GitHub Import
    const handleGithubImport = async () => {
        if (!githubImportUrl) return;

        const parsed = parseGitHubUrl(githubImportUrl);
        if (!parsed) {
            setGithubImportError("Invalid GitHub URL");
            return;
        }

        setLoadingChallenge(true);
        setGithubImportError(null);
        setChallengeInfo({
            name: parsed.repo,
            repoUrl: githubImportUrl,
            commit: 'main',
            platform: 'github',
            owner: parsed.owner,
            repo: parsed.repo
        });
        setSidebarTab('files');

        try {
            const treeRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/main?recursive=1`);
            if (!treeRes.ok) throw new Error("Repository not found or private");

            const data = await treeRes.json();
            const tree = data.tree || [];

            // STRICT filtering for .sol files
            const solFiles = tree
                .filter((item: any) => item.type === 'blob' && item.path.endsWith('.sol'))
                .slice(0, 100);

            setFileTree(solFiles);

            if (solFiles.length > 0) {
                const first = solFiles[0];
                setSelectedFile(first.path);
                const content = await fetchGithubFile(parsed.owner, parsed.repo, first.path, 'main');
                setContractCode(content);
                // Clear the import input on success
                setGithubImportUrl("");
            } else {
                setContractCode('// No Solidity (.sol) files found in this repository.');
            }
        } catch (error) {
            console.error(error);
            setGithubImportError("Failed to import. Check URL/public access.");
            setChallengeInfo(null);
        } finally {
            setLoadingChallenge(false);
        }
    };

    // Handle Local Folder Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoadingChallenge(true);
        const solFiles: { path: string; type: string; content: string }[] = [];
        let filesProcessed = 0;

        // Convert FileList to Array and filter
        const fileArray = Array.from(files).filter(f => f.name.endsWith('.sol'));

        if (fileArray.length === 0) {
            setGithubImportError("No .sol files found in selection");
            setLoadingChallenge(false);
            return;
        }

        setChallengeInfo({
            name: "Local Upload",
            platform: "local",
            isLocal: true
        });
        setSidebarTab('files');

        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                solFiles.push({
                    path: file.webkitRelativePath || file.name,
                    type: 'blob',
                    content: event.target?.result as string
                });

                filesProcessed++;
                if (filesProcessed === fileArray.length) {
                    // Sort by path length/alphabetical
                    solFiles.sort((a, b) => a.path.localeCompare(b.path));
                    setFileTree(solFiles);

                    if (solFiles.length > 0) {
                        setSelectedFile(solFiles[0].path);
                        setContractCode(solFiles[0].content);
                    }
                    setLoadingChallenge(false);
                }
            };
            reader.readAsText(file);
        });
    };

    const toggleAgent = (id: string) => {
        setSelectedAgents(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
        );
    };

    const handleSubmit = async () => {
        // Removed selectedAgents check since we removed manual selection
        setIsSubmitting(true);
        setActiveStep(1);

        for (let i = 1; i <= 5; i++) {
            setActiveStep(i);
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        const newTask = {
            id: `audit-${Date.now()}`,
            name: challengeInfo ? `Audit - ${challengeInfo.name}` : "Sandbox Audit Run",
            status: "validated",
            score: 94,
            progress: 100,
            createdAt: new Date().toLocaleString(),
            model: "AuditPal Agents",
            agents: 3, // Default agent count
            code: contractCode
        };

        if (typeof window !== 'undefined') {
            const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            localStorage.setItem('tasks', JSON.stringify([newTask, ...existingTasks]));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSubmitting(false);
        // Redirect to new dedicated report page
        router.push(`/benchmark/report/${newTask.id}`);
    };

    const handleFindingClick = async (finding: Finding) => {
        setActiveFinding(finding);
        if (!fileTree || fileTree.length === 0) return;

        // Attempt to find the file in the tree (exact match or partial match)
        const matchedFile = fileTree.find(f => f.path === finding.file || f.path.endsWith(`/${finding.file}`) || f.path === finding.file);

        if (matchedFile) {
            setSelectedFile(matchedFile.path);
            // Re-use logic for fetching content
            if (challengeInfo?.isLocal) {
                if (matchedFile.content) setContractCode(matchedFile.content);
            } else if (challengeInfo?.owner && challengeInfo?.repo) {
                // Optimistic update or loading state could be better, but simple is fine for now
                const content = await fetchGithubFile(
                    challengeInfo.owner,
                    challengeInfo.repo,
                    matchedFile.path,
                    challengeInfo.commit || 'main'
                );
                setContractCode(content);
            }
        } else {
            console.warn("File not found in tree:", finding.file);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-2 border-border rounded-lg overflow-hidden h-auto lg:h-[calc(100vh-140px)] min-h-0 lg:min-h-[600px] bg-card shadow-xl">

            {/* ... Left Sidebar (Files) ... */}
            <div className="lg:col-span-3 h-[300px] lg:h-full flex flex-col border-r-2 border-border bg-muted/20 min-h-0 overflow-hidden border-b-2 lg:border-b-0">
                {/* Header with tabs */}
                <div className="h-14 px-4 flex items-center justify-between border-b-2 border-border bg-background/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Project Files</span>
                    </div>
                    {challengeInfo && (
                        <span className="px-2 py-0.5 rounded-sm bg-kast-teal/10 text-xs font-bold text-kast-teal border border-kast-teal/20">
                            {fileTree.length}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                    {challengeInfo ? (
                        <>
                            <div className="p-3 border-b-2 border-border bg-background/40">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Project</div>
                                    {/* Reset Button */}
                                    <button
                                        onClick={() => {
                                            if (onClose) {
                                                onClose();
                                            } else {
                                                setChallengeInfo(null);
                                                setFileTree([]);
                                                setContractCode('');
                                                setSelectedFile(null);
                                                setReport(null);
                                            }
                                        }}
                                        className="text-[9px] text-red-500 hover:text-red-400 uppercase font-black tracking-widest"
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className="text-xs font-bold text-foreground truncate">{challengeInfo.name}</div>
                                <div className="text-[9px] text-muted-foreground mt-1 font-mono truncate">{challengeInfo.platform.toUpperCase()}</div>
                            </div>

                            {loadingChallenge ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="w-5 h-5 text-kast-teal animate-spin mx-auto mb-3" />
                                    <div className="text-[10px] text-muted-foreground font-mono">Scanning repository...</div>
                                    <div className="text-[9px] text-muted-foreground mt-1">Filtering .sol files</div>
                                </div>
                            ) : (
                                <div className="p-2 space-y-0.5">
                                    {fileTree.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground text-[10px]">
                                            No .sol files found
                                        </div>
                                    ) : (
                                        fileTree.map((file) => (
                                            <button
                                                key={file.path}
                                                onClick={async () => {
                                                    setSelectedFile(file.path);
                                                    if (challengeInfo.isLocal) {
                                                        if (file.content) setContractCode(file.content);
                                                    } else if (challengeInfo.owner && challengeInfo.repo) {
                                                        const content = await fetchGithubFile(
                                                            challengeInfo.owner,
                                                            challengeInfo.repo,
                                                            file.path,
                                                            challengeInfo.commit || 'main'
                                                        );
                                                        setContractCode(content);
                                                    }
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors",
                                                    selectedFile === file.path
                                                        ? "bg-kast-teal/10 text-kast-teal"
                                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                )}
                                            >
                                                <FileCode className="w-3 h-3 flex-shrink-0" />
                                                <span className="text-[10px] font-mono truncate" title={file.path}>
                                                    {file.path.split('/').pop()}
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        // --- Import / Upload UI ---
                        <div className="p-4 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <GitBranch className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Import from GitHub</span>
                                    </div>
                                    <button
                                        onClick={handleLoadExample}
                                        disabled={loadingChallenge}
                                        className="text-[10px] text-kast-teal hover:text-kast-teal/80 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                    >
                                        <Zap className="w-3.5 h-3.5" />
                                        Load Example
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        value={githubImportUrl}
                                        onChange={(e) => setGithubImportUrl(e.target.value)}
                                        placeholder="https://github.com/owner/repo"
                                        className="h-8 text-[11px] bg-background border-input focus:border-kast-teal/50 placeholder:text-muted-foreground text-foreground"
                                    />
                                    <Button
                                        onClick={handleGithubImport}
                                        disabled={loadingChallenge || !githubImportUrl}
                                        className="w-full h-7 text-[10px] bg-muted/50 hover:bg-muted border border-border text-muted-foreground font-medium"
                                    >
                                        {loadingChallenge ? <Loader2 className="w-3 h-3 animate-spin" /> : "Import Repository"}
                                    </Button>
                                    {githubImportError && (
                                        <p className="text-[9px] text-red-500">{githubImportError}</p>
                                    )}
                                </div>
                            </div>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-card px-3 text-muted-foreground font-bold tracking-widest">Or</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Layers className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Upload Folder</span>
                                </div>
                                <Label
                                    htmlFor="folder-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border rounded-lg bg-muted/5 hover:bg-muted/10 hover:border-kast-teal/30 cursor-pointer transition-all duration-300 group"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="p-3 rounded-full bg-muted/20 mb-3 group-hover:scale-110 transition-transform duration-300">
                                            <Plus className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Click to select folder</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1.5">.sol files only</p>
                                    </div>
                                    <input
                                        id="folder-upload"
                                        type="file"
                                        className="hidden"
                                        // @ts-ignore
                                        webkitdirectory=""
                                        directory=""
                                        multiple
                                        onChange={handleFileUpload}
                                    />
                                </Label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Column: Editor (6 cols) */}
            <div className="lg:col-span-6 h-[500px] lg:h-full flex flex-col bg-background border-r-2 border-border relative border-b-2 lg:border-b-0">
                {/* Activity Bar Strip */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center py-4 bg-muted/20 border-r-2 border-border z-10 gap-6">
                    <div className="p-2.5 bg-muted rounded-md shadow-sm">
                        <FileCode className="w-4.5 h-4.5 text-foreground" />
                    </div>
                    <Search className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                    <GitBranch className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                    <div className="flex-1" />
                    <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                </div>

                {/* Header */}
                <div className="h-14 pl-12 flex items-center justify-between border-b-2 border-border bg-background">
                    <div className="flex h-full">
                        <div className="h-full px-6 flex items-center gap-3 bg-background border-t-[2px] border-t-kast-teal min-w-[140px]">
                            <FileCode className="w-4 h-4 text-kast-teal" />
                            <span className="text-xs font-bold text-foreground font-mono truncate max-w-[180px]">
                                {selectedFile ? selectedFile.split('/').pop() : (challengeInfo ? 'Select a file' : 'Start.sol')}
                            </span>
                            <X className="w-3.5 h-3.5 text-muted-foreground ml-3 hover:text-foreground cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 pl-12 relative">
                    {showReport ? (
                        <VulnerabilityFindings onBack={() => {
                            setShowReport(false);
                            setActiveStep(0);
                        }} />
                    ) : (
                        <MonacoEditor
                            height="100%"
                            language="sol"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            value={contractCode}
                            onChange={(val) => setContractCode(val || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: "on",
                                folding: true,
                                fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                renderLineHighlight: "all",
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Right Column: Pipeline & Output (3 cols) */}
            <div className="lg:col-span-3 h-[400px] lg:h-full flex flex-col bg-muted/20 relative overflow-hidden">
                <div className="h-14 px-6 flex items-center border-b-2 border-border bg-background/50 backdrop-blur-md justify-between">
                    <div className="flex items-center gap-3">
                        <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            {report ? "Security Report" : "Diagnostics"}
                        </span>
                    </div>
                </div>

                <div className="flex-1 p-6 relative flex flex-col min-h-0 overflow-hidden">
                    {/* CASE 1: Loading Report */}
                    {loadingReport && !isSubmitting ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4 pb-16">
                            <Loader2 className="w-8 h-8 text-kast-teal animate-spin opacity-50" />
                            <div className="text-[10px] text-muted-foreground font-mono animate-pulse">Fetching security data...</div>
                        </div>
                    ) : report ? (
                        /* CASE 2: Report Found -> Display Findings */
                        <div className="flex-1 flex flex-col overflow-hidden -m-6">
                            {/* Stats Header */}
                            <div className="bg-muted/30 border-b-2 border-border p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">{report.total_findings} Findings</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground font-mono font-bold">
                                    SCAN-{report.project_id.substring(0, 6)}
                                </div>
                            </div>

                            {/* Findings List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0 min-h-0 flex flex-col">
                                {report.findings.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4 animate-pulse">
                                            <Shield className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <h3 className="text-sm font-bold text-foreground mb-2">No Vulnerabilities Detected</h3>
                                        <p className="text-[10px] text-muted-foreground max-w-[200px] leading-relaxed">
                                            The scanning engine did not identify any known security risks in this codebase.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative flex-1 overflow-hidden">
                                        {/* Blurred Content */}
                                        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-0 filter blur-md opacity-30 pointer-events-none select-none">
                                            {report.findings.map((finding) => (
                                                <div
                                                    key={finding.id}
                                                    className="p-4 border-b border-border"
                                                >
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <h4 className="text-[11px] font-bold text-foreground leading-tight">
                                                            {finding.title}
                                                        </h4>
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider border flex-shrink-0",
                                                            finding.severity === 'critical' || finding.severity === 'high'
                                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                        )}>
                                                            {finding.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                                                        {finding.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-muted border border-border">
                                                            <FileCode className="w-2.5 h-2.5 text-muted-foreground" />
                                                            <span className="text-[9px] font-mono text-muted-foreground">******.sol</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Dummy items to ensure scrollable look if list is short */}
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={`dummy-${i}`} className="p-4 border-b border-border">
                                                    <div className="h-4 w-3/4 bg-muted/50 rounded mb-2" />
                                                    <div className="h-2 w-full bg-muted/30 rounded mb-1" />
                                                    <div className="h-2 w-1/2 bg-muted/30 rounded" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Lock Overlay */}
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 pb-10 sm:pb-20 text-center bg-transparent">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-background/80 backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center border border-border mb-3 sm:mb-4 shadow-2xl ring-1 ring-border">
                                                <LockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xs sm:text-sm font-bold text-foreground mb-2 tracking-wide">RESTRICTED ACCESS</h3>
                                            <p className="text-[10px] text-muted-foreground max-w-[200px] sm:max-w-[240px] leading-relaxed">
                                                Vulnerability details are classified. Only authorized miners with consensus proof can decrypt this report.
                                            </p>
                                            <div className="mt-4 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                Miner Consensus Pending
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* CASE 3: No Report -> Standard "Run Audit" UI */
                        !isSubmitting ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pb-16">
                                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center border border-border mb-2 shadow-2xl">
                                    <Zap className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-2 max-w-[200px]">
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Ready to Audit</h3>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Verify integrity and logic.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    className="h-8 text-[10px] bg-kast-teal text-black hover:bg-emerald-400 font-bold uppercase tracking-widest px-8 mt-2 shadow-lg shadow-emerald-900/20"
                                >
                                    <Play className="w-3 h-3 mr-2" /> Run Audit
                                </Button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                                {/* Pipeline Visualizer */}
                                <div className="relative pt-2">
                                    {/* Connecting Line Background */}
                                    <div className="absolute left-[19px] top-4 bottom-8 w-[1px] bg-muted-foreground/30" />

                                    {steps.map((step, index) => {
                                        const isActive = activeStep === step.id;
                                        const isDone = activeStep > step.id;

                                        return (
                                            <div key={step.id} className="relative pl-12 pb-6 last:pb-0 group">
                                                {/* Dot Node */}
                                                <div className={cn(
                                                    "absolute left-3 top-0.5 w-4 h-4 rounded-full border-[2px] z-10 box-content transition-all duration-500 flex items-center justify-center bg-background",
                                                    isDone
                                                        ? "border-kast-teal shadow-[0_0_12px_rgba(45,212,191,0.4)]"
                                                        : isActive
                                                            ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110"
                                                            : "border-muted-foreground/50 group-hover:border-muted-foreground"
                                                )}>
                                                    {isDone && <div className="w-1.5 h-1.5 rounded-full bg-kast-teal shadow-[0_0_5px_rgba(45,212,191,0.8)]" />}
                                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                </div>

                                                {/* Card Content */}
                                                <div className={cn(
                                                    "relative p-3 rounded-lg border transition-all duration-500 backdrop-blur-sm",
                                                    isDone
                                                        ? "bg-kast-teal/[0.03] border-kast-teal/20"
                                                        : isActive
                                                            ? "bg-amber-500/[0.05] border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.1)]"
                                                            : "bg-muted/10 border-border opacity-50 grayscale"
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn(
                                                            "text-[10px] font-bold uppercase tracking-widest transition-colors",
                                                            isDone ? "text-kast-teal" : isActive ? "text-amber-500" : "text-muted-foreground"
                                                        )}>
                                                            {step.label}
                                                        </span>
                                                        {isDone && <Check className="w-3 h-3 text-kast-teal" />}
                                                        {isActive && <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />}
                                                    </div>

                                                    {/* Simulated Console Log for Active Step */}
                                                    {isActive && (
                                                        <div className="mt-2 pl-2 border-l border-amber-500/20">
                                                            <div className="text-[9px] font-mono text-amber-500/70 truncate animate-pulse">
                                                                {["Scanning AST...", "Verifying logic...", "Checking overflow...", "Analyzing content..."][index % 4]}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    )}
                </div>

            </div>

            {/* Finding Detail Modal */}
            {activeFinding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4">
                    <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-border flex items-start justify-between bg-muted/10">
                            <div className="space-y-1 pr-4">
                                <h3 className="text-sm font-bold text-foreground leading-tight">
                                    {activeFinding.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-wider border",
                                        activeFinding.severity === 'critical' || activeFinding.severity === 'high'
                                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                                            : activeFinding.severity === 'medium'
                                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {activeFinding.severity}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {activeFinding.file}:{activeFinding.location}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveFinding(null)}
                                className="p-1 hover:bg-muted rounded-sm transition-colors"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Description</h4>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                                {activeFinding.description}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 border-t border-border bg-muted/20 flex justify-end">
                            <Button
                                onClick={() => setActiveFinding(null)}
                                className="h-7 text-[10px] bg-muted hover:bg-muted/80 text-foreground border border-border"
                            >
                                Close Details
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
