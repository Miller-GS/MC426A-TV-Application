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

export default class WatchListService {
    private watchListRepository: Repository<WatchListEntity>;
    private watchListItemRepository: Repository<WatchListItemEntity>;
    private userRepository: Repository<UserEntity>;
    private mediaRepository: Repository<MediaEntity>;
    private tmdbRepository: TMDBRepository;

    public constructor(
        watchListRepository: Repository<WatchListEntity>,
        watchListItemRepository: Repository<WatchListItemEntity>,
        userRepository: Repository<UserEntity>,
        mediaRepository: Repository<MediaEntity>,
        tmdbRepository: TMDBRepository
    ) {
        this.watchListRepository = watchListRepository;
        this.watchListItemRepository = watchListItemRepository;
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
        this.tmdbRepository = tmdbRepository;
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

        const userExists = await this.userRepository.exist({
            where: { Id: userId },
        });

        if (!userExists) throw new UserNotExistsError();

        const watchList = await this.watchListRepository.save({
            Owner: {
                Id: userId,
            },
            Title: title,
            Description: description,
            PrivacyType: privacyType,
        } as unknown as WatchListEntity);

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

    public async getWatchListItems(userId: number | undefined, watchListId: number) {
        if (userId) {
            const userExists = await this.userRepository.exist({
                where: { Id: userId },
            });
            if (!userExists) throw new UserNotExistsError();
        }

        const watchList = await this.watchListRepository.findOne({
            where: { Id: watchListId },
            relations: ["Owner", "WatchListItems", "WatchListItems.Media"],
        });
        if (!watchList) throw new WatchListNotFoundError();

        const isOwner = watchList.Owner.Id === userId;
        const isFriend = true; // Insert friendship logic here

        if (!isOwner && watchList.PrivacyType == WatchListPrivacyType.PRIVATE)
            throw new WatchListNotFoundError();
        if (!isOwner && !isFriend && watchList.PrivacyType == WatchListPrivacyType.FRIENDS_ONLY)
            throw new WatchListNotFoundError();

        // return watchList;
        return WatchListParser.parseWatchList(watchList, this.tmdbRepository);
    };

    private async validateAddWatchListItemsArguments(
        userId: number,
        watchListId: number
    ) {
        const userExists = await this.userRepository.exist({
            where: { Id: userId },
        });
        if (!userExists) throw new UserNotExistsError();

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

        if (
            await this.watchListItemRepository.exist({
                where: { WatchList: { Id: watchListId }, Media: { Id: mediaId } },
            })
        )
            return;

        return await this.watchListItemRepository.save({
            WatchList: {
                Id: watchListId,
            },
            Media: {
                Id: mediaId,
            },
        } as WatchListItemEntity);
    }
}
