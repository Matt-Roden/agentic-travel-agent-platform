import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSearch = vi.fn();

vi.mock("@tavily/core", () => ({
  tavily: () => ({ search: mockSearch }),
}));

vi.mock("../config/env.js", () => ({
  env: { tavilyApiKey: "fake-key" },
}));

beforeEach(() => {
  mockSearch.mockReset();
});

describe("searchShoppingItems", () => {
  it("returns search results from Tavily", async () => {
    const fakeResults = {
      results: [{ title: "Winter Jacket", url: "https://example.com/jacket" }],
    };
    mockSearch.mockResolvedValue(fakeResults);

    const { searchShoppingItems } = await import("./tavilyClient.js");
    const result = await searchShoppingItems("winter jacket");

    expect(result).toEqual(fakeResults);
  });

  it("passes the correct options to Tavily search", async () => {
    mockSearch.mockResolvedValue({ results: [] });

    const { searchShoppingItems } = await import("./tavilyClient.js");
    await searchShoppingItems("summer hat");

    expect(mockSearch).toHaveBeenCalledWith("summer hat", {
      max_results: 3,
      include_images: false,
      include_raw_content: false,
      include_follow_up_questions: false,
      include_response_time: false,
      include_request_id: false,
    });
  });
});
