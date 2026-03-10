import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWeatherData } from "./openMeteoClient.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchWeatherData", () => {
  const lat = 25.8;
  const lon = -80.2;
  const city = "Miami";

  it("returns parsed WeatherData on a successful response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        current_weather: {
          temperature: 28.5,
          windspeed: 15.2,
          conditionCode: 1,
        },
      }),
    });

    const result = await fetchWeatherData(lat, lon, city);

    expect(result).toEqual({
      temperature: 28.5,
      windspeed: 15.2,
      conditionCode: 1,
      city: "Miami",
    });
  });

  it("builds the correct URL from lat/lon inputs", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        current_weather: { temperature: 0, windspeed: 0, conditionCode: 0 },
      }),
    });

    await fetchWeatherData(lat, lon, city);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
  });

  it("throws when the API returns a non-200 status", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(fetchWeatherData(lat, lon, city)).rejects.toThrow(
      "Failed to fetch weather data — API responded with status 503"
    );
  });
});
