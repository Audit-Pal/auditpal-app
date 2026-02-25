"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Back buttons */}
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-5 w-32 bg-muted rounded animate-pulse" />
                    <Skeleton className="h-5 w-32 bg-muted rounded animate-pulse" />
                </div>

                {/* Task Header Wrapper */}
                <div className="bg-card border border-border rounded-xl p-8 mb-8 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-10 w-96 mb-3 bg-muted rounded-lg animate-pulse" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-40 bg-muted rounded animate-pulse" />
                                <Skeleton className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <Skeleton className="h-4 w-36 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-12 w-24 mb-2 ml-auto bg-muted rounded animate-pulse" />
                            <Skeleton className="h-8 w-28 ml-auto bg-muted rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <Skeleton className="h-9 w-52 bg-muted rounded-lg animate-pulse" />
                        <Skeleton className="h-9 w-36 bg-muted rounded-lg animate-pulse" />
                        <Skeleton className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-muted border border-border p-4 rounded-lg">
                                <Skeleton className="h-4 w-28 mb-2 bg-background/50 animate-pulse" />
                                <Skeleton className="h-8 w-20 mb-1 bg-background/50 animate-pulse" />
                                <Skeleton className="h-3 w-32 bg-background/50 animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Annual Projection Mock */}
                    <div className="mt-8 pt-8 border-t border-border">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-muted rounded-2xl animate-pulse" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
                                    <Skeleton className="h-4 w-32 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="space-y-8">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <Skeleton className="h-6 w-48 mb-6 bg-muted rounded animate-pulse" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-12 w-full bg-muted rounded animate-pulse" />
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <Skeleton className="h-6 w-48 mb-6 bg-muted rounded animate-pulse" />
                        <div className="h-48 w-full bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
