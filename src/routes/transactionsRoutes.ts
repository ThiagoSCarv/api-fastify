import { knex } from "../../database/knex";
import { FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { verifyUserToken } from "../middlewares/verifyUserCookie";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [verifyUserToken] }, async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    const transactions = await knex("transactions")
      .where("session_id", sessionId)
      .select();

    return { transactions };
  });

  app.get("/:id", { preHandler: [verifyUserToken] }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { sessionId } = request.cookies;

    const { id } = paramsSchema.parse(request.params);

    const transaction = await knex("transactions")
      .select()
      .where("session_id", sessionId)
      .andWhere("id", id)
      .first();

    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [verifyUserToken] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    },
  );

  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      title: z.string().min(2),
      amount: z.number().positive(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = bodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
