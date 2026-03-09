import { tool } from "ai";
import { z } from "zod";
import { readPolicyFile } from "../services/policyService.js";

export const policyReaderTool = tool({
  description: "Read the travel policy document and answer questions about it",
  inputSchema: z.object({
    question: z.string().describe("The question to answer about the travel policy"),
  }),
  execute: async ({ question }) => {
    console.log(`📄  [Tool] Reading travel policy document...`);
    const policy = await readPolicyFile();
    return {
      policy: policy,
      answer: `The answer to the question "${question}" is ${policy}`,
    };
  },
});
