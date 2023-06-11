import CommentService from "../services/commentService";
import { Response, Request } from "express";
import { ValidationUtils } from "../utils/validationUtils";
import { MyTVListError } from "../errors/MyTVListError";

export class CommentController {
    private commentService: CommentService;

    public constructor(commentService: CommentService) {
        this.commentService = commentService;
    }

    public async listComments(req: Request, res: Response) {
        const mediaId = req.params["mediaId"];
        if (!this.validateMediaId(mediaId, res)) return res;

        try {
            const comments = await this.commentService.listComments(
                parseInt(mediaId)
            );
            return res.status(200).json(comments);
        } catch (err: any) {
            console.error(err.message);
            return this.handleError(err, res);
        }
    }

    public async createComment(req: Request, res: Response) {
        const { content, mediaId, parentId } = req.body;
        if (!this.validateMediaId(mediaId, res)) return res;
        if (!this.validateContent(content, res)) return res;
        if (!this.validateParentId(parentId, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;

        try {
            const comment = await this.commentService.createComment(
                mediaId,
                userId,
                parentId,
                content
            );
            return res.status(201).json(comment);
        } catch (err: any) {
            console.error(err.message);
            this.handleError(err, res);
        }
    }

    public async updateComment(req: Request, res: Response) {
        const commentId = req.params["commentId"];
        const content = req.body["content"];

        if (!this.validateContent(content, res)) return res;
        if (!this.validateCommentId(commentId, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;

        try {
            await this.commentService.updateComment(
                parseInt(commentId),
                userId,
                content
            );
            return res.status(204).json();
        } catch (err: any) {
            console.error(err.message);
            return this.handleError(err, res);
        }
    }

    public async deleteComment(req: Request, res: Response) {
        const commentId = req.params["commentId"];
        if (!this.validateCommentId(commentId, res)) return res;
        if (!ValidationUtils.validateUserLoggedIn(req, res)) return res;

        const userId = req["user"].id;

        try {
            await this.commentService.deleteComment(
                parseInt(commentId),
                userId
            );
            return res.status(204).json();
        } catch (err: any) {
            console.error(err.message);
            return this.handleError(err, res);
        }
    }

    private validateMediaId(mediaId: any, res: Response) {
        if (ValidationUtils.isEmpty(mediaId) || isNaN(mediaId)) {
            res.status(400).json({
                message: "Bad request: Media ID necessary",
            });
            return false;
        }
        return true;
    }

    private validateContent(content: any, res: Response) {
        if (ValidationUtils.isEmpty(content)) {
            res.status(400).json({
                message: "Bad request: Content necessary",
            });
            return false;
        }
        return true;
    }

    private validateCommentId(commentId: any, res: Response) {
        if (!ValidationUtils.isPositiveNumber(commentId)) {
            res.status(400).json({
                message: "Bad request: Comment ID necessary",
            });
            return false;
        }
        return true;
    }

    private validateParentId(parentId: any, res: Response) {
        if (!ValidationUtils.isEmpty(parentId) && isNaN(parentId)) {
            res.status(400).json({
                message: "Bad request: Parent ID must be a number",
            });
            return false;
        }
        return true;
    }

    private handleError(err: Error, res: Response) {
        if (err instanceof MyTVListError) {
            return res.status(err.getStatus()).json({
                message: err.message,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
