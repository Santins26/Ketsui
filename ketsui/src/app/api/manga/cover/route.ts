
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const mangaId = request.nextUrl.searchParams.get('mangaId');
    const fileName = request.nextUrl.searchParams.get('fileName');

    if (
        !mangaId ||
        !fileName ||
        !/^[a-f0-9-]{36}$/i.test(mangaId) ||
        !/^[a-zA-Z0-9._-]+$/.test(fileName)
    ) {
        return NextResponse.json(
            { error: 'Invalid cover parameters' },
            { status: 400 }
        );
    }

    try {
        const imageUrl =
            `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'MangaReader/1.0',
                'Accept': 'image/*',
            },
            cache: 'force-cache',
        });

        if (!response.ok) {
            console.error('MangaDex cover error:', response.status);

            return NextResponse.json(
                { error: 'Cover not found on MangaDex' },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type');

        if (!contentType?.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Invalid image response' },
                { status: 502 }
            );
        }

        return new NextResponse(response.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });

    } catch (error) {
        console.error('Cover proxy error:', error);

        return NextResponse.json(
            { error: 'Failed to retrieve cover' },
            { status: 500 }
        );
    }
}
