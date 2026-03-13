# 修复计划详情页面数据不匹配问题

## 🐛 问题描述

用户点击训练页面的计划列表查看详情时，所有计划都显示为"全身力量训练"的内容，而不是对应计划的实际内容。

## 🔍 问题分析

### 根本原因

**数据不同步**：
- `pages/training/training.js` 中定义了8个训练计划（id: 1-8）
- `pages/plan-detail/plan-detail.js` 中只定义了4个训练计划（id: 1-4）

### 问题代码

在 `pages/plan-detail/plan-detail.js` 的 `loadPlanDetail` 函数中：

```javascript
const plan = plans.find(p => p.id === planId) || plans[0];
```

**执行流程**：
1. 用户点击id为5、6、7、8的计划
2. `plans.find(p => p.id === planId)` 找不到匹配的计划，返回 `undefined`
3. 使用 `|| plans[0]` 作为fallback，返回第一个计划（全身力量训练）
4. 所有未定义的计划都显示为"全身力量训练"

### 影响范围

**受影响的计划**：
- id: 5 - 有氧舞蹈
- id: 6 - 普拉提核心
- id: 7 - 哑铃全身训练
- id: 8 - 晨间唤醒瑜伽

**用户体验**：
- 点击这些计划的详情，都显示"全身力量训练"的内容
- 造成用户困惑，无法查看正确的计划信息

## ✅ 解决方案

### 修改内容

在 `pages/plan-detail/plan-detail.js` 中添加缺失的4个计划数据：

1. **有氧舞蹈** (id: 5)
   - 35分钟，300卡路里
   - 4个舞蹈动作
   - 适合中级

2. **普拉提核心** (id: 6)
   - 25分钟，180卡路里
   - 4个普拉提动作
   - 适合中级

3. **哑铃全身训练** (id: 7)
   - 35分钟，220卡路里
   - 4个哑铃动作
   - 适合中级

4. **晨间唤醒瑜伽** (id: 8)
   - 15分钟，80卡路里
   - 4个瑜伽动作
   - 适合初级

### 数据结构

每个计划包含以下完整信息：

```javascript
{
  id: 5,
  title: '有氧舞蹈',
  description: '结合音乐的有氧运动...',
  duration: '35分钟',
  calories: 300,
  difficulty: '中级',
  category: '有氧运动',
  icon: '/images/placeholder.png',
  rating: 4.8,
  participants: 3200,
  tags: ['舞蹈', '音乐', '燃脂'],
  equipment: ['无器械'],
  targetMuscles: ['全身', '心肺', '协调性'],
  benefits: ['燃烧卡路里', '提高心肺功能', ...],
  steps: [
    {
      id: 1,
      name: '热身舞步',
      sets: 1,
      reps: 300,
      rest: 30,
      image: '/images/placeholder.png',
      description: '跟随音乐节奏...'
    },
    // ... 更多动作
  ],
  tips: [
    '选择自己喜欢的音乐...',
    // ... 更多提示
  ]
}
```

## 📊 修复前后对比

### 修复前

| 计划ID | 计划名称 | 点击详情显示 | 状态 |
|--------|----------|--------------|------|
| 1 | 全身力量训练 | 全身力量训练 | ✅ 正确 |
| 2 | HIIT燃脂训练 | HIIT燃脂训练 | ✅ 正确 |
| 3 | 瑜伽拉伸 | 瑜伽拉伸 | ✅ 正确 |
| 4 | 腹肌撕裂者 | 腹肌撕裂者 | ✅ 正确 |
| 5 | 有氧舞蹈 | 全身力量训练 | ❌ 错误 |
| 6 | 普拉提核心 | 全身力量训练 | ❌ 错误 |
| 7 | 哑铃全身训练 | 全身力量训练 | ❌ 错误 |
| 8 | 晨间唤醒瑜伽 | 全身力量训练 | ❌ 错误 |

### 修复后

