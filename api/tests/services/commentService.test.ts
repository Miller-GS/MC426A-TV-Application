import CommentService from "../../src/services/commentService";
import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";
import { CommentParentNotFoundError } from "../../src/errors/CommentParentNotFoundError";
import { CommentNotFoundError } from "../../src/errors/CommentNotFoundError";
import { CommentNotOwnedError } from "../../src/errors/CommentNotOwnedError";

const makeCommentEntityMock = (entity = {} as any) => {
    return {
        Id: entity.Id || 1,
        UserId: entity.UserId || 1,
        MediaId: entity.MediaId || 1,
        ParentId: entity.ParentId || null,
        Content: entity.Contant || "Comment content",
        Edited: entity.Edited || false,
        DeletedAt: entity.DeletedAt || null,
    }
}

const makeCommentMock = (commentObj = {} as any) => {
    return {
        id: commentObj.id || 1,
        userId: commentObj.userId || 1,
        mediaId: commentObj.mediaId || 1,
        parentId: commentObj.parentId || null,
        content: commentObj.content || "Comment content",
        edited: commentObj.edited || false,
        deleted: commentObj.deleted || false,
        responses: commentObj.responses || [],
    };
}

describe("Comment Service", () => {
    let commentService: CommentService;
    let commentRepositoryMock: any;
    let mediaRepositoryMock: any;

    beforeEach(() => {
        commentRepositoryMock = {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            exist: jest.fn(),
            update: jest.fn(),
        };
        
        mediaRepositoryMock = {
            exist: jest.fn(),
        };

        commentService = new CommentService(commentRepositoryMock, mediaRepositoryMock);
    });

    describe("List Comments", () => {
        test("Should return empty list when media exists but has no comments", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            commentRepositoryMock.find.mockReturnValueOnce([]);

            const response = await commentService.listComments(1);

            expect(response).toEqual([]);
        });

        test("Should throw error when media does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(commentService.listComments(1)).rejects.toThrow(MediaNotFoundError);
        });

        test("Should return list of comments when media exists and has comments", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            const commentEntityMock = makeCommentEntityMock();
            const responseEntityMock = makeCommentEntityMock({Id: 2, ParentId: commentEntityMock.Id});
            commentRepositoryMock.find.mockReturnValueOnce([commentEntityMock, responseEntityMock]);

            const response = await commentService.listComments(1);

            const expectedCommentResponse = makeCommentMock({id: 2, parentId: 1})
            const expectedComment = makeCommentMock({responses:[expectedCommentResponse]})
            expect(response).toEqual([expectedComment]);
        });
    });

    describe("Create Comment", () => {
        test("Should throw error when media does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(commentService.createComment(1, 1, null, "Comment content")).rejects.toThrow(MediaNotFoundError);
        });

        test("Should throw error when parent comment does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            commentRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(commentService.createComment(1, 1, 1, "Comment content")).rejects.toThrow(CommentParentNotFoundError);
        });

        test("Should create comment when media exists and parent comment exists", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            commentRepositoryMock.exist.mockReturnValueOnce(true);
            const commentEntityMock = makeCommentEntityMock({ParentId: 1});
            commentRepositoryMock.save.mockReturnValueOnce(commentEntityMock);

            const response = await commentService.createComment(1, 1, 1, "Comment content");

            expect(response).toEqual(makeCommentMock({parentId: 1}));
        });
    });

    describe("Edit Comment", () => {
        test("Should throw error when comment does not exist", async () => {
            commentRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(commentService.updateComment(1, 1, "Comment content")).rejects.toThrow(CommentNotFoundError);
        });

        test("Should throw error when user does not own comment", async () => {
            commentRepositoryMock.exist.mockReturnValueOnce(true);
            commentRepositoryMock.findOne.mockReturnValueOnce(makeCommentEntityMock({UserId: 2}));

            await expect(commentService.updateComment(1, 1, "Comment content")).rejects.toThrow(CommentNotOwnedError);
        });

        test("Should edit comment when comment exists and user owns comment", async () => {
            commentRepositoryMock.exist.mockReturnValueOnce(true);
            const commentEntityMock = makeCommentEntityMock();
            commentRepositoryMock.findOne.mockReturnValueOnce(commentEntityMock);
            commentRepositoryMock.update.mockReturnValueOnce(commentEntityMock);

            await commentService.updateComment(1, 1, "Comment content");

            expect(commentRepositoryMock.update).toHaveBeenCalledWith(commentEntityMock.Id, {Content: "Comment content", Edited: true});
        });
    });

    describe("Delete Comment", () => {
        test("Should throw error when comment does not exist", async () => {
            commentRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(commentService.deleteComment(1, 1)).rejects.toThrow(CommentNotFoundError);
        });

        test("Should throw error when user does not own comment", async () => {
            commentRepositoryMock.exist.mockReturnValueOnce(true);
            commentRepositoryMock.findOne.mockReturnValueOnce(makeCommentEntityMock({UserId: 2}));

            await expect(commentService.deleteComment(1, 1)).rejects.toThrow(CommentNotOwnedError);
        });

        test("Should delete comment when comment exists and user owns comment", async () => {
            commentRepositoryMock.exist.mockReturnValueOnce(true);
            const commentEntityMock = makeCommentEntityMock();
            commentRepositoryMock.findOne.mockReturnValueOnce(commentEntityMock);
            commentRepositoryMock.update.mockReturnValueOnce(commentEntityMock);

            await commentService.deleteComment(1, 1);

            expect(commentRepositoryMock.update).toHaveBeenCalledWith(commentEntityMock.Id, {DeletedAt: expect.any(Date), UserId: null, Content: "Comment deleted"});
        });
    });
});