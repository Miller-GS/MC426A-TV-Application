import * as dotenv from 'dotenv';

dotenv.config();

export default {
    TMDB_KEY: process.env.TMDB_AUTH_KEY ?? '',
    TMDB_URL: process.env.TMDB_URL ?? ''
}