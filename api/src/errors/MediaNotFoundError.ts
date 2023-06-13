import { MyTVListError } from "./MyTVListError";

export class MediaNotFoundError extends MyTVListError {
    public constructor() {
        super("Media not found", 404);
    }
}
