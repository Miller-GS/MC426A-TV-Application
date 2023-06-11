export class CommentParentNotFoundError extends Error {
    public constructor() {
        super("Comment Parent not found");
    }
}