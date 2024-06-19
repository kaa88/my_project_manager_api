import { ApiError } from "../../error/error.js";
// import { defaultController } from "./defaultController.js";
// import { reservation } from "../models/models.js";
// import UserService from "../services/UserService.js";
// import { getDefaultController } from "../../controller/defaultController.js";
import model from "../../db/db.js";
import { Entity, PaginationParams, SearchParams } from "./dto.js";

// export const controller = getDefaultController(model);

// get - одна таска по id // get(id) или get({id: ''})
// несколько тасок - либо пустой запрос (все), либо search query // get() или get({search: 'ищет во всех полях', createDate: 'ищет в одном'})

export const controller = {
  async get(req, res, next) {
    // query only
    const params = req.query;
    const paginationParams = new PaginationParams(params);
    const globalSearch = new SearchParams(params);
    const search = new Entity(params);
    const id = params.id;
    try {
      return await model.findAll({ where: search, attributes: globalSearch });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  },
  async create(req, res, next) {
    // query, body
    const params = req.body;
  },
  async update(req, res, next) {
    // query, body
    const params = req.body;
  },
  async delete(req, res, next) {
    // query only
    const params = req.query;
  },
};
