import { MyTVListError } from "./MyTVListError";

export class InvalidUserParamsError extends MyTVListError {
    public constructor() {
        super("Invalid User Params", 400);
    }
}
