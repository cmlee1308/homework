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

console.log("所有欄位名稱:", Object.keys(records[0]));
console.log("每個欄位的實際值:");
Object.entries(records[0]).forEach(([key, value]) => {
  console.log(`  "${key}": "${value}"`);
});