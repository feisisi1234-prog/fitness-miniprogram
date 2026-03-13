# 图片路径自动更新指南

## 📋 图片路径映射表

当你下载完所有图片并放入 `images` 文件夹后，需要更新以下路径：

### 计划4：腹肌撕裂者
```
placeholder.png → eluositizhuanti.png     (俄罗斯转体)
placeholder.png → pingbanzhictaitui.png   (平板支撑抬腿)
placeholder.png → juanfu.png              (卷腹)
```

### 计划5：有氧舞蹈
```
placeholder.png → rewuwubu.png            (热身舞步)
placeholder.png → youyangwudaozuhe.png    (有氧舞蹈组合)
placeholder.png → gaoqiangduwubu.png      (高强度舞步)
placeholder.png → fangsongwubu.png        (放松舞步)
```

### 计划6：普拉提核心
```
placeholder.png → baicihuxi.png           (百次呼吸)
placeholder.png → dantuihuaquan.png       (单腿画圈)
placeholder.png → gundongruqiu.png        (滚动如球)
placeholder.png → cewotaitui.png          (侧卧抬腿)
```

### 计划7：哑铃全身训练
```
placeholder.png → yalingshendun.png       (哑铃深蹲)
placeholder.png → yalingwotui.png         (哑铃卧推)
placeholder.png → yalinghuachuan.png      (哑铃划船)
placeholder.png → yalingjiantui.png       (哑铃肩推)
```

### 计划8：晨间唤醒瑜伽
```
placeholder.png → yingshi.png             (婴儿式)
placeholder.png → shanshi.png             (山式)
```

---

## 🔧 手动更新步骤

如果你想手动更新，请按照以下步骤：

### 1. 打开文件
打开 `pages/plan-detail/plan-detail.js`

### 2. 查找并替换

#### 计划4：腹肌撕裂者（第4个计划，id: 4）
找到第232行附近：
```javascript
// 俄罗斯转体
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/eluositizhuanti.png',
```

找到第242行附近：
```javascript
// 平板支撑抬腿
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/pingbanzhictaitui.png',
```

找到第251行附近：
```javascript
// 卷腹
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/juanfu.png',
```

#### 计划5：有氧舞蹈（第5个计划，id: 5）
找到第284行附近：
```javascript
// 热身舞步
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/rewuwubu.png',
```

找到第293行附近：
```javascript
// 有氧舞蹈组合
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/youyangwudaozuhe.png',
```

找到第302行附近：
```javascript
// 高强度舞步
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/gaoqiangduwubu.png',
```

找到第311行附近：
```javascript
// 放松舞步
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/fangsongwubu.png',
```

#### 计划6：普拉提核心（第6个计划，id: 6）
找到第344行附近：
```javascript
// 百次呼吸
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/baicihuxi.png',
```

找到第353行附近：
```javascript
// 单腿画圈
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/dantuihuaquan.png',
```

找到第362行附近：
```javascript
// 滚动如球
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/gundongruqiu.png',
```

找到第371行附近：
```javascript
// 侧卧抬腿
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/cewotaitui.png',
```

#### 计划7：哑铃全身训练（第7个计划，id: 7）
找到第404行附近：
```javascript
// 哑铃深蹲
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/yalingshendun.png',
```

找到第413行附近：
```javascript
// 哑铃卧推
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/yalingwotui.png',
```

找到第422行附近：
```javascript
// 哑铃划船
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/yalinghuachuan.png',
```

找到第431行附近：
```javascript
// 哑铃肩推
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/yalingjiantui.png',
```

#### 计划8：晨间唤醒瑜伽（第8个计划，id: 8）
找到第464行附近：
```javascript
// 婴儿式
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/yingshi.png',
```

找到第491行附近：
```javascript
// 山式
image: '/images/placeholder.png',
```
替换为：
```javascript
image: '/images/shanshi.png',
```

---

## ✅ 验证步骤

更新完成后，请验证：

1. 打开微信开发者工具
2. 进入"训练"页面
3. 依次点击以下计划的"详情"：
   - 腹肌撕裂者
   - 有氧舞蹈
   - 普拉提核心
   - 哑铃全身训练
   - 晨间唤醒瑜伽
4. 查看每个动作的图片是否正确显示
5. 如果图片不显示，检查：
   - 图片文件名是否正确
   - 图片是否在 `images` 文件夹中
   - 图片格式是否正确（PNG或JPG）

---

## 🐛 常见问题

### 问题1：图片不显示
**原因**：文件名不匹配
**解决**：检查图片文件名是否与代码中的完全一致（包括大小写）

### 问题2：图片显示模糊
**原因**：图片分辨率太低
**解决**：重新下载更高分辨率的图片

### 问题3：图片加载慢
**原因**：图片文件太大
**解决**：使用 TinyPNG 等工具压缩图片

---

## 💡 提示

- 建议一次性下载所有图片，然后统一更新
- 更新前先备份 `plan-detail.js` 文件
- 可以使用编辑器的"查找替换"功能批量替换

---

完成后，你的训练计划就会显示专业的动作图片了！💪
