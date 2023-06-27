import { MyTVListError } from "./MyTVListError";

export class RatingNotFoundError extends MyTVListError {
    public constructor() {
        super("Rating not found", 404);
    }
}
