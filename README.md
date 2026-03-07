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

### 4. Start the server

```bash
npm start
```

Or run in watch mode (auto-restarts on file changes):

```bash
npm run dev
```

The server will start at `http://localhost:3000` (override with the `PORT` env var).

### 5. Send a question

Send a POST request to the `/ask` endpoint with a JSON body:

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "I'\''m traveling to Miami (Lat: 25.8, Lon: -80.2) next week for 3 days. What is the maximum allowed lodging rate for the current season?"}'
```

The response will be a JSON object with the agent's answer:

```json
{
  "answer": "Based on the corporate travel policy, the maximum lodging rate for Miami is..."
}
```

## Project Structure

```
travel-agent-platform/
├── data/
│   └── travel-policy.txt          # Corporate travel policy document
├── src/
│   ├── index.ts                   # Entry point — Express server with POST /ask
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

## API

### `POST /ask`

Send a travel-related question and receive the agent's answer.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | yes | The travel question to ask the agent |

**Response (200):**

```json
{ "answer": "The agent's synthesized response..." }
```

If the model returned no text but did call tools, the response includes a `toolTrace` array instead.

Example of full response:
```json
{
    "answer": "For your upcoming 4-day trip to Denver, please note that the company policy does not provide a stipend for clothing or luggage purchases.\n\nThe weather in Denver is currently cold, with a temperature of approximately 29.12°F and a wind speed of about 4.91 mph. Given the cold weather, I recommend packing warm winter clothing, especially since you will be attending meetings, lunches with customers, and potentially golfing.\n\nHere are some options for winter clothing:\n*   **LLBean Winter Clothes For Women**: [https://www.llbean.com/buy/winter-clothes-for-women](https://www.llbean.com/buy/winter-clothes-for-women)\n*   **Ann Taylor Women's Winter Clothing**: [https://www.anntaylor.com/l/womens-winter-clothing-0aez08a?srsltid=AfmBOopOBxTzO08vymzOL5XUzxYIOEDyOKWXOqh8erkYPwLOCk4nRLHr](https://www.anntaylor.com/l/womens-winter-clothing-0aezO08vymzOL5XUzxYIOEDyOKWXOqh8erkPpwLOCk4nRLHr)\n*   **REI Co-op Winter Clothing**: [https://www.rei.com/h/winter-clothing](https://www.rei.com/h/winter-clothing)"
}
```

**Error responses:**

| Status | Reason |
|---|---|
| 400 | Missing or invalid `question` field |
| 500 | Internal error during agent processing |

## How It Works

1. A POST request hits `/ask` with the user's question.
2. The question is forwarded to Google Gemini via the Vercel AI SDK along with three tools: **getWeather**, **getPolicy**, and **getShoppingItems**.
3. The agent autonomously decides which tools to invoke, calls them, and synthesizes a final answer.
4. The response — including policy details, weather conditions (converted to °F / mph), and shopping links — is returned as JSON.

## Customization

- **Update the travel policy** — Replace or edit `data/travel-policy.txt` with your own company's policy document.
- **Swap the model** — The model is configured in `src/index.ts`; change it to any model supported by the Vercel AI SDK.
- **Change the port** — Set the `PORT` environment variable (defaults to `3000`).

## Tech Stack

| Technology | Purpose |
|---|---|
| [Express](https://expressjs.com/) | HTTP server and routing |
| [Vercel AI SDK](https://sdk.vercel.ai/docs) | Agent orchestration and tool calling |
| [Google Gemini](https://ai.google.dev/) | LLM powering the agent |
| [Tavily](https://tavily.com/) | Web search API for shopping results |
| [Open-Meteo](https://open-meteo.com/) | Free weather API |
| [Zod](https://zod.dev/) | Tool input schema validation |
| [tsx](https://github.com/privatenumber/tsx) | TypeScript execution without a build step |
