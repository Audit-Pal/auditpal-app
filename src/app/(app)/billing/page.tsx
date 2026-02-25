"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionCard } from "@/components/billing/SubscriptionCard";
import { PaymentMethod } from "@/components/billing/PaymentMethod";
import { BillingHistory } from "@/components/settings/BillingHistory";
import { CreditCard, Receipt, Crown } from "lucide-react";
import { toast } from "sonner";
import { LoginGate } from "@/components/auth/LoginGate";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function BillingPage() {
    const [currentPlan] = useState<"starter" | "pro" | "enterprise">("pro");

    const handleUpgrade = () => {
        toast.info("Stripe checkout will open here", {
            description: "This would redirect to Stripe Checkout for the selected plan.",
        });
    };

    const handleManageSubscription = () => {
        toast.info("Stripe customer portal will open here", {
            description: "This would redirect to Stripe Customer Portal to manage subscription.",
        });
    };

    const handleCancelSubscription = () => {
        toast.warning("Cancel subscription", {
            description: "A confirmation dialog would appear before canceling.",
        });
    };

    const handleAddPaymentMethod = () => {
        toast.info("Add payment method", {
            description: "This would open Stripe Elements to add a new card.",
        });
    };

    const handleRemovePaymentMethod = (id: string) => {
        toast.error(`Remove payment method ${id}`, {
            description: "A confirmation dialog would appear before removing.",
        });
    };

    const handleSetDefaultPaymentMethod = (id: string) => {
        toast.success(`Set ${id} as default`, {
            description: "Payment method has been set as default.",
        });
    };

    return (
        <LoginGate title="Billing & Subscription" description="Sign in to manage your subscription and payment methods.">
            <div className="min-h-screen bg-background text-foreground font-mono text-sm selection:bg-primary selection:text-primary-foreground">
                {/* Header - Aligned with Sidebar (h-16) */}
                <div className="h-16 flex items-center justify-between px-8 border-b border-border bg-background backdrop-blur-md sticky top-0 z-50">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Billing & Subscription</h2>
                    <ThemeToggle />
                </div>

                <div className="max-w-5xl mx-auto p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-medium tracking-tight text-foreground mb-1">Manage Plan</h1>
                        <p className="text-muted-foreground text-xs">
                            View your subscription details, payment methods, and invoices.
                        </p>
                    </div>

                    <Tabs defaultValue="subscription" className="w-full">
                        <div className="flex justify-center mb-10">
                            <TabsList className="bg-muted/30 border border-border p-1.5 h-auto rounded-xl">
                                <TabsTrigger
                                    value="subscription"
                                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all"
                                >
                                    <Crown className="w-4 h-4" />
                                    Subscription
                                </TabsTrigger>
                                <TabsTrigger
                                    value="payment"
                                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Payment
                                </TabsTrigger>
                                <TabsTrigger
                                    value="invoices"
                                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2.5 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all"
                                >
                                    <Receipt className="w-4 h-4" />
                                    Invoices
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-8 max-w-4xl mx-auto">
                            <TabsContent value="subscription" className="mt-0 focus-visible:outline-none">
                                <SubscriptionCard
                                    currentPlan={currentPlan}
                                    auditsUsed={12}
                                    auditsLimit={currentPlan === "starter" ? 5 : 0}
                                    nextBillingDate="March 1, 2026"
                                    onUpgrade={handleUpgrade}
                                    onManage={handleManageSubscription}
                                    onCancel={handleCancelSubscription}
                                />
                            </TabsContent>

                            <TabsContent value="payment" className="mt-0 focus-visible:outline-none">
                                <PaymentMethod
                                    onAddPaymentMethod={handleAddPaymentMethod}
                                    onRemovePaymentMethod={handleRemovePaymentMethod}
                                    onSetDefault={handleSetDefaultPaymentMethod}
                                />
                            </TabsContent>

                            <TabsContent value="invoices" className="mt-0 focus-visible:outline-none">
                                <BillingHistory />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </LoginGate>
    );
}

