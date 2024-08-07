import { count, eq, gte, sql } from "drizzle-orm";
import instance from "./init.js";
import {
  checkDbQueryProps,
  getDbPaginationProps,
  getDbWhereProps,
} from "./dbProps.js";
import { getModelName } from "./utils.js";

export const db = {
  async create({ model, values }) {
    checkDbQueryProps({ model, values });

    return await instance.insert(model).values(values).returning();
  },

  async update({ model, values, id }) {
    checkDbQueryProps({ model, values, id });

    return await instance
      .update(model)
      .set(values)
      .where(eq(model.id, id))
      .returning();
  },

  async delete({ model, id }) {
    checkDbQueryProps({ model, id });

    return await instance.delete(model).where(eq(model.id, id)).returning();
  },

  async findMany({ model, query, customChunks = [] }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const correctQuery = {
      ...getDbPaginationProps({ query, model }),
      ...getDbWhereProps({ query, model, customChunks }),
    };

    return await instance.query[modelName].findMany(correctQuery);
  },

  async findOne({ model, query }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);

    return await instance.query[modelName].findFirst(query);
  },
  // async findMany({ model, query }) {
  //   return await find({ model, query });
  // },

  // async findOne({ model, query }) {
  //   return await find({ model, query }, true);
  // },

  async count({ model, query, customChunks = [] }) {
    checkDbQueryProps({ model, query });

    const modelName = getModelName(model, instance);
    const correctQuery = {
      ...getDbWhereProps({ query, model, customChunks }),
      columns: { id: true },
      // limit: 0,
      // offset: 0,
    };

    const response = await instance.query[modelName].findMany(correctQuery);
    return response.length;

    // const response = await find({
    //   model,
    //   query: { ...query, limit: 0, offset: 0, columns: { id: true } },
    // });
  },
};

// const find = async ({ model, query }, one) => {
//   checkDbQueryProps({ model, query });

//   const modelName = getModelName(model, instance);

//   return await instance.query[modelName][one ? "findFirst" : "findMany"](query);
// return await instance
//   .select([count(model.id)])
//   .from(model)
//   .groupBy(model.id);

//   return await instance.execute(sql`WITH first_10_rows AS (
//     SELECT *
//     FROM ${model}
//     ORDER BY "id"
//     LIMIT 10
// )
//     SELECT *,
//        COUNT(*) OVER() AS total_count
// FROM first_10_rows;
// `);
// };
