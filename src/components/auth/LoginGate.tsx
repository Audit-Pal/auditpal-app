"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Lock } from "lucide-react";

interface LoginGateProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function LoginGate({
    children,
    title = "Sign in to continue",
    description = "You need to be logged in to view this page."
}: LoginGateProps) {
    const { status } = useSession();
    const { connected } = useWallet();

    const hasWalletAuth = typeof window !== "undefined" && sessionStorage.getItem("walletAuth");
    const isAuthenticated = status === "authenticated" || connected || hasWalletAuth;

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-start pt-32 md:pt-40 p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full max-w-[400px] space-y-6 text-center bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl shadow-xl">
                <div className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
                    <p className="text-sm text-muted-foreground leading-relaxed text-balance">{description}</p>
                </div>

                <div className="space-y-4 pt-2">
                    {/* Wallet Button Container - forcing clean styles */}
                    <div className="wallet-adapter-button-trigger-clean">
                        <WalletMultiButton className="!w-full !justify-center !bg-primary !text-primary-foreground !font-medium !text-sm !h-10 !rounded-md hover:!opacity-90 transition-opacity" />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
                        </div>
                    </div>

                    <Link href="/login" className="block">
                        <button className="flex h-10 w-full items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Email
                        </button>
                    </Link>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    New to AuditPal?{" "}
                    <Link href="/login" className="underline underline-offset-4 hover:text-foreground transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
