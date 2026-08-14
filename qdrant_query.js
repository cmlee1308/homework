import { qdrant, embed, coffee_COLLECTION } from "./lib/qdrant.js";

async function test() {
  const vector = await embed("義式咖啡");
  const results = await qdrant.query(coffee_COLLECTION, {
    query: vector,
    limit: 5,
    with_payload: true,
  });
  
  console.log("查詢結果的型別:", typeof results);
  console.log("查詢結果:", JSON.stringify(results, null, 2));
}

test();
