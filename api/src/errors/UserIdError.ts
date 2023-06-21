import { MyTVListError } from "./MyTVListError";

export class UserIdError extends MyTVListError {
    public constructor() {
        super("User id error", 404);
    }
}
