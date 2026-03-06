import "dotenv/config";
import { generateText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { tools } from "./tools/index.js";

const model = google("gemini-2.5-flash");

const systemPrompt = `You are a Corporate Travel Assistant. 
               Your goal is to help employees plan trips according to company policy.
               1. ALWAYS check the 'getPolicy' tool for reimbursement rules.
               2. ALWAYS check 'getWeather' to provide travel advice.
               3. Be professional, concise, and helpful.
               CRITICAL BEHAVIOR: 
             1. After you receive data from a tool, you MUST synthesize it into a final answer.
             2. Never provide an empty response. 
             3. If you have the weather and the policy, combine them into a single helpful paragraph.
             You must answer based on BOTH the weather AND the travel policy.
             Do not stop until you have provided a text summary of all findings.`;

async function main() {
  console.log("Travel agent platform is online...");

  try {
    const result = await generateText({
      model: model,
      system: systemPrompt,
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
