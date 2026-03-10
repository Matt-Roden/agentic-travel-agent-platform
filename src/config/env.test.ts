import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("dotenv/config", () => ({}));

describe("env", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.TAVILY_API_KEY;
    delete process.env.PORT;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function loadEnv() {
    const mod = await import("./env.js");
    return mod.env;
  }

  it("throws when GOOGLE_GENERATIVE_AI_API_KEY is missing", async () => {
    await expect(loadEnv()).rejects.toThrow(
      "Missing required env var: GOOGLE_GENERATIVE_AI_API_KEY"
    );
  });

  it("throws when TAVILY_API_KEY is missing", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key";

    await expect(loadEnv()).rejects.toThrow(
      "Missing required env var: TAVILY_API_KEY"
    );
  });

  it("returns correct values when all vars are set", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "google-key-123";
    process.env.TAVILY_API_KEY = "tavily-key-456";
    process.env.PORT = "4000";

    const env = await loadEnv();

    expect(env.googleAiKey).toBe("google-key-123");
    expect(env.tavilyApiKey).toBe("tavily-key-456");
    expect(env.port).toBe(4000);
  });

  it("defaults port to 3000 when PORT is not set", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "google-key";
    process.env.TAVILY_API_KEY = "tavily-key";

    const env = await loadEnv();

    expect(env.port).toBe(3000);
  });
});
