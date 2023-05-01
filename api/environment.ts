import * as dotenv from "dotenv";

dotenv.config();

export default {
    TMDB_KEY: process.env.TMDB_AUTH_KEY ?? "",
    TMDB_URL: process.env.TMDB_URL ?? "",
    TMDB_IMAGE_URL: process.env.TMDB_IMAGE_URL ?? "",
    DB_HOST: process.env.DB_HOST ?? "",
    DB_NAME: process.env.DB_NAME ?? "",
    DB_PORT: parseInt(process.env.DB_PORT ?? "0"),
    DB_USER: process.env.DB_USER ?? "",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
};
