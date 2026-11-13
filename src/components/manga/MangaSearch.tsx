
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type MangaResult = {
    id: string;
    title: string;
    image: string;
};

type SearchResponse = {
    currentPage: number;
    hasNextPage: boolean;
    results: MangaResult[];
};

export default function MangaSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<MangaResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function searchManga(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await fetch(
                `/api/manga/search?q=${encodeURIComponent(query)}`
            );

            const data: SearchResponse | { error: string } =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    "error" in data
                        ? data.error
                        : "Failed to search manga"
                );
            }

            if (!("results" in data)) {
                throw new Error("Invalid response from manga provider");
            }

            setResults(data.results);

            console.log("WeebCentral results:", data.results);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while searching"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="p-4 ">
            <h2 className="mb-4 text-xl font-bold">
            </h2>

            <form onSubmit={searchManga} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search manga..."
                    className="w-full rounded-lg bg-white p-3 text-black"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-500 px-5 text-white hover:bg-blue-800 cursor-pointer"
                >
                    {loading ? "..." : "Search"}
                </button>
            </form>

            {error && (
                <p className="mt-4 text-red-500">{error}</p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {results.map((manga) => (
                    <Link
                        key={manga.id}
                        href={`/manga/${encodeURIComponent(manga.id)}`}
                        className="block"
                    >
                        <article className="overflow-hidden rounded-xl bg-gray-900 text-white">
                            <img
                                src={manga.image}
                                alt={`${manga.title} cover`}
                                loading="lazy"
                                className="aspect-[2/3] w-full object-cover"
                            />

                            <div className="p-3">
                                <h3 className="font-bold line-clamp-2">
                                    {manga.title}
                                </h3>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {!loading && results.length === 0 && query && !error && (
                <p className="mt-4 text-gray-400">
                    No results found.
                </p>
            )}
        </section>
    );
}
