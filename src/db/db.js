// import { Pool } from "pg";

// const connectionString = process.env.DB_URL;

// const settings = connectionString
//   ? { connectionString }
//   : {
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       database: process.env.DB_NAME,
//     };

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export default drizzle(sql);

// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { sql } from "@vercel/postgres";
// import {
//   pgTable,
//   serial,
//   text,
//   timestamp,
//   uniqueIndex,
// } from 'drizzle-orm/pg-core';

// // Use this object to send drizzle queries to your DB
// export const db = drizzle(sql);
// // Create a pgTable that maps to a table in your DB
// export const ExampleTable = pgTable(
//   'users',
//   {
//     id: serial('id').primaryKey(),
//     name: text('name').notNull(),
//     email: text('email').notNull(),
//     image: text('image').notNull(),
//     createdAt: timestamp('createdAt').defaultNow().notNull(),
//   },
//   (users) => {
//     return {
//       uniqueIdx: uniqueIndex('unique_idx').on(users.email),
//     };
//   },
// );

// export const getExampleTable = async () => {
//   const selectResult = await db.select().from(ExampleTable);
//   console.log('Results', selectResult);
// };
