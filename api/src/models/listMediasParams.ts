export interface ListMediasParams {
    name: String | undefined
    genres: String | undefined
    year: number | undefined
    minVoteAverage: number | undefined
    maxVoteAverage: number | undefined
    minVoteCount: number | undefined
    maxVoteCount: number | undefined
    page: number
}