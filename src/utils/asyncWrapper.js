export default function asyncWrapper (asyncFunction) {
    return async (request, response, next) => {
        try {
            await asyncFunction(request, response);
        } catch (error) {
            next(error)
        }
    }
}