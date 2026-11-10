
"use client";

type MangaReaderProps = {
    pages: string[];
};

export default function MangaReader({ pages }: MangaReaderProps) {
    return (
        <main className="min-h-screen bg-black">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center">

                {pages.map((page, index) => (
                    <div
                        key={page}
                        className="w-full"
                    >
                        <img
                            src={page}
                            alt={`Page ${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            className="block h-auto w-full"
                        />
                    </div>
                ))}

            </div>
        </main>
    );
}
