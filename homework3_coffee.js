import { input } from "@inquirer/prompts";
import { searchCoffee } from "./lib/qdrant.js";
import { spinner } from "./utils/spinner.js";

try {
  while (true) {
    const query = (
      await input({ message: "您想聽聽哪種咖啡的故事?我來介紹給您：" })
    ).trim();

    if (query === "") continue;
    if (query.toLowerCase() === "exit") {
      console.log("謝謝光臨，再見~");
      break;
    }

    const spin = spinner("搜尋中...").start();
    const results = await searchCoffee(query, 5);
    spin.stop();
//Coffee_Name,Ingredients_and_Ratio,Flavor_Profile,Target_Audience
    for (const [i, r] of results.entries()) {
        console.log(`分數：${r.score}`);
        console.log(`咖啡名稱：${r.Coffee_Name}`);
        console.log(`主要成分與比例：${r.Ingredients_and_Ratio}`);
        console.log(`風味特色：${r.Flavor_Profile}`);
        console.log(`適合對象：${r.Target_Audience}`);
    }
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}