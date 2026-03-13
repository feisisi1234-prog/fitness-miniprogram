# 图片压缩指南

## 问题
小程序代码包大小超过 2MB 限制（当前约 2.9MB），主要是因为 images 文件夹中的图片文件过大。

## 解决方案

### 方案一：使用 Node.js 脚本（推荐）

1. **安装依赖**
```bash
npm install sharp
```

2. **运行压缩脚本**
```bash
node scripts/compress-images.js
```

3. **查看结果**
- 原图片会被压缩后的图片替换
- 原图片会备份到 `images_backup_[时间戳]` 文件夹
- 控制台会显示压缩统计信息

### 方案二：使用 PowerShell 脚本

1. **运行脚本**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/compress-images.ps1
```

2. **如果有 ImageMagick**
- 脚本会自动检测并使用 ImageMagick 进行高质量压缩
- 下载地址: https://imagemagick.org/script/download.php

3. **如果没有 ImageMagick**
- 脚本会使用 Windows 自带的 .NET 图片处理功能
- 压缩效果可能不如 ImageMagick

### 方案三：手动在线压缩

1. **访问在线压缩工具**
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/

2. **上传并压缩最大的图片**
- yalingwotui.png (393.8KB)
- gongbu.png (251.49KB)
- maonius.png (238.9KB)
- baicihuxi.png (196.52KB)
- shus.png (195.96KB)

3. **下载压缩后的图片并替换原文件**

## 预期效果

压缩后图片总大小应该能减少 40-60%，从约 2.9MB 降到 1.2-1.7MB，满足 2MB 限制。

## 注意事项

1. **备份重要**：脚本会自动备份原图片，如果压缩效果不满意可以恢复
2. **质量检查**：压缩后请在小程序中检查图片显示效果
3. **渐进式压缩**：如果一次压缩后仍超限，可以调整脚本中的 quality 参数（降低到 70-75）

## 其他优化建议

1. **使用 WebP 格式**：WebP 比 PNG/JPG 小 25-35%
2. **按需加载**：不常用的图片可以放到云存储，按需下载
3. **分包加载**：将部分页面和资源放到分包中

## 恢复备份

如果需要恢复原图片：
```bash
# 找到备份文件夹 images_backup_[时间戳]
# 将备份文件复制回 images 文件夹
Copy-Item images_backup_*/\* images/ -Force
```
