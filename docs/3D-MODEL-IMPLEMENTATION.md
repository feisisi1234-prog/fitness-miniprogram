# 3D人体模型实施指南

## 概述
本文档详细说明如何在微信小程序中实现真正的3D人体肌肉模型，支持触摸旋转、缩放等交互。

## 前置要求

### 1. 开发环境
- 微信开发者工具 1.06.0 或更高版本
- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器

### 2. 必需的依赖包
```bash
npm install three three-platformize
```

或使用 yarn:
```bash
yarn add three three-platformize
```

## 详细实施步骤

### 步骤1：安装Three.js小程序适配库

1. 在项目根目录执行：
```bash
npm install three-platformize three
```

2. 构建npm包：
   - 打开微信开发者工具
   - 点击菜单：工具 -> 构建npm
   - 等待构建完成

### 步骤2：准备3D模型文件

#### 推荐的模型来源：

**免费资源：**
1. **Sketchfab** (https://sketchfab.com)
   - 搜索关键词："human anatomy", "muscle anatomy", "body anatomy"
   - 筛选：可下载、CC授权
   - 下载格式：GLB（推荐）或GLTF

2. **Free3D** (https://free3d.com)
   - 分类：Characters -> Anatomy
   - 格式：选择GLTF/GLB

3. **TurboSquid Free** (https://www.turbosquid.com/Search/3D-Models/free/anatomy)

**付费资源（高质量）：**
- CGTrader: $20-$100
- TurboSquid: $30-$200
- Sketchfab Store: $15-$80

#### 模型要求：
- 格式：GLB（推荐）或GLTF
- 大小：建议 < 10MB（小程序限制）
- 面数：建议 < 50,000 三角面（性能考虑）
- 贴图：建议使用压缩的纹理（JPG格式，< 2MB）

#### 模型优化（如果文件太大）：
使用Blender进行优化：
1. 下载安装Blender (https://www.blender.org)
2. 导入模型：File -> Import -> glTF 2.0
3. 减面：选择模型 -> Modifiers -> Decimate -> Ratio: 0.5
4. 压缩纹理：UV Editing -> 导出为JPG，质量80%
5. 导出：File -> Export -> glTF 2.0 -> Format: GLB

### 步骤3：放置模型文件

将模型文件放到项目中：
```
/models
  └── human-anatomy.glb  (你的3D模型文件)
```

### 步骤4：完整的组件代码

由于代码较长，已经创建在 `components/model-viewer/` 目录中。

需要完善的部分：

#### 4.1 更新 model-viewer.js

在 `initThreeJS()` 方法中，取消注释并完善Three.js代码：

```javascript
// 导入Three.js
const THREE = require('three');
const { registerCanvas } = require('three-platformize');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');

// 注册Canvas
registerCanvas(canvas);

// 创建场景
this.scene = new THREE.Scene();
this.scene.background = new THREE.Color(0xf5f7fa);

// 创建相机
const aspect = width / height;
this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
this.camera.position.set(0, 1, 3);

// 创建渲染器
const gl = canvas.getContext('webgl');
this.renderer = new THREE.WebGLRenderer({ 
  canvas, 
  context: gl,
  antialias: true 
});
this.renderer.setSize(width, height);
this.renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
this.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
this.scene.add(directionalLight);

// 加载模型
this.loadModel();

// 开始渲染
this.animate();
```

#### 4.2 完善 loadModel() 方法

```javascript
loadModel() {
  const loader = new GLTFLoader();
  
  loader.load(
    '/models/human-anatomy.glb',  // 模型路径
    (gltf) => {
      this.model = gltf.scene;
      
      // 调整模型大小和位置
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // 居中模型
      this.model.position.sub(center);
      
      // 缩放到合适大小
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      this.model.scale.setScalar(scale);
      
      this.scene.add(this.model);
      this.setData({ loading: false });
    },
    (progress) => {
      const percent = Math.floor((progress.loaded / progress.total) * 100);
      this.setData({ loadingProgress: percent });
    },
    (error) => {
      console.error('模型加载失败:', error);
      wx.showToast({
        title: '模型加载失败',
        icon: 'none'
      });
    }
  );
}
```

### 步骤5：在页面中使用组件

#### 5.1 注册组件

在 `pages/muscle-analysis/muscle-analysis.json` 中：
```json
{
  "usingComponents": {
    "model-viewer": "/components/model-viewer/model-viewer"
  }
}
```

#### 5.2 使用组件

在 `pages/muscle-analysis/muscle-analysis.wxml` 中：
```xml
<!-- 替换原来的人体图 -->
<view class="model-container">
  <view class="diagram-title">
    <text>3D人体肌肉模型</text>
    <text class="diagram-tip">触摸旋转 · 双指缩放</text>
  </view>
  
  <model-viewer 
    modelUrl="/models/human-anatomy.glb"
    autoRotate="{{true}}"
  ></model-viewer>
</view>
```

### 步骤6：配置小程序

#### 6.1 project.config.json

确保启用了npm支持：
```json
{
  "setting": {
    "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./"
      }
    ]
  }
}
```

#### 6.2 app.json

如果模型文件较大，可能需要调整分包配置。

## 性能优化建议

### 1. 模型优化
- 使用Draco压缩（可减少70%文件大小）
- 减少多边形数量
- 合并材质和纹理
- 使用LOD（细节层次）技术

### 2. 渲染优化
```javascript
// 只在需要时渲染
let needsRender = true;

function animate() {
  if (needsRender) {
    renderer.render(scene, camera);
    needsRender = false;
  }
  requestAnimationFrame(animate);
}

// 在交互时标记需要渲染
onTouchMove() {
  needsRender = true;
}
```

### 3. 内存管理
```javascript
// 组件卸载时清理资源
detached() {
  if (this.renderer) {
    this.renderer.dispose();
  }
  if (this.model) {
    this.model.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
```

## 常见问题

### Q1: 模型不显示
- 检查模型路径是否正确
- 检查模型文件是否损坏
- 查看控制台错误信息
- 确认Canvas节点获取成功

### Q2: 性能卡顿
- 减少模型面数
- 降低纹理分辨率
- 使用requestAnimationFrame节流
- 关闭不必要的光源和阴影

### Q3: 触摸不响应
- 确认Canvas的disable-scroll="true"
- 检查触摸事件绑定
- 查看是否有其他元素遮挡

### Q4: 模型太大或太小
- 调整camera.position.z的值
- 使用Box3计算模型尺寸并自动缩放
- 调整模型的scale值

## 进阶功能

### 1. 高亮特定肌肉
```javascript
highlightMuscle(muscleName) {
  this.model.traverse((child) => {
    if (child.isMesh && child.name === muscleName) {
      child.material.emissive.setHex(0xff0000);
      child.material.emissiveIntensity = 0.5;
    }
  });
}
```

### 2. 添加标注点
```javascript
addLabel(position, text) {
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  this.scene.add(sprite);
}
```

### 3. 动画播放
```javascript
playAnimation(animationName) {
  const clip = THREE.AnimationClip.findByName(this.model.animations, animationName);
  const mixer = new THREE.AnimationMixer(this.model);
  const action = mixer.clipAction(clip);
  action.play();
}
```

## 参考资源

- Three.js官方文档: https://threejs.org/docs/
- three-platformize: https://github.com/yannliao/three-platformize
- 微信小程序WebGL: https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html
- Blender教程: https://www.blender.org/support/tutorials/

## 预算估算

- 3D模型购买: $0-$200
- 开发时间: 3-5天
- 测试优化: 1-2天

总计: 约4-7个工作日

## 总结

实现3D模型需要：
1. 安装three-platformize和three
2. 准备优化好的3D模型文件
3. 创建WebGL Canvas组件
4. 实现触摸交互逻辑
5. 性能优化和测试

虽然比2D方案复杂，但能提供更专业的用户体验。
