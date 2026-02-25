"use client";

import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodProps {
    paymentMethods?: {
        id: string;
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
        isDefault: boolean;
    }[];
    onAddPaymentMethod?: () => void;
    onRemovePaymentMethod?: (id: string) => void;
    onSetDefault?: (id: string) => void;
}

const cardBrandColors: Record<string, string> = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-red-500 to-orange-500",
    amex: "from-blue-400 to-blue-600",
    discover: "from-orange-400 to-orange-600",
    default: "from-zinc-600 to-zinc-800",
};

export function PaymentMethod({
    paymentMethods = [
        {
            id: "pm_1",
            brand: "visa",
            last4: "4242",
            expMonth: 12,
            expYear: 2027,
            isDefault: true,
        },
    ],
    onAddPaymentMethod,
    onRemovePaymentMethod,
    onSetDefault,
}: PaymentMethodProps) {
    return (
        <Card className="relative overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg border-border w-full max-w-md mx-auto shadow-sm">
            <CardHeader className="pb-3 pt-5 px-6 flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">Payment Methods</CardTitle>
                </div>
                <Button
                    onClick={onAddPaymentMethod}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-medium border-dashed border-muted-foreground/30 hover:bg-muted hover:border-muted-foreground/50"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Card
                </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
                <CardDescription className="text-xs text-muted-foreground -mt-2 mb-4">
                    Manage your payment methods for subscription billing.
                </CardDescription>

                {paymentMethods.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
                        <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No payment methods added yet</p>
                        <Button
                            onClick={onAddPaymentMethod}
                            variant="link"
                            className="text-kast-teal text-xs h-auto p-0 mt-1 font-medium"
                        >
                            Add your first payment method
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="p-4 rounded-lg bg-card border border-border flex items-center justify-between group hover:border-kast-teal/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-background border border-border rounded flex items-center justify-center p-1">
                                        <span className="font-bold text-[10px] text-muted-foreground uppercase">{method.brand}</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-foreground flex items-center gap-2">
                                            •••• {method.last4}
                                            {method.isDefault && (
                                                <span className="px-1.5 py-0.5 rounded bg-kast-teal/10 text-kast-teal text-[8px] font-black uppercase tracking-wider">Default</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Expires {method.expMonth.toString().padStart(2, "0")}/{method.expYear}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    {!method.isDefault && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onSetDefault?.(method.id)}
                                            className="h-8 w-8 text-muted-foreground hover:text-kast-teal hover:bg-kast-teal/10 rounded-full"
                                            title="Set as Default"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemovePaymentMethod?.(method.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full"
                                        title="Remove Card"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <div className="w-3 h-3 text-muted-foreground shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                        Your payment information is securely stored with Stripe.
                    </p>
                </div>
            </CardContent>
        </Card >
    );
}
