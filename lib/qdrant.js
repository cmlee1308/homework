import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
});

//export const coffee_COLLECTION = "netflix";
export const coffee_COLLECTION = "coffee";
export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embed(text) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

export async function searchCoffee(queryText, limit = 5) {
  try {
    const vector = await embed(queryText);

    const response = await qdrant.query(coffee_COLLECTION, {
      query: vector,
      limit: limit,
      with_payload: true,
    });

    const results = response.points.map((r) => ({
      score: r.score,
      Coffee_Name: r.payload.Coffee_Name || "未知咖啡",
      Ingredients_and_Ratio: r.payload.Ingredients_and_Ratio,
      Flavor_Profile: r.payload.Flavor_Profile,
      Target_Audience: r.payload.Target_Audience,
    }));

    // ✅ 如果查詢文字是咖啡名稱，優先回傳精確匹配
    const exactMatch = results.find(r => r.Coffee_Name === queryText.trim());
    if (exactMatch) {
      return [exactMatch];  // 只回傳這一個
    }

    return results;

  } catch (error) {
    console.error("向量搜尋失敗:", error);
    return [];
  }
}