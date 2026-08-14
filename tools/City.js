import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

async function search({ query, limit = 5 }) {
  return await searchCity(query, limit);
}

export const cityTool = defineTool({
  name: "search_city",
  description:
    "當使用者要求查詢城市相關的訊息時使用此工具。",
  fn: search,
  parameters: z.object({
    query: z.string().describe("查詢內容，可以是城市名稱、特色景點、美食等"),
    limit: z.number().default(5).describe("回傳筆數上限，預設 5"),
  }),
});