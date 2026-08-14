import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
const HISTORY_DIR = 'histories';

// 檢查資料夾是否存在，若不存在則自動建立（recursive: true 確保多層級目錄也能順利建立）
if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true });
const filename = `${new Date().toISOString().replace(/[:.]/g, '')}.json`;
const adapter = new JSONFile(join(HISTORY_DIR, filename));
const db = new Low(adapter, { messages: [] });
await db.read();

export async function initMessage(systemPrompt) {
  // 只有在訊息陣列為空的時候才進入
  if (db.data.messages.length === 0) {
    // 將系統提示詞存入陣列，角色設定為 'developer'
    db.data.messages.push({ role: 'developer', content: systemPrompt });
    await db.write();
  }
}

export async function addMessage(content, role = 'user') {
  db.data.messages.push({ role, content });
  await db.write();
}

export function getMessages() { return db.data.messages; }