
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('q')?.trim();

    if (!query) {
        return NextResponse.json(
            { error: 'Search query is required' },
            { status: 400 }
        );
    }

    try {

        const params = new URLSearchParams({
            title: query,
            limit: '10',
        });

        params.append('contentRating[]', 'safe');

        const mangaResponse = await fetch(
            `https://api.mangadex.org/manga?${params.toString()}`,
            { cache: 'no-store' }
        );

        if (!mangaResponse.ok) {
            throw new Error('Failed to fetch manga');
        }

        const mangaData = await mangaResponse.json();


        const mangaIds = mangaData.data.map(
            (manga: { id: string }) => manga.id
        );


        const coverParams = new URLSearchParams();

        mangaIds.forEach((id: string) => {
            coverParams.append('manga[]', id);
        });

        coverParams.set('limit', '100');

        const coverResponse = await fetch(
            `https://api.mangadex.org/cover?${coverParams.toString()}`,
            { cache: 'no-store' }
        );

        if (!coverResponse.ok) {
            throw new Error('Failed to fetch manga covers');
        }

        const coverData = await coverResponse.json();

        const coverMap = new Map<string, string>();

        for (const cover of coverData.data) {
            const mangaId = cover.relationships.find(
                (rel: { type: string }) => rel.type === 'manga'
            )?.id;

            if (mangaId && cover.attributes.fileName) {
                coverMap.set(mangaId, cover.attributes.fileName);
            }
        }
        console.log('Cover API response:', coverData.data);
console.log('Cover map:', Array.from(coverMap.entries()));

        const results = mangaData.data.map((manga: { id: string }) => ({
            ...manga,
            coverFileName: coverMap.get(manga.id) || null,
        }));

        return NextResponse.json({
            ...mangaData,
            data: results,
        });

    } catch (error) {
        console.error('Manga search error:', error);

        return NextResponse.json(
            { error: 'Failed to search MangaDex' },
            { status: 500 }
        );
        
    }
    
}

