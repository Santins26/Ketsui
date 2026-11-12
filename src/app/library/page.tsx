"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getReadingLibrary,
    type SavedManga,
} from "@/lib/reading-progress";

export default function LibraryPage() {
    const [mangaList, setMangaList] = useState<SavedManga[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMangaList(getReadingLibrary());
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-black p-8 text-white">
                Loading library...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black px-6 py-10 text-white">
            <div className="mx-auto max-w-6xl">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold">
                        My Library
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Your manga and reading progress.
                        </p>
                </header>

                {mangaList.length === 0 ?(
                    <div className="rounded-xl border border-gray-800 p-10 text-center">
                        <h2 className="text-xl font-semibold">
                            Your library is empty
                            </h2>
                            
                            <p className="mt-2 text-gray-400">
                                Start reading a manga and it will appear here.
                                </p>

                                <Link
                                    href="/"
                                    className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 transition hover:bg-blue-500">
                                        Explore manga
                                    </Link>
            </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols 3 md:grid-cols-4 lg:grid-cols5">
                        {mangaList.map((manga) => (
                            <article
                                key={manga.id}
                                className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950"
                            >
                                <Link
                                    href={`/manga/${encodeURIComponent(manga.id)}`}
                                >
                                    <img
                                        src={manga.image}
                                        alt={manga.title}
                                        className="aspect-[2/3] w-full object-cover"
                                    />
                                </Link>

                                <div className="p-3">
                                    <h2 className="truncate font-semibold">
                                        {manga.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-400">
                                        Last read:
                                    </p>

                                    <p className="truncate text-sm text-gray-300">
                                        {manga.lastReadChapter.title}
                                    </p>

                                    <Link
                                        href={`/manga/${encodeURIComponent(manga.id)}/chapter/${manga.lastReadChapter.id}`}
                                        className="mt-4 block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm transition hover:bg-blue-500"
                                    >
                                        Continue reading
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}