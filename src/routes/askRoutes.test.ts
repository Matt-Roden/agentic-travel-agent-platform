import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../agents/travelAgent.js", () => ({
  runTravelAgent: vi.fn(),
}));

vi.mock("../config/env.js", () => ({
  env: {
    googleAiKey: "fake-key",
    tavilyApiKey: "fake-key",
    port: 3000,
  },
}));

import { app } from "../app.js";
import { runTravelAgent } from "../agents/travelAgent.js";

const mockRunTravelAgent = vi.mocked(runTravelAgent);

beforeEach(() => {
  mockRunTravelAgent.mockReset();
});

describe("POST /ask", () => {
  it("returns 400 when question is missing from the body", async () => {
    const res = await request(app).post("/ask").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/question/i);
  });

  it("returns 400 when question is not a string", async () => {
    const res = await request(app).post("/ask").send({ question: 123 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/question/i);
  });

  it("returns 200 with the agent answer on success", async () => {
    mockRunTravelAgent.mockResolvedValue({
      answer: "The lodging rate for Miami is $200/night.",
    });

    const res = await request(app)
      .post("/ask")
      .send({ question: "What is the Miami lodging rate?" });

    expect(res.status).toBe(200);
    expect(res.body.answer).toEqual({
      answer: "The lodging rate for Miami is $200/night.",
    });
  });

  it("returns 500 when the agent throws", async () => {
    mockRunTravelAgent.mockRejectedValue(new Error("Gemini is down"));

    const res = await request(app)
      .post("/ask")
      .send({ question: "What is the Miami lodging rate?" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Gemini is down");
  });
});
