"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Mail, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { connected, publicKey } = useWallet();
    const [email, setEmail] = useState("demo@auditpal.io");
    const [password, setPassword] = useState("demo123");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if wallet is connected
    if (connected && publicKey) {
        // Store wallet auth in sessionStorage for demo
        if (typeof window !== "undefined") {
            sessionStorage.setItem("walletAuth", publicKey.toString());
        }
        router.push("/dashboard");
    }

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials. Try password: demo123");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-kast-teal rounded-lg flex items-center justify-center font-bold text-black font-mono text-lg group-hover:bg-primary/90 transition-colors">
                            AP
                        </div>
                        <span className="font-mono font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                            AuditPal
                        </span>
                    </Link>
                    <p className="text-muted-foreground mt-4 text-sm">
                        Sign in to access your security dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    {/* Wallet Login */}
                    <div className="mb-6">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                            <Wallet className="w-3 h-3" />
                            Connect Wallet
                        </div>
                        <WalletMultiButton className="!w-full !h-12 !rounded-lg !bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-500 hover:!to-indigo-500 !font-medium !text-sm" />
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-4 text-muted-foreground">or continue with email</span>
                        </div>
                    </div>

                    {/* Credentials Login */}
                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                Email
                            </div>
                            <Input
                                type="email"
                                placeholder="demo@auditpal.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-background border-input focus:border-kast-teal"
                                required
                            />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                Password
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 bg-background border-input focus:border-kast-teal"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-destructive text-sm">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-kast-teal text-black hover:bg-kast-teal/90 font-bold"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Demo hint */}
                    <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Shield className="w-3 h-3 text-kast-teal" />
                            <span>Demo: Use any email with password <code className="text-kast-teal">demo123</code></span>
                        </div>
                    </div>
                </div>

                {/* Back to home */}
                <p className="text-center mt-6 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        ← Back to home
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
