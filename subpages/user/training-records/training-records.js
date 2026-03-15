// 训练记录页面
const app = getApp()

Page({
  data: {
    trainingRecords: [],
    customPlans: [],
    selectedDate: '',
    selectedType: '全部',
    totalDuration: 0,
    totalCalories: 0,
    recordCount: 0,
    exerciseTypes: [
      { type: '全部', name: '全部运动' },
      { type: 'training', name: '训练计划' },
      { type: 'running', name: '跑步' },
      { type: 'cycling', name: '骑行' },
      { type: 'swimming', name: '游泳' },
      { type: 'yoga', name: '瑜伽' },
      { type: 'strength', name: '力量' },
      { type: 'other', name: '其他' }
    ],
    showCustomPlans: false
  },

  onLoad() {
    console.log('=== 训练记录页面加载 ===');
    
    // 获取当前日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    console.log('设置默认日期:', dateStr);
    
    this.setData({
      selectedDate: dateStr
    });
    
    // 加载训练记录和自定义计划
    this.loadTrainingRecords();
    this.loadCustomPlans();
    
    console.log('=== 训练记录页面加载完成 ===');
  },

  // 加载训练记录
  loadTrainingRecords() {
    console.log('=== 训练记录页面：加载训练记录 ===');
    
    // 从本地存储获取训练记录
    let trainingRecords = wx.getStorageSync('trainingRecords') || [];
    console.log('所有训练记录数:', trainingRecords.length);
    
    // 按日期过滤
    if (this.data.selectedDate) {
      trainingRecords = trainingRecords.filter(record => record.date === this.data.selectedDate);
      console.log('筛选日期后记录数:', trainingRecords.length, '日期:', this.data.selectedDate);
    }
    
    // 按类型过滤
    if (this.data.selectedType !== '全部') {
      trainingRecords = trainingRecords.filter(record => record.type === this.data.selectedType);
      console.log('筛选类型后记录数:', trainingRecords.length, '类型:', this.data.selectedType);
    }
    
    // 按时间戳倒序排列（最新的在前）
    trainingRecords.sort((a, b) => b.timestamp - a.timestamp);
    
    // 计算统计数据
    let totalDuration = 0;
    let totalCalories = 0;
    
    trainingRecords.forEach((record, index) => {
      console.log(`记录${index + 1}:`, {
        typeName: record.typeName,
        duration_seconds: record.duration,
        calories: record.calories,
        date: record.date
      });
      totalDuration += record.duration;
      totalCalories += record.calories;
    });
    
    console.log('统计结果 - 总时长(秒):', totalDuration, '总卡路里:', totalCalories, '记录数:', trainingRecords.length);
    console.log('=== 加载训练记录完成 ===');
    
    this.setData({
      trainingRecords,
      totalDuration,
      totalCalories,
      recordCount: trainingRecords.length
    });
  },

  // 加载自定义训练计划
  loadCustomPlans() {
    const customPlans = wx.getStorageSync('customPlans') || [];
    this.setData({
      customPlans: customPlans
    });
  },

  // 切换显示自定义计划
  toggleCustomPlans() {
    this.setData({
      showCustomPlans: !this.data.showCustomPlans
    });
  },

  // 跳转到自定义计划页面
  goToCustomPlans() {
    wx.switchTab({
      url: '/pages/custom-plans/custom-plans'
    });
  },

  // 选择日期
  selectDate(e) {
    const date = e.detail.value;
    this.setData({
      selectedDate: date
    });
    
    // 重新加载记录
    this.loadTrainingRecords();
  },

  // 选择运动类型
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type
    });
    
    // 重新加载记录
    this.loadTrainingRecords();
  },

  // 删除记录
  deleteRecord(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条训练记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 从本地存储获取所有记录
          let trainingRecords = wx.getStorageSync('trainingRecords') || [];
          
          // 删除指定ID的记录
          trainingRecords = trainingRecords.filter(record => record.id !== id);
          
          // 保存更新后的记录
          wx.setStorageSync('trainingRecords', trainingRecords);
          
          // 重新加载记录
          this.loadTrainingRecords();
          
          // 提示删除成功
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 删除自定义计划
  deleteCustomPlan(e) {
    const id = e.currentTarget.dataset.id;
    
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

  // 格式化时间
  formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}小时${m}分钟`;
    } else if (m > 0) {
      return `${m}分钟${s}秒`;
    } else {
      return `${s}秒`;
    }
  },

  // 导出数据
  exportData() {
    const { trainingRecords, customPlans } = this.data;
    
    if (trainingRecords.length === 0 && customPlans.length === 0) {
      wx.showToast({
        title: '暂无数据可导出',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    // 构建导出文本
    let exportText = '健身数据导出\n\n';
    exportText += `导出时间：${new Date().toLocaleString()}\n\n`;
    
    // 训练记录部分
    if (trainingRecords.length > 0) {
      exportText += '训练记录：\n';
      exportText += `记录数量：${trainingRecords.length}\n`;
      exportText += `总时长：${this.formatDuration(this.data.totalDuration)}\n`;
      exportText += `总消耗：${this.data.totalCalories}千卡\n\n`;
      exportText += '详细记录：\n';
      exportText += '日期\t\t时长\t\t卡路里\t运动类型\n';
      
      trainingRecords.forEach(record => {
        exportText += `${record.date}\t${record.formatTime}\t${record.calories}千卡\t${record.typeName}\n`;
      });
    }
    
    // 自定义训练计划部分
    if (customPlans.length > 0) {
      exportText += '\n\n自定义训练计划：\n';
      exportText += `计划数量：${customPlans.length}\n\n`;
      
      customPlans.forEach(plan => {
        exportText += `计划名称：${plan.title}\n`;
        exportText += `计划类别：${plan.category}\n`;
        exportText += `动作数量：${plan.exercises.length}\n`;
        exportText += '动作列表：\n';
        
        plan.exercises.forEach(exercise => {
          exportText += `- ${exercise.name}：${exercise.sets}组，间歇${exercise.restTime}秒`;
          if (exercise.completed) {
            exportText += '（已完成）';
          }
          exportText += '\n';
        });
        exportText += '\n';
      });
    }
    
    // 复制到剪贴板
    wx.setClipboardData({
      data: exportText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 1500
        });
      }
    });
  }
})