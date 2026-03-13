// pages/training/training.js
const app = getApp()

Page({
  data: {
    currentCategory: '全部',
    categories: [
      { id: '全部', name: '全部', icon: '🏋️' },
      { id: '力量训练', name: '力量训练', icon: '💪' },
      { id: '有氧运动', name: '有氧运动', icon: '🏃' },
      { id: '柔韧性', name: '柔韧性', icon: '🧘' }
    ],
    plans: [
      {
        id: 1,
        title: '全身力量训练',
        description: '适合初学者的全身力量训练，包括主要肌群的基础动作',
        category: '力量训练',
        icon: '/images/strength.svg',
        duration: '30分钟',
        calories: 200,
        difficulty: '初级',
        rating: 4.5,
        participants: 1280,
        tags: ['全身', '基础', '复合动作']
      },
      {
        id: 2,
        title: 'HIIT燃脂训练',
        description: '高强度间歇训练，快速燃烧脂肪，提高心肺功能',
        category: '有氧运动',
        icon: '/images/hiit.svg',
        duration: '20分钟',
        calories: 250,
        difficulty: '中级',
        rating: 4.7,
        participants: 2560,
        tags: ['燃脂', '间歇训练', '心肺功能']
      },
      {
        id: 3,
        title: '瑜伽拉伸',
        description: '舒缓身心的瑜伽练习，提高身体柔韧性和平衡能力',
        category: '柔韧性',
        icon: '/images/yoga.svg',
        duration: '40分钟',
        calories: 120,
        difficulty: '初级',
        rating: 4.3,
        participants: 890,
        tags: ['放松', '柔韧性', '平衡']
      },
      {
        id: 4,
        title: '腹肌撕裂者',
        description: '专注于核心肌群的训练，打造完美腹肌线条',
        category: '力量训练',
        icon: '/images/abs.svg',
        duration: '15分钟',
        calories: 150,
        difficulty: '高级',
        rating: 4.6,
        participants: 1680,
        tags: ['核心', '腹肌', '高级']
      },
      {
        id: 5,
        title: '有氧舞蹈',
        description: '结合音乐的有氧运动，在愉悦氛围中燃烧卡路里',
        category: '有氧运动',
        icon: '/images/dance.svg',
        duration: '35分钟',
        calories: 300,
        difficulty: '中级',
        rating: 4.8,
        participants: 3200,
        tags: ['舞蹈', '音乐', '燃脂']
      },
      {
        id: 6,
        title: '普拉提核心',
        description: '通过普拉提动作强化核心肌群，改善体态和稳定性',
        category: '柔韧性',
        icon: '/images/pilates.svg',
        duration: '25分钟',
        calories: 180,
        difficulty: '中级',
        rating: 4.4,
        participants: 1100,
        tags: ['核心', '体态', '稳定性']
      },
      {
        id: 7,
        title: '哑铃全身训练',
        description: '使用哑铃进行全身力量训练，增强肌肉力量和体型',
        category: '力量训练',
        icon: '/images/dumbbell.svg',
        duration: '35分钟',
        calories: 220,
        difficulty: '中级',
        rating: 4.6,
        participants: 1890,
        tags: ['哑铃', '器械', '塑形']
      },
      {
        id: 8,
        title: '晨间唤醒瑜伽',
        description: '适合早晨练习的瑜伽动作，温和唤醒身体',
        category: '柔韧性',
        icon: '/images/morning-yoga.svg',
        duration: '15分钟',
        calories: 80,
        difficulty: '初级',
        rating: 4.5,
        participants: 2100,
        tags: ['早晨', '唤醒', '温和']
      }
    ],
    filteredPlans: [],
    searchKeyword: '',
    sortType: 'default', // default, rating, participants, calories
    
    // 计时器相关数据
    showTimer: false,
    seconds: 0,
    formatTime: '00:00:00',
    isRunning: false,
    timer: null,
    totalCalories: 0,
    caloriesPerMinute: 8,
    voiceEnabled: true,
    voiceInterval: 60,
    lastVoiceTime: 0,
    currentPlanId: null,
    currentPlanTitle: '',
    
    // 往期计划相关
    showHistoryModal: false,
    historyRecords: []
  },

  onLoad() {
    // 为每个计划添加格式化后的参与人数
    const plans = this.data.plans.map(plan => {
      return {
        ...plan,
        formattedParticipants: this.formatParticipants(plan.participants)
      };
    });
    
    // 获取语音设置
    this.getVoiceSettings();
    
    this.setData({
      plans: plans,
      filteredPlans: plans
    });
  },

  onUnload() {
    // 页面卸载时清除计时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 格式化参与人数显示
  formatParticipants(num) {
    return num > 1000 ? (num/1000).toFixed(1) + 'k' : num;
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    this.filterPlans(category);
  },

  filterPlans(category) {
    let filtered = this.data.plans;
    
    // 按类别筛选
    if (category !== '全部') {
      filtered = filtered.filter(plan => plan.category === category);
    }
    
    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(keyword) ||
        plan.description.toLowerCase().includes(keyword) ||
        plan.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }
    
    // 排序
    switch (this.data.sortType) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'participants':
        filtered.sort((a, b) => b.participants - a.participants);
        break;
      case 'calories':
        filtered.sort((a, b) => b.calories - a.calories);
        break;
      default:
        // 默认排序，保持原顺序
        break;
    }
    
    this.setData({
      filteredPlans: filtered
    });
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.filterPlans(this.data.currentCategory);
  },

  onSortChange(e) {
    this.setData({
      sortType: e.detail.value
    });
    this.filterPlans(this.data.currentCategory);
  },

  goToPlanDetail(e) {
    const id = e.detail.id || e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/plan-detail/plan-detail?id=${id}`
    });
  },

  startTraining(e) {
    const { id, title } = e.detail;
    
    // 跳转到训练执行页面
    wx.navigateTo({
      url: `/pages/training-session/training-session?id=${id}&title=${title}`
    });
  },

  // 从训练列表开始训练
  startTrainingSession(e) {
    const { id, title } = e.currentTarget.dataset;
    
    // 跳转到训练执行页面
    wx.navigateTo({
      url: `/pages/training-session/training-session?id=${id}&title=${title}`
    });
  },

  goToMuscleAnalysis() {
    wx.navigateTo({
      url: '/pages/muscle-analysis/muscle-analysis'
    });
  },

  // 跳转到自定义计划页面
  goToCustomPlans() {
    wx.switchTab({
      url: '/pages/custom-plans/custom-plans'
    });
  },

  // 计时器相关方法
  // 获取语音设置
  getVoiceSettings() {
    const voiceEnabled = wx.getStorageSync('voiceEnabled') !== false; // 默认开启
    const voiceInterval = wx.getStorageSync('voiceInterval') || 60; // 默认60秒
    
    this.setData({
      voiceEnabled,
      voiceInterval
    });
  },

  // 格式化时间显示
  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const formatNumber = (n) => {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    };
    
    return `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
  },

  // 开始/暂停计时器
  toggleTimer() {
    const { isRunning, timer } = this.data;
    
    if (isRunning) {
      // 暂停计时器
      clearInterval(timer);
      this.setData({
        isRunning: false,
        timer: null
      });
      
      // 暂停语音提示
      wx.showToast({
        title: '训练已暂停',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 开始计时器
      const newTimer = setInterval(() => {
        const seconds = this.data.seconds + 1;
        const totalCalories = Math.floor(seconds / 60 * this.data.caloriesPerMinute);
        this.setData({
          seconds,
          formatTime: this.formatTime(seconds),
          totalCalories
        });
        
        // 检查是否需要语音提示
        this.checkVoicePrompt(seconds);
      }, 1000);
      
      this.setData({
        isRunning: true,
        timer: newTimer
      });
      
      // 开始语音提示
      wx.showToast({
        title: '训练开始',
        icon: 'none',
        duration: 1500
      });
    }
  },

  // 检查是否需要语音提示
  checkVoicePrompt(seconds) {
    const { voiceInterval, lastVoiceTime } = this.data;
    
    // 每隔指定时间提示一次
    if (seconds > 0 && seconds % voiceInterval === 0 && seconds !== lastVoiceTime) {
      const minutes = Math.floor(seconds / 60);
      const calories = Math.floor(seconds / 60 * this.data.caloriesPerMinute);
      
      wx.showToast({
        title: `已训练${minutes}分钟，消耗${calories}卡路里`,
        icon: 'none',
        duration: 2000
      });
      
      this.setData({
        lastVoiceTime: seconds
      });
    }
  },

  // 重置计时器
  resetTimer() {
    const { timer } = this.data;
    
    if (timer) {
      clearInterval(timer);
    }
    
    this.setData({
      seconds: 0,
      formatTime: '00:00:00',
      isRunning: false,
      timer: null,
      totalCalories: 0,
      lastVoiceTime: 0
    });
    
    // 重置语音提示
    wx.showToast({
      title: '计时器已重置',
      icon: 'success',
      duration: 1500
    });
  },

  // 完成训练
  finishTraining() {
    if (this.data.isRunning) {
      clearInterval(this.data.timer);
    }
    
    // 显示训练完成提示
    wx.showModal({
      title: '训练完成',
      content: `本次训练时长：${this.data.formatTime}\n消耗卡路里：${this.data.totalCalories}千卡`,
      confirmText: '保存',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          // 保存训练记录
          this.saveTrainingRecord();
          
          // 隐藏计时器
          this.setData({
            showTimer: false
          });
          
          // 重置计时器
          this.resetTimer();
        }
      }
    });
  },

  // 保存训练记录
  saveTrainingRecord() {
    // 获取当前日期
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    // 获取已有训练记录
    let trainingRecords = wx.getStorageSync('trainingRecords') || [];
    
    // 添加新记录
    const newRecord = {
      id: Date.now(),
      date: dateStr,
      duration: this.data.seconds,
      formatTime: this.data.formatTime,
      calories: this.data.totalCalories,
      type: 'training',
      typeName: this.data.currentPlanTitle || '训练',
      planId: this.data.currentPlanId || null,
      timestamp: now.getTime()
    };
    
    trainingRecords.push(newRecord);
    
    // 只保留最近30天的记录
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    trainingRecords = trainingRecords.filter(record => record.timestamp > thirtyDaysAgo);
    
    // 保存到本地存储
    wx.setStorageSync('trainingRecords', trainingRecords);
    
    // 提示保存成功
    wx.showToast({
      title: '训练记录已保存',
      icon: 'success',
      duration: 1500
    });
  },

  // 显示计时器
  showTimerView(e) {
    const { id, title } = e.currentTarget.dataset;
    this.setData({
      showTimer: true,
      currentPlanId: id,
      currentPlanTitle: title
    });
    
    // 重置计时器
    this.resetTimer();
  },

  // 隐藏计时器
  hideTimerView() {
    if (this.data.isRunning) {
      wx.showModal({
        title: '训练进行中',
        content: '确定要退出计时器吗？当前训练进度将会丢失。',
        confirmText: '退出',
        cancelText: '继续',
        success: (res) => {
          if (res.confirm) {
            // 停止计时器
            if (this.data.timer) {
              clearInterval(this.data.timer);
            }
            
            this.setData({
              showTimer: false,
              isRunning: false,
              timer: null
            });
            
            // 重置计时器
            this.resetTimer();
          }
        }
      });
    } else {
      this.setData({
        showTimer: false
      });
    }
  },

  // 显示往期计划
  showHistoryPlans() {
    const trainingRecords = wx.getStorageSync('trainingRecords') || [];
    
    // 按日期分组统计
    const recordsByDate = {};
    trainingRecords.forEach(record => {
      if (!recordsByDate[record.date]) {
        recordsByDate[record.date] = {
          date: record.date,
          records: [],
          totalCalories: 0,
          totalDuration: 0
        };
      }
      recordsByDate[record.date].records.push(record);
      recordsByDate[record.date].totalCalories += (record.calories || 0);
      recordsByDate[record.date].totalDuration += (record.duration || 0);
    });
    
    // 转换为数组并排序
    const historyRecords = Object.values(recordsByDate)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(item => ({
        ...item,
        formatTime: this.formatDuration(item.totalDuration),
        weekday: this.getWeekday(item.date)
      }));
    
    this.setData({
      showHistoryModal: true,
      historyRecords: historyRecords
    });
  },

  // 隐藏往期计划
  hideHistoryPlans() {
    this.setData({
      showHistoryModal: false
    });
  },

  // 获取星期几
  getWeekday(dateStr) {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  },

  // 格式化时长
  formatDuration(seconds) {
    if (!seconds) return '0分钟';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return secs > 0 ? `${minutes}分${secs}秒` : `${minutes}分钟`;
    }
    return `${secs}秒`;
  }
})