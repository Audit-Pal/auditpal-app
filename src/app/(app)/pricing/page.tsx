"use client";

import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const pricingTiers = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for individual developers and small projects.",
        features: [
            "5 Smart Contract Audits / mo",
            "Basic Vulnerability Scanning",
            "Community Support",
            "Standard Report Export",
        ],
        buttonText: "Current Plan",
        buttonVariant: "outline" as const,
        popular: false,
        action: "current",
    },
    {
        name: "Pro",
        price: "$49",
        period: "/month",
        description: "For professional teams scaling their security.",
        features: [
            "Unlimited Audits",
            "Advanced AI Logic Analysis",
            "Priority Support (24/7)",
            "Detailed PDF Reports",
            "API Access",
        ],
        buttonText: "Upgrade to Pro",
        buttonVariant: "default" as const,
        popular: true,
        action: "upgrade",
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Tailored solutions for large organizations.",
        features: [
            "Dedicated Security Engineer",
            "Custom SLAs",
            "On-Premise Deployment",
            "Audit Insurance",
            "White-glove Onboarding",
        ],
        buttonText: "Contact Sales",
        buttonVariant: "outline" as const,
        popular: false,
        action: "contact",
    },
];

export default function PricingPage() {
    const router = useRouter();

    const handleAction = (action: string, planName: string) => {
        switch (action) {
            case "current":
                toast.info("You're already on this plan", {
                    description: "Visit the Billing page to manage your subscription.",
                });
                break;
            case "upgrade":
                toast.info("Redirecting to checkout...", {
                    description: `Upgrading to ${planName} plan. Stripe checkout will open.`,
                });
                // In a real app, this would trigger Stripe checkout
                router.push("/billing");
                break;
            case "contact":
                toast.info("Contact Sales", {
                    description: "Our team will reach out to you shortly.",
                });
                // Could open a contact modal or mailto link
                window.open("mailto:sales@auditpal.io?subject=Enterprise Inquiry", "_blank");
                break;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 max-w-5xl mx-auto gap-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Pricing & Billing</h1>
                <p className="text-muted-foreground">Manage your subscription plan.</p>
            </div>

            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {pricingTiers.map((tier) => (
                    <Card
                        key={tier.name}
                        className={cn(
                            "relative overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                            tier.popular ? 'border-kast-teal/50 shadow-lg shadow-kast-teal/10' : 'border-border'
                        )}
                    >
                        {tier.popular && (
                            <div className="absolute top-0 right-0 bg-kast-teal text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                                {tier.period && <span className="text-sm text-muted-foreground font-normal">{tier.period}</span>}
                            </CardTitle>
                            <h3 className="text-lg font-medium mt-2 text-foreground">{tier.name}</h3>
                            <CardDescription className="text-muted-foreground">{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 text-kast-teal shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={cn(
                                    "w-full",
                                    tier.popular
                                        ? 'bg-kast-teal text-white hover:bg-kast-teal/90'
                                        : 'bg-muted hover:bg-muted/80 text-foreground'
                                )}
                                variant={tier.buttonVariant}
                                onClick={() => handleAction(tier.action, tier.name)}
                            >
                                {tier.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

