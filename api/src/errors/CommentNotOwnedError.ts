import { MyTVListError } from "./MyTVListError";

export class CommentNotOwnedError extends MyTVListError {
    public constructor() {
        super("Comment not owned by logged in user", 403);
    }
}