"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataModuleProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export function DataModule({
    title,
    children,
    className,
    contentClassName,
    icon,
    action
}: DataModuleProps) {
    return (
        <div className={cn(
            "relative group bg-card/40 backdrop-blur-md border border-border rounded-lg overflow-hidden flex flex-col shadow-lg transition-all hover:border-kast-teal/30",
            className
        )}>


            {/* Header */}
            {(title || icon || action) && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-muted-foreground group-hover:text-kast-teal transition-colors">{icon}</span>}
                        {title && (
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono group-hover:text-foreground transition-colors">
                                {title}
                            </span>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            {/* Content */}
            <div className={cn("p-4 relative flex-1 min-h-0", contentClassName)}>
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay dark:mix-blend-screen" />
                <div className="relative z-10 h-full flex flex-col">
                    {children}
                </div>
            </div>

            {/* Hover Effect - Scanline */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kast-teal/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
            </div>
        </div>
    );
}
