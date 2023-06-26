import axios, { AxiosError } from "axios";
import env from "../../environment";

import { TMDBMedia, TMDBMediaParser } from "../models/tmdbMedia";
import { HttpUtils } from "../utils/httpUtils";
import { ValidationUtils } from "../utils/validationUtils";
import { ListMediasParams } from "../models/listMediasParams";

import TMDBRepository from "../repositories/tmdbRepository";

export default class TMDBService {
    private tmdbRepository: TMDBRepository;

    constructor(tmdbRepository: TMDBRepository) {
        this.tmdbRepository = tmdbRepository;
    }

    public async list(
        params: ListMediasParams,
        includeMovies: boolean,
        includeTvShows: boolean
    ) {
        let medias: TMDBMedia[] = [];

        if (includeTvShows) {
            medias = medias.concat(await this.tmdbRepository.listTvShows(params));
        }

        if (includeMovies) {
            medias = medias.concat(await this.tmdbRepository.listMovies(params));
        }

        return medias.sort((a, b) => b.popularity - a.popularity);
    }
}
