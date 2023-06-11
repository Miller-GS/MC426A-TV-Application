import { MyTVListError } from "./MyTVListError";

export class CommentNotFoundError extends MyTVListError {
    public constructor() {
        super("Comment not found", 404);
    }
}