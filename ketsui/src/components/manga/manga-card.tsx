import { Manga } from '@/types/manga';

const coversImages = {
    'one-piece': "bg-sky-500",
    'naruto': "bg-orange-500",
    'attack-on-titan': 'bg-gray-500',
};

export default function MangaCard({ manga }: { manga: Manga }) {
    return (
        <article>
            <div className={`${coversImages[manga.cover]} h-40 w-40`}></div>
            <div>
                <div>
                    <h1><strong>{manga.title}</strong></h1>
                    <p>{manga.author}</p>
                </div>
            </div>

            <div></div>
            <div>
                <p>{manga.totalChapters} chapters</p>
                <p>{manga.lastReadChapter ? `Last read: Chapter ${manga.lastReadChapter}` : 'Not started yet'}</p>
            </div>
        </article>
    );
}