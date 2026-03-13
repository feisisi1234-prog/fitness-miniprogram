# TabBar 图标说明

## 问题
微信小程序的 tabBar 只支持 PNG/JPG 格式，不支持 SVG。

## 解决方案
需要将 SVG 图标转换为 PNG 格式（建议尺寸：81x81px）

## 转换方法

### 方法1：使用在线工具
1. 访问 https://www.aconvert.com/cn/image/svg-to-png/
2. 上传 SVG 文件
3. 设置输出尺寸为 81x81
4. 下载 PNG 文件

### 方法2：使用设计工具
- Figma: 导入 SVG，导出为 PNG @2x (81x81)
- Sketch: 导入 SVG，导出为 PNG @2x (81x81)
- Adobe XD: 导入 SVG，导出为 PNG @2x (81x81)

### 方法3：使用命令行工具
如果安装了 ImageMagick：
```bash
magick convert -background none -density 300 -resize 81x81 home.svg home.png
```

## 图标列表
需要转换的图标：
- home.svg → home.png
- home-active.svg → home-active.png
- training.svg → training.png
- training-active.svg → training-active.png
- plan.svg → plan.png
- plan-active.svg → plan-active.png
- profile.svg → profile.png
- profile-active.svg → profile-active.png

## 配置
转换完成后，在 app.json 中配置：
```json
"tabBar": {
  "color": "#94a3b8",
  "selectedColor": "#10b981",
  "backgroundColor": "#ffffff",
  "borderStyle": "white",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/icons/tabbar/home.png",
      "selectedIconPath": "images/icons/tabbar/home-active.png"
    },
    {
      "pagePath": "pages/training/training",
      "text": "训练",
      "iconPath": "images/icons/tabbar/training.png",
      "selectedIconPath": "images/icons/tabbar/training-active.png"
    },
    {
      "pagePath": "pages/custom-plans/custom-plans",
      "text": "计划",
      "iconPath": "images/icons/tabbar/plan.png",
      "selectedIcon