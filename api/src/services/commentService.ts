import { CommentEntity } from "../entity/comment.entity";
import { MediaEntity } from "../entity/media.entity";
import { Repository } from "typeorm";
import { MediaNotFoundError } from "../errors/MediaNotFoundError";
import { CommentParentNotFoundError } from "../errors/CommentParentNotFoundError";
import { CommentNotFoundError } from "../errors/CommentNotFoundError";
import { CommentNotOwnedError } from "../errors/CommentNotOwnedError";
import { ValidationUtils } from "../../src/utils/validationUtils";
import { CommentParser } from "../models/comment";

export default class CommentService {
    private commentRepository: Repository<CommentEntity>;
    private mediaRepository: Repository<MediaEntity>;

    public constructor(
        commentRepository: Repository<CommentEntity>,
        mediaRepository: Repository<MediaEntity>
    ) {
        this.commentRepository = commentRepository;
        this.mediaRepository = mediaRepository;
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

        if (!ValidationUtils.isEmpty(parentId)) {
            const commentExists = await this.commentRepository.exist({
                where: { Id: parentId as number },
            });
            if (!commentExists) {
                throw new CommentParentNotFoundError();
            }
        }

        const commentEntity = await this.commentRepository.save({
            UserId: userId,
            MediaId: mediaId,
            ParentId: parentId,
            Content: content,
        } as CommentEntity);

        return CommentParser.parseComment(commentEntity);
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
