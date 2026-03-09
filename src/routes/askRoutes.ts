import { Router } from "express";
import { runTravelAgent } from "../agents/travelAgent.js";

export const askRouter = Router();

askRouter.post("/", async (req, res) => {
  const question = req.body?.question;
  if (!question || typeof question !== "string") {
    res
      .status(400)
      .json({
        error:
          "A 'question' string is required in the request body. Make sure you set Content-Type: application/json.",
      });
    return;
  }
  try {
    const answer = await runTravelAgent(question);
    res.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Agent error:", error);
    res.status(500).json({ error: message });
  }
});
