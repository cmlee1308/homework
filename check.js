import fs from "fs";
import { parse } from "csv-parse/sync";

const fileContent = fs.readFileSync("data/coffee.csv", "utf-8");

const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ",",
  escape: '"',
  quote: '"',
  relax_column_count: true,
});

console.log("欄位名稱（帶引號）:");
const keys = Object.keys(records[0]);
keys.forEach(key => {
  console.log(`  "${key}"`);
});

console.log("\n第一筆值:");
keys.forEach(key => {
  console.log(`  ${key} = "${records[0][key]}"`);
});