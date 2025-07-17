import { test, expect } from "vitest"

test("usuario pode criar uma transação", () => {
  const responseStatus = 201

  expect(responseStatus).toBe(201)
})
