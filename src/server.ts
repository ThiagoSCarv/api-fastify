import fastify from "fastify";
import { env } from "./env";
import { knex } from "./database";

const app = fastify();

const PORT = env.PORT;

app.get("/hello", () => {
  const tables = knex('sqlite_schema').select('*')

  return tables
});

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
