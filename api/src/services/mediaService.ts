import axios, { AxiosError } from "axios";
import env from "../../environment";
import { Repository } from "typeorm";

import { MediaEntity } from "../entity/media.entity";
import { TMDBMedia, TMDBMediaParser, MediaTypeEnum } from "../models/tmdbMedia";
import { HttpUtils } from "../utils/httpUtils";
import { ValidationUtils } from "../utils/validationUtils";
import { ListMediasParams } from "../models/listMediasParams";
import { MediaNotFoundError } from "../errors/MediaNotFoundError";
import TMDBRepository from "../repositories/tmdbRepository";

export default class MediaService {
    private mediaRepository: Repository<MediaEntity>;
    private tmdbRepository: TMDBRepository;

    constructor(
        mediaRepository: Repository<MediaEntity>,
        tmdbRepository: TMDBRepository
    ) {
        this.mediaRepository = mediaRepository;
        this.tmdbRepository = tmdbRepository;
    }

    public async list(
        params: ListMediasParams,
        includeMovies: boolean,
        includeTvShows: boolean
    ) {
        let medias: TMDBMedia[] = [];

        if (includeTvShows) {
            medias = medias.concat(
                await this.tmdbRepository.listTvShows(params)
            );
        }

        if (includeMovies) {
            medias = medias.concat(
                await this.tmdbRepository.listMovies(params)
            );
        }

        await this.getInternalIds(medias);

        return medias.sort((a, b) => b.popularity - a.popularity);
    }

    private async getInternalIds(tmdbMedias: TMDBMedia[]) {
        for (const tmdbMedia of tmdbMedias) {
            const internalMedia = await this.mediaRepository.findOne({
                where: {
                    ExternalId: tmdbMedia.externalId,
                    Type: tmdbMedia.mediaType,
                },
            });
            if (internalMedia) {
                tmdbMedia.id = internalMedia.Id;
            } else {
                const newMedia = await this.mediaRepository.save({
                    ExternalId: tmdbMedia.externalId,
                    Type: tmdbMedia.mediaType,
                });
                tmdbMedia.id = newMedia.Id;
            }
        }
    }

    public async getMedia(mediaId: number) {
        const internalMedia = await this.mediaRepository.findOne({
            where: {
                Id: mediaId,
            },
        });

        if (!internalMedia) {
            throw new MediaNotFoundError();
        }
        const media = await this.tmdbRepository.getMedia(
            internalMedia.ExternalId,
            internalMedia.Type
        );
        media.id = internalMedia.Id;
        return media;
    }
}
