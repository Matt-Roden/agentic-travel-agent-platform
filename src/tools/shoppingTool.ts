import { tool } from "ai";
import { z } from "zod";
import { searchShoppingItems } from "../clients/tavilyClient.js";

export const shoppingTool = tool({
  description: "Search for shopping items on amazon on the internet based on the information fed to the tool. IF the weather is cold, search for winter clothing. IF the weather is hot, search for summer clothing. IF the weather is mild, search for spring/summer clothing.",
  inputSchema: z.object({
    query: z.string().describe("The query to search for shopping items"),
  }),
  execute: async ({ query }) => {
    console.log(`[Tool] Searching for shopping items...`);
    const response = await searchShoppingItems(query);
    return {
      response: response,
    };
  },
});
