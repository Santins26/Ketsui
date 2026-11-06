import type { Manga } from "@/types/manga";

export const mangaList: Manga[] = [
    {
        id: '1',
        title: 'One Piece',
        author: 'Eiichiro Oda',
        description: 'Monkey D. Luffy and his pirate crew explore the Grand Line in search of the ultimate treasure, the One Piece.',
        cover: 'one-piece',
        genres: ['Action', 'Adventure', 'Comedy'],
        totalChapters: 1000,
        progress: 50,
        status: 'ongoing',
        lastReadChapter: 500
    },
    {
        id: '2',
        title: 'Naruto',
        author: 'Masashi Kishimoto',
        description: 'Naruto Uzumaki, a young ninja with a sealed demon fox spirit, strives to become the strongest ninja and gain recognition from his village.',
        cover: 'naruto',
        genres: ['Action', 'Adventure', 'Fantasy'],
        totalChapters: 700,
        progress: 70,
        status: 'completed',
        lastReadChapter: 560
    },
    {
        id: '3',
        title: 'Attack on Titan',
        author: 'Hajime Isayama',
        description: 'In a world where humanity is forced to live behind walls for protection against giant humanoid Titans, a young boy joins the military to fight the Titans.',
        cover: 'attack-on-titan',
        genres: ['Action', 'Drama', 'Fantasy'],
        totalChapters: 139,
        progress: 100,
        status: 'completed',
        lastReadChapter: 139
    }
];