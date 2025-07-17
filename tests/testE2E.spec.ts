import { app } from "../src/app"
import request from "supertest"
import { beforeAll, afterAll, expect, test, describe } from "vitest"

describe('transactions', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test("usuario pode criar uma transação", async () => {
    const response = await request(app.server).post("/transactions").send({
      title: "New transaction",
      amount: 900,
      type: "credit"
    })

    expect(response.statusCode).toBe(201)
  })

})