| 计划ID | 计划名称 | 点击详情显示 | 状态 |
|--------|----------|--------------|------|
| 1 | 全身力量训练 | 全身力量训练 | ✅ 正确 |
| 2 | HIIT燃脂训练 | HIIT燃脂训练 | ✅ 正确 |
| 3 | 瑜伽拉伸 | 瑜伽拉伸 | ✅ 正确 |
| 4 | 腹肌撕裂者 | 腹肌撕裂者 | ✅ 正确 |
| 5 | 有氧舞蹈 | 有氧舞蹈 | ✅ 正确 |
| 6 | 普拉提核心 | 普拉提核心 | ✅ 正确 |
| 7 | 哑铃全身训练 | 哑铃全身训练 | ✅ 正确 |
| 8 | 晨间唤醒瑜伽 | 晨间唤醒瑜伽 | ✅ 正确 |

## 🎯 验证方法

### 测试步骤

1. 打开小程序，进入"训练"页面
2. 依次点击以下计划的"详情"按钮：
   - 有氧舞蹈
   - 普拉提核心
   - 哑铃全身训练
   - 晨间唤醒瑜伽
3. 验证每个计划显示的内容是否正确

### 预期结果

- 每个计划显示对应的标题、描述、动作列表
- 不再出现所有计划都显示"全身力量训练"的情况
- 动作数量、时长、卡路里等信息正确

## 📝 注意事项

### 1. 数据一致性

**重要**：确保两个文件中的计划数据保持一致：
- `pages/training/training.js` - 计划列表数据
- `pages/plan-detail/plan-detail.js` - 计划详情数据

**建议**：
- 将计划数据提取到独立的数据文件（如 `utils/plans-data.js`）
- 两个页面共享同一份数据源
- 避免数据不同步的问题

### 2. 图片资源

**当前状态**：
- 新增的4个计划使用 `placeholder.png` 作为动作图片
- 部分动作复用了现有图片（如猫牛式、下犬式）

**后续优化**：
- 为新增计划准备专门的动作图片
- 替换 `placeholder.png` 为实际图片
- 提升用户体验

### 3. 扩展性

**如果需要添加新计划**：
1. 在 `training.js` 中添加计划基本信息
2. 在 `plan-detail.js` 中添加计划详细信息
3. 确保两处的 `id` 保持一致
4. 准备相应的图片资源

## 🔄 未来优化建议

### 1. 数据统一管理

创建 `utils/plans-data.js`：

```javascript
// utils/plans-data.js
const plansData = [
  {
    id: 1,
    title: '全身力量训练',
    // ... 完整数据
  },
  // ... 更多计划
];

module.exports = {
  plansData,
  getPlanById: (id) => plansData.find(p => p.id === id),
  getAllPlans: () => plansData
};
```

在页面中使用：

```javascript
// pages/training/training.js
const { getAllPlans } = require('../../utils/plans-data.js');

Page({
  data: {
    plans: getAllPlans()
  }
});

// pages/plan-detail/plan-detail.js
const { getPlanById } = require('../../utils/plans-data.js');

Page({
  loadPlanDetail(planId) {
    const plan = getPlanById(planId);
    this.setData({ plan });
  }
});
```

### 2. 错误处理优化

改进fallback逻辑：

```javascript
const plan = plans.find(p => p.id === planId);

if (!plan) {
  wx.showToast({
    title: '计划不存在',
    icon: 'none'
  });
  wx.navigateBack();
  return;
}

this.setData({ plan });
```

### 3. 添加日志

帮助调试数据问题：

```javascript
loadPlanDetail(planId) {
  console.log('加载计划详情, ID:', planId);
  const plan = plans.find(p => p.id === planId);
  
  if (!plan) {
    console.error('未找到计划, ID:', planId);
  } else {
    console.log('找到计划:', plan.title);
  }
  
  // ...
}
```

## 📁 修改的文件

1. `pages/plan-detail/plan-detail.js`
   - 添加了4个缺失的计划数据（id: 5-8）
   - 每个计划包含完整的详情信息
   - 保持与training.js的数据一致性

## 🎉 总结

成功修复了计划详情页面数据不匹配的问题。现在用户点击任何计划的详情，都能看到对应的正确内容，不再出现所有计划都显示"全身力量训练"的情况。

**修复效果**：
- ✅ 8个计划全部显示正确
- ✅ 数据完整，包含动作、提示等信息
- ✅ 用户体验得到改善

---

问题已解决！✅
