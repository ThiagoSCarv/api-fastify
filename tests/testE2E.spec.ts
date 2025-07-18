import { app } from "../src/app";
import request from "supertest";
import {
  beforeAll,
  afterAll,
  expect,
  test,
  describe,
  beforeEach,
} from "vitest";
import { execSync } from "node:child_process";

describe("transactions", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex -- migrate:latest");
  });

  const server = app.server;

  test("usuario pode criar uma transação", async () => {
    const response = await request(server).post("/transactions").send({
      title: "New transaction",
      amount: 900,
      type: "credit",
    });

    expect(response.statusCode).toBe(201);
  });

  test("Deve retornar todas as transações do usuario", async () => {
    const createTransaction = await request(server).post("/transactions").send({
      title: "New transaction",
      amount: 900,
      type: "credit",
    });

    const cookies = createTransaction.get("Set-Cookie");

    const listOfTransactions = await request(server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listOfTransactions.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 900,
      }),
    ]);
  });
});
