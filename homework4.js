import { input } from "@inquirer/prompts";
import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { spinner } from "./utils/spinner.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const AVAILABLE_TOOLS = Object.fromEntries(toolList.map((t) => [t.name, t.fn]));

const systemPrompt = `你是一個有用的助手，擁有以下能力：
- 使用 get_current_time 工具查詢現在的時間
- 使用 get_weather 工具查詢各城市的天氣狀況

當使用者問你時間相關的問題，就使用時間工具。
當使用者問你天氣相關的問題，就使用天氣工具。
如果使用者同時問兩種問題，就呼叫兩個工具。`;

const messages = [
  {
    role: "system",
    content: systemPrompt,
  },
];

async function main() {
  console.log("🤖 天氣時間助手已啟動！");
  console.log("試試問：「現在幾點？」、「台北天氣如何？」或「現在幾點？台北天氣好嗎？」\n");

  while (true) {
    const userQuestion = await input({ message: "你：" });

    if (userQuestion.toLowerCase() === "exit") {
      console.log("再見！");
      break;
    }

    messages.push({
      role: "user",
      content: userQuestion,
    });

    const spin = spinner("我想想...").start();

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      tools,
      tool_choice: "auto",
    });

    spin.stop();

    const message = response.choices[0].message;
    messages.push(message);

    // 處理工具呼叫
    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log("\n🔧 呼叫工具中...\n");

      for (const toolCall of message.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        console.log(`📍 呼叫: ${fnName}(${JSON.stringify(args)})`);

        const fn = AVAILABLE_TOOLS[fnName];
        const result = await fn(args);

        console.log(`✅ 結果:`, result);
        console.log();

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      // 重新問一次 AI，讓它總結結果
      const finalResponse = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages,
        tools,
        tool_choice: "auto",
      });

      const finalMessage = finalResponse.choices[0].message;
      console.log(`🤖 助手：${finalMessage.content}\n`);
      messages.push(finalMessage);
    } else {
      // AI 直接回答，不需要工具
      console.log(`🤖 助手：${message.content}\n`);
    }
  }
}

main().catch(console.error);