import { MyTVListError } from "./MyTVListError";

export class UserAlreadyExistsError extends MyTVListError {
    public constructor() {
        super("User already exists", 409);
    }
}
