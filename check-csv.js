import fs from "fs";

// 直接讀取原始檔案前幾行
const fileContent = fs.readFileSync("data/coffee.csv", "utf-8");
const lines = fileContent.split("\n").slice(0, 5);

console.log("📄 原始檔案內容（前5行）：");
lines.forEach((line, i) => {
  console.log(`行 ${i}: ${JSON.stringify(line)}`);
});

console.log("\n🔍 檔案第一個字符編碼:", fileContent.charCodeAt(0));
console.log("第一行:", fileContent.split("\n")[0]);