"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation"
import { Search, Home, Library, Settings, BookOpen, ChevronRight, Menu, } from "lucide-react";
import Image from 'next/image';

import { mangaList } from "@/data/manga";
import MangaSearch from '@/components/manga/MangaSearch';

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeNav, setActiveNav] = useState("home");
  const router = useRouter();

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

  const navItems: {
  label: string;
  icon: React.ElementType;
  path: string;
}[] = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Library", icon: Library, path: "/library" },
];

  return (
  <div className="min-h-screen bg-black text-white">
    <header className="flex items-center justify-between bg-black p-4">
<Image
  src="/logo/logo-512x512.png"
  alt="logo"
  width={80}
  height={80}
/>
<h1 className="mr-95 text-xl font-bold">Ketsui</h1>

      <div className="flex items-center gap-4">
        <MangaSearch />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded bg-white px-2 py-1 text-black"
        >
          <option value="all">All</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </header>

    <nav className="flex gap-2 border-b border-white 0 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-gray-800"
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>

    <main className="p-6">
      {/* Home Page items*/}
    </main>
  </div>
);
}