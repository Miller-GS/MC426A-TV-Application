import { MediaEntity } from "../entity/media.entity";
import { RatingEntity } from "../entity/rating.entity";
import { Repository } from "typeorm";
import { MediaNotFoundError } from "../errors/MediaNotFoundError";
import { RatingNotFoundError } from "../errors/RatingNotFoundError";
import { RatingNotOwnedError } from "../errors/RatingNotOwnedError";
import { DuplicatedRatingError } from "../errors/DuplicatedRatingError";

export default class RatingService {
    private ratingRepository: Repository<RatingEntity>;
    private mediaRepository: Repository<MediaEntity>;

    public constructor(
        ratingRepository: Repository<RatingEntity>,
        mediaRepository: Repository<MediaEntity>
    ) {
        this.ratingRepository = ratingRepository;
        this.mediaRepository = mediaRepository;
    }

    public async createRating(
        userId: number,
        mediaId: number,
        rating: number,
        review: string
    ) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) {
            throw new MediaNotFoundError();
        }

        const ratingExists = await this.ratingRepository.exist({
            where: { UserId: userId, MediaId: mediaId },
        });
        if (ratingExists) {
            throw new DuplicatedRatingError();
        }

        await this.ratingRepository.save({
            UserId: userId,
            MediaId: mediaId,
            Rating: rating,
            Review: review,
        });
    }

    public async updateRating(
        userId: number,
        ratingId: number,
        rating: number,
        review: string
    ) {
        const ratingEntity = await this.ratingRepository.findOne({
            where: { Id: ratingId },
        });
        if (!ratingEntity) {
            throw new RatingNotFoundError();
        }

        if (ratingEntity.UserId !== userId) {
            throw new RatingNotOwnedError();
        }

        await this.ratingRepository.update(ratingId, {
            Review: review,
            Rating: rating,
        });
    }

    public async deleteRating(
        userId: number,
        ratingId: number
    ) {
        const ratingEntity = await this.ratingRepository.findOne({
            where: { Id: ratingId },
        });
        if (!ratingEntity) {
            throw new RatingNotFoundError();
        }

        if (ratingEntity.UserId !== userId) {
            throw new RatingNotOwnedError();
        }

        await this.ratingRepository.delete(ratingId);
    }

    public async getUserRating(userId: number, mediaId: number) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) {
            throw new MediaNotFoundError();
        }

        return await this.ratingRepository.findOne({
            where: { UserId: userId, MediaId: mediaId },
        });
    }

    public async listRatings(mediaId: number) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) {
            throw new MediaNotFoundError();
        }

        return await this.ratingRepository.find({
            where: { MediaId: mediaId },
        });
    }
}
