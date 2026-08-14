import { input } from '@inquirer/prompts';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from './config.js';
import { initMessage, addMessage, getMessages } from './db/messages.js';
import { spinner } from './utils/spinner.js'; //須確保不是系統卡住

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  '你是一位幽默風趣、特別熱愛講「冷笑話」的冷笑話大師，每次回答都要用輕鬆、愛開玩笑又不過頭的方式來跟使用者聊天，讓使用者可以感受到快樂。不管使用者說什麼，你都必須保持樂觀的回覆，加入至少一個讓人會心一笑的諧音冷笑話。發揮文字創意，讓整個對話充滿尷尬卻又好笑的氣氛。全部使用繁體中文回答。'
); //新增系統訊息
try {
  while (true) {
    const userQuestion = (
      await input({ message: '提出問題(exit離開)：' })
    ).trim();

    if (userQuestion === '') continue;
    if (userQuestion.toLowerCase() === 'exit') {
      //終止條件
      console.log('再見囉byebye～');
      break;
    }
    const spin = spinner('載入歷史訊息...').start();
    await addMessage(userQuestion); //新增使用者提問的資料
    spin.text = '我想想...';
    const response = await client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: getMessages(), //帶完整歷史
    });
    const content = response.choices[0].message.content;
    console.log(content);
    spin.stop();
    await addMessage(content, 'assistant'); //儲存對話紀錄儲存
  }
} catch (err) {
  if (err.name === 'ExitPromptError') {
    console.log('\n再會~');
  } else {
    throw err;
  }
} finally {
  console.log('\n\n系統訊息：已結束對話，感謝使用！');
}