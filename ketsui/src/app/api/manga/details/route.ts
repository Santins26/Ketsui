
import { NextRequest, NextResponse } from 'next/server';
import { weebcentral } from '@/lib/weebcentral';

export async function GET(request: NextRequest) {
    const mangaId = request.nextUrl.searchParams.get('mangaId');

    if (!mangaId) {
        return NextResponse.json(
            { error: 'Missing manga ID' },
            { status: 400 }
        );
    }

    try {
        console.log("Requested manga ID:", mangaId);

const manga = await weebcentral.fetchMangaInfo(mangaId);

console.log("Returned manga ID:", manga.id);
console.log("Returned chapters:", manga.chapters?.length);

return NextResponse.json(manga);
    } catch (error) {
        console.error('WeebCentral manga details error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch manga details' },
            { status: 500 }
        );
    }
}
