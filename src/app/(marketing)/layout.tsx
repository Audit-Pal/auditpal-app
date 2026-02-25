import { Header } from "@/components/marketing/Header";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Header />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <footer className="border-t border-border py-12 bg-background z-10 relative">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground">τ</div>
                        <span>Optimized by Bittensor Subnet </span>
                    </div>
                    <div>
                        © {new Date().getFullYear()} AuditPal.
                    </div>
                </div>
            </footer>
        </div>
    )
}
