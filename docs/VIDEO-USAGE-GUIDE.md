# 视频使用指南

## ✅ 已完成的配置

你的视频已经成功集成到肌肉分析页面！

### 文件位置
- 视频文件：`/videos/muscle.mp4`
- 视频播放器组件：`/components/muscle-video-player/`
- 使用页面：`pages/muscle-analysis/`

## 🎬 功能特性

### 1. 基础播放控制
- ▶️ 播放/暂停
- 🔁 循环播放
- 🔇/🔊 静音切换
- ⛶ 全屏播放

### 2. 高级功能
- 播放速度调节（0.5x - 2.0x）
- 进度条显示
- 时间显示（当前时间/总时长）
- 自定义控制栏

### 3. 用户体验
- 加载动画
- 错误提示和重试
- 操作提示
- 流畅的动画效果

## 📝 如何使用

### 查看视频
1. 打开小程序
2. 进入"肌肉分析"页面
3. 选择"肌纤维走向"标签
4. 视频会自动显示

### 控制视频
- **播放/暂停**：点击左下角播放按钮
- **调节速度**：点击"1.0x"按钮切换速度
- **静音/取消静音**：点击音量图标
- **循环播放**：点击循环图标（绿色表示已开启）
- **全屏观看**：点击全屏图标

## 🔧 自定义配置

### 修改视频设置

在 `pages/muscle-analysis/muscle-analysis.wxml` 中找到：

```xml
<muscle-video-player
  videoUrl="/videos/muscle.mp4"
  posterUrl="/images/placeholder.png"
  autoplay="{{false}}"          <!-- 是否自动播放 -->
  loop="{{true}}"                <!-- 是否循环播放 -->
  muted="{{true}}"               <!-- 是否静音 -->
  objectFit="contain"            <!-- 填充模式 -->
  showCustomControls="{{true}}"  <!-- 显示自定义控制栏 -->
></muscle-video-player>
```

### 填充模式选项
- `contain`：保持比例，完整显示（推荐）
- `cover`：保持比例，填满容器
- `fill`：拉伸填满容器

### 添加多个视频

如果你有多个视频（如正面、背面、侧面），可以这样配置：

```xml
<muscle-video-player
  videos="{{muscleVideos}}"
  showCustomControls="{{true}}"
></muscle-video-player>
```

在 JS 文件中定义：

```javascript
data: {
  muscleVideos: [
    {
      id: 1,
      name: '正面',
      url: '/videos/muscle-front.mp4',
      poster: '/images/poster-front.png'
    },
    {
      id: 2,
      name: '背面',
      url: '/videos/muscle-back.mp4',
      poster: '/images/poster-back.png'
    },
    {
      id: 3,
      name: '侧面',
      url: '/videos/muscle-side.mp4',
      poster: '/images/poster-side.png'
    }
  ]
}
```

## 📹 视频要求

### 推荐规格
- **格式**：MP4（H.264编码）
- **分辨率**：720p (1280x720) 或 1080p (1920x1080)
- **帧率**：24-30 fps
- **码率**：1-3 Mbps
- **文件大小**：< 20MB（小程序限制）

### 视频优化建议

如果视频文件太大，可以使用以下工具压缩：

#### 1. 使用FFmpeg（命令行）
```bash
ffmpeg -i muscle.mp4 -vcodec h264 -acodec aac -b:v 1500k -b:a 128k muscle-compressed.mp4
```

#### 2. 使用在线工具
- CloudConvert: https://cloudconvert.com/mp4-converter
- Online-Convert: https://www.online-convert.com/
- HandBrake: https://handbrake.fr/ (桌面软件)

#### 3. 推荐设置
- 视频编码：H.264
- 音频编码：AAC
- 视频码率：1500 kbps
- 音频码率：128 kbps
- 分辨率：1280x720

## 🎨 自定义样式

### 修改播放器尺寸

在 `components/muscle-video-player/muscle-video-player.wxss` 中：

```css
.video-player-container {
  height: 800rpx;  /* 修改这里调整高度 */
}
```

### 修改控制栏颜色

```css
.custom-controls {
  background: linear-gradient(to top, 
    rgba(0, 0, 0, 0.8) 0%,  /* 修改透明度 */
    transparent 100%
  );
}
```

### 修改按钮样式

```css
.control-btn {
  background: rgba(255, 255, 255, 0.15);  /* 修改背景色 */
  border-radius: 30rpx;  /* 修改圆角 */
}
```

## ⚠️ 常见问题

### Q1: 视频不显示
**解决方案：**
1. 检查视频文件路径是否正确：`/videos/muscle.mp4`
2. 确认视频文件格式是MP4
3. 查看控制台错误信息
4. 尝试使用绝对路径

### Q2: 视频加载很慢
**解决方案：**
1. 压缩视频文件
2. 降低视频分辨率
3. 减少视频码率
4. 使用CDN托管视频

### Q3: 视频无法播放
**解决方案：**
1. 确认视频编码格式（必须是H.264）
2. 检查视频是否损坏
3. 尝试重新编码视频
4. 在真机上测试（开发者工具可能有限制）

### Q4: 控制栏不显示
**解决方案：**
1. 确认 `showCustomControls="{{true}}"`
2. 检查CSS样式是否被覆盖
3. 查看z-index层级

### Q5: 视频比例不对
**解决方案：**
修改 `objectFit` 属性：
- `contain`：完整显示（可能有黑边）
- `cover`：填满容器（可能裁剪）
- `fill`：拉伸填满（可能变形）

## 📱 真机测试

### 注意事项
1. 开发者工具的视频播放可能与真机不同
2. 建议在真机上测试所有功能
3. 不同手机性能可能影响播放流畅度
4. iOS和Android的视频播放器略有差异

### 测试清单
- [ ] 视频能正常加载
- [ ] 播放/暂停功能正常
- [ ] 进度条显示正确
- [ ] 全屏功能正常
- [ ] 音量控制正常
- [ ] 速度调节正常
- [ ] 循环播放正常

## 🚀 下一步

### 可以添加的功能
1. **字幕支持**：添加肌肉名称字幕
2. **时间点标记**：标记重要肌肉出现的时间点
3. **截图功能**：截取视频画面
4. **分享功能**：分享视频到朋友圈
5. **收藏功能**：收藏喜欢的视频片段

### 扩展建议
1. 添加更多角度的视频
2. 添加不同训练动作的视频
3. 添加视频播放列表
4. 添加视频下载功能（需要服务器支持）

## 📞 技术支持

如果遇到问题：
1. 查看控制台错误信息
2. 检查视频文件是否正常
3. 参考微信小程序video组件文档
4. 在真机上测试

---

**恭喜！你已经成功将视频集成到小程序中了！** 🎉
