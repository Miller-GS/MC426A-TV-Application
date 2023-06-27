import { CommentEntity } from "../entity/comment.entity";
import { ValidationUtils } from "../utils/validationUtils";

export interface Comment {
    id: number;
    userId: number | null;
    mediaId: number;
    parentId: number;
    content: string;
    edited: boolean;
    deleted: boolean;
    responses: Comment[];
}

export class CommentParser {
    public static parseComment(commentEntity: CommentEntity): Comment {
        return {
            id: commentEntity.Id,
            userId: commentEntity.UserId,
            mediaId: commentEntity.MediaId,
            parentId: commentEntity.ParentId,
            content: commentEntity.Content,
            edited: commentEntity.Edited,
            deleted: commentEntity.DeletedAt !== null,
            responses: [],
        };
    }

    public static parseComments(commentEntities: CommentEntity[]): Comment[] {
        const commentMap = new Map();
        for (const commentEntity of commentEntities) {
            commentMap.set(
                commentEntity.Id,
                CommentParser.parseComment(commentEntity)
            );
        }
        for (const commentEntity of commentEntities) {
            if (commentEntity.ParentId !== null) {
                const parentComment = commentMap.get(commentEntity.ParentId);
                parentComment.responses.push(commentMap.get(commentEntity.Id));
            }
        }
        return Array.from(commentMap.values()).filter((comment) =>
            ValidationUtils.isEmpty(comment.parentId)
        );
    }
}
