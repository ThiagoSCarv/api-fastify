import { knex } from "@/database/knex";
import { FastifyInstance } from "fastify";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/hello", () => {
    const transaction = knex("transactions").select().where("amount", "<", 900);

    return transaction;
  });
}
