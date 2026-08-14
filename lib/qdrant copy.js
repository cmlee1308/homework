import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
});

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

    // ✅ 用 query() 方法！
    const results = await qdrant.query(coffee_COLLECTION, {
      query: vector,
      limit: limit,
      with_payload: true,
    });

    return results.map((r) => ({
      score: r.score,
      Coffee_Name: r.payload.Coffee_Name,
      Ingredients_and_Ratio: r.payload.Ingredients_and_Ratio,
      Flavor_Profile: r.payload.Flavor_Profile,
      Target_Audience: r.payload.Target_Audience,
    }));

  } catch (error) {
    console.error("向量搜尋失敗:", error);
    return [];
  }
}