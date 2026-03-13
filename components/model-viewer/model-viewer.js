// 3D模型查看器组件
// 注意：需要先安装 three-platformize 和 three

// 使用方法：
// 1. npm install three-platformize three
// 2. 将 three.weapp.js 放到 libs 目录
// 3. 准备好 .glb 或 .gltf 模型文件

Component({
  properties: {
    modelUrl: {
      type: String,
      value: ''
    },
    autoRotate: {
      type: Boolean,
      value: true
    }
  },

  data: {
    loading: true,
    loadingProgress: 0,
    showHint: true,
    autoRotate: true
  },

  lifetimes: {
    attached() {
      console.log('3D模型查看器组件加载');
      this.initThreeJS();
    },
    
    detached() {
      console.log('3D模型查看器组件卸载');
      this.cleanup();
    }
  },

  methods: {
    // 初始化Three.js
    async initThreeJS() {
      try {
        // 导入Three.js（需要先安装）
        // const THREE = require('../../libs/three.weapp.js');
        // const { registerCanvas } = require('three-platformize');
        
        console.log('开始初始化Three.js...');
        
        // 获取Canvas上下文
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
            
            console.log('Canvas尺寸:', width, height);
            
            // 这里需要实现Three.js的初始化逻辑
            // 由于需要完整的three.weapp.js，这里提供伪代码框架
            
            this.setupScene(canvas, width, height);
          });
          
      } catch (error) {
        console.error('初始化Three.js失败:', error);
        wx.showToast({
          title: '3D模型加载失败',
          icon: 'none'
        });
      }
    },

    // 设置场景（伪代码框架）
    setupScene(canvas, width, height) {
      console.log('设置Three.js场景...');
      
      // 1. 创建场景
      // this.scene = new THREE.Scene();
      // this.scene.background = new THREE.Color(0xf5f7fa);
      
      // 2. 创建相机
      // this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      // this.camera.position.set(0, 1, 3);
      
      // 3. 创建渲染器
      // const gl = canvas.getContext('webgl');
      // this.renderer = new THREE.WebGLRenderer({ canvas, context: gl });
      // this.renderer.setSize(width, height);
      
      // 4. 添加光源
      // const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      // this.scene.add(ambientLight);
      // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      // directionalLight.position.set(1, 1, 1);
      // this.scene.add(directionalLight);
      
      // 5. 加载模型
      // this.loadModel();
      
      // 6. 开始渲染循环
      // this.animate();
      
      // 模拟加载完成
      setTimeout(() => {
        this.setData({
          loading: false,
          loadingProgress: 100
        });
        
        // 3秒后隐藏提示
        setTimeout(() => {
          this.setData({ showHint: false });
        }, 3000);
      }, 2000);
    },

    // 加载3D模型（伪代码）
    loadModel() {
      // const loader = new THREE.GLTFLoader();
      // loader.load(
      //   this.properties.modelUrl,
      //   (gltf) => {
      //     this.model = gltf.scene;
      //     this.scene.add(this.model);
      //     this.setData({ loading: false });
      //   },
      //   (progress) => {
      //     const percent = Math.floor((progress.loaded / progress.total) * 100);
      //     this.setData({ loadingProgress: percent });
      //   },
      //   (error) => {
      //     console.error('模型加载失败:', error);
      //   }
      // );
    },

    // 渲染循环（伪代码）
    animate() {
      // if (!this.renderer || !this.scene || !this.camera) return;
      
      // if (this.data.autoRotate && this.model) {
      //   this.model.rotation.y += 0.01;
      // }
      
      // this.renderer.render(this.scene, this.camera);
      // this.animationId = requestAnimationFrame(() => this.animate());
    },

    // 触摸开始
    onTouchStart(e) {
      const touches = e.touches;
      
      if (touches.length === 1) {
        // 单指旋转
        this.lastTouchX = touches[0].pageX;
        this.lastTouchY = touches[0].pageY;
        this.isRotating = true;
      } else if (touches.length === 2) {
        // 双指缩放
        const dx = touches[0].pageX - touches[1].pageX;
        const dy = touches[0].pageY - touches[1].pageY;
        this.lastDistance = Math.sqrt(dx * dx + dy * dy);
        this.isScaling = true;
      }
      
      this.setData({ showHint: false });
    },

    // 触摸移动
    onTouchMove(e) {
      const touches = e.touches;
      
      if (this.isRotating && touches.length === 1) {
        const deltaX = touches[0].pageX - this.lastTouchX;
        const deltaY = touches[0].pageY - this.lastTouchY;
        
        // 旋转模型
        // if (this.model) {
        //   this.model.rotation.y += deltaX * 0.01;
        //   this.model.rotation.x += deltaY * 0.01;
        // }
        
        this.lastTouchX = touches[0].pageX;
        this.lastTouchY = touches[0].pageY;
      } else if (this.isScaling && touches.length === 2) {
        const dx = touches[0].pageX - touches[1].pageX;
        const dy = touches[0].pageY - touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scale = distance / this.lastDistance;
        
        // 缩放相机
        // if (this.camera) {
        //   this.camera.position.z *= (2 - scale);
        //   this.camera.position.z = Math.max(1, Math.min(10, this.camera.position.z));
        // }
        
        this.lastDistance = distance;
      }
    },

    // 触摸结束
    onTouchEnd(e) {
      this.isRotating = false;
      this.isScaling = false;
    },

    // 重置视图
    resetView() {
      // if (this.camera) {
      //   this.camera.position.set(0, 1, 3);
      //   this.camera.lookAt(0, 0, 0);
      // }
      // if (this.model) {
      //   this.model.rotation.set(0, 0, 0);
      // }
      
      wx.showToast({
        title: '视图已重置',
        icon: 'success'
      });
    },

    // 切换自动旋转
    toggleRotation() {
      this.setData({
        autoRotate: !this.data.autoRotate
      });
    },

    // 切换视图
    switchView() {
      // 切换到预设视角
      wx.showToast({
        title: '切换视图',
        icon: 'none'
      });
    },

    // 清理资源
    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      
      // 清理Three.js资源
      // if (this.renderer) {
      //   this.renderer.dispose();
      // }
      // if (this.scene) {
      //   this.scene.clear();
      // }
    }
  }
});
