"use client";

import { SettingsForm } from "@/components/settings/SettingsForm";
import { LoginGate } from "@/components/auth/LoginGate";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
    return (
        <LoginGate title="Account Settings" description="Sign in to manage your account settings and preferences.">
            <div className="container mx-auto max-w-7xl py-10 px-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
                        <p className="text-muted-foreground">
                            Manage your account settings and set e-mail preferences.
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                <div className="rounded-xl border border-border bg-card p-6 md:p-10">
                    <SettingsForm />
                </div>
            </div>
        </LoginGate>
    );
}


