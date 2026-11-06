
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
        // coleta os detalhes do manga
        const mangaUrl = new URL(
            `https://api.mangadex.org/manga/${id}`
        );

        mangaUrl.searchParams.append('includes[]', 'author');
        mangaUrl.searchParams.append('includes[]', 'artist');
        mangaUrl.searchParams.append('includes[]', 'cover_art');

        // Coleta a capinha
        const coverUrl = new URL(
            'https://api.mangadex.org/cover'
        );

        coverUrl.searchParams.set('manga[]', id);
        coverUrl.searchParams.set('limit', '10');

        const [mangaResponse, coverResponse] = await Promise.all([
            fetch(mangaUrl, { cache: 'no-store' }),
            fetch(coverUrl, { cache: 'no-store' })
        ]);

        if (!mangaResponse.ok) {
            return NextResponse.json(
                { error: 'Manga not found' },
                { status: mangaResponse.status }
            );
        }

        // Converte pra json
        const mangaData = await mangaResponse.json();
        const coverData = coverResponse.ok
            ? await coverResponse.json()
            : { data: [] };

        const manga = mangaData.data;

        if (!manga) {
            return NextResponse.json(
                { error: 'Manga not found' },
                { status: 404 }
            );
        }

        // Extrai o nome da capinha
        const coverFileName =
            coverData.data?.[0]?.attributes?.fileName ?? null;

        // Extrai autores e artistas
        const relationships = manga.relationships ?? [];

        const authors = relationships
            .filter((rel: any) => rel.type === 'author')
            .map((rel: any) => rel.attributes?.name)
            .filter(Boolean);

        const artists = relationships
            .filter((rel: any) => rel.type === 'artist')
            .map((rel: any) => rel.attributes?.name)
            .filter(Boolean);

        // Retorna os dados do manga, capinha, autores e artistas
        return NextResponse.json({
            manga,
            coverFileName,
            authors,
            artists
        });

    } catch (error) {
        console.error('Manga API error:', error);

        return NextResponse.json(
            { error: 'Failed to retrieve manga data' },
            { status: 500 }
        );
    }
}
