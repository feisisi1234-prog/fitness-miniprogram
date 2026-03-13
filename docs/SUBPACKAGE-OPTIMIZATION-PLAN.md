# 分包优化方案

## 当前状态分析

### 主包页面（必须保留）
- `pages/index/index` - 首页（TabBar）
- `pages/training/training` - 训练（TabBar）
- `pages/custom-plans/custom-plans` - 计划（TabBar）
- `pages/profile/profile` - 我的（TabBar）

### 可分包页面（7个）
1. `pages/profile/edit/edit` - 个人信息编辑
2. `pages/muscle-analysis/muscle-analysis` - 肌肉分析（95.32KB，最大页面）
3. `pages/plan-detail/plan-detail` - 计划详情
4. `pages/training-records/training-records` - 训练记录
5. `pages/settings/settings` - 设置
6. `pages/training-session/training-session` - 训练会话
7. `pages/timer/timer` - 计时器

### 组件使用情况
- `navigation-bar` (8.1KB) - 被主包页面使用，必须保留在主包

## 分包方案建议

### 方案一：按功能模块分包（推荐）

```json
{
  "pages": [
    "pages/index/index",
    "pages/training/training",
    "pages/custom-plans/custom-plans",
    "pages/profile/profile"
  ],
  "subpackages": [
    {
      "root": "subpkg-training",
      "name": "training",
      "pages": [
        "pages/training-session/training-session",
        "pages/timer/timer",
        "pages/plan-detail/plan-detail"
      ]
    },
    {
      "root": "subpkg-analysis",
      "name": "analysis",
      "pages": [
        "pages/muscle-analysis/muscle-analysis"
      ]
    },
    {
      "root": "subpkg-profile",
      "name": "profile",
      "pages": [
        "pages/profile/edit/edit",
        "pages/training-records/training-records",
        "pages/settings/settings"
      ]
    }
  ],
  "preloadRule": {
    "pages/training/training": {
      "network": "all",
      "packages": ["training"]
    },
    "pages/profile/profile": {
      "network": "all",
      "packages": ["profile"]
    }
  }
}
```

**优点**：
- 按业务逻辑清晰分包
- 可以使用预加载优化用户体验
- 主包大小减少约 160KB

### 方案二：按使用频率分包

```json
{
  "pages": [
    "pages/index/index",
    "pages/training/training",
    "pages/custom-plans/custom-plans",
    "pages/profile/profile"
  ],
  "subpackages": [
    {
      "root": "subpkg-frequent",
      "name": "frequent",
      "pages": [
        "pages/training-session/training-session",
        "pages/plan-detail/plan-detail"
      ]
    },
    {
      "root": "subpkg-infrequent",
      "name": "infrequent",
      "pages": [
        "pages/muscle-analysis/muscle-analysis",
        "pages/training-records/training-records",
        "pages/settings/settings",
        "pages/profile/edit/edit",
        "pages/timer/timer"
      ]
    }
  ],
  "preloadRule": {
    "pages/training/training": {
      "network": "all",
      "packages": ["frequent"]
    }
  }
}
```

**优点**：
- 高频页面独立分包，可预加载
- 低频页面按需加载
- 分包结构简单

## 分包异步化

如果未来需要在分包中使用独立组件，可以使用分包异步化：

### 1. 在 app.json 中启用分包异步化

```json
{
  "lazyCodeLoading": "requiredComponents"
}
```

### 2. 在分包中创建独立组件

例如，如果 `muscle-analysis` 页面需要专用组件：

```
subpkg-analysis/
  ├── pages/
  │   └── muscle-analysis/
  └── components/
      └── muscle-diagram/
```

### 3. 使用组件占位符

```json
{
  "usingComponents": {
    "muscle-diagram": "./components/muscle-diagram/muscle-diagram"
  },
  "componentPlaceholder": {
    "muscle-diagram": "view"
  }
}
```

## 当前结论

✅ **当前不需要分包优化**

原因：
1. 主包大小仅 0.34MB，远低于 1.5MB 警戒线
2. 所有组件都被主包页面使用，不存在"仅被分包依赖"的情况
3. 没有配置分包，因此不存在分包依赖问题

## 何时需要分包

建议在以下情况下考虑分包：
1. 主包大小超过 1.2MB
2. 首次加载时间过长（>3秒）
3. 有大量低频功能页面
4. 需要独立更新某些功能模块

## 实施步骤

如果决定实施分包：

1. **备份当前代码**
2. **修改 app.json**，添加 subpackages 配置
3. **移动页面文件**到对应的分包目录
4. **更新页面路径引用**（如果有跳转逻辑）
5. **测试所有页面跳转**和组件引用
6. **配置预加载规则**优化体验
7. **检查包大小**确认优化效果

## 注意事项

1. TabBar 页面必须在主包
2. 分包不能互相引用页面
3. 分包可以引用主包的组件和资源
4. 主包不能引用分包的组件
5. 分包异步化需要基础库 2.11.1+
