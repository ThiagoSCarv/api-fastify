import fastify from "fastify";
import { env } from "./env";
import cookie from "@fastify/cookie"
import { transactionsRoutes } from "./routes/transactionsRoutes";

const app = fastify();

const PORT = env.PORT;

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: "/transactions",
});

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
