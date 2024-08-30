import { PaginationParams } from "../shared/mappers/pagination.js";
import { isObject } from "../shared/utils/utils.js";
import { ApiError } from "./error/index.js";

function queryParserMiddleware(req, res, next) {
  try {
    // console.log("req.api:", req.api);

    // req.api = {
    //   // pagination: new PaginationParams(req.query), // ? нужен только в findAll
    //   query: {
    //     ...req.query,
    //     ...req.params,
    //     creatorId: req.user.userId || req.query.creatorId,
    //     projectId: req.user.projectId || req.query.projectId,
    //     boardId: req.user.boardId || req.query.boardId,
    //   }, // + cookies projectId boardId from $user
    //   shortQuery: {}, // изначально пустой... т.е. на каждом этапе не убирать, а добавлять id в пустой query
    //   search: {},
    //   values: { ...req.body },
    //   // errors: [] // на будущее - накопитель ошибок
    // };

    // req.$pagination = new PaginationParams(req.query);
    // req.$query = { ...req.query, ...req.params }; // + cookies projectId boardId from $user
    // req.$search = {};
    // req.$values = req.body;

    // Object.entries(req).forEach(([key, value]) => {
    //   console.log(key, typeof value === "object" ? "object" : value);
    // });

    next();
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
}

export default queryParserMiddleware;
