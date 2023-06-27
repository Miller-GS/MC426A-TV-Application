import { MyTVListError } from "./MyTVListError";

export class MediaIdsNotProvidedError extends MyTVListError {
    public constructor() {
        super("Media ids array not provided in body", 400);
    }
}
