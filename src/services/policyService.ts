import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readPolicyFile = async () => {
  const policy = await readFile(path.join(__dirname, "../..", "data", "travel-policy.txt"), "utf-8");
  return policy;
};  