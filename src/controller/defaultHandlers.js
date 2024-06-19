import { ApiError } from "../error/error.js";

export const defaultHandlers = {
  async get(req, res, next, dbHandler) {
    let { max, order, ...filter } = req.query || {};
    let params = { where: filter };
    if (max) params.limit = Number(max);
    if (order) {
      order = order.toUpperCase();
      if (order.match(/^DESC/)) order = "DESC";
      else order = "ASC";
      params.order = [["id", order]];
    }

    try {
      return await dbHandler(params);
    } catch (err) {
      return next(ApiError.badRequest(err.message));
    }
  },

  async create(req, res, next, model) {
    let { createdAt, updatedAt, ...attributes } = model.getAttributes();
    let fields = {},
      errors = [];

    Object.values(attributes).forEach((value) => {
      if (value.allowNull === false && !req.body[value.fieldName])
        errors.push(value.fieldName);
      else if (!value.autoIncrement)
        fields[value.fieldName] = req.body[value.fieldName];
    });

    if (errors.length)
      return next(
        ApiError.badRequest(
          `Error when creating a new entry. Missing attributes: ${errors.toString()}`
        )
      );
    try {
      return await model.create(fields);
    } catch (err) {
      return next(ApiError.badRequest(err.message));
    }
  },

  async update(req, res, next, model) {
    let { id, createdAt, updatedAt, ...attributes } = req.body || {};
    if (!id)
      return next(
        ApiError.badRequest(
          `Error when editing an entry. Missing attribute 'id'`
        )
      );

    return await model.update(attributes, { where: { id } });
  },

  async delete(req, res, next, model) {
    let id = req.query.id ? Number(req.query.id) : null;
    if (!id)
      return next(
        ApiError.badRequest(
          `Error when deleting an entry. Missing attribute 'id'. Note that this API uses query attributes for 'delete' method`
        )
      );

    let response = await model.destroy({ where: { id } });
    if (!response)
      return next(ApiError.badRequest(`entry with 'id'= ${id} not found`));
    return response;
  },
};
