import { MyTVListError } from "./MyTVListError";

export class NotificationNotFoundError extends MyTVListError {
    public constructor() {
        super("Notification not found", 404);
    }
}
