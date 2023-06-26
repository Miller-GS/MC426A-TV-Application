import { MyTVListError } from "./MyTVListError";

export class WatchListIdNotProvidedError extends MyTVListError {
    public constructor() {
        super("Watch list id not provided", 400);
    }
}
