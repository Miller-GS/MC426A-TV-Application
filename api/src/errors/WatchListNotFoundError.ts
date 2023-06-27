import { MyTVListError } from "./MyTVListError";

export class WatchListNotFoundError extends MyTVListError {
    public constructor() {
        super("Watch list not found", 404);
    }
}
