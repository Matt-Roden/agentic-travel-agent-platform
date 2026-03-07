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
        // "I'm traveling to Denver (Lat: 39.8, Lon: -104.9) next week for 3 days. Are ride-sharing apps like Uber fully reimbursable from the airport, or am I required to use the train, and what should I pack based on the weather?",
        // "I'm traveling to Seattle (Lat: 47.6, Lon: -122.3) next week for 3 days. As a non-exempt employee, how do I log my transit time for payroll under Washington state law, and what should I pack based on the weather?"
        "I'm traveling to Miami (Lat: 25.8, Lon: -80.2) next week for 3 days. What is the maximum allowed lodging rate for the current season?"
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
