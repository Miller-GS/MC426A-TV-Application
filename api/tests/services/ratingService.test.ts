import { MediaNotFoundError } from "../../src/errors/MediaNotFoundError";
import RatingService from "../../src/services/ratingService";
import { DuplicatedRatingError } from "../../src/errors/DuplicatedRatingError";
import { RatingNotFoundError } from "../../src/errors/RatingNotFoundError";
import { RatingNotOwnedError } from "../../src/errors/RatingNotOwnedError";

const makeRatingEntityMock = (entity = {} as any) => {
    return {
        Id: entity.Id || 1,
        UserId: entity.UserId || 1,
        MediaId: entity.MediaId || 1,
        Rating: entity.Rating || 0,
        Review: entity.Contant || "Review content",
        DeletedAt: entity.DeletedAt || null,
    };
};

describe("Rating Service", () => {
    let ratingService: RatingService;
    let ratingRepositoryMock: any;
    let mediaRepositoryMock: any;

    beforeEach(() => {
        ratingRepositoryMock = {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            exist: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    addSelect: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            getRawOne: jest.fn(),
                        }),
                    }),
                }),
            }),
        };

        mediaRepositoryMock = {
            exist: jest.fn(),
        };

        ratingService = new RatingService(
            ratingRepositoryMock,
            mediaRepositoryMock
        );
    });

    describe("List Ratings", () => {
        test("Should return empty list when media exists but has no ratings", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            ratingRepositoryMock.find.mockReturnValueOnce([]);

            const response = await ratingService.listRatings(1);

            expect(response).toEqual([]);
        });

        test("Should throw error when media does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(ratingService.listRatings(1)).rejects.toThrow(
                MediaNotFoundError
            );
        });

        test("Should return list of ratings when media exists and has ratings", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            const commentEntityMock = makeRatingEntityMock();

            ratingRepositoryMock.find.mockReturnValueOnce([commentEntityMock]);

            const response = await ratingService.listRatings(1);

            expect(ratingRepositoryMock.find).toBeCalledWith({
                where: { MediaId: 1 },
            });
            expect(response).toEqual([commentEntityMock]);
        });
    });

    describe("Create Rating", () => {
        test("Should throw MediaNotFoundError if media does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(
                ratingService.createRating(1, 1, 5, "")
            ).rejects.toThrow(MediaNotFoundError);
        });

        test("Should throw DuplicatedRatingError if rating already exists from this user to the media", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            ratingRepositoryMock.exist.mockReturnValueOnce(true);

            await expect(
                ratingService.createRating(1, 1, 5, "")
            ).rejects.toThrow(DuplicatedRatingError);

            expect(ratingRepositoryMock.exist).toBeCalledWith({
                where: { UserId: 1, MediaId: 1 },
            });
        });

        test("Should succeed if media exists and rating is not duplicated", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            ratingRepositoryMock.exist.mockReturnValueOnce(false);
            ratingRepositoryMock.save.mockReturnValueOnce({});

            await ratingService.createRating(1, 1, 5, "");

            expect(ratingRepositoryMock.save).toBeCalledWith({
                UserId: 1,
                MediaId: 1,
                Rating: 5,
                Review: "",
            });
        });
    });

    describe("Update Rating", () => {
        test("Should throw RatingNotFoundError if rating does not exist", async () => {
            ratingRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(
                ratingService.updateRating(1, 1, 5, "")
            ).rejects.toThrow(RatingNotFoundError);
        });

        test("Should throw RatingNotOwnedError if the rating does not belong to the logged user", async () => {
            ratingRepositoryMock.findOne.mockReturnValueOnce(
                makeRatingEntityMock()
            );

            await expect(
                ratingService.updateRating(500, 1, 5, "")
            ).rejects.toThrow(RatingNotOwnedError);
        });

        test("Should update rating successfully", async () => {
            ratingRepositoryMock.findOne.mockReturnValueOnce(
                makeRatingEntityMock()
            );

            await ratingService.updateRating(1, 1, 5, "");

            expect(ratingRepositoryMock.update).toBeCalledWith(1, {
                Review: "",
                Rating: 5,
            });
        });
    });

    describe("Delete Rating", () => {
        test("Should throw RatingNotFoundError if rating does not exist", async () => {
            ratingRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(ratingService.deleteRating(1, 1)).rejects.toThrow(
                RatingNotFoundError
            );
        });

        test("Should throw RatingNotOwnedError if the rating does not belong to the logged user", async () => {
            ratingRepositoryMock.findOne.mockReturnValueOnce(
                makeRatingEntityMock()
            );

            await expect(ratingService.deleteRating(500, 1)).rejects.toThrow(
                RatingNotOwnedError
            );
        });

        test("Should delete rating successfully", async () => {
            ratingRepositoryMock.findOne.mockReturnValueOnce(
                makeRatingEntityMock()
            );

            await ratingService.deleteRating(1, 1);

            expect(ratingRepositoryMock.delete).toBeCalledWith(1);
        });
    });

    describe("Get User Rating", () => {
        test("Should throw MediaNotFoundError if media does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(ratingService.getUserRating(1, 1)).rejects.toThrow(
                MediaNotFoundError
            );
        });

        test("Should get user's rating successfully", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            ratingRepositoryMock.findOne.mockReturnValueOnce(
                makeRatingEntityMock()
            );

            const response = await ratingService.getUserRating(1, 1);

            expect(response).toEqual(makeRatingEntityMock());

            expect(ratingRepositoryMock.findOne).toBeCalledWith({
                where: { UserId: 1, MediaId: 1 },
            });
        });
    });

    describe("Get Media Average Rating", () => {
        test("Should throw MediaNotFoundError if media does not exist", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(false);

            await expect(ratingService.getMediaAvgRating(1)).rejects.toThrow(
                MediaNotFoundError
            );
        });

        test("Should get media's average rating successfully", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            ratingRepositoryMock
                .createQueryBuilder()
                .select()
                .addSelect()
                .where()
                .getRawOne.mockReturnValueOnce({
                    avgRating: 7,
                    ratingsCount: 3,
                });

            const response = await ratingService.getMediaAvgRating(1);

            expect(response).toEqual({
                avgRating: 7,
                ratingsCount: 3,
            });
        });

        test("Should get media's average rating successfully replacing empty values", async () => {
            mediaRepositoryMock.exist.mockReturnValueOnce(true);
            ratingRepositoryMock
                .createQueryBuilder()
                .select()
                .addSelect()
                .where()
                .getRawOne.mockReturnValueOnce({
                    avgRating: null,
                    ratingsCount: "",
                });

            const response = await ratingService.getMediaAvgRating(1);

            expect(response).toEqual({
                avgRating: 0,
                ratingsCount: 0,
            });
        });
    });
});
