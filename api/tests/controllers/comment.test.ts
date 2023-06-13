import { CommentController } from "../../src/controllers/comment";
import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";
import { CommentParentNotFoundError } from "../../src/errors/CommentParentNotFoundError";
import { CommentNotFoundError } from "../../src/errors/CommentNotFoundError";
import { CommentNotOwnedError } from "../../src/errors/CommentNotOwnedError";

describe("Comment controller", () => {
    let commentController: CommentController;
    let commentService: any;

    beforeEach(() => {
        commentService = {
            createComment: jest.fn(),
            updateComment: jest.fn(),
            listComments: jest.fn(),
            deleteComment: jest.fn(),
        };
        commentController = new CommentController(commentService);
    });

    describe("listComments", () => {
        test("Should return 200 and empty list when media exists but has no comments", async () => {
            const req: any = {
                params: {
                    mediaId: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.listComments.mockResolvedValueOnce([]);

            await commentController.listComments(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        test("Should return 404 when media does not exist", async () => {
            const req: any = {
                params: {
                    mediaId: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.listComments.mockRejectedValueOnce(
                new MediaNotFoundError()
            );

            await commentController.listComments(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Media not found",
            });
        });

        test("Should return 500 when an error occurs", async () => {
            const req: any = {
                params: {
                    mediaId: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.listComments.mockRejectedValueOnce(new Error());

            await commentController.listComments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });

        test("Should return 400 when mediaId is not a number", async () => {
            const req: any = {
                params: {
                    mediaId: "not a number",
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.listComments(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Media ID necessary",
            });
        });
    });

    describe("createComment", () => {
        test("Should return 201 and created comment when comment is created", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.createComment.mockResolvedValueOnce({});

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({});
            expect(commentService.createComment).toHaveBeenCalledWith(
                1,
                1,
                undefined,
                "content"
            );
        });

        test("Should return 404 when media does not exist", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.createComment.mockRejectedValueOnce(
                new MediaNotFoundError()
            );

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Media not found",
            });
        });

        test("Should return 404 when parent comment does not exist", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    content: "content",
                    parentId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.createComment.mockRejectedValueOnce(
                new CommentParentNotFoundError()
            );

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Comment Parent not found",
            });
        });

        test("Should return 500 when an error occurs", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.createComment.mockRejectedValueOnce(new Error());

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });

        test("Should return 400 when mediaId is not provided", async () => {
            const req: any = {
                body: {
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Media ID necessary",
            });
        });

        test("Should return 400 when content is not provided", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Content necessary",
            });
        });

        test("Should return 400 when parentId is provided but not a number", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    content: "content",
                    parentId: "abc",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Parent ID must be a number",
            });
        });

        test("Should return 401 when user is not logged in", async () => {
            const req: any = {
                body: {
                    mediaId: 1,
                    content: "content",
                },
                user: undefined,
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.createComment(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        });
    });

    describe("updateComment", () => {
        test("Should return 204 and updated comment when comment is updated", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                body: {
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.updateComment.mockResolvedValueOnce({});

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith();
            expect(commentService.updateComment).toHaveBeenCalledWith(
                1,
                1,
                "content"
            );
        });

        test("Should return 404 when comment does not exist", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                body: {
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.updateComment.mockRejectedValueOnce(
                new CommentNotFoundError()
            );

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Comment not found",
            });
        });

        test("Should return 403 when user is not the author of the comment", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                body: {
                    content: "content",
                },
                user: {
                    id: 2,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.updateComment.mockRejectedValueOnce(
                new CommentNotOwnedError()
            );

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: "Comment not owned by logged in user",
            });
        });

        test("Should return 500 when an error occurs", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                body: {
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.updateComment.mockRejectedValueOnce(new Error());

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });

        test("Should return 400 when content is not provided", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                body: {},
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Content necessary",
            });
        });

        test("Should return 401 when user is not logged in", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                body: {
                    content: "content",
                },
                user: undefined,
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        });

        test("Should return 400 when commentId is not a number", async () => {
            const req: any = {
                params: {
                    commentId: "abc",
                },
                body: {
                    content: "content",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.updateComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Comment ID necessary",
            });
        });
    });

    describe("deleteComment", () => {
        test("Should return 204 when comment is deleted", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.deleteComment.mockResolvedValueOnce({});

            await commentController.deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith();
            expect(commentService.deleteComment).toHaveBeenCalledWith(1, 1);
        });

        test("Should return 404 when comment does not exist", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.deleteComment.mockRejectedValueOnce(
                new CommentNotFoundError()
            );

            await commentController.deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Comment not found",
            });
        });

        test("Should return 403 when user is not the author of the comment", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                user: {
                    id: 2,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.deleteComment.mockRejectedValueOnce(
                new CommentNotOwnedError()
            );

            await commentController.deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: "Comment not owned by logged in user",
            });
        });

        test("Should return 500 when an error occurs", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            commentService.deleteComment.mockRejectedValueOnce(new Error());

            await commentController.deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        });

        test("Should return 401 when user is not logged in", async () => {
            const req: any = {
                params: {
                    commentId: 1,
                },
                user: undefined,
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        });

        test("Should return 400 when commentId is not a number", async () => {
            const req: any = {
                params: {
                    commentId: "abc",
                },
                user: {
                    id: 1,
                },
            };
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await commentController.deleteComment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request: Comment ID necessary",
            });
        });
    });
});
