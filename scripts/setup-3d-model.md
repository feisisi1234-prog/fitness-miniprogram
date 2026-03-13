# 3D模型快速设置指南

## 快速开始（5步完成）

### 第1步：安装依赖
在项目根目录打开终端，执行：
```bash
npm install three three-platformize
```

### 第2步：构建npm包
1. 打开微信开发者工具
2. 点击菜单栏：工具 -> 构建npm
3. 等待构建完成（会显示"构建完成"提示）

### 第3步：下载3D模型
推荐网站（选一个）：

**选项A - Sketchfab（推荐，质量高）**
1. 访问：https://sketchfab.com/3d-models/categories/characters-creatures?features=downloadable&sort_by=-likeCount
2. 搜索："human anatomy" 或 "muscle anatomy"
3. 筛选：Downloadable（可下载）
4. 选择一个喜欢的模型，点击Download
5. 选择格式：glTF Binary (.glb)
6. 下载后重命名为：human-anatomy.glb

**选项B - Free3D（免费，无需注册）**
1. 访问：https://free3d.com/3d-models/anatomy
2. 选择一个模型
3. 下载GLB或GLTF格式

**选项C - 使用测试模型**
如果暂时找不到合适的模型，可以先用简单的测试模型：
- 下载地址：https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0
- 推荐：BrainStem.glb 或 CesiumMan.glb

### 第4步：放置模型文件
1. 在项目根目录创建 `models` 文件夹
2. 将下载的模型文件放入，重命名为：`human-anatomy.glb`
3. 最终路径：`/models/human-anatomy.glb`

### 第5步：更新代码

#### A. 更新 components/model-viewer/model-viewer.js

找到 `initThreeJS()` 方法，替换为：

```javascript
async initThreeJS() {
  try {
    // 导入Three.js
    const THREE = require('three');
    const { registerCanvas } = require('three-platformize');
    
    console.log('开始初始化Three.js...');
    
    const query = this.createSelectorQuery();
    query.select('#webgl-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          console.error('无法获取Canvas节点');
          return;
        }
        
        const canvas = res[0].node;
        const { width, height } = res[0];
        
        // 注册Canvas
        registerCanvas(canvas);
        
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f7fa);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 1, 3);
        
        // 创建渲染器
        const gl = canvas.getContext('webgl');
        this.renderer = new THREE.WebGLRenderer({ 
          canvas, 
          context: gl,
          antialias: true 
        });
        this.renderer.setSize(width, height);
        
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
      });
      
  } catch (error) {
    console.error('初始化Three.js失败:', error);
    wx.showToast({
      title: '3D模型加载失败',
      icon: 'none'
    });
  }
}
```

#### B. 更新 loadModel() 方法

```javascript
loadModel() {
  const THREE = require('three');
  const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
  
  const loader = new GLTFLoader();
  
  loader.load(
    '/models/human-anatomy.glb',
    (gltf) => {
      this.model = gltf.scene;
      
      // 调整模型
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      this.model.position.sub(center);
      
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

#### C. 更新 animate() 方法

```javascript
animate() {
  if (!this.renderer || !this.scene || !this.camera) return;
  
  if (this.data.autoRotate && this.model) {
    this.model.rotation.y += 0.01;
  }
  
  this.renderer.render(this.scene, this.camera);
  this.animationId = requestAnimationFrame(() => this.animate());
}
```

#### D. 在页面中使用

在 `pages/muscle-analysis/muscle-analysis.json` 添加：
```json
{
  "usingComponents": {
    "model-viewer": "/components/model-viewer/model-viewer"
  }
}
```

在 `pages/muscle-analysis/muscle-analysis.wxml` 中使用：
```xml
<model-viewer 
  modelUrl="/models/human-anatomy.glb"
  autoRotate="{{true}}"
></model-viewer>
```

## 测试

1. 保存所有文件
2. 在微信开发者工具中编译
3. 查看肌肉分析页面
4. 应该能看到3D模型加载并可以旋转

## 故障排除

### 问题1：提示"找不到模块three"
解决：
1. 确认已执行 `npm install`
2. 在微信开发者工具中点击"工具 -> 构建npm"
3. 重新编译项目

### 问题2：模型不显示
解决：
1. 检查控制台错误信息
2. 确认模型文件路径正确：`/models/human-anatomy.glb`
3. 确认模型文件格式是GLB或GLTF
4. 尝试使用更小的测试模型

### 问题3：Canvas空白
解决：
1. 检查Canvas节点是否获取成功
2. 查看是否有JavaScript错误
3. 确认WebGL上下文创建成功

### 问题4：触摸不响应
解决：
1. 确认触摸事件已绑定
2. 检查是否有其他元素遮挡
3. 查看控制台是否有错误

## 下一步

完成基础设置后，可以：
1. 添加肌肉高亮功能
2. 添加标注点
3. 优化性能
4. 添加更多交互

详细文档请查看：`docs/3D-MODEL-IMPLEMENTATION.md`
