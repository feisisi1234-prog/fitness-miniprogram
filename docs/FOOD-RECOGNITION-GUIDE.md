# 食物识别功能开发指南

## 功能概述

食物识别功能允许用户通过拍照或从相册选择图片，使用 AI 识别食物并获取营养信息，包括：
- 食物名称
- 热量
- 升糖指数 (GI)
- 升糖负荷 (GL)
- 食用建议

## 技术架构

### 流程图
```
用户点击"食物识别"
    ↓
进入食物识别页面
    ↓
用户选择图片（拍照/相册）
    ↓
显示图片预览
    ↓
用户点击"开始识别"
    ↓
[步骤1] 上传文件到 Coze (wx.uploadFile)
    ↓
[步骤2] 创建 Chat 请求 (wx.request POST)
    ↓
[步骤3] 轮询消息获取结果 (wx.request GET)
    ↓
解析识别结果
    ↓
显示结果页面
```

### API 集成

#### 1. Coze API 配置

需要在代码中配置以下信息：

```javascript
// 在 food-recognition.js 中替换以下配置
const COZE_CONFIG = {
  apiKey: 'YOUR_COZE_API_KEY',      // Coze API Key
  botId: 'YOUR_BOT_ID',              // Bot ID
  baseUrl: 'https://api.coze.cn'     // API 基础URL
};
```

#### 2. 文件上传 API

**接口**: `POST /v1/files/upload`

**请求**:
```javascript
wx.uploadFile({
  url: 'https://api.coze.cn/v1/files/upload',
  filePath: tempFilePath,
  name: 'file',
  header: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'multipart/form-data'
  }
})
```

**响应**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "file_xxxxx",
    "bytes": 123456,
    "created_at": 1234567890
  }
}
```

#### 3. Chat 创建 API

**接口**: `POST /v3/chat`

**请求**:
```javascript
{
  "bot_id": "YOUR_BOT_ID",
  "user_id": "user_xxxxx",
  "stream": false,
  "auto_save_history": true,
  "additional_messages": [
    {
      "role": "user",
      "content": "请识别这个食物...",
      "content_type": "text"
    },
    {
      "role": "user",
      "content": "file_xxxxx",
      "content_type": "file"
    }
  ]
}
```

**响应**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "chat_xxxxx",
    "conversation_id": "conv_xxxxx",
    "status": "processing"
  }
}
```

#### 4. 消息轮询 API

**接口**: `GET /v3/chat/message/list`

**请求参数**:
- `conversation_id`: 会话ID
- `chat_id`: Chat ID

**响应**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "role": "assistant",
      "type": "answer",
      "content": "食物名称: 苹果\n热量: 52千卡/100g\n..."
    }
  ]
}
```

## 配置步骤

### 1. 获取 Coze API Key

1. 访问 [Coze 开放平台](https://www.coze.cn/)
2. 注册/登录账号
3. 创建应用
4. 获取 API Key

### 2. 创建 Bot

1. 在 Coze 平台创建新的 Bot
2. 配置 Bot 的能力：
   - 启用视觉模型
   - 配置提示词：
     ```
     你是一个专业的营养师助手。当用户上传食物图片时，请识别食物并提供以下信息：
     1. 食物名称
     2. 热量（千卡/100g）
     3. 升糖指数（GI值）
     4. 升糖负荷（GL值）
     5. 食用建议
     
     请以结构化的格式返回，例如：
     食物名称: XXX
     热量: XXX千卡/100g
     升糖指数(GI): XX
     升糖负荷(GL): XX
     食用建议: XXX
     ```
3. 发布 Bot 并获取 Bot ID

### 3. 配置代码

在 `pages/food-recognition/food-recognition.js` 中替换配置：

```javascript
// 第 120 行左右
header: {
  'Authorization': 'Bearer pat_xxxxx_your_api_key_here',
  'Content-Type': 'multipart/form-data'
}

// 第 155 行左右
header: {
  'Authorization': 'Bearer pat_xxxxx_your_api_key_here',
  'Content-Type': 'application/json'
}

// 第 160 行左右
data: {
  bot_id: '7xxxxx_your_bot_id_here',
  // ...
}

