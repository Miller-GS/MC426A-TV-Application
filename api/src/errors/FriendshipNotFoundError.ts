import { MyTVListError } from "./MyTVListError";

export class FriendshipNotFoundError extends MyTVListError {
    public constructor() {
        super("Friendship not found", 404);
    }
}
