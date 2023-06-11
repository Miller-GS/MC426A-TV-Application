export class CommentNotOwnedError extends Error {
    public constructor() {
        super("Comment not owned by logged in user");
    }
}