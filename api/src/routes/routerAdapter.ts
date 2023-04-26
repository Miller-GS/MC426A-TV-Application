export const adaptRoute = (callback) => {
    return async (request, response) => {

        const httpResponse = await callback(request, response)
        return httpResponse
    }
}