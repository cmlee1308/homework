import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config.js';
const client = new OpenAI({ apiKey: OPENAI_API_KEY });
const DEFAULT_MODEL = 'gpt-5-mini';

//使用的參數
export { client, DEFAULT_MODEL };