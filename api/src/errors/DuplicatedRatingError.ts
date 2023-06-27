import { MyTVListError } from "./MyTVListError";

export class DuplicatedRatingError extends MyTVListError {
    public constructor() {
        super("There is already a rating for this media", 403);
    }
}
