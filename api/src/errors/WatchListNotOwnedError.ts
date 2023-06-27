import { MyTVListError } from "./MyTVListError";

export class WatchListNotOwnedError extends MyTVListError {
    public constructor() {
        super("Watch list not owned by logged in user", 403);
    }
}
