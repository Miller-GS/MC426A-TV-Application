import { Repository } from "typeorm";
import {
    WatchListEntity,
    WatchListPrivacyType,
} from "../entity/watchList.entity";
import { WatchListItemEntity } from "../entity/watchListItem.entity";
import { UserNotExistsError } from "../errors/UserNotExistsError";
import { UserEntity } from "../entity/user.entity";
import { ValidationUtils } from "../utils/validationUtils";
import { EmptyWatchListTitleError } from "../errors/EmptyWatchListTitleError";
import { EmptyWatchListDescriptionError } from "../errors/EmptyWatchListDescriptionError";
import { WatchListNotFoundError } from "../errors/WatchListNotFoundError";
import { MediaEntity } from "../entity/media.entity";
import { WatchListNotOwnedError } from "../errors/WatchListNotOwnedError";
import { MediaNotFoundError } from "../errors/MediaNotFoundError";
import { WatchListParser } from "../models/watchList";
import TMDBRepository from "../repositories/tmdbRepository";
import { FriendshipEntity } from "../entity/friendship.entity";

export default class WatchListService {
    private watchListRepository: Repository<WatchListEntity>;
    private watchListItemRepository: Repository<WatchListItemEntity>;
    private userRepository: Repository<UserEntity>;
    private mediaRepository: Repository<MediaEntity>;
    private tmdbRepository: TMDBRepository;
    private friendshipRepository: Repository<FriendshipEntity>;

    public constructor(
        watchListRepository: Repository<WatchListEntity>,
        watchListItemRepository: Repository<WatchListItemEntity>,
        userRepository: Repository<UserEntity>,
        mediaRepository: Repository<MediaEntity>,
        tmdbRepository: TMDBRepository,
        friendshipRepository: Repository<FriendshipEntity>
    ) {
        this.watchListRepository = watchListRepository;
        this.watchListItemRepository = watchListItemRepository;
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
        this.tmdbRepository = tmdbRepository;
        this.friendshipRepository = friendshipRepository;
    }

    private async checkUserExists(userId: number) {
        const userExists = await this.userRepository.exist({
            where: { Id: userId },
        });

        return userExists;
    }

    public async createWatchList(
        userId: number,
        title: string,
        description: string,
        privacyType: WatchListPrivacyType
    ) {
        if (ValidationUtils.isEmpty(title))
            throw new EmptyWatchListTitleError();
        if (ValidationUtils.isEmpty(description))
            throw new EmptyWatchListDescriptionError();

        if (!(await this.checkUserExists(userId)))
            throw new UserNotExistsError();

        const watchList = await this.watchListRepository.save({
            Owner: {
                Id: userId,
            },
            Title: title,
            Description: description,
            PrivacyType: privacyType,
        } as WatchListEntity);

        return watchList;
    }

    public async addWatchListItems(
        userId: number,
        watchListId: number,
        mediaIds: number[]
    ) {
        await this.validateAddWatchListItemsArguments(userId, watchListId);
        const promises = mediaIds.map((mediaId) =>
            this.saveMediaIntoWatchList(watchListId, mediaId)
        );
        return await Promise.all(promises);
    }

    public async getWatchListItems(
        userId: number | undefined,
        watchListId: number
    ) {
        if (userId && !(await this.checkUserExists(userId))) {
            throw new UserNotExistsError();
        }

        const watchList = await this.watchListRepository.findOne({
            where: { Id: watchListId },
            relations: ["Owner", "WatchListItems", "WatchListItems.Media"],
        });
        if (!watchList) throw new WatchListNotFoundError();

        const isOwner = watchList.Owner.Id === userId;
        const isFriend = await ValidationUtils.areFriends(
            this.friendshipRepository,
            watchList.Owner.Id,
            userId
        );

        if (!isOwner && watchList.PrivacyType == WatchListPrivacyType.PRIVATE)
            throw new WatchListNotFoundError();
        if (
            !isOwner &&
            !isFriend &&
            watchList.PrivacyType == WatchListPrivacyType.FRIENDS_ONLY
        )
            throw new WatchListNotFoundError();

        return WatchListParser.parseWatchList(watchList, this.tmdbRepository);
    }

    private async validateAddWatchListItemsArguments(
        userId: number,
        watchListId: number
    ) {
        if (!(await this.checkUserExists(userId)))
            throw new UserNotExistsError();

        const watchList = await this.watchListRepository.findOne({
            where: { Id: watchListId },
            relations: ["Owner"],
        });
        if (!watchList) throw new WatchListNotFoundError();

        if (watchList.Owner.Id !== userId) throw new WatchListNotOwnedError();
    }

    private async saveMediaIntoWatchList(watchListId: number, mediaId: number) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) throw new MediaNotFoundError();

        const watchListItemExists = await this.watchListItemRepository.exist({
            where: {
                WatchList: { Id: watchListId },
                Media: { Id: mediaId },
            },
        });

        if (watchListItemExists) return;

        return await this.watchListItemRepository.save({
            WatchList: {
                Id: watchListId,
            },
            Media: {
                Id: mediaId,
            },
        } as WatchListItemEntity);
    }

    private createWatchListEntity(
        id: number,
        title: string,
        description: string,
        privacyType: WatchListPrivacyType
    ) {
        const watchListEntity = {
            Id: id,
            Title: title,
            Description: description,
            PrivacyType: privacyType,
        };

        Object.keys(watchListEntity).forEach(
            (key) =>
                ValidationUtils.isNull(watchListEntity[key]) &&
                delete watchListEntity[key]
        );

        return watchListEntity;
    }

    public async updateWatchList(
        userId: number,
        watchListId: number,
        title: string,
        description: string,
        privacyType: WatchListPrivacyType
    ) {
        await this.validateAddWatchListItemsArguments(userId, watchListId);

        const watchListEntity = this.createWatchListEntity(
            watchListId,
            title,
            description,
            privacyType
        );

        const watchList = await this.watchListRepository.save(watchListEntity);
        return watchList;
    }

    private async removeMediaFromWatchList(
        watchListId: number,
        mediaId: number
    ) {
        const mediaExists = await this.mediaRepository.exist({
            where: { Id: mediaId },
        });
        if (!mediaExists) throw new MediaNotFoundError();

        const watchListItemExists = await this.watchListItemRepository.exist({
            where: {
                WatchList: { Id: watchListId },
                Media: { Id: mediaId },
            },
        });

        if (!watchListItemExists) return;

        await this.watchListItemRepository.delete({
            WatchList: {
                Id: watchListId,
            },
            Media: {
                Id: mediaId,
            },
        });
    }

    public async removeWatchListItems(
        userId: number,
        watchListId: number,
        mediaIds: number[]
    ) {
        await this.validateAddWatchListItemsArguments(userId, watchListId);
        const promises = mediaIds.map((mediaId) =>
            this.removeMediaFromWatchList(watchListId, mediaId)
        );
        return await Promise.all(promises);
    }

    public async deleteWatchList(userId: number, watchListId: number) {
        await this.validateAddWatchListItemsArguments(userId, watchListId);
        this.watchListRepository.delete(watchListId);
    }
}
