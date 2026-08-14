export const time = {
  name: "get_current_time",
  description: "取得目前的時間",
  fn: async () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString('zh-TW'),
      date: now.toLocaleDateString('zh-TW'),
      full: now.toString(),
    };
  },
};