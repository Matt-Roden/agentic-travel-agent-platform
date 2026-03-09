import { tool } from "ai";
import { z } from "zod";
import { fetchWeatherData } from "../clients/openMeteoClient.js";

export const weatherTool = tool({
  description:
    "Get the weather for a specific location using coordiantes and/or city name",
  inputSchema: z.object({
    lat: z.number().describe("The latitude of the location"),
    lon: z.number().describe("The longitude of the location"),
    city: z.string().describe("The city name"),
  }),
  execute: async ({ lat, lon, city }) => {
    console.log(`☁️  [Tool] Fetching real-time weather for ${city}...`);
    const weather = await fetchWeatherData(lat, lon, city);
    return {
      location: city,
      temperature: weather.temperature,
      windspeed: weather.windspeed,
      summary: `the current weather in ${city} is ${weather.temperature}°C with a wind speed of ${weather.windspeed} km/h.`,
    };
  },
});
