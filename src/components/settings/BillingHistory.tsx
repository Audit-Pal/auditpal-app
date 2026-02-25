"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const invoices = [
    {
        invoice: "S-5524",
        date: "Feb 01, 2026",
        amount: "$0.00",
        status: "Paid",
        plan: "Starter Plan",
    },
    {
        invoice: "S-5412",
        date: "Jan 01, 2026",
        amount: "$0.00",
        status: "Paid",
        plan: "Starter Plan",
    },
    {
        invoice: "S-5309",
        date: "Dec 01, 2025",
        amount: "$0.00",
        status: "Paid",
        plan: "Starter Plan",
    },
];

export function BillingHistory() {
    return (
        <Card className="border-border mt-8">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-foreground">Billing History</CardTitle>
                        <CardDescription>View your past invoices and payment status.</CardDescription>
                    </div>
                    <Button variant="outline" className="gap-2 border-border hover:bg-muted">
                        <Download className="w-4 h-4" /> Export All
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Invoice</TableHead>
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-muted-foreground">Plan</TableHead>
                            <TableHead className="text-muted-foreground">Amount</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice} className="border-border hover:bg-muted/30">
                                <TableCell className="font-mono text-foreground">{invoice.invoice}</TableCell>
                                <TableCell className="text-foreground">{invoice.date}</TableCell>
                                <TableCell className="text-foreground">{invoice.plan}</TableCell>
                                <TableCell className="text-foreground">{invoice.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
