// Coze API 配置示例
// 复制此文件为 coze-config.js 并填入实际的配置信息

module.exports = {
  // Coze API Key
  // 获取方式: https://www.coze.cn/ -> 个人中心 -> API Keys
  apiKey: 'pat_xxxxx_your_api_key_here',
  
  // Bot ID
  // 获取方式: 创建 Bot 后在 Bot 详情页面查看
  botId: '7xxxxx_your_bot_id_here',
  
  // API 基础 URL
  baseUrl: 'https://api.coze.cn',
  
  // 轮询配置
  polling: {
    maxRetries: 30,        // 最大轮询次数
    interval: 1000,        // 轮询间隔（毫秒）
    timeout: 30000         // 总超时时间（毫秒）
  },
  
  // 文件上传配置
  upload: {
    maxSize: 10 * 1024 * 1024,  // 最大文件大小 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
  }
};
