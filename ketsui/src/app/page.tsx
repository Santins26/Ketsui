"use client";

import { useMemo, useState } from "react";
import { Search, Home, Library, Settings, BookOpen, ChevronRight, Menu, } from "lucide-react";

import { mangaList } from "@/data/manga";
import MangaCard from "@/components/manga/manga-card";
import MangaSearch from '@/components/manga/MangaSearch';

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeNav, setActiveNav] = useState("home");

  const filteredManga = useMemo(() => {
  return mangaList.filter((manga) => {
    const matchesSearch =
      manga.title.toLowerCase().includes(search.toLowerCase()) ||
      manga.author.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Reading" && manga.lastReadChapter !== undefined) ||
      (filter === "Completed" && manga.status === "completed");

    return matchesSearch && matchesFilter;
  });
}, [search, filter]);

  const continueReading = mangaList.filter(
    (manga) => manga.lastReadChapter !== undefined
  );

  const navItems = [
    { label: "Home", icon: Home},
    { label: "Library", icon: Library },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Manga Reader</h1>
        <div className="flex items-center space-x-4">
          <MangaSearch />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1 rounded bg-gray-700 text-white"
          >
            <option value="all">All</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </header>

      <main className="flex-1 p-4">
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Continue Reading</h2>
          <div className="flex flex-wrap gap-8">
            {continueReading.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">All Manga</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}