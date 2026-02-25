"use client";

import { OptimizationSubmissions } from "@/components/OptimizationSubmissions";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuditsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-end">
                <ThemeToggle />
            </div>
            <OptimizationSubmissions />
        </div>
    );
}
