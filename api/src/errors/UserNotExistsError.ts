import { MyTVListError } from "./MyTVListError";

export class UserNotExistsError extends MyTVListError {
    public constructor() {
        super("User does not exist", 401);
    }
}
