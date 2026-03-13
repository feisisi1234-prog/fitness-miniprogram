# 语法错误修复说明

## 问题描述
在修改 `pages/custom-plans/custom-plans.js` 文件时，`showRecognitionOptions` 函数被意外重复了3次，导致语法错误。

## 错误信息
```
Error: file: pages/custom-plans/custom-plans.js
unknown: Unexpected token, expected "," (814:14)
```

## 错误原因
在使用 `strReplace` 工具时，`oldStr` 参数没有包含完整的重复代码，导致只替换了部分内容，留下了重复的代码片段。

## 修复方法
删除了重复的代码片段，保留了正确的 `showRecognitionOptions` 函数实现。

## 修复后的代码结构
```javascript
// 显示识别选项
showRecognitionOptions(plan, originalText, quality) {
  const that = this;
  const options = ['手动选择文字', '修改计划', '查看原始文字', '查看识别建议', '重新识别'];
  
  wx.showActionSheet({
    itemList: options,
    success: (actionRes) => {
      if (actionRes.tapIndex === 0) {
        // 手动选择文字
        that.showTextSelection(originalText);
      } else if (actionRes.tapIndex === 1) {
        // 打开编辑表单
        that.editRecognizedPlan(plan);
      } else if (actionRes.tapIndex === 2) {
        // 显示原始文字
        that.showOriginalText(originalText);
      } else if (actionRes.tapIndex === 3) {
        // 显示识别建议
        that.showRecognitionTips(quality);
      } else if (actionRes.tapIndex === 4) {
        // 重新扫描
        that.scanImagePlan();
      }
    }
  });
},
```

## 验证
运行 `getDiagnostics` 工具确认没有语法错误。

## 状态
✅ 已修复
✅ 已验证
✅ 页面可以正常加载
