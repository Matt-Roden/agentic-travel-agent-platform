import { tavily } from "@tavily/core";

const client = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export async function searchShoppingItems(query: string) {
  console.log("[Tavily] Searching for shopping items...");

  try {
    const response = await client.search(query, {
      max_results: 3,
      include_images: false,
      include_raw_content: false,
      include_follow_up_questions: false,
      include_response_time: false,
      include_request_id: false,
    });
    return response;
  } catch (error) {
    console.error("[Tavily] Error searching for shopping items:", error);
    throw error;
  }
}
