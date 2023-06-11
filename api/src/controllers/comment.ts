import CommentService from '../services/commentService';
import { Response, Request } from "express";
import { ValidationUtils } from '../utils/validationUtils';
import { MediaNotFoundError } from "../errors/MediaNotFoundError";
import { CommentParentNotFoundError } from "../errors/CommentParentNotFoundError";
import { CommentNotFoundError } from "../errors/CommentNotFoundError";
import { CommentNotOwnedError } from "../errors/CommentNotOwnedError";

export class CommentController {
    private commentService: CommentService;

    public constructor(commentService: CommentService) {
        this.commentService = commentService
    }

    public async listComments(req: Request, res: Response) {
        const mediaId = req.params["mediaId"];
        if (!ValidationUtils.isPositiveNumber(mediaId)) {
            return res.status(400).json({
                message: "Bad request: Media ID necessary",
            });
        }
        
        try {
            const comments = await this.commentService.listComments(parseInt(mediaId));
            return res.status(200).json(comments);
            
        } catch (err: any) {
            if (err instanceof MediaNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            return res.status(500).json({
                message: err.message,
            });
        }
    }

    public async createComment(req: Request, res: Response) {
        const { content, mediaId, parentId } = req.body;
        if (ValidationUtils.isEmpty(mediaId) || isNaN(mediaId)) {
            return res.status(400).json({
                message: "Bad request: Media ID necessary",
            });
        }
        if (ValidationUtils.isEmpty(content)) {
            return res.status(400).json({
                message: "Bad request: Content necessary",
            });
        }
        if (!ValidationUtils.isEmpty(parentId) && (isNaN(parentId) || parentId < 0)){
            return res.status(400).json({
                message: "Bad request: Parent ID must be a positive number",
            });
        }
        
        const userId = req["user"].id;
        if (ValidationUtils.isEmpty(userId)) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        try {
            const comment = await this.commentService.createComment(mediaId, userId, parentId, content);
            return res.status(201).json(comment);
        } catch (err: any) {
            if (err instanceof MediaNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err instanceof CommentParentNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            return res.status(500).json({
                message: err.message,
            });
        }
    }

    public async updateComment(req: Request, res: Response) {
        const commentId = req.params["commentId"];
        const content = req.body["content"];
        if (!ValidationUtils.isPositiveNumber(commentId)) {
            return res.status(400).json({
                message: "Bad request: Comment ID necessary",
            });
        }
        if (ValidationUtils.isEmpty(content)) {
            return res.status(400).json({
                message: "Bad request: Content necessary",
            });
        }

        const userId = req["user"].id;
        if (ValidationUtils.isEmpty(userId)) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        try {
            await this.commentService.updateComment(parseInt(commentId), userId, content);
            return res.status(204).json();
        } catch (err: any) {
            if (err instanceof CommentNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err instanceof CommentNotOwnedError) {
                return res.status(401).json({
                    message: err.message,
                });
            }
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }

    public async deleteComment(req: Request, res: Response) {
        const commentId = req.params["commentId"];
        if (!ValidationUtils.isPositiveNumber(commentId)) {
            return res.status(400).json({
                message: "Bad request: Comment ID necessary",
            });
        }

        const userId = req["user"].id;
        if (ValidationUtils.isEmpty(userId)) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        try {
            await this.commentService.deleteComment(parseInt(commentId), userId);
            return res.status(204).json();
        } catch (err: any) {
            if (err instanceof CommentNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err instanceof CommentNotOwnedError) {
                return res.status(401).json({
                    message: err.message,
                });
            }
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
}