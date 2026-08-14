import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";
import { searchCoffee } from "../lib/qdrant.js";

async function search({ query, limit = 5 }) {
  return await searchCoffee(query, limit);
}

export const coffeeTool = defineTool({
  name: "search_coffee",
  description:
    "當使用者要求查詢咖啡相關的訊息（如咖啡名稱、風味特色及適合飲用人群）時使用此工具。",
  fn: search,
  parameters: z.object({
    query: z.string().describe("查詢內容，可以是咖啡名稱、口味、適合的人等等"),
    limit: z.number().default(5).describe("回傳筆數上限，預設 5"),
  }),
});