"use client";

import { useState } from "react";
import Link from 'next/link';

type MangaResult = {
    id: string;
    coverFileName: string | null;
    attributes: {
        title: Record<string, string>;
        description: Record<string, string>;
        status: string;
        year: number | null;
    };
    relationships: {
        id: string;
        type: string;
        attributes?: {
            fileName?: string;
        };
    }[];
};

export default function MangaSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<MangaResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function searchManga (e: React.FormEvent) {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const response = await fetch(`/api/manga/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch manga data');
            }

            setResults(data.data || []);
            console.log('Manga data:', data.data);
            console.log('Relationships:', data.data[0]?.relationships);
        }
        catch (err: any) {
            setError(err.message || 'An error occurred while searching for manga');
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <section className="p-4">
            <h2 className="mb-4 text-xl font-bold">
                Search Manga
            </h2>

            <form onSubmit={searchManga} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search manga..."
                    className="w-full rounded-lg bg-gray-800 p-3 text-white"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 text-white"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </form>

            {error && (
                <p className="mt-4 text-red-500">{error}</p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {results.map((manga) => {
                    const title =
                        manga.attributes.title.en ||
                        Object.values(manga.attributes.title)[0] ||
                        'Unknown title';
                        const coverUrl = manga.coverFileName
    ? `/api/manga/cover?mangaId=${manga.id}&fileName=${encodeURIComponent(manga.coverFileName)}`
    : null;

                    return (
                        <Link
                        key={manga.id}
                        href={`/manga/${manga.id}`}
                        className="block">
                        
<article
    key={manga.id}
    className="overflow-hidden rounded-xl bg-gray-900 text-white"
>
    {coverUrl ? (
        <img
            src={coverUrl}
            alt={`${title} cover`}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover"
        />
    ) : (
        <div className="aspect-[2/3] w-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No cover</span>
        </div>
    )}

    <div className="p-3">
        <h3 className="font-bold line-clamp-2">
            {title}
        </h3>

        <p className="mt-2 text-sm text-gray-400 capitalize">
            {manga.attributes.status}
        </p>

        <p className="text-sm text-gray-400">
            {manga.attributes.year || 'Unknown year'}
        </p>
    </div>
</article>
</Link>

                    );
                })}
            </div>

            {!loading && results.length === 0 && query && !error && (
                <p className="mt-4 text-gray-400">
                    No results found.
                </p>
            )}
        </section>
    );
}