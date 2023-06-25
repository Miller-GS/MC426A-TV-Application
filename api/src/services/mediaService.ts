import axios, { AxiosError } from "axios";
import env from "../../environment";
import { Repository } from "typeorm";

import { MediaEntity } from "../entity/media.entity";
import { TMDBMedia, TMDBMediaParser, MediaTypeEnum } from "../models/tmdbMedia";
import { HttpUtils } from "../utils/httpUtils";
import { ValidationUtils } from "../utils/validationUtils";
import { ListMediasParams } from "../models/listMediasParams";
import { MediaNotFoundError } from "../errors/MediaNotFoundError";

export default class MediaService {
    private mediaRepository: any;

    constructor(mediaRepository: Repository<MediaEntity>) {
        this.mediaRepository = mediaRepository;
    }

    protected async get(path: String, params: Object) {
        params = HttpUtils.buildQuery({ ...params, api_key: env.TMDB_KEY });

        const url = env.TMDB_URL + path + "?" + params;

        const response = await axios.get(url);

        return response.data;
    }

    private async listMovies(params: ListMediasParams) {
        let data: Object[] = [];

        if (!ValidationUtils.isEmpty(params.name)) {
            data = (await this.get("/search/movie", {
                query: params.name,
                year: params.year,
                page: params.page,
            })).results;
        } else {
            data = (await this.get("/discover/movie", {
                with_genres: params.genres,
                year: params.year,
                sort_by: "popularity.desc",
                page: params.page,
                "vote_average.gte": params.minVoteAverage,
                "vote_average.lte": params.maxVoteAverage,
                "vote_count.gte": params.minVoteCount,
                "vote_count.lte": params.maxVoteCount,
            })).results;
        }

        const response: TMDBMedia[] = data.map(TMDBMediaParser.parseMovie);

        return response;
    }

    private async listTvShows(params: ListMediasParams) {
        let data: Object[] = [];

        if (!ValidationUtils.isEmpty(params.name)) {
            data = (await this.get("/search/tv", {
                query: params.name,
                first_air_date_year: params.year,
                page: params.page,
            })).results;
        } else {
            data = (await this.get("/discover/tv", {
                with_genres: params.genres,
                first_air_date_year: params.year,
                sort_by: "popularity.desc",
                page: params.page,
                "vote_average.gte": params.minVoteAverage,
                "vote_average.lte": params.maxVoteAverage,
                "vote_count.gte": params.minVoteCount,
                "vote_count.lte": params.maxVoteCount,
            })).results;
        }

        const response: TMDBMedia[] = data.map(TMDBMediaParser.parseTv);

        return response;
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

    public async list(
        params: ListMediasParams,
        includeMovies: boolean,
        includeTvShows: boolean
    ) {
        let medias: TMDBMedia[] = [];

        if (includeTvShows) {
            medias = medias.concat(await this.listTvShows(params));
        }

        if (includeMovies) {
            medias = medias.concat(await this.listMovies(params));
        }
        await this.getInternalIds(medias);

        return medias.sort((a, b) => b.popularity - a.popularity);
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
        console.log(internalMedia);

        if (internalMedia.Type == MediaTypeEnum.MOVIE) {
            const tmdbMedia = await this.get("/movie/" + internalMedia.ExternalId, {});
            tmdbMedia.id = internalMedia.Id;
            return TMDBMediaParser.parseMovie(tmdbMedia);
        }
        if (internalMedia.Type == MediaTypeEnum.TV) {
            const tmdbMedia = await this.get("/tv/" + internalMedia.ExternalId, {});
            tmdbMedia.id = internalMedia.Id;
            return TMDBMediaParser.parseTv(tmdbMedia);
        }
    }
}
