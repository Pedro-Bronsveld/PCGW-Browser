export default interface Game {
    pageId: string;
    page: string;
    coverUrl: string | null;
    genres: string | null;
    steamId: string | null;
    gogId: string | null;
    releaseDate: string | null;
    language?: string | null | undefined;
}
