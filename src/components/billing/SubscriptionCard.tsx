"use client";

import { Check, Zap, Crown, Building2, ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StatusBadge = ({ status }: { status: string }) => (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-kast-teal/10 border border-kast-teal/20">
        <div className="w-1.5 h-1.5 rounded-full bg-kast-teal animate-pulse" />
        <span className="text-[10px] font-bold text-kast-teal uppercase tracking-wider">{status}</span>
    </div>
);

interface SubscriptionCardProps {
    currentPlan?: "starter" | "pro" | "enterprise";
    auditsUsed?: number;
    auditsLimit?: number;
    nextBillingDate?: string;
    onUpgrade?: () => void;
    onManage?: () => void;
    onCancel?: () => void;
}

const planDetails = {
    starter: {
        name: "Starter",
        price: "$0",
        period: "/month",
        description: "Perfect for individual developers and small projects.",
        icon: Zap,
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        borderColor: "border-border",
        features: ["5 Audits/month", "Basic Scanning", "Community Support"],
    },
    pro: {
        name: "Pro",
        price: "$49",
        period: "/month",
        description: "For professional teams scaling their security.",
        icon: Crown,
        color: "text-kast-teal",
        bgColor: "bg-kast-teal/10",
        borderColor: "border-kast-teal/50 shadow-lg shadow-kast-teal/10",
        features: ["Unlimited Audits", "AI Logic Analysis", "Priority Support", "API Access"],
    },
    enterprise: {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for large organizations.",
        icon: Building2,
        color: "text-purple-600",
        bgColor: "bg-purple-600/10",
        borderColor: "border-purple-600/20",
        features: ["Dedicated Engineer", "Custom SLAs", "On-Premise", "Audit Insurance"],
    },
};

export function SubscriptionCard({
    currentPlan = "pro",
    auditsUsed = 12,
    auditsLimit = 0, // 0 means unlimited
    nextBillingDate = "March 1, 2026",
    onUpgrade,
    onManage,
    onCancel,
}: SubscriptionCardProps) {
    const plan = planDetails[currentPlan];
    const PlanIcon = plan.icon;
    const hasLimit = auditsLimit > 0;
    const usagePercent = hasLimit ? (auditsUsed / auditsLimit) * 100 : 0;
    const isPro = currentPlan === "pro";

    return (
        <Card className={`relative overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${plan.borderColor} border w-full max-w-sm mx-auto shadow-sm`}>
            {isPro && (
                <div className="absolute top-0 right-0 bg-kast-teal text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg z-10 tracking-wide">
                    ACTIVE
                </div>
            )}

            <CardHeader className="pb-6 pt-6 px-6 border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <PlanIcon className={`w-5 h-5 ${plan.color}`} />
                        <h3 className="text-lg font-bold text-foreground">{plan.name} Plan</h3>
                    </div>
                    {isPro && <StatusBadge status="ACTIVE" />}
                </div>

                <CardTitle className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-4xl font-black text-foreground tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{plan.period}</span>}
                </CardTitle>

                <CardDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {plan.description}
                </CardDescription>

                <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground bg-background/50 border border-border/50 px-3 py-1.5 rounded-md w-fit">
                    <span className="font-bold uppercase tracking-widest opacity-60">Next renewal:</span>
                    <span className="font-mono text-foreground font-bold">{currentPlan === "starter" ? "—" : nextBillingDate}</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 px-6 pt-6">
                {/* Benefits List */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Included Features</h4>
                    <div className="grid grid-cols-1 gap-3.5">
                        {plan.features.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="p-0.5 rounded-full bg-emerald-500/10">
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>

            <div className="p-6 pt-0 mt-auto space-y-3">
                <div className="flex gap-3">
                    {currentPlan !== "enterprise" && (
                        <Button
                            onClick={onUpgrade}
                            className={`flex-1 h-9 text-xs font-semibold tracking-wide uppercase ${isPro ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-kast-teal text-white hover:bg-kast-teal/90'}`}
                            variant={isPro ? "outline" : "default"}
                        >
                            {currentPlan === "starter" ? "Upgrade" : "Upgrade"}
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={onManage}
                        className="flex-1 h-9 text-xs font-semibold tracking-wide uppercase border-input hover:bg-accent hover:text-accent-foreground"
                    >
                        Manage
                    </Button>
                </div>

                {currentPlan !== "starter" && (
                    <button
                        onClick={onCancel}
                        className="w-full text-center text-[10px] text-muted-foreground hover:text-destructive transition-colors py-1"
                    >
                        Cancel subscription
                    </button>
                )}
            </div>
        </Card>
    );
}
