export class CommentNotFoundError extends Error {
    public constructor() {
        super("Comment not found");
    }
}