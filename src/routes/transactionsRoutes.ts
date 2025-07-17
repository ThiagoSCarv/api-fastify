import { knex } from "@/database/knex";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod/v4";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const transactions = await knex("transactions").select()

    return { transactions }
  })

  app.get("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const transaction = await knex("transactions").select().where("id", id).first()

    return { transaction }
  })

  app.get("/summary", async (request, reply) => {
    const summary = await knex("transactions").sum("amount", { as: "amount" }).first()

    return { summary }
  })

  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      title: z.string().min(2),
      amount: z.number().positive(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = bodySchema.parse(request.body);

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return reply.status(201).send();
  });
}
