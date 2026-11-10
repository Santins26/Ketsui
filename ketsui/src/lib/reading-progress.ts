export type SavedManga = {
    id: string;
    title: string;
    image: string;
    authors: string[];
    genres: string[];
    status: string;
    lastReadChapter: {
        id: string;
        title: string;
    };
    lastReadAt: string;
};

const STORAGE_KEY = "ketsui-reading-library";

export function getReadingLibrary(): SavedManga[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load reading library:", error);
        return [];
    }
}

export function saveReadingProgress(
    manga: Omit<SavedManga, "lastReadChapter" | "lastReadAt">,
    chapter: { id: string; title: string }
) {
    if (typeof window === "undefined") return;

    const library = getReadingLibrary();

    const savedManga: SavedManga = {
        ...manga,
        lastReadChapter: chapter,
        lastReadAt: new Date().toISOString(),
    };

    const existingIndex = library.findIndex(
        (item) => item.id === manga.id
    );

    if (existingIndex >= 0) {
        library[existingIndex] = savedManga;
    } else {
        library.unshift(savedManga);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(library)
    );
}