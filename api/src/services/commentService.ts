import { CommentEntity } from "../entity/comment.entity";
import { MediaEntity } from "../entity/media.entity";
import { Repository } from "typeorm";
import { MediaNotFoundError } from "../errors/MediaNotFoundError";
import { CommentParentNotFoundError } from "../errors/CommentParentNotFoundError";
import { CommentNotFoundError } from "../errors/CommentNotFoundError";
import { CommentNotOwnedError } from "../errors/CommentNotOwnedError";
import { ValidationUtils } from "../../src/utils/validationUtils";
import { Comment, CommentParser } from "../models/comment";
import { NotificationEntity } from "../entity/notification.entity";
import { ReplyNotification } from "./replyNotification";

export default class CommentService {
    private commentRepository: Repository<CommentEntity>;
    private mediaRepository: Repository<MediaEntity>;
    private notificationRepository: Repository<NotificationEntity>;

    public constructor(
        commentRepository: Repository<CommentEntity>,
        mediaRepository: Repository<MediaEntity>,
        notificationRepository: Repository<NotificationEntity>
    ) {
        this.commentRepository = commentRepository;
        this.mediaRepository = mediaRepository;
        this.notificationRepository = notificationRepository;
    }

    public async listComments(mediaId: number) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) {
            throw new MediaNotFoundError();
        }

        const comments = await this.commentRepository.find({
            where: { MediaId: mediaId },
            withDeleted: true,
        });

        return CommentParser.parseComments(comments);
    }

    public async createComment(
        mediaId: number,
        userId: number,
        parentId: number | null,
        content: string
    ) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) {
            throw new MediaNotFoundError();
        }

        let parentComment = {} as Comment;

        if (!ValidationUtils.isEmpty(parentId)) {
            const parentCommentEntity = await this.commentRepository.findOne({
                where: { Id: parentId as number },
            });
            if (!parentCommentEntity) {
                throw new CommentParentNotFoundError();
            }

            parentComment = CommentParser.parseComment(parentCommentEntity);
        }

        const commentEntity = await this.commentRepository.save({
            UserId: userId,
            MediaId: mediaId,
            ParentId: parentId,
            Content: content,
        } as CommentEntity);

        const comment = CommentParser.parseComment(commentEntity);

        if (parentComment && !ValidationUtils.isNull(parentComment.userId)) {
            const parentUserId = parentComment.userId as number;

            const notificaton = new ReplyNotification(
                this.notificationRepository,
                parentUserId,
                comment
            );

            notificaton.saveNotification();
        }

        return comment;
    }

    public async updateComment(
        commentId: number,
        userId: number,
        content: string
    ) {
        const comment = await this.commentRepository.findOne({
            where: { Id: commentId },
        });
        if (!comment) {
            throw new CommentNotFoundError();
        }

        if (comment.UserId !== userId) {
            throw new CommentNotOwnedError();
        }

        await this.commentRepository.update(commentId, {
            Content: content,
            Edited: true,
        });
    }

    public async deleteComment(commentId: number, userId: number) {
        const comment = await this.commentRepository.findOne({
            where: { Id: commentId },
        });
        if (!comment) {
            throw new CommentNotFoundError();
        }

        if (comment.UserId !== userId) {
            throw new CommentNotOwnedError();
        }

        await this.commentRepository.update(commentId, {
            UserId: null,
            Content: "Comment deleted",
            DeletedAt: new Date(),
        });
    }
}
