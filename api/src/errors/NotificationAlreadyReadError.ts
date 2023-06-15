import { MyTVListError } from "./MyTVListError";

export class NotificationAlreadyReadError extends MyTVListError {
    public constructor() {
        super("Notification has already been read", 405);
    }
}

