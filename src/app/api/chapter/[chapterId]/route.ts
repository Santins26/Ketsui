
import { NextRequest, NextResponse } from 'next/server';
import { weebcentral } from '@/lib/weebcentral';

type ChapterPage = {
    img: string;
    page: number;
    headerForImage: string;
};

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ chapterId: string }> }
) {
    const { chapterId } = await context.params;

    try {
        const pages = await weebcentral.fetchChapterPages(chapterId);

        const formattedPages = pages.map((page) => ({
            page: page.page,
            img: `/api/chapter/image?url=${encodeURIComponent(page.img)}`
        }));

        return NextResponse.json({
            pages: formattedPages.map((page) => page.img),
            totalPages: formattedPages.length
        });
    } catch (error) {
        console.error('WeebCentral chapter error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch chapter pages' },
            { status: 500 }
        );
    }
}
