import { MyTVListError } from "./MyTVListError";

export class RatingNotOwnedError extends MyTVListError {
    public constructor() {
        super("Rating not owned by logged in user", 403);
    }
}
