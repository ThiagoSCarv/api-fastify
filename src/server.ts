import fastify from "fastify";
import { env } from "./env";
import { knex } from "./database/knex";
import { transactionsRoutes } from "./routes/transactionsRoutes";

const app = fastify();

const PORT = env.PORT;

app.register(transactionsRoutes);

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
