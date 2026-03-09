import { WeatherData } from "../types/weather.js";

export async function fetchWeatherData(
  lat: number,
  lon: number,
  city: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch weather data — API responded with status ${response.status}`
    );
  }

  const data = await response.json();

  return {
    temperature: data.current_weather.temperature,
    windspeed: data.current_weather.windspeed,
    conditionCode: data.current_weather.conditionCode,
    city,
  };
}
