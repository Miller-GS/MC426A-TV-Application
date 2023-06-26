import TMDBRepository from "../repositories/tmdbRepository";
import { TMDBMedia } from "./tmdbMedia";

export interface WatchList {
    id: number;
    title: string;
    description: string;
    privacyType: string;
    items: WatchListItem[];
}

export interface WatchListItem {
    id: number;
    media: TMDBMedia;
}

export class WatchListParser {
    static async parseWatchList(
        watchListObj: any,
        tmdbRepository: TMDBRepository
    ) {
        const watchList: WatchList = {
            id: watchListObj.Id,
            title: watchListObj.Title,
            description: watchListObj.Description,
            privacyType: watchListObj.PrivacyType,
            items: [],
        };

        for (const item of watchListObj.WatchListItems) {
            const watchListItem: WatchListItem = {
                id: item.Id,
                media: await tmdbRepository.getMedia(
                    item.Media.ExternalId,
                    item.Media.Type
                ),
            };

            watchList.items.push(watchListItem);
        }

        return watchList;
    }
}
