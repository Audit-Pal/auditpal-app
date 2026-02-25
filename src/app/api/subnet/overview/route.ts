import { NextResponse } from 'next/server';
import { TaoStatsService } from '@/lib/backend/taostats';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const overview = await TaoStatsService.getOverview();
        return NextResponse.json(overview);
    } catch (error) {
        console.error("Overview Route Error:", error);
        return NextResponse.json({ error: "Failed to fetch overview" }, { status: 500 });
    }
}
