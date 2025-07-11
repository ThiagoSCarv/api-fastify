import { knex } from "@/database/knex";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod/v4";

export async function transactionsRoutes(app: FastifyInstance) {
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
