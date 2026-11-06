'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type MangaDetails = {
    manga: {
        id: string;
        attributes: {
            title: Record<string, string>;
            description: Record<string, string>;
            status: string;
            year: number | null;
            contentRating: string;
        };
    };
    coverFileName: string | null;
    author: string[];
    artists: string[];
};

export default function MangaDetailsPage() {
    const { id } = useParams();

    const [manga, setManga] = useState<MangaDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchManga() {
            try {
                const response = await fetch(`/api/manga/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch manga details');
                }

                setManga(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred while fetching manga details'
                );

            } finally {
                setLoading(false);
            }
        }

        fetchManga();
    }, [id]);
    
    if (loading) {
        return <p>Loading...</p>;
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

    const attributes = manga.manga.attributes;
    const title = attributes.title.en || Object.values(attributes.title)[0] || "Unknown title";

    const description = attributes.description.en || Object.values(attributes.description)[0] || "No description available";

    const coverUrl = manga.coverFileName
        ? `/api/manga/cover?mangaId=${manga.manga.id}&fileName=${encodeURIComponent(manga.coverFileName)}`
        : null;

    return (
            <main className="min-h-screen bg-black text-white p-4 sm:p-8">

            <Link
                href="/"
                className="mb-6 inline-block text-gray-400 hover:text-white"
            >
                ← Back to search
            </Link>

            <section className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row">

                {/* Capa do manga */}
                <div className="w-full shrink-0 sm:w-64">
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={`${title} cover`}
                            className="w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="aspect-[2/3] rounded-xl bg-gray-800" />
                    )}
                </div>

                {/* Informações do manga */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        {title}
                    </h1>

                    <p className="mt-3 text-sm text-gray-400">
                        {manga.author.join(', ') || 'Unknown author'}
                    </p>

                    {manga.artists.length > 0 && (
                        <p className="mt-1 text-sm text-gray-400">
                            Artist: {manga.artists.join(', ')}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-sm capitalize">
                            {attributes.status}
                        </span>

                        {attributes.year && (
                            <span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
                                {attributes.year}
                            </span>
                        )}
                    </div>

                    <h2 className="mt-8 text-xl font-semibold">
                        Synopsis
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">
                        {description}
                    </p>
                </div>

            </section>

            {}

        </main>
    );
}
