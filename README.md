# Travel Agent Platform

An agentic AI proof-of-concept that acts as a corporate travel assistant. Ask it about your upcoming work trip and it will look up company travel policy, fetch live weather for your destination, and suggest relevant shopping items with links — all in a single conversational response.

Built with the [Vercel AI SDK](https://sdk.vercel.ai/docs), Google Gemini, and Tavily search.

## Features

- **Travel Policy Lookup** — Reads your company's travel policy document and answers questions about lodging caps, per diem rates, reimbursement rules, and more.
- **Live Weather** — Fetches current weather for any destination using the [Open-Meteo API](https://open-meteo.com/) (no API key required).
- **Smart Shopping Suggestions** — Based on the destination's weather, searches for relevant clothing and gear with purchase links via [Tavily](https://tavily.com/).

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [Google AI (Gemini) API key](https://aistudio.google.com/apikey)
- A [Tavily API key](https://app.tavily.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/travel-agent-platform.git
cd travel-agent-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### 4. Run the application

```bash
npm start
```

Or run in watch mode (auto-restarts on file changes):

```bash
npm run dev
```

The agent will process the prompt defined in `src/index.ts` and print its response to the console.

## Project Structure

```
travel-agent-platform/
├── data/
│   └── travel-policy.txt          # Corporate travel policy document
├── src/
│   ├── index.ts                   # Entry point — runs the agent
│   ├── agents/
│   │   └── travelAgent.ts         # Weather data fetching logic
│   ├── prompts/
│   │   └── main_agent_prompt.ts   # System prompt for the AI agent
│   ├── services/
│   │   ├── policyService.ts       # Reads the travel policy file
│   │   └── shoppingService.ts     # Tavily search integration
│   └── tools/
│       ├── index.ts               # Tool exports
│       ├── weatherTool.ts         # Weather lookup tool
│       ├── policyReaderTool.ts    # Policy Q&A tool
│       └── shoppingTool.ts        # Shopping search tool
├── .env                           # API keys (not committed)
├── package.json
└── tsconfig.json
```

## How It Works

1. The entry point (`src/index.ts`) sends a user prompt to Google Gemini via the Vercel AI SDK.
2. The model is given three tools it can call autonomously: **getWeather**, **getPolicy**, and **getShoppingItems**.
3. The agent decides which tools to invoke based on the user's question, calls them in sequence, and synthesizes a final answer.
4. The response — including policy details, weather conditions (converted to °F / mph), and shopping links — is printed to the console.

## Customization

- **Change the user prompt** — Edit the hardcoded prompt string in `src/index.ts` to ask different travel questions.
- **Update the travel policy** — Replace or edit `data/travel-policy.txt` with your own company's policy document.
- **Swap the model** — The model is configured in `src/index.ts`; change it to any model supported by the Vercel AI SDK.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Vercel AI SDK](https://sdk.vercel.ai/docs) | Agent orchestration and tool calling |
| [Google Gemini](https://ai.google.dev/) | LLM powering the agent |
| [Tavily](https://tavily.com/) | Web search API for shopping results |
| [Open-Meteo](https://open-meteo.com/) | Free weather API |
| [Zod](https://zod.dev/) | Tool input schema validation |
| [tsx](https://github.com/privatenumber/tsx) | TypeScript execution without a build step |
