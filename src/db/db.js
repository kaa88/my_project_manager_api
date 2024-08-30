import instance from "./init.js";
import {
  checkDbQueryProps,
  getDbPaginationProps,
  getDbWhereProps,
  getDbWithProps,
} from "./queryProps.js";
import { getModelName } from "./utils.js";
import { getSerialId } from "../shared/utils/utils.js";

export const db = {
  async create({ model, values }) {
    checkDbQueryProps({ model, values });

    const response = await instance.insert(model).values(values).returning();
    return response[0];
  },

  async update({ model, query, values }) {
    checkDbQueryProps({ model, query, values });

    const dbQuery = getDbWhereProps({ model, query });

    const response = await instance
      .update(model)
      .set(values)
      .where(dbQuery.where)
      .returning();
    return response[0];
  },

  async delete({ model, query }) {
    checkDbQueryProps({ model, query });

    const dbQuery = getDbWhereProps({ model, query });

    const response = await instance
      .delete(model)
      .where(dbQuery.where)
      .returning({ id: model.id });
    return response[0];
  },

  async findOne({ model, query, related }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbWhereProps({ model, query }),
      ...getDbWithProps(related),
    };

    return await instance.query[modelName].findFirst(dbQuery);
  },

  async findMany({ model, query, related }) {
    // checkDbQueryProps({ model, query });
    const totalItems = await this.count({ model, query });
    let response = [];

    if (totalItems) {
      const modelName = getModelName(model, instance);
      const dbQuery = {
        ...getDbPaginationProps({ model, query }),
        ...getDbWhereProps({ model, query }),
        ...getDbWithProps(related),
      };

      response = await instance.query[modelName].findMany(dbQuery);
    }
    return { items: response, total: totalItems };
  },

  async count({ model, query }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbWhereProps({ model, query }),
      columns: { id: true },
      limit: 0,
      offset: 0,
    };

    const response = await instance.query[modelName].findMany(dbQuery);
    return response.length;
  },

  async generateId({ model, query }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbWhereProps({ model, query }),
      columns: { id: true },
      limit: 0,
      offset: 0,
    };

    const response = await instance.query[modelName].findMany(dbQuery);
    return getSerialId(response);
  },
};
