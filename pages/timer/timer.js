// timer.js
const app = getApp()

Page({
  data: {
    seconds: 0,
    formatTime: '00:00:00',
    isRunning: false,
    timer: null,
    lapTimes: [],
    currentType: 'running',
    totalCalories: 0,
    caloriesPerMinute: 8,
    voiceEnabled: true,
    voiceInterval: 60, // 语音提示间隔（秒）
    lastVoiceTime: 0, // 上次语音提示时间
    presetTimes: [
      { name: '5分钟', seconds: 300 },
      { name: '10分钟', seconds: 600 },
      { name: '15分钟', seconds: 900 },
      { name: '20分钟', seconds: 1200 },
      { name: '30分钟', seconds: 1800 },
      { name: '45分钟', seconds: 2700 }
    ],
    exerciseTypes: [
      { type: 'running', name: '跑步', icon: '/images/running.svg', caloriesPerMinute: 10 },
      { type: 'cycling', name: '骑行', icon: '/images/cycling.svg', caloriesPerMinute: 8 },
      { type: 'swimming', name: '游泳', icon: '/images/swimming.svg', caloriesPerMinute: 12 },
      { type: 'yoga', name: '瑜伽', icon: '/images/yoga.svg', caloriesPerMinute: 3 },
      { type: 'strength', name: '力量', icon: '/images/strength.svg', caloriesPerMinute: 6 },
      { type: 'other', name: '其他', icon: '/images/placeholder.png', caloriesPerMinute: 5 }
    ]
  },

  onLoad(options) {
    // 页面加载时初始化
    if (options.planId) {
      this.setData({
        planId: options.planId
      });
    }
    
    // 获取语音设置
    this.getVoiceSettings();
  },

  onUnload() {
    // 页面卸载时清除计时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 获取语音设置
  getVoiceSettings() {
    const voiceEnabled = wx.getStorageSync('voiceEnabled') !== false; // 默认开启
    const voiceInterval = wx.getStorageSync('voiceInterval') || 60; // 默认60秒
    
    this.setData({
      voiceEnabled,
      voiceInterval
    });
  },

  // 切换语音设置
  toggleVoice() {
    const newVoiceEnabled = !this.data.voiceEnabled;
    this.setData({
      voiceEnabled: newVoiceEnabled
    });
    
    // 保存设置到本地存储
    wx.setStorageSync('voiceEnabled', newVoiceEnabled);
    
    // 提示用户
    wx.showToast({
      title: newVoiceEnabled ? '语音提示已开启' : '语音提示已关闭',
      icon: 'success',
      duration: 1500
    });
  },

  // 设置语音提示间隔
  setVoiceInterval(e) {
    const interval = parseInt(e.currentTarget.dataset.interval);
    this.setData({
      voiceInterval: interval
    });
    
    // 保存设置到本地存储
    wx.setStorageSync('voiceInterval', interval);
    
    // 提示用户
    let intervalText = '30秒';
    if (interval === 60) intervalText = '1分钟';
    else if (interval === 120) intervalText = '2分钟';
    else if (interval === 300) intervalText = '5分钟';
    
    wx.showToast({
      title: `语音提示间隔已设置为${intervalText}`,
      icon: 'success',
      duration: 1500
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

  // 语音播报
  speakText(text) {
    if (!this.data.voiceEnabled) return;
    
    // 使用微信内置语音合成API
    if (wx.createInnerAudioContext) {
      // 创建音频上下文
      const audioContext = wx.createInnerAudioContext();
      
      // 使用系统TTS（需要小程序有相关权限）
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 2000
      });
    }
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
      this.speakText('训练已暂停');
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
      this.speakText('训练开始');
    }
  },

  // 检查是否需要语音提示
  checkVoicePrompt(seconds) {
    const { voiceInterval, lastVoiceTime } = this.data;
    
    // 每隔指定时间提示一次
    if (seconds > 0 && seconds % voiceInterval === 0 && seconds !== lastVoiceTime) {
      const minutes = Math.floor(seconds / 60);
      const calories = Math.floor(seconds / 60 * this.data.caloriesPerMinute);
      
      this.speakText(`已训练${minutes}分钟，消耗${calories}卡路里`);
      
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
      lapTimes: [],
      totalCalories: 0,
      lastVoiceTime: 0
    });
    
    // 重置语音提示
    this.speakText('计时器已重置');
  },

  // 记录分段时间
  recordLap() {
    const { lapTimes, formatTime } = this.data;
    
    this.setData({
      lapTimes: [...lapTimes, { time: formatTime }]
    });
    
    // 语音提示记录分段
    this.speakText(`分段记录：${formatTime}`);
  },

  // 设置预设时间
  setPresetTime(e) {
    const seconds = e.currentTarget.dataset.seconds;
    
    // 如果计时器正在运行，先停止
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    
    this.setData({
      seconds,
      formatTime: this.formatTime(seconds),
      isRunning: false,
      timer: null,
      lastVoiceTime: 0
    });
  },

  // 选择运动类型
  selectExerciseType(e) {
    const type = e.currentTarget.dataset.type;
    const exerciseType = this.data.exerciseTypes.find(item => item.type === type);
    this.setData({
      currentType: type,
      caloriesPerMinute: exerciseType ? exerciseType.caloriesPerMinute : 8
    });
    
    // 语音提示运动类型变更
    if (exerciseType) {
      this.speakText(`已切换到${exerciseType.name}模式`);
    }
  },

  // 完成训练
  finishTraining() {
    if (this.data.isRunning) {
      clearInterval(this.data.timer);
    }
    
    // 语音提示训练完成
    this.speakText('训练完成，辛苦了！');
    
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
          
          // 保存训练数据到首页
          this.saveTrainingData();
          
          // 返回首页
          wx.navigateBack();
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
      type: this.data.currentType,
      typeName: this.data.exerciseTypes.find(item => item.type === this.data.currentType)?.name || '未知',
      planId: this.data.planId || null,
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

  // 保存训练数据
  saveTrainingData() {
    // 获取当前页面栈
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一个页面（首页）
    
    // 如果上一个页面是首页，调用其更新训练数据的方法
    if (prevPage && prevPage.route === 'pages/index/index') {
      const durationInMinutes = Math.floor(this.data.seconds / 60);
      const calories = this.data.totalCalories;
      
      prevPage.updateTrainingData(durationInMinutes, calories);
    }
  }
})