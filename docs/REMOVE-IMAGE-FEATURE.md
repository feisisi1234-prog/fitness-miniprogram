# 移除自定义计划图片功能说明

## 📋 修改概述

根据用户需求，移除了自定义训练计划中的图片上传和显示功能，简化界面和操作流程。

## 🎯 修改内容

### 1. 自定义计划编辑页面（custom-plans）

**文件**：`pages/custom-plans/custom-plans.wxml`

**移除内容**：
- 动作编辑表单中的"动作标准图"上传区域
- 图片预览组件
- 上传提示文字

**修改前**：
```xml
<view class="form-row">
  <text class="form-label-small">动作标准图</text>
  <view class="image-upload">
    <image src="{{exercise.image}}" class="exercise-image"></image>
    <text class="upload-tip">点击上传图片</text>
  </view>
</view>
```

**修改后**：
```xml
<!-- 已移除图片上传区域 -->
```

**影响**：
- 用户创建/编辑自定义计划时，不再显示图片上传选项
- 界面更简洁，操作更快捷
- 减少了用户的操作步骤

### 2. 训练会话页面（training-session）

**文件**：`pages/training-session/training-session.wxml`

**移除内容**：
- 动作名称下方的图片显示区域

**修改前**：
```xml
<view class="exercise-header">
  <text class="exercise-name">{{currentExercise.name}}</text>
  <view class="set-info">
    <text class="set-text">第 {{currentSet}}/{{currentExercise.totalSets}} 组</text>
  </view>
</view>

<image class="exercise-image" src="{{currentExercise.image}}" mode="aspectFit"></image>

<view class="exercise-details">
  ...
</view>
```

**修改后**：
```xml
<view class="exercise-header">
  <text class="exercise-name">{{currentExercise.name}}</text>
  <view class="set-info">
    <text class="set-text">第 {{currentSet}}/{{currentExercise.totalSets}} 组</text>
  </view>
</view>

<view class="exercise-details">
  ...
</view>
```

**影响**：
- 训练时不再显示动作图片
- 界面更紧凑，信息更集中
- 用户可以更专注于训练数据

### 3. 样式调整（training-session）

**文件**：`pages/training-session/training-session.wxss`

**修改内容**：
- 增加 `exercise-details` 的上边距，补偿移除图片后的空间

**修改前**：
```css
.exercise-details {
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;
}
```

**修改后**：
```css
.exercise-details {
  display: flex;
  gap: 30rpx;
  margin-top: 40rpx;
  margin-bottom: 20rpx;
}
```

**影响**：
- 保持界面布局的平衡
- 避免元素过于紧凑

## 📊 对比效果

### 自定义计划编辑页面

**修改前**：
```
动作 1
├── 动作名称: [输入框]
├── 组数: [输入框]  间歇时间: [输入框]
└── 动作标准图: [图片上传区域]
```

**修改后**：
```
动作 1
├── 动作名称: [输入框]
└── 组数: [输入框]  间歇时间: [输入框]
```

### 训练会话页面

**修改前**：
```
[动作名称]
[第 X/Y 组]

[动作图片 - 400rpx高度]

[组数信息] [休息时间]
[动作要领]
```

**修改后**：
```
[动作名称]
[第 X/Y 组]

[组数信息] [休息时间]
[动作要领]
```

## ✅ 优势

1. **界面更简洁**
   - 减少视觉干扰
   - 信息更集中
   - 操作更直观

2. **创建更快捷**
   - 减少必填项
   - 无需上传图片
   - 快速创建计划

3. **性能更好**
   - 减少图片加载
   - 降低存储占用
   - 提升页面响应速度

4. **维护更简单**
   - 无需管理图片资源
   - 减少数据存储
   - 降低复杂度

## 📝 注意事项

### 1. 现有数据兼容性

**问题**：已创建的自定义计划可能包含图片数据

**处理**：
- 图片数据仍保留在存储中
- 只是不再显示
- 不影响现有计划的使用

### 2. 预设计划

**说明**：
- 预设计划（全身力量训练、HIIT等）仍然包含图片
- 这些图片在 `pages/plan-detail` 和 `pages/training-session` 中使用
- 只有自定义计划不显示图片

### 3. CSS样式

**说明**：
- 相关CSS样式（`.exercise-image`, `.image-upload`）仍保留
- 不会影响功能
- 如需完全清理，可以删除这些样式

## 🔄 如果需要恢复

如果将来需要恢复图片功能，可以：

1. 恢复 `custom-plans.wxml` 中的图片上传区域
2. 恢复 `training-session.wxml` 中的图片显示
3. 调整 `training-session.wxss` 中的 `margin-top`
4. 添加图片上传逻辑（如果需要）

## 📁 修改的文件

1. `pages/custom-plans/custom-plans.wxml` - 移除图片上传UI
2. `pages/training-session/training-session.wxml` - 移除图片显示
3. `pages/training-session/training-session.wxss` - 调整布局间距

## 🎉 总结

成功移除了自定义训练计划中的图片功能，使界面更简洁、操作更快捷。用户现在可以更专注于训练内容本身，而不需要为每个动作准备图片。

---

修改完成！✅
