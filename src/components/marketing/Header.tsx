"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignUpModal, SignUpSuccessModal } from "@/components/SignUpModal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Header() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { theme } = useTheme();

    const handleSignUp = (displayName: string, method: string) => {
        console.log("Signed up:", displayName, method);
        setShowSignUp(false);
        setShowSuccess(true);
        // In a real app, this would trigger auth logic
    };
    return (
        <>
            <header className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                            <img
                                src="/audis.jpg"
                                alt="AuditPal Logo"
                                className={cn(
                                    "h-full w-full object-contain opacity-90 hover:opacity-100 transition-opacity",
                                    theme === "dark" && "filter invert"
                                )}
                            />
                        </div>
                        <span className="font-sans font-extrabold text-xl tracking-wide group-hover:text-kast-teal transition-colors text-foreground">AuditPal</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button
                            onClick={() => setShowSignUp(true)}
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground font-mono text-xs uppercase font-bold tracking-wider hover:bg-accent"
                        >
                            Log In
                        </Button>
                    </div>
                </div>
            </header>

            <SignUpModal
                isOpen={showSignUp}
                onClose={() => setShowSignUp(false)}
                onSignUp={handleSignUp}
            />

            <SignUpSuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
            />
        </>
    );
}
