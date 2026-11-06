export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: "one-piece" | "naruto" | "attack-on-titan";
  status: "ongoing" | "completed";
  genres: string[];
  totalChapters: number;
  lastReadChapter?: number;
  progress?: number;
}