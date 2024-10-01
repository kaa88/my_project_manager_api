import instance from "./init.js";
import { checkDbQueryProps } from "./propsCheck.js";
import {
  getDbPaginationProps,
  getDbWhereProps,
  getDbFieldSelectProps,
} from "./queryProps.js";
import { getModelName } from "./utils.js";
import { getSerialId } from "../shared/utils/utils.js";

export const db = {
  async create({ model, values }) {
    checkDbQueryProps({ model, values });

    const response = await instance.insert(model).values(values).returning();
    return response[0];
  },

  async update({ model, query, values, equal }) {
    checkDbQueryProps({ model, query, values });

    const dbQuery = getDbWhereProps({ model, query, equal }, true);

    const response = await instance
      .update(model)
      .set(values)
      .where(dbQuery.where)
      .returning();
    return response[0];
  },

  async delete({ model, query, equal }) {
    checkDbQueryProps({ model, query });

    const dbQuery = getDbWhereProps({ model, query, equal }, true);

    const response = await instance
      .delete(model)
      .where(dbQuery.where)
      .returning(model.id ? { id: model.id } : undefined);
    return response[0];
  },

  async findOne({ model, query, equal }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbWhereProps({ model, query, equal }, true),
      ...getDbFieldSelectProps({ model, query }, true),
    };

    return await instance.query[modelName].findFirst(dbQuery);
  },

  async findMany({ model, query, count = true }) {
    checkDbQueryProps({ model, query });
    let response = [];
    let totalItems = 0;
    if (count) totalItems = await this.count({ model, query }, true);

    if ((count && totalItems) || !count) {
      const modelName = getModelName(model, instance);
      const dbQuery = {
        ...getDbPaginationProps({ model, query }, true),
        ...getDbWhereProps({ model, query }, true),
        ...getDbFieldSelectProps({ model, query }, true),
      };

      response = await instance.query[modelName].findMany(dbQuery);
    }
    return { items: response, total: totalItems };
  },

  async count({ model, query }, propsChecked) {
    if (!propsChecked) checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbWhereProps({ model, query }, true),
      limit: 0,
      offset: 0,
    };
    if (model.id) dbQuery.columns = { id: true };

    const response = await instance.query[modelName].findMany(dbQuery);
    return response.length;
  },

  async generateId({ model, query, idName = "id" }, propsChecked) {
    if (!propsChecked) checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbWhereProps({ model, query }, true),
      limit: 0,
      offset: 0,
    };
    if (model[idName]) dbQuery.columns = { [idName]: true };

    const response = await instance.query[modelName].findMany(dbQuery);
    return getSerialId(response.map((item) => item.id));
  },
};
