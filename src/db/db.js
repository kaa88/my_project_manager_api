import { eq } from "drizzle-orm";
import instance from "./init.js";
import {
  checkDbQueryProps,
  getDbPaginationProps,
  getDbWhereProps,
} from "./queryProps.js";
import { getModelName } from "./utils.js";

export const db = {
  async create({ model, values }) {
    checkDbQueryProps({ model, values });

    const response = await instance.insert(model).values(values).returning();
    return response[0];
  },

  async update({ model, values, id }) {
    checkDbQueryProps({ model, values, id });

    const response = await instance
      .update(model)
      .set(values)
      .where(eq(model.id, id))
      .returning();
    return response[0];
  },

  async delete({ model, id }) {
    checkDbQueryProps({ model, id });

    const response = await instance
      .delete(model)
      .where(eq(model.id, id))
      .returning();
    return response[0];
  },

  async findOne({ model, query }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = getDbWhereProps({ model, query });

    return await instance.query[modelName].findFirst(dbQuery);
  },

  async findMany({ model, query }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const dbQuery = {
      ...getDbPaginationProps({ model, query }),
      ...getDbWhereProps({ model, query }),
    };

    const totalItems = await this.count({ model, query });
    let response;
    if (totalItems) {
      response = await instance.query[modelName].findMany(dbQuery);
    }
    return {
      items: response || [],
      total: totalItems,
    };
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
};
