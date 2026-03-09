import { tavily } from "@tavily/core";
import { env } from "../config/env.js";

const client = tavily({ apiKey: env.tavilyApiKey });

export async function searchShoppingItems(query: string) {
  const response = await client.search(query, {
    max_results: 3,
    include_images: false,
    include_raw_content: false,
    include_follow_up_questions: false,
    include_response_time: false,
    include_request_id: false,
  });
  return response;
}
