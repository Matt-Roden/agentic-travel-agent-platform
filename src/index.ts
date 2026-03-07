import "dotenv/config";
import { generateText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { tools } from "./tools/index.js";
import { MAIN_AGENT_PROMPT } from "./prompts/main_agent_prompt.js";

const model = google("gemini-2.5-flash");


async function main() {
  console.log("Travel agent platform is online...");

  try {
    const result = await generateText({
      model: model,
      system: MAIN_AGENT_PROMPT,
      tools: tools,
      stopWhen: stepCountIs(10),
      prompt:
        "I'm traveling to New York (Lat: 40.7, Lon: -74.0) next week for 3 days. What is the meal stipend, and what should I pack based on the weather? Then summarize everything for me.",
    });

    console.log("/------Agent Response------/");
    if (result.text) {
      console.log(result.text);
    } else {
      console.log("⚠️ Agent remained silent. Accessing complete Tool Trace:");

      // This loop ensures we see EVERYTHING the agent found, not just the last thing
      result.steps.forEach((step, index) => {
        step.toolResults.forEach((res) => {
          console.log(`📍 Step ${index + 1} (${res.toolName}):`, res.output);
        });
      });
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
