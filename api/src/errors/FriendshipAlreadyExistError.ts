import { MyTVListError } from "./MyTVListError";

export class FriendshipAlreadyExistError extends MyTVListError {
    public constructor() {
        super("Friendship Already Exist", 409);
    }
}
