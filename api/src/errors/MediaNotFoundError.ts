export class MediaNotFoundError extends Error {
    public constructor() {
        super("Media not found");
    }
}