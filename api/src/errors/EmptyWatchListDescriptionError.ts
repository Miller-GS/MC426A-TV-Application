import { MyTVListError } from "./MyTVListError";

export class EmptyWatchListDescriptionError extends MyTVListError {
    public constructor() {
        super("Watch list should have a description", 400);
    }
}
