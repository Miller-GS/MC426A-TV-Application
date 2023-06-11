import { MyTVListError } from "./MyTVListError";

export class CommentParentNotFoundError extends MyTVListError {
    public constructor() {
        super("Comment Parent not found", 404);
    }
}
