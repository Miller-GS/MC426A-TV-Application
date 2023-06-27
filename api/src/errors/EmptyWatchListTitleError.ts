import { MyTVListError } from "./MyTVListError";

export class EmptyWatchListTitleError extends MyTVListError {
    public constructor() {
        super("Watch list should have a title", 400);
    }
}
