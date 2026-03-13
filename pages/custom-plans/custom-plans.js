// pages/custom-plans/custom-plans.js
const app = getApp()
const ocrParser = require('../../utils/ocr-parser.js')

Page({
  data: {
    customPlans: [],
    showAddForm: false,
    editingPlan: null,
    newPlan: {
      title: '',
      category: '',
      exercises: []
    },
    categories: [
      { id: '力量训练', name: '力量训练', icon: 'strength' },
      { id: '有氧运动', name: '有氧运动', icon: 'cardio' },
      { id: '柔韧性', name: '柔韧性', icon: 'flexibility' }
    ],
    exerciseTemplates: [
      { name: '深蹲', category: '力量训练', defaultSets: 3, defaultRest: 60 },
      { name: '硬拉', category: '力量训练', defaultSets: 3, defaultRest: 90 },
      { name: '卧推', category: '力量训练', defaultSets: 3, defaultRest: 60 },
      { name: '引体向上', category: '力量训练', defaultSets: 3, defaultRest: 60 },
      { name: '俯卧撑', category: '力量训练', defaultSets: 3, defaultRest: 45 },
      { name: '平板支撑', category: '力量训练', defaultSets: 3, defaultRest: 30 },
      { name: '跑步', category: '有氧运动', defaultSets: 1, defaultRest: 0 },
      { name: '跳绳', category: '有氧运动', defaultSets: 3, defaultRest: 30 },
      { name: '开合跳', category: '有氧运动', defaultSets: 3, defaultRest: 30 },
      { name: '瑜伽拉伸', category: '柔韧性', defaultSets: 1, defaultRest: 0 },
      { name: '腿部拉伸', category: '柔韧性', defaultSets: 1, defaultRest: 0 }
    ],
    // OCR文字选择相关
    showTextSelectionModal: false,
    ocrOriginalText: '',
    ocrTextLines: []
  },

  onLoad() {
    this.loadCustomPlans();
  },

  onShow() {
    this.loadCustomPlans();
  },

  // 加载自定义训练计划
  loadCustomPlans() {
    const customPlans = wx.getStorageSync('customPlans') || [];
    this.setData({
      customPlans: customPlans
    });
  },

  // 显示添加计划表单
  showAddPlanForm() {
    this.setData({
      showAddForm: true,
      editingPlan: null,
      newPlan: {
        title: '',
        category: '',
        exercises: []
      }
    });
  },

  // 隐藏添加计划表单
  hideAddPlanForm() {
    this.setData({
      showAddForm: false,
      editingPlan: null,
      newPlan: {
        title: '',
        category: '',
        exercises: []
      }
    });
  },

  // 输入计划标题
  onTitleInput(e) {
    this.setData({
      'newPlan.title': e.detail.value
    });
  },

  // 选择计划类别
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      'newPlan.category': category
    });
  },

  // 添加训练动作
  addExercise() {
    const exercises = this.data.newPlan.exercises;
    const newExercise = {
      id: Date.now(),
      name: '',
      sets: 3,
      restTime: 60,
      image: '/images/placeholder.png',
      completed: false
    };
    
    this.setData({
      'newPlan.exercises': [...exercises, newExercise]
    });
  },

  // 从模板添加训练动作
  addExerciseFromTemplate(e) {
    const templateIndex = e.currentTarget.dataset.index;
    const template = this.data.exerciseTemplates[templateIndex];
    const exercises = this.data.newPlan.exercises;
    
    const newExercise = {
      id: Date.now(),
      name: template.name,
      sets: template.defaultSets,
      restTime: template.defaultRest,
      image: '/images/placeholder.png',
      completed: false
    };
    
    this.setData({
      'newPlan.exercises': [...exercises, newExercise]
    });
  },

  // 更新训练动作
  updateExercise(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const exercises = this.data.newPlan.exercises;
    
    exercises[index][field] = value;
    
    this.setData({
      'newPlan.exercises': exercises
    });
  },

  // 删除训练动作
  deleteExercise(e) {
    const { index } = e.currentTarget.dataset;
    const exercises = this.data.newPlan.exercises;
    
    exercises.splice(index, 1);
    
    this.setData({
      'newPlan.exercises': exercises
    });
  },

  // 保存自定义计划
  saveCustomPlan() {
    const { newPlan, editingPlan } = this.data;
    
    if (!newPlan.title) {
      wx.showToast({
        title: '请输入计划标题',
        icon: 'none'
      });
      return;
    }
    
    if (!newPlan.category) {
      wx.showToast({
        title: '请选择计划类别',
        icon: 'none'
      });
      return;
    }
    
    if (newPlan.exercises.length === 0) {
      wx.showToast({
        title: '请添加至少一个训练动作',
        icon: 'none'
      });
      return;
    }
    
    // 检查所有动作是否已填写完整
    for (let i = 0; i < newPlan.exercises.length; i++) {
      const exercise = newPlan.exercises[i];
      if (!exercise.name) {
        wx.showToast({
          title: `请填写第${i + 1}个动作的名称`,
          icon: 'none'
        });
        return;
      }
    }
    
    // 获取自定义计划列表
    let customPlans = wx.getStorageSync('customPlans') || [];
    
    if (editingPlan) {
      // 编辑现有计划
      const index = customPlans.findIndex(p => p.id === editingPlan.id);
      if (index !== -1) {
        customPlans[index] = {
          ...customPlans[index], // 保留原有属性
          title: newPlan.title,
          category: newPlan.category,
          exercises: newPlan.exercises,
          duration: `${newPlan.exercises.reduce((total, exercise) => total + exercise.sets * (exercise.restTime + 30), 0)}秒`,
          calories: newPlan.exercises.reduce((total, exercise) => total + exercise.sets * 5, 0),
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // 创建新计划
      const planToAdd = {
        id: Date.now(),
        title: newPlan.title,
        category: newPlan.category,
        icon: '/images/placeholder.png',
        duration: `${newPlan.exercises.reduce((total, exercise) => total + exercise.sets * (exercise.restTime + 30), 0)}秒`,
        calories: newPlan.exercises.reduce((total, exercise) => total + exercise.sets * 5, 0),
        difficulty: '自定义',
        rating: 0,
        participants: 0,
        tags: ['自定义'],
        exercises: newPlan.exercises,
        isCustom: true,
        createdAt: new Date().toISOString()
      };
      
      customPlans.push(planToAdd);
    }
    
    // 保存到本地存储
    wx.setStorageSync('customPlans', customPlans);
    
    // 更新页面数据
    this.setData({
      customPlans: customPlans,
      showAddForm: false,
      editingPlan: null,
      newPlan: {
        title: '',
        category: '',
        exercises: []
      }
    });
    
    wx.showToast({
      title: editingPlan ? '计划已更新' : '计划已保存',
      icon: 'success'
    });
  },

  // 编辑自定义计划
  editCustomPlan(e) {
    const { id } = e.currentTarget.dataset;
    const customPlans = this.data.customPlans;
    const plan = customPlans.find(p => p.id === id);
    
    if (plan) {
      this.setData({
        showAddForm: true,
        editingPlan: plan, // 保存整个计划对象
        newPlan: {
          title: plan.title,
          category: plan.category,
          exercises: [...plan.exercises]
        }
      });
    }
  },

  // 删除自定义计划
  deleteCustomPlan(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个自定义训练计划吗？',
      confirmText: '删除',
      confirmColor: '#ff0000',
      success: (res) => {
        if (res.confirm) {
          let customPlans = this.data.customPlans;
          customPlans = customPlans.filter(p => p.id !== id);
          
          // 保存到本地存储
          wx.setStorageSync('customPlans', customPlans);
          
          // 更新页面数据
          this.setData({
            customPlans: customPlans
          });
          
          wx.showToast({
            title: '计划已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 切换动作完成状态
  toggleExerciseComplete(e) {
    const { planId, exerciseId } = e.currentTarget.dataset;
    const customPlans = this.data.customPlans;
    const plan = customPlans.find(p => p.id === planId);
    
    if (plan) {
      const exercise = plan.exercises.find(e => e.id === exerciseId);
      if (exercise) {
        exercise.completed = !exercise.completed;
        
        // 保存到本地存储
        wx.setStorageSync('customPlans', customPlans);
        
        // 更新页面数据
        this.setData({
          customPlans: customPlans
        });
      }
    }
  },

  // 开始训练
  startTraining(e) {
    const { id, title } = e.currentTarget.dataset;
    const plan = this.data.customPlans.find(p => p.id === id);
    
    if (!plan) {
      wx.showToast({
        title: '计划不存在',
        icon: 'error'
      });
      return;
    }
    
    // 跳转到训练会话页面
    wx.navigateTo({
      url: `/pages/training-session/training-session?id=${id}&title=${encodeURIComponent(title)}&isCustom=true`
    });
  },

  // 扫描图片识别训练计划
  scanImagePlan() {
    console.log('========================================');
    console.log('🚀 [性能监控] 扫描图片流程开始');
    console.log('========================================');
    const flowStartTime = Date.now();
    this.setData({ _flowStartTime: flowStartTime });
    
    const that = this;
    
    // 先显示拍照提示
    wx.showModal({
      title: '📷 拍照提示',
      content: '为了提高识别准确度:\n\n1. 确保文字清晰可见\n2. 光线充足，避免阴影\n3. 每行一个动作\n4. 使用格式: 动作名 3组 x 12次 休息60秒\n5. 避免手写，优先打印文字\n\n点击"继续"开始拍照',
      confirmText: '继续',
      cancelText: '查看示例',
      success: (res) => {
        if (res.confirm) {
          that.chooseAndRecognizeImage();
        } else {
          that.showImageExample();
        }
      }
    });
  },
  
  // 显示图片示例
  showImageExample() {
    const that = this;
    wx.showModal({
      title: '✅ 好的示例',
      content: '全身力量训练\n\n深蹲 3组 x 12次 休息60秒\n俯卧撑 3组 x 10次 休息60秒\n平板支撑 3组 x 30秒 休息45秒\n弓步蹲 3组 x 10次 休息60秒\n\n每行一个动作，格式清晰',
      confirmText: '开始拍照',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          that.chooseAndRecognizeImage();
        }
      }
    });
  },
  
  // 选择并识别图片
  chooseAndRecognizeImage() {
    console.log('⏱️  [性能监控] 步骤1: 开始选择图片');
    const stepStartTime = Date.now();
    
    wx.showLoading({
      title: '准备识别...',
      mask: true
    });
    
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const chooseImageTime = Date.now() - stepStartTime;
        console.log(`✅ [性能监控] 步骤1完成: 选择图片耗时 ${chooseImageTime}ms`);
        
        const tempFilePath = res.tempFilePaths[0];
        console.log('选择的图片:', tempFilePath);
        
        // 调用OCR识别
        this.recognizeImage(tempFilePath);
      },
      fail: (err) => {
        const chooseImageTime = Date.now() - stepStartTime;
        console.error(`❌ [性能监控] 步骤1失败: 选择图片耗时 ${chooseImageTime}ms`);
        console.error('选择图片失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '选择图片失败',
          icon: 'error'
        });
      }
    });
  },

  // 识别图片中的文字
  recognizeImage(imagePath) {
    console.log('⏱️  [性能监控] 步骤2: 开始OCR识别');
    const ocrStartTime = Date.now();
    
    wx.showLoading({
      title: '识别中...',
      mask: true
    });
    
    // 检查OCR API是否可用
    if (!wx.ocr || typeof wx.ocr.recognize !== 'function') {
      const checkTime = Date.now() - ocrStartTime;
      console.log(`⚠️  [性能监控] OCR API不可用检测耗时 ${checkTime}ms，使用模拟识别`);
      wx.hideLoading();
      this.simulateOCR(imagePath);
      return;
    }
    
    // 使用微信OCR API
    wx.ocr.recognize({
      path: imagePath,
      ocrType: 'general', // 通用文字识别
      success: (res) => {
        const ocrTime = Date.now() - ocrStartTime;
        console.log(`✅ [性能监控] 步骤2完成: OCR识别耗时 ${ocrTime}ms`);
        console.log('OCR识别成功:', res);
        wx.hideLoading();
        
        // 提取识别的文字
        console.log('⏱️  [性能监控] 步骤3: 开始提取文字');
        const extractStartTime = Date.now();
        
        const recognizedText = this.extractTextFromOCR(res);
        
        const extractTime = Date.now() - extractStartTime;
        console.log(`✅ [性能监控] 步骤3完成: 提取文字耗时 ${extractTime}ms`);
        console.log('提取的文字:', recognizedText);
        
        if (!recognizedText) {
          wx.showModal({
            title: '识别失败',
            content: '未能识别到文字内容，请确保图片清晰且包含训练计划信息',
            showCancel: false
          });
          return;
        }
        
        // 解析训练计划
        console.log('⏱️  [性能监控] 步骤4: 开始解析训练计划');
        const parseStartTime = Date.now();
        
        const parsedPlan = ocrParser.parseTrainingPlan(recognizedText);
        
        const parseTime = Date.now() - parseStartTime;
        console.log(`✅ [性能监控] 步骤4完成: 解析训练计划耗时 ${parseTime}ms`);
        
        // 显示识别结果并确认
        this.showRecognizedPlan(parsedPlan, recognizedText);
      },
      fail: (err) => {
        const ocrTime = Date.now() - ocrStartTime;
        console.error(`❌ [性能监控] 步骤2失败: OCR识别耗时 ${ocrTime}ms`);
        console.error('OCR识别失败:', err);
        wx.hideLoading();
        
        // 使用模拟识别
        this.simulateOCR(imagePath);
      }
    });
  },

  // 从OCR结果中提取文字
  extractTextFromOCR(ocrResult) {
    if (!ocrResult || !ocrResult.items) {
      return '';
    }
    
    // 合并所有识别的文字，按位置排序
    const items = ocrResult.items.sort((a, b) => {
      // 先按y坐标排序（从上到下）
      const yDiff = (a.pos?.top || 0) - (b.pos?.top || 0);
      if (Math.abs(yDiff) > 10) return yDiff;
      // 再按x坐标排序（从左到右）
      return (a.pos?.left || 0) - (b.pos?.left || 0);
    });
    
    const texts = items.map(item => item.text || '');
    return texts.join('\n');
  },

  // 模拟OCR识别（用于开发测试）
  simulateOCR(imagePath) {
    console.log('使用模拟OCR识别');
    
    const that = this;
    
    // 提供多个模拟选项
    wx.showActionSheet({
      itemList: [
        '全身力量训练（4个动作）',
        'HIIT燃脂训练（4个动作）',
        '臀腿训练（5个动作）',
        '上肢训练（6个动作）',
        '测试手动选择（低质量文字）',
        '手动输入文字'
      ],
      success: (res) => {
        let mockText = '';
        
        switch(res.tapIndex) {
          case 0: // 全身力量训练
            mockText = `
              全身力量训练计划
              深蹲 3组 x 12次 休息60秒
              俯卧撑 3组 x 10次 休息60秒
              平板支撑 3组 x 30秒 休息45秒
              弓步蹲 3组 x 10次 休息60秒
            `;
            break;
          case 1: // HIIT燃脂
            mockText = `
              HIIT燃脂训练
              开合跳 4组 x 30次 休息30秒
              高抬腿 4组 x 30次 休息30秒
              波比跳 3组 x 10次 休息45秒
              登山跑 4组 x 30次 休息30秒
            `;
            break;
          case 2: // 臀腿训练
            mockText = `
              臀腿训练计划
              深蹲 4组 x 15次 休息60秒
              硬拉 4组 x 12次 休息90秒
              弓步蹲 3组 x 12次 休息60秒
              臀桥 3组 x 15次 休息45秒
              腿举 3组 x 15次 休息60秒
            `;
            break;
          case 3: // 上肢训练
            mockText = `
              上肢力量训练
              卧推 4组 x 10次 休息90秒
              引体向上 3组 x 8次 休息90秒
              肩推 3组 x 12次 休息60秒
              二头弯举 3组 x 12次 休息45秒
              三头屈伸 3组 x 12次 休息45秒
              侧平举 3组 x 15次 休息45秒
            `;
            break;
          case 4: // 测试手动选择（低质量文字）
            mockText = `
              胸部训练
              坐姿下斜推 3组 12次 组内暂停 10+5 休息 60
              上斜推 3组 12次 休息 60
              平板推 3组 12次 休息 60
              飞鸟 3组 15次 休息 45
              绳索夹胸 3组 15次 休息 45
              这是一些无关的文字
              可能还有一些干扰内容
              俯卧撑 3组 力竭 休息 60
            `;
            break;
          case 5: // 手动输入
            that.showManualInput();
            return;
        }
        
        const parsedPlan = ocrParser.parseTrainingPlan(mockText);
        that.showRecognizedPlan(parsedPlan, mockText);
      }
    });
  },

  // 手动输入文字
  showManualInput() {
    const that = this;
    wx.showModal({
      title: '手动输入训练计划',
      editable: true,
      placeholderText: '格式：\n深蹲 3组 x 12次 休息60秒\n俯卧撑 3组 x 10次 休息60秒',
      content: '',
      success: (res) => {
        if (res.confirm && res.content) {
          const parsedPlan = ocrParser.parseTrainingPlan(res.content);
          that.showRecognizedPlan(parsedPlan, res.content);
        }
      }
    });
  },

  // 显示识别的计划并确认
  showRecognizedPlan(plan, originalText) {
    console.log('⏱️  [性能监控] 步骤5: 开始质量评估和显示结果');
    const evalStartTime = Date.now();
    
    console.log('=== showRecognizedPlan 开始 ===');
    console.log('原始文字:', originalText);
    console.log('解析的计划:', plan);
    
    // 评估OCR质量
    const quality = ocrParser.evaluateOCRQuality ? 
      ocrParser.evaluateOCRQuality(originalText) : 
      { score: 80, issues: [], suggestions: [] };
    
    const evalTime = Date.now() - evalStartTime;
    console.log(`✅ [性能监控] 步骤5完成: 质量评估耗时 ${evalTime}ms`);
    console.log('OCR质量评估:', quality);
    
    // 计算总耗时
    const flowStartTime = this.data._flowStartTime || Date.now();
    const totalTime = Date.now() - flowStartTime;
    console.log('========================================');
    console.log(`🏁 [性能监控] 完整流程总耗时: ${totalTime}ms (${(totalTime/1000).toFixed(2)}秒)`);
    console.log('========================================');
    
    let summary = ocrParser.formatPlanSummary(plan);
    
    // 添加质量评估信息
    if (quality.score < 60) {
      summary += `\n⚠️ 识别质量: ${quality.score}分\n`;
      if (quality.issues.length > 0) {
        summary += `问题: ${quality.issues.join(', ')}\n`;
      }
      if (quality.suggestions.length > 0) {
        summary += `建议: ${quality.suggestions[0]}\n`;
      }
    } else {
      summary += `\n✅ 识别质量: ${quality.score}分\n`;
    }
    
    // 检查识别质量，如果太低，提供手动选择选项
    const that = this;
    const shouldShowManualSelection = quality.score < 50 || 
                                      plan.exercises.length === 0 || 
                                      (plan.exercises[0] && plan.exercises[0].name === '动作1');
    
    console.log('是否应该显示手动选择:', shouldShowManualSelection);
    console.log('质量分数:', quality.score);
    console.log('动作数量:', plan.exercises.length);
    console.log('第一个动作名称:', plan.exercises[0] ? plan.exercises[0].name : '无');
    
    if (shouldShowManualSelection) {
      console.log('触发手动选择提示');
      wx.showModal({
        title: '识别质量较低',
        content: '自动识别效果不佳，建议手动选择文字创建计划。\n\n是否查看识别的文字并手动选择？',
        confirmText: '手动选择',
        cancelText: '查看结果',
        success: (res) => {
          console.log('用户选择:', res.confirm ? '手动选择' : '查看结果');
          if (res.confirm) {
            // 显示文字选择界面
            that.showTextSelection(originalText);
          } else {
            // 显示识别结果
            that.showRecognitionResult(plan, originalText, quality);
          }
        }
      });
    } else {
      console.log('识别质量良好，直接显示结果');
      // 识别质量较好，直接显示结果
      that.showRecognitionResult(plan, originalText, quality);
    }
  },
  
  // 显示识别结果
  showRecognitionResult(plan, originalText, quality) {
    const that = this;
    let summary = ocrParser.formatPlanSummary(plan);
    
    if (quality.score < 60) {
      summary += `\n⚠️ 识别质量: ${quality.score}分`;
    } else {
      summary += `\n✅ 识别质量: ${quality.score}分`;
    }
    
    wx.showModal({
      title: '识别结果',
      content: summary + '\n\n是否保存此计划？',
      confirmText: '保存',
      cancelText: '选项',
      success: (res) => {
        if (res.confirm) {
          // 直接保存
          that.saveRecognizedPlan(plan);
        } else if (res.cancel) {
          // 显示更多选项
          that.showRecognitionOptions(plan, originalText, quality);
        }
      }
    });
  },
  
  // 显示文字选择界面
  showTextSelection(originalText) {
    console.log('=== showTextSelection 开始 ===');
    console.log('原始文字长度:', originalText ? originalText.length : 0);
    console.log('原始文字内容:', originalText);
    
    const that = this;
    
    // 将文字按行分割
    const lines = originalText.split(/[\n\r]+/).filter(line => line.trim());
    
    console.log('分割后的行数:', lines.length);
    console.log('分割后的行:', lines);
    
    if (lines.length === 0) {
      console.log('未识别到文字，显示提示');
      wx.showToast({
        title: '未识别到文字',
        icon: 'none'
      });
      return;
    }
    
    // 保存原始文字和选中状态
    const textLines = lines.map((line, index) => ({
      id: index,
      text: line.trim(),
      selected: false
    }));
    
    console.log('准备显示的文字行:', textLines);
    
    this.setData({
      ocrOriginalText: originalText,
      ocrTextLines: textLines,
      showTextSelectionModal: true
    }, () => {
      console.log('文字选择弹窗已显示');
      console.log('showTextSelectionModal:', that.data.showTextSelectionModal);
      console.log('ocrTextLines 数量:', that.data.ocrTextLines.length);
    });
  },
  
  // 切换文字行选中状态
  toggleTextLineSelection(e) {
    const { index } = e.currentTarget.dataset;
    const lines = this.data.ocrTextLines;
    lines[index].selected = !lines[index].selected;
    
    this.setData({
      ocrTextLines: lines
    });
  },
  
  // 全选文字
  selectAllTextLines() {
    const lines = this.data.ocrTextLines.map(line => ({
      ...line,
      selected: true
    }));
    
    this.setData({
      ocrTextLines: lines
    });
  },
  
  // 清除所有选择
  clearAllTextLines() {
    const lines = this.data.ocrTextLines.map(line => ({
      ...line,
      selected: false
    }));
    
    this.setData({
      ocrTextLines: lines
    });
  },
  
  // 确认选择的文字
  confirmTextSelection() {
    const selectedLines = this.data.ocrTextLines
      .filter(line => line.selected)
      .map(line => line.text);
    
    if (selectedLines.length === 0) {
      wx.showToast({
        title: '请至少选择一行文字',
        icon: 'none'
      });
      return;
    }
    
    // 关闭选择界面
    this.setData({
      showTextSelectionModal: false
    });
    
    // 将选中的文字组合并解析
    const selectedText = selectedLines.join('\n');
    const parsedPlan = ocrParser.parseTrainingPlan(selectedText);
    
    // 显示解析结果
    this.showRecognizedPlan(parsedPlan, selectedText);
  },
  
  // 取消文字选择
  cancelTextSelection() {
    this.setData({
      showTextSelectionModal: false
    });
  },
  
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
  
  // 显示识别建议
  showRecognitionTips(quality) {
    let tips = `识别质量评分: ${quality.score}/100\n\n`;
    
    if (quality.issues.length > 0) {
      tips += '发现的问题:\n';
      quality.issues.forEach((issue, index) => {
        tips += `${index + 1}. ${issue}\n`;
      });
      tips += '\n';
    }
    
    if (quality.suggestions.length > 0) {
      tips += '改进建议:\n';
      quality.suggestions.forEach((suggestion, index) => {
        tips += `${index + 1}. ${suggestion}\n`;
      });
      tips += '\n';
    }
    
    tips += '最佳图片格式:\n';
    tips += '• 每行一个动作\n';
    tips += '• 格式: 动作名 3组 x 12次 休息60秒\n';
    tips += '• 字体清晰，背景简洁\n';
    tips += '• 避免手写，使用打印文字';
    
    wx.showModal({
      title: '识别建议',
      content: tips,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 显示原始识别文字（用于调试）
  showOriginalText(text) {
    const that = this;
    
    // 评估质量
    const quality = ocrParser.evaluateOCRQuality ? 
      ocrParser.evaluateOCRQuality(text) : 
      { score: 80, issues: [], suggestions: [] };
    
    let content = `识别质量: ${quality.score}分\n\n`;
    content += `原始文字:\n${text || '无文字内容'}\n\n`;
    
    if (quality.issues.length > 0) {
      content += `问题: ${quality.issues.join(', ')}`;
    }
    
    wx.showModal({
      title: '原始识别文字',
      content: content,
      confirmText: '重新解析',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          // 重新解析
          const parsedPlan = ocrParser.parseTrainingPlan(text);
          that.showRecognizedPlan(parsedPlan, text);
        }
      }
    });
  },

  // 保存识别的计划
  saveRecognizedPlan(plan) {
    console.log('⏱️  [性能监控] 步骤6: 开始保存计划');
    const saveStartTime = Date.now();
    
    const customPlans = wx.getStorageSync('customPlans') || [];
    
    const planToAdd = {
      id: Date.now(),
      title: plan.title,
      category: plan.category,
      icon: '/images/placeholder.png',
      duration: `${plan.exercises.reduce((total, exercise) => total + exercise.sets * (exercise.restTime + 30), 0)}秒`,
      calories: plan.exercises.reduce((total, exercise) => total + exercise.sets * 5, 0),
      difficulty: '自定义',
      rating: 0,
      participants: 0,
      tags: ['扫描识别', '自定义'],
      exercises: plan.exercises,
      isCustom: true,
      fromOCR: true,
      createdAt: new Date().toISOString()
    };
    
    customPlans.push(planToAdd);
    wx.setStorageSync('customPlans', customPlans);
    
    const saveTime = Date.now() - saveStartTime;
    console.log(`✅ [性能监控] 步骤6完成: 保存计划耗时 ${saveTime}ms`);
    
    // 计算从开始到保存完成的总耗时
    const flowStartTime = this.data._flowStartTime || Date.now();
    const totalTime = Date.now() - flowStartTime;
    console.log('========================================');
    console.log(`🎉 [性能监控] 从扫描到保存完整流程总耗时: ${totalTime}ms (${(totalTime/1000).toFixed(2)}秒)`);
    console.log('========================================');
    
    this.setData({
      customPlans: customPlans
    });
    
    wx.showToast({
      title: '计划已保存',
      icon: 'success'
    });
  },

  // 编辑识别的计划
  editRecognizedPlan(plan) {
    this.setData({
      showAddForm: true,
      editingPlan: null,
      newPlan: {
        title: plan.title,
        category: plan.category,
        exercises: plan.exercises
      }
    });
  }
})