import { count, eq, gte, sql } from "drizzle-orm";
import { checkDbQueryProps, getModelName } from "./generic.js";
import instance from "./init.js";

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

  async findMany({ model, query }) {
    return await find({ model, query });
  },

  async findOne({ model, query }) {
    return await find({ model, query }, true);
  },

  async count({ model, query }) {
    const response = await find({
      model,
      query: { ...query, limit: 0, offset: 0, columns: { id: true } },
    });
    return response.length;
  },
};

const find = async ({ model, query }, one) => {
  checkDbQueryProps({ model, query });

  const modelName = getModelName(model, instance);
  // return await instance.query[modelName][one ? "findFirst" : "findMany"](query);
  // return await instance
  //   .select([count(model.id)])
  //   .from(model)
  //   .groupBy(model.id);
  return await instance.execute(sql`WITH first_10_rows AS (
    SELECT *
    FROM ${model}
    ORDER BY "id"
    LIMIT 10
)
    SELECT *,
       COUNT(*) OVER() AS total_count
FROM first_10_rows;
`);
};
