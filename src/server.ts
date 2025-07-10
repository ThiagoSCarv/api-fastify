import fastify from "fastify";
import { env } from "./env";
import { knex } from "./database/knex";

const app = fastify();

const PORT = env.PORT;

app.get("/hello", () => {
  const transaction = knex("transactions").select().where("amount", '<', 900);

  return transaction;
});

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
