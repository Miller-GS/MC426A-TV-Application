import { MyTVListError } from "./MyTVListError";

export class SelfFriendshipError extends MyTVListError {
    public constructor() {
        super("Cannot add friendship with yourself", 400);
    }
}