// 第 220 行左右
header: {
  'Authorization': 'Bearer pat_xxxxx_your_api_key_here',
}
```

## 性能监控

代码中已集成完整的性能监控，会在控制台输出：

```
========================================
🚀 [性能监控] 食物识别流程开始
========================================
⏱️  [性能监控] 步骤1: 开始上传文件
✅ [性能监控] 步骤1完成: 文件上传耗时 XXXms
⏱️  [性能监控] 步骤2: 开始创建Chat请求
✅ [性能监控] 步骤2完成: Chat请求耗时 XXXms
⏱️  [性能监控] 步骤3: 轮询消息 (第X次)
✅ [性能监控] 步骤3完成: 消息轮询总耗时 XXXms
========================================
🎉 [性能监控] 完整识别流程总耗时: XXXms (X.XX秒)
========================================
```

## 预期性能指标

- 文件上传: 500-2000ms (取决于图片大小和网络)
- Chat 创建: 200-500ms
- 消息轮询: 2000-5000ms (取决于 AI 处理速度)
- 总耗时: 3-8秒

## 错误处理

代码中已实现完整的错误处理：

1. **文件上传失败**: 显示"文件上传失败"提示
2. **Chat 创建失败**: 显示"Chat请求失败"提示
3. **识别超时**: 轮询30次后超时（约30秒）
4. **网络错误**: 显示"网络请求失败"提示

## 结果解析

代码支持两种格式的结果解析：

### 1. JSON 格式
```json
{
  "name": "苹果",
  "calories": "52千卡/100g",
  "gi": "36",
  "gl": "6",
  "suggestion": "苹果是低GI食物，适合减肥和控糖人群..."
}
```

### 2. 文本格式
```
食物名称: 苹果
热量: 52千卡/100g
升糖指数(GI): 36
升糖负荷(GL): 6
食用建议: 苹果是低GI食物，适合减肥和控糖人群...
```

## 测试步骤

### 1. 开发环境测试

1. 打开微信开发者工具
2. 点击首页的"食物识别"卡片
3. 点击上传区域
4. 选择"拍照"或"从相册选择"
5. 选择一张食物图片
6. 点击"开始识别"
7. 查看控制台的性能日志
8. 验证识别结果是否正确显示

### 2. 真机测试

1. 使用真机预览
2. 测试拍照功能
3. 测试相册选择功能
4. 验证识别准确度
5. 测试网络异常情况

## 常见问题

### Q1: 文件上传失败
**原因**: API Key 配置错误或网络问题
**解决**: 检查 API Key 是否正确，检查网络连接

### Q2: 识别超时
**原因**: AI 处理时间过长或网络延迟
**解决**: 增加轮询次数或优化图片大小

### Q3: 结果解析失败
**原因**: Bot 返回格式不符合预期
**解决**: 调整 Bot 的提示词，确保返回结构化数据

### Q4: 识别不准确
**原因**: 图片质量差或 Bot 训练不足
**解决**: 
- 提示用户拍摄清晰的照片
- 优化 Bot 的提示词
- 使用更强大的视觉模型

## 优化建议

### 1. 图片预处理
- 压缩图片大小（建议 < 1MB）
- 调整图片分辨率（建议 1024x1024）
- 提高图片清晰度

### 2. 缓存机制
- 缓存已识别的食物
- 避免重复识别相同图片

### 3. 离线支持
- 预置常见食物数据库
- 网络异常时使用本地数据

### 4. 用户体验
- 添加识别历史记录
- 支持批量识别
- 添加收藏功能

## 相关文件

- `pages/food-recognition/food-recognition.js` - 主要逻辑
- `pages/food-recognition/food-recognition.wxml` - 页面结构
- `pages/food-recognition/food-recognition.wxss` - 页面样式
- `pages/food-recognition/food-recognition.json` - 页面配置
- `pages/index/index.js` - 首页入口
- `pages/index/index.wxml` - 首页结构

## 下一步开发

1. 添加识别历史记录功能
2. 集成营养数据库
3. 添加食物对比功能
4. 支持多语言
5. 添加分享功能
