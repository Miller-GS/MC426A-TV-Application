import { Repository } from "typeorm";
import { WatchListEntity, WatchListPrivacyType } from "../entity/watchList.entity";
import { WatchListItemEntity } from "../entity/watchListItem.entity";
import { UserNotExistsError } from "../errors/UserNotExistsError";
import { UserEntity } from "../entity/user.entity";
import { ValidationUtils } from "../utils/validationUtils";
import { EmptyWatchListTitleError } from "../errors/EmptyWatchListTitleError";
import { EmptyWatchListDescriptionError } from "../errors/EmptyWatchListDescriptionError";

export default class WatchListService {
    private watchListRepository: Repository<WatchListEntity>;
    private watchListItemRepository: Repository<WatchListItemEntity>;
    private userRepository: Repository<UserEntity>;

    public constructor(
        watchListRepository: Repository<WatchListEntity>,
        watchListItemRepository: Repository<WatchListItemEntity>,
        userRepository: Repository<UserEntity>,
    ) {
        this.watchListRepository = watchListRepository;
        this.watchListItemRepository = watchListItemRepository;
        this.userRepository = userRepository;
    }

    public async createWatchList(userId: number, title: string, description: string, privacyType: WatchListPrivacyType) {
        if (ValidationUtils.isEmpty(title))
            throw new EmptyWatchListTitleError();
        if (ValidationUtils.isEmpty(description))
            throw new EmptyWatchListDescriptionError();
        
        const userExists = await this.userRepository.exist({
            where: { Id: userId },
        });

        if (!userExists)
            throw new UserNotExistsError();

        const watchList = await this.watchListRepository.save({
            User: {
                Id: userId,
            },
            Title: title,
            Description: description,
            PrivacyType: privacyType,
        } as unknown as WatchListEntity);

        return watchList;
    }
}