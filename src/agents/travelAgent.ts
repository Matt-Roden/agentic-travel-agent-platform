import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { tools } from "../tools/index.js";
import { TRAVEL_AGENT_PROMPT } from "../prompts/travelAgentPrompt.js";

const model = google("gemini-2.5-flash");

export async function runTravelAgent(question: string) {
  const result = await generateText({
    model,
    system: TRAVEL_AGENT_PROMPT,
    tools,
    stopWhen: stepCountIs(10),
    prompt: question,
  });

  if (result.text) {
    return { answer: result.text };
  }

  const toolTrace = result.steps.flatMap((step, i) =>
    step.toolResults.map((r) => ({
      step: i + 1,
      tool: r.toolName,
      output: r.output,
    }))
  );
  return { answer: null, toolTrace };
}
