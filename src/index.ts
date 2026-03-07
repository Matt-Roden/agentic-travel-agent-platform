import "dotenv/config";
import express from "express";
import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { tools } from "./tools/index.js";
import { MAIN_AGENT_PROMPT } from "./prompts/main_agent_prompt.js";

const app = express();
app.use(express.json());

const model = google("gemini-2.5-flash");
const PORT = process.env.PORT || 3000;

app.post("/ask", async (req, res) => {
  const question = req.body?.question;

  if (!question || typeof question !== "string") {
    res.status(400).json({ error: "A 'question' string is required in the request body. Make sure you set Content-Type: application/json." });
    return;
  }

  console.log(`Received question: ${question}`);

  try {
    const result = await generateText({
      model,
      system: MAIN_AGENT_PROMPT,
      tools,
      stopWhen: stepCountIs(10),
      prompt: question,
    });

    if (result.text) {
      res.json({ answer: result.text });
    } else {
      const toolTrace = result.steps.flatMap((step, index) =>
        step.toolResults.map((r) => ({
          step: index + 1,
          tool: r.toolName,
          output: r.output,
        }))
      );
      res.json({ answer: null, toolTrace });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Agent error:", error);
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Travel Agent Platform is running at http://localhost:${PORT}`);
  console.log(`POST your questions to http://localhost:${PORT}/ask`);
});
