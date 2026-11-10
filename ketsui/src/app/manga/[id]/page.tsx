
'use client';

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";


type MangaChapter = {
    id: string;
    title: string;
    releaseDate: string;
};

type MangaDetails = {
    id: string;
    title: string;
    image: string;
    description: string;
    authors: string[];
    genres: string[];
    releaseDate: string;
    status: string;
    chapters: MangaChapter[];
};

function MangaDetailsContent() {
    const { id } = useParams<{ id: string }>();
    let mangaId = id;

try {
    while (mangaId.includes("%")) {
        const decoded = decodeURIComponent(mangaId);
        if (decoded === mangaId) break;
        mangaId = decoded;
    }
} catch {
    mangaId = id;
}

    const [manga, setManga] = useState<MangaDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchManga() {
            try {
                setLoading(true);
                setError("");

                let mangaId = id;

while (mangaId.includes("%")) {
    const decoded = decodeURIComponent(mangaId);

    if (decoded === mangaId) break;

    mangaId = decoded;
}

const response = await fetch(
    `/api/manga/details?mangaId=${encodeURIComponent(mangaId)}`,
    {
        cache: "no-store",
    }
);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to fetch manga details"
                    );
                }

                setManga(data);
                console.log("Manga chapters:", data.chapters);
console.log("Total chapters:", data.chapters?.length);
console.log("Manga ID:", id);
console.log("API response:", data);
console.log("Chapters:", data.chapters);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred while fetching manga details"
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchManga();
        }
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                Loading manga...
            </main>
        );
    }

    if (error || !manga) {
        return (
            <main className="min-h-screen bg-black p-6 text-white">
                <p>{error || "Manga not found"}</p>

                <Link href="/" className="text-blue-500 hover:underline">
                    Go back to Home
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black p-4 text-white sm:p-8">

            <Link
                href="/"
                className="mb-6 inline-block text-gray-400 hover:text-white"
            >
                ← Back to search
            </Link>

            <section className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row">

                {/* Manga cover */}
                <div className="w-full shrink-0 sm:w-64">
                    {manga.image ? (
                        <img
                            src={manga.image}
                            alt={`${manga.title} cover`}
                            className="w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="aspect-[2/3] rounded-xl bg-gray-800" />
                    )}
                </div>

                {/* Manga information */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        {manga.title}
                    </h1>

                    <p className="mt-3 text-sm text-gray-400">
                        {manga.authors?.join(", ") || "Unknown author"}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-sm capitalize">
                            {manga.status || "Unknown status"}
                        </span>

                        {manga.releaseDate && (
                            <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                                {manga.releaseDate}
                            </span>
                        )}
                    </div>

                    {manga.genres?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {manga.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    <h2 className="mt-8 text-xl font-semibold">
                        Synopsis
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">
                        {manga.description || "No description available"}
                    </p>
                </div>
            </section>

            {/* Chapter list */}
            <section className="mx-auto mt-12 max-w-4xl">
                <h2 className="mb-5 text-2xl font-bold">
                    Chapters
                </h2>

                {!manga.chapters || manga.chapters.length === 0 ? (
                    <p className="text-gray-400">
                        No chapters available.
                    </p>
                ) : (
                    <div className="divide-y divide-gray-800 rounded-lg border border-gray-800">
                        {manga.chapters.map((chapter) => (
                            <Link
                                key={chapter.id}
                                href={`/manga/${encodeURIComponent(mangaId)}/chapter/${chapter.id}`}
                                className="flex items-center justify-between p-4 transition hover:bg-gray-900"
                            >
                                <div>
                                    <p className="font-medium">
                                        {chapter.title}
                                    </p>

                                    {chapter.releaseDate && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(
                                                chapter.releaseDate
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <span className="text-gray-400">
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
export default function MangaDetailsPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-black p-6 text-white">
                    Loading manga...
                </main>
            }
        >
            <MangaDetailsContent />
        </Suspense>
    );
}