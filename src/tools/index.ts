import { weatherTool } from "./weatherTool.js";
import { policyReaderTool } from "./policyReaderTool.js";
import { shoppingTool } from "./shoppingTool.js";

export const tools = {
  getWeather: weatherTool,
  getPolicy: policyReaderTool,
  getShoppingItems: shoppingTool,
}
