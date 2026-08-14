import fs from "fs";
import { parse } from "csv-parse/sync";
import { qdrant, embed, coffee_COLLECTION, EMBEDDING_DIM } from "./lib/qdrant.js";

async function uploadCoffeeData() {
  try {
    let fileContent = fs.readFileSync("data/coffee.csv", "utf-8");
    
    // ✅ 移除 BOM 字符！
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      fileContent = fileContent.slice(1);
    }
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      escape: '"',
      quote: '"',
    });

    console.log(`📖 讀取了 ${records.length} 筆咖啡資料`);

    try {
      await qdrant.deleteCollection(coffee_COLLECTION);
      console.log(`🗑️  刪除舊 collection`);
    } catch (e) {}

    console.log(`🏗️  建立新 collection: ${coffee_COLLECTION}`);
    await qdrant.createCollection(coffee_COLLECTION, {
      vectors: {
        size: EMBEDDING_DIM,
        distance: "Cosine",
      },
    });

    const points = [];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      console.log(`⏳ [${i + 1}/${records.length}] 處理 ${record.Coffee_Name}...`);
      
      const textToEmbed = `${record.Coffee_Name} ${record.Flavor_Profile}`;
      const vector = await embed(textToEmbed);

      points.push({
        id: i + 1,
        vector: vector,
        payload: {
          Coffee_Name: record.Coffee_Name,
          Ingredients_and_Ratio: record.Ingredients_and_Ratio,
          Flavor_Profile: record.Flavor_Profile,
          Target_Audience: record.Target_Audience,
        },
      });
    }

    console.log(`\n📤 上傳資料到 Qdrant...`);
    await qdrant.upsert(coffee_COLLECTION, {
      points: points,
    });

    console.log(`\n✨ 成功！已上傳 ${points.length} 筆咖啡資料到 Qdrant！`);

  } catch (error) {
    console.error("❌ 上傳失敗:", error);
  }
}

uploadCoffeeData();