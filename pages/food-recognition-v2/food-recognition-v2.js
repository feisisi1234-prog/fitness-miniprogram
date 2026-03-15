// pages/food-recognition-v2/food-recognition-v2.js
// 使用 DeepSeek API 的食物识别页面
const app = getApp()

Page({
  data: {
    selectedImage: null,
    isRecognizing: false,
    recognitionResult: null,
    showResult: false
  },

  onLoad() {
    console.log('食物识别 V2 页面加载 (DeepSeek版本)');
  },

  // 选择图片
  chooseImage() {
    const that = this;
    
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ['camera'] : ['album'];
        
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: sourceType,
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            console.log('选择的图片:', tempFilePath);
            
            that.setData({
              selectedImage: tempFilePath,
              showResult: false,
              recognitionResult: null
            });
          },
          fail: (err) => {
            console.error('选择图片失败:', err);
            wx.showToast({
              title: '选择图片失败',
              icon: 'error'
            });
          }
        });
      }
    });
  },

  // 开始识别
  startRecognition() {
    if (!this.data.selectedImage) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    console.log('========================================');
    console.log('🚀 [性能监控] DeepSeek 食物识别流程开始');
    console.log('========================================');
    const flowStartTime = Date.now();

    this.setData({
      isRecognizing: true
    });

    // ============================================================
    // TODO: 在这里补充 DeepSeek API 调用逻辑
    // ============================================================
    // 
    // 步骤1: 将图片转换为 base64
    // 步骤2: 调用 DeepSeek API 进行识别
    // 步骤3: 解析返回结果
    //
    // 示例代码结构：
    // this.convertImageToBase64(this.data.selectedImage)
    //   .then(base64Image => {
    //     return this.callDeepSeekAPI(base64Image);
    //   })
    //   .then(result => {
    //     const totalTime = Date.now() - flowStartTime;
    //     console.log(`🎉 识别完成，总耗时: ${totalTime}ms`);
    //     
    //     this.setData({
    //       isRecognizing: false,
    //       recognitionResult: result,
    //       showResult: true
    //     });
    //   })
    //   .catch(err => {
    //     console.error('识别失败:', err);
    //     this.setData({
    //       isRecognizing: false
    //     });
    //     wx.showModal({
    //       title: '识别失败',
    //       content: err.message || '请稍后重试',
    //       showCancel: false
    //     });
    //   });
    // ============================================================

    // 临时模拟数据（用于测试界面）
    setTimeout(() => {
      const totalTime = Date.now() - flowStartTime;
      console.log(`🎉 [模拟] 识别完成，总耗时: ${totalTime}ms`);
      
      this.setData({
        isRecognizing: false,
        recognitionResult: {
          name: '苹果',
          calories: '52千卡/100g',
          gi: '36',
          gl: '6',
          suggestion: '苹果是低GI食物，富含膳食纤维和维生素C与抗氧化成分，适合减肥人群、糖尿病患者及普通大众食用。建议在两餐之间作为加餐，每次食用约150g（中等大小苹果），既能缓解饥饿又不会引发血糖大幅波动。糖尿病患者食用时需注意监测血糖，日常建议洗净后连皮食用以获取更多营养，肠胃较弱者可去皮或蒸煮后食用。'
        },
        showResult: true
      });
    }, 2000);
  },

  // ============================================================
  // TODO: 补充以下方法
  // ============================================================

  // 将图片转换为 base64
  convertImageToBase64(filePath) {
    // TODO: 实现图片转 base64 的逻辑
    // 提示：使用 wx.getFileSystemManager().readFile()
    return new Promise((resolve, reject) => {
      // 你的代码...
    });
  },

  // 调用 DeepSeek API
  callDeepSeekAPI(base64Image) {
    // TODO: 实现 DeepSeek API 调用逻辑
    // 提示：使用 wx.request() 或云函数
    return new Promise((resolve, reject) => {
      // 你的代码...
    });
  },

  // 解析 DeepSeek 返回结果
  parseDeepSeekResult(response) {
    // TODO: 实现结果解析逻辑
    // 返回格式：
    // {
    //   name: '食物名称',
    //   calories: '热量',
    //   gi: '升糖指数',
    //   gl: '升糖负荷',
    //   suggestion: '食用建议'
    // }
  },

  // ============================================================

  // 重新识别
  resetRecognition() {
    this.setData({
      selectedImage: null,
      recognitionResult: null,
      showResult: false
    });
  }
})
