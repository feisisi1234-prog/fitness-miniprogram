# 视频播放故障排除指南

## 当前错误：MEDIA_ERR_SRC_NOT_SUPPORTED

这个错误表示视频源不被支持。可能的原因和解决方案：

## 解决方案

### 方案1：检查视频格式（最常见）

**问题**：视频编码格式不被小程序支持

**解决方法**：
1. 确认视频是MP4格式
2. 确认视频编码是H.264
3. 确认音频编码是AAC

**如何转换视频格式：**

#### 使用FFmpeg（推荐）
```bash
# 安装FFmpeg后执行
ffmpeg -i muscle.mp4 -vcodec h264 -acodec aac -strict -2 muscle-converted.mp4
```

#### 使用在线工具
1. 访问 https://cloudconvert.com/mp4-converter
2. 上传你的视频
3. 选择输出格式：MP4
4. 高级设置：
   - 视频编码：H.264
   - 音频编码：AAC
5. 下载转换后的视频

#### 使用HandBrake（免费桌面软件）
1. 下载 HandBrake: https://handbrake.fr/
2. 打开视频文件
3. 选择预设：Fast 1080p30
4. 确认：
   - Video Codec: H.264 (x264)
   - Audio Codec: AAC
5. 点击 Start Encode

### 方案2：检查文件路径

**当前路径**：`/videos/muscle.mp4`

**验证步骤**：
1. 确认文件在项目根目录的 `videos` 文件夹中
2. 文件名必须是 `muscle.mp4`（区分大小写）
3. 路径必须以 `/` 开头

### 方案3：检查视频文件完整性

**问题**：视频文件可能损坏

**解决方法**：
1. 在电脑上用播放器打开视频，确认能正常播放
2. 如果不能播放，重新下载或转换视频
3. 确认文件大小 > 0

### 方案4：使用临时网络地址测试

**目的**：排除本地文件问题

**步骤**：
1. 将视频上传到云存储（如腾讯云COS、阿里云OSS）
2. 获取视频的HTTPS地址
3. 临时修改代码测试：

```xml
<video 
  src="https://你的云存储地址/muscle.mp4"
  ...
></video>
```

如果网络地址可以播放，说明是本地文件配置问题。

### 方案5：检查项目配置

**检查 project.config.json**：

```json
{
  "miniprogramRoot": "./",
  "setting": {
    "urlCheck": false
  }
}
```

### 方案6：重新编译项目

1. 在微信开发者工具中点击：工具 -> 清除缓存
2. 选择：清除文件缓存、清除授权数据
3. 重新编译项目

### 方案7：使用推荐的视频规格

**推荐规格**：
- 格式：MP4
- 视频编码：H.264 (AVC)
- 音频编码：AAC
- 分辨率：1280x720 或 1920x1080
- 帧率：24-30 fps
- 码率：1-3 Mbps
- 文件大小：< 20MB

**转换命令（FFmpeg）**：
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -vf "scale=1280:720" \
  output.mp4
```

## 快速测试步骤

### 1. 验证视频文件
```bash
# 在项目根目录执行
ffprobe videos/muscle.mp4
```

查看输出中的：
- Video: h264 ✅
- Audio: aac ✅

### 2. 测试用简单视频

如果你的视频有问题，可以先用一个测试视频：

1. 下载测试视频：https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4
2. 重命名为 `muscle.mp4`
3. 放到 `videos/` 文件夹
4. 测试是否能播放

如果测试视频能播放，说明是原视频文件的问题。

## 常见错误代码

| 错误代码 | 含义 | 解决方案 |
|---------|------|---------|
| MEDIA_ERR_SRC_NOT_SUPPORTED | 视频格式不支持 | 转换为H.264编码的MP4 |
| MEDIA_ERR_NETWORK | 网络错误 | 检查网络连接 |
| MEDIA_ERR_DECODE | 解码失败 | 重新编码视频 |
| MEDIA_ERR_ABORTED | 播放中止 | 检查视频文件完整性 |

## 调试技巧

### 1. 查看详细错误信息
在 `pages/muscle-analysis/muscle-analysis.js` 中已添加详细错误处理。

### 2. 在真机上测试
开发者工具的视频播放可能与真机不同，建议：
1. 使用真机调试
2. 查看真机上的错误信息

### 3. 检查控制台
查看完整的错误堆栈信息。

## 推荐工作流程

1. **准备视频**
   - 使用FFmpeg或HandBrake转换为标准格式
   - 确认视频能在电脑上正常播放

2. **放置文件**
   - 将视频放到 `videos/muscle.mp4`
   - 确认路径正确

3. **测试播放**
   - 在开发者工具中测试
   - 在真机上测试

4. **如果失败**
   - 查看错误信息
   - 按照本指南排查
   - 尝试使用测试视频

## 联系支持

如果以上方法都无法解决，请提供：
1. 视频文件的详细信息（使用 `ffprobe` 获取）
2. 完整的错误信息
3. 微信开发者工具版本
4. 是否在真机上测试过

---

**最快的解决方案**：使用FFmpeg重新编码视频
```bash
ffmpeg -i muscle.mp4 -vcodec h264 -acodec aac muscle-fixed.mp4
```
然后用 `muscle-fixed.mp4` 替换原文件。
