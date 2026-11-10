
import { NextRequest, NextResponse } from 'next/server';
import { weebcentral } from '@/lib/weebcentral';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('q')?.trim();

    if (!query) {
        return NextResponse.json(
            { error: 'Missing search query' },
            { status: 400 }
        );
    }

    try {
        const results = await weebcentral.search(query);

        return NextResponse.json(results);
    } catch (error) {
        console.error('WeebCentral search error:', error);

        return NextResponse.json(
            { error: 'Failed to search WeebCentral' },
            { status: 500 }
        );
    }
}
