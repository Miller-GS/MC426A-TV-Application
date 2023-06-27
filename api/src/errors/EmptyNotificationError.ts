import { MyTVListError } from "./MyTVListError";

export class EmptyNotificationError extends MyTVListError {
    public constructor() {
        super("Notification text was empty", 404);
    }
}
