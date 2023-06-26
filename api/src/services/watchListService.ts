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

export default class WatchListService {
    private watchListRepository: Repository<WatchListEntity>;
    private watchListItemRepository: Repository<WatchListItemEntity>;
    private userRepository: Repository<UserEntity>;
    private mediaRepository: Repository<MediaEntity>;

    public constructor(
        watchListRepository: Repository<WatchListEntity>,
        watchListItemRepository: Repository<WatchListItemEntity>,
        userRepository: Repository<UserEntity>,
        mediaRepository: Repository<MediaEntity>
    ) {
        this.watchListRepository = watchListRepository;
        this.watchListItemRepository = watchListItemRepository;
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
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
}
