import { z } from 'zod';
import { defineTool } from '../utils/func-tool.js';

async function calculate({ expression }) {
  try {
       const result = new Function(`return ${expression}`)();
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result))
      return { error: '無效的數學運算結果'};
    return { result };
  } catch (error) { return { error: '無法解析或計算該數學運算式'}; }
}

export const calculateTool = defineTool({
  name: 'calculate',
  description: '數學運算工具，接受一個數學表達式字串並返回計算結果',
  fn: calculate,
  parameters: z.object({
    expression: z.string().describe('數學表達式字串，例如 "5 + 6"'),
  }),
});