"use client";
import React from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Terminal, Shield, FileCode, Settings, LogOut, ChevronRight, Loader2, CreditCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const { connected, disconnect, publicKey } = useWallet();
    const { theme } = useTheme();

    // Check for wallet auth in sessionStorage
    const hasWalletAuth = typeof window !== "undefined" && sessionStorage.getItem("walletAuth");
    // Removed isDev check so login gate works in development too
    const isAuthenticated = status === "authenticated" || connected || hasWalletAuth;
    const isLoading = status === "loading";

    const handleSignOut = async () => {
        // Clear wallet auth
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("walletAuth");
        }
        // Disconnect wallet
        if (connected) {
            await disconnect();
        }
        // Sign out from NextAuth
        await signOut({ redirect: false });
        router.push("/login");
    };

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "New Audit", icon: Terminal, href: "/benchmark/solidity-suite" },
        { name: "My Audits", icon: FileCode, href: "/benchmark/solidity-suite?view=history" },
        { name: "Pricing", icon: CreditCard, href: "/pricing" },
        { name: "Billing", icon: Receipt, href: "/billing" },
        { name: "Settings", icon: Settings, href: "/settings" },
    ];

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-kast-teal animate-spin" />
            </div>
        );
    }

    // Get display name
    const displayName = session?.user?.name ||
        (publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : "User");
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col fixed inset-y-0 z-50">

                <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                            <img
                                src="/audis.jpg"
                                alt="AuditPal Logo"
                                className="h-full w-full object-contain opacity-90 hover:opacity-100 transition-opacity dark:invert"
                            />
                        </div>
                        <span className="font-sans font-extrabold text-xl tracking-wide group-hover:text-kast-teal transition-colors text-foreground">AuditPal</span>
                    </Link>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1">
                    <div className="px-3 mb-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Platform</div>
                    </div>
                    {menu.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 h-10 font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all mb-1",
                                        isActive && "bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-primary"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                    {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                                </Button>
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-sidebar-border">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border mb-4">
                        <Link href="/settings" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white hover:opacity-80 transition-opacity">
                            {displayName.charAt(0).toUpperCase()}
                        </Link>
                        <div className="overflow-hidden">
                            <Link href="/settings" className="text-sm font-medium truncate text-sidebar-foreground hover:text-kast-teal transition-colors">{displayName}</Link>
                            <div className="text-xs text-sidebar-foreground/60 truncate">
                                {connected ? "Wallet Connected" : "Pro Plan"}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="flex-1 justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen bg-background">
                {children}
            </main>
        </div>
    );
}
