import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id || !/^[a-f0-9-]{36}$/i.test(id)) {
        return NextResponse.json(
            { error: 'Invalid manga ID' },
            { status: 400 }
        );
    }

    try {
        const params = new URLSearchParams();
        params.append('manga[]', id);
        params.set('limit', '100');

        const mangaResponse = await fetch(
            `https://api.mangadex.org/cover?${params.toString()}`,
            { cache: 'no-store' }
        );

        if (!mangaResponse.ok) {
            return NextResponse.json(
                { error: "Manga not found"},
                { status: mangaResponse.status }
            );
        }

        const mangaData = await mangaResponse.json();
        const manga = mangaData.data;

        // Coletar as capinhas dos mangas

        const coverResponse = await fetch(
            `https://api.mangadex.org/cover?manga[]=${id}&limit=10`,
            { cache: 'no-store' }
        );

        let coverFileName = null;

        if (coverResponse.ok) {
            const coverData = await coverResponse.json();

            coverFileName = coverData.data[0]?.attributes?.fileName ?? null;
        }

        // Extrair o nome dos autores

        const author = manga.relantionships
        .filter((rel: { type: string}) => rel.type === 'author')
        .map((rel: { attributes: { name: string }}) => rel.attributes.name)
        .filter(Boolean)

        const artists = manga.relationships
        .filter((rel: { type: string}) => rel.type === 'artist')
        .map((rel: { attributes: { name: string }}) => rel.attributes.name)
        .filter(Boolean);

        return NextResponse.json({
            manga,
            coverFileName,
            author,
            artists,
        });
    } catch (error) {
        console.error('Manga API error:', error);

        return NextResponse.json(
            { error: 'Failed to retrieve manga data' },
            { status: 500 }
        );
            
    }
}