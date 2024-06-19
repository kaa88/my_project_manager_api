import { defaultHandlers } from "./defaultHandlers.js";
import { controllerCheck } from "./controllerCheck.js";

export const defaultControllerKeys = ["get", "create", "update", "delete"]; // Object.keys(defaultController); // ?

export const getDefaultController = (model) => {
  return {
    async get(req, res, next) {
      return res.json(await defaultHandlers.get(...arguments, model));
    },
    // async create(req, res, next) {
    //   const { error } = controllerCheck(req, res, next);
    //   if (error) return error;
    //   return res.json(await defaultHandlers.create(req, res, next, model));
    // },
    // async update(req, res, next) {
    //   const { error } = controllerCheck(req, res, next);
    //   if (error) return error;
    //   return res.json(await defaultHandlers.update(req, res, next, model));
    // },
    create: withCheck(defaultHandlers.create, model),
    update: withCheck(defaultHandlers.update, model),
    delete: withCheck(defaultHandlers.delete, model),
    // async delete(req, res, next) {
    //   const { error } = controllerCheck(req, res, next);
    //   if (error) return error;
    //   return res.json(await defaultHandlers.delete(req, res, next, model));
    // },
  };
};

const withCheck = (handler, model) => async (req, res, next) => {
  const { error } = controllerCheck(req, res, next);
  if (error) return error;
  return res.json(await handler(req, res, next, model));
};
