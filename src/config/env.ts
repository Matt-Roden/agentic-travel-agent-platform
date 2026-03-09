import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  googleAiKey: required("GOOGLE_GENERATIVE_AI_API_KEY"),
  tavilyApiKey: required("TAVILY_API_KEY"),
  port: Number(process.env.PORT) || 3000,
};
