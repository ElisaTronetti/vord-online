const okResponse = (res, json) => res.status(200).json(json);

const conflictError = (res, json) => res.status(409).json(json);

const internalServerError = (res, json) => res.status(500).json({ message: json || 'Internal Server Error' });

module.exports = {
    OkResponse: okResponse,
    ConflictError: conflictError,
    ServerError: internalServerError,
}