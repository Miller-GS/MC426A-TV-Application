import { MyTVListError } from "./MyTVListError";

export class InvalidAccessError extends MyTVListError {
    public constructor() {
        super("Invalid access", 401);
    }
}
