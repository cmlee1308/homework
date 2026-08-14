import { getEmbeddings, cosineSimilarity } from "./embedding.js";

// 📝 測試數據
const testGroups = {
  相近文字: {
    description: "意思相近的句子",
    sentences: [
      "我喜歡貓",
      "貓咪很可愛",
      "我養了一隻貓",
    ],
  },
  不同文字: {
    description: "意思完全不同的句子",
    sentences: [
      "今天天氣很好",
      "我要去買菜",
      "電腦壞了",
    ],
  },
  自定義測試: {
    description: "關於陳幸妤的敘述",
    sentences: [
        "陳幸妤很真誠",
        "陳幸妤是牙醫",
        "陳幸妤不會說謊",
    ],
  },
};

// 🔍 主程式
async function runSimilarityTest() {
  console.log("🔬 向量相似度實驗\n");
  console.log("=" .repeat(60) + "\n");

  for (const [groupName, groupData] of Object.entries(testGroups)) {
    console.log(`📊 第 ${Object.keys(testGroups).indexOf(groupName) + 1} 組：${groupName}`);
    console.log(`📝 描述：${groupData.description}`);
    console.log(`\n句子列表：`);
    groupData.sentences.forEach((s, i) => {
      console.log(`  ${i + 1}. "${s}"`);
    });

    console.log(`\n⏳ 生成 embedding 中...`);
    const embeddings = await getEmbeddings(groupData.sentences);
    console.log(`✅ 完成！\n`);

    // 計算所有句子對之間的相似度
    console.log(`相似度矩陣：\n`);
    console.log("       句1    句2    句3");
    
    for (let i = 0; i < groupData.sentences.length; i++) {
      let row = `句${i + 1}  `;
      for (let j = 0; j < groupData.sentences.length; j++) {
        const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
        row += `${similarity.toFixed(3)}  `;
      }
      console.log(row);
    }

    // 分析結果
    console.log(`\n📈 分析：`);
    const similarities = [];
    for (let i = 0; i < groupData.sentences.length; i++) {
      for (let j = i + 1; j < groupData.sentences.length; j++) {
        const sim = cosineSimilarity(embeddings[i], embeddings[j]);
        similarities.push({
          pair: `句${i + 1}-句${j + 1}`,
          similarity: sim,
        });
      }
    }

    // 按相似度排序
    similarities.sort((a, b) => b.similarity - a.similarity);
    similarities.forEach(({ pair, similarity }) => {
      const level = 
        similarity > 0.8 ? "🔴 非常相近" :
        similarity > 0.6 ? "🟠 相近" :
        similarity > 0.4 ? "🟡 中等" :
        "🟢 不相近";
      console.log(`  ${pair}：${similarity.toFixed(3)} ${level}`);
    });

    console.log("\n" + "=".repeat(60) + "\n");
  }

  // 總結
  console.log("📋 實驗總結：\n");
  console.log("第 1 組（相近文字）預期：句子間相似度 > 0.6");
  console.log("第 2 組（不同文字）預期：句子間相似度 < 0.5");
  console.log("第 3 組（自定義）預期：根據內容判斷\n");
  console.log("✨ 實驗完成！");
}

// 執行
runSimilarityTest().catch(console.error);