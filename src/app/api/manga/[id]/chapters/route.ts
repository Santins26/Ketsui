
import { NextRequest, NextResponse } from "next/server";

const MANGADEX_API = "https://api.mangadex.org";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const url = new URL(`${MANGADEX_API}/manga/${id}/feed`);

        url.searchParams.set("limit", "100");
        url.searchParams.set("offset", "0");
        url.searchParams.set("order[chapter]", "asc");
        url.searchParams.set("includes[]", "scanlation_group");

        const response = await fetch(url.toString());
        const data = await response.json();

        console.log("MangaDex status:", response.status);
        console.log("MangaDex response:", data);

        if (!response.ok) {
            return NextResponse.json(
                { error: data.errors?.[0]?.detail || "MangaDex request failed", details: data },
                { status: response.status }
            );
        }

        const availableChapters = data.data.filter(
    (chapter: {
        attributes: {
            pages: number;
            externalUrl: string | null;
        };
    }) => {
        return (
            chapter.attributes.pages > 0 &&
            !chapter.attributes.externalUrl
        );
    }
);

return NextResponse.json({
    ...data,
    data: availableChapters,
});

    } catch (error) {
        console.error("Chapter API error:", error);

        return NextResponse.json(
            { error: "Failed to fetch chapters" },
            { status: 500 }
        );
    }
}
