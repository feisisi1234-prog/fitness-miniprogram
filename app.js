// app.js
App({
  globalData: {
    userInfo: null,
    trainingRecords: [],
    userStats: {
      totalDays: 0,
      totalMinutes: 0,
      totalCalories: 0,
      continuousDays: 0
    }
  },

  onLaunch() {
    // 小程序启动时执行
    console.log('健身助手小程序启动');
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 初始化用户数据
    this.initUserData();
  },

  onShow() {
    // 小程序显示时执行
  },

  onHide() {
    // 小程序隐藏时执行
  },

  checkLoginStatus() {
    // 检查用户登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  initUserData() {
    // 初始化用户数据
    const userStats = wx.getStorageSync('userStats');
    if (userStats) {
      this.globalData.userStats = userStats;
    }

    const trainingRecords = wx.getStorageSync('trainingRecords');
    if (trainingRecords) {
      this.globalData.trainingRecords = trainingRecords;
    }
  },

  saveUserData() {
    // 保存用户数据到本地存储
    wx.setStorageSync('userInfo', this.globalData.userInfo);
    wx.setStorageSync('userStats', this.globalData.userStats);
    wx.setStorageSync('trainingRecords', this.globalData.trainingRecords);
  },

  updateTrainingRecord(record) {
    // 更新训练记录
    this.globalData.trainingRecords.unshift(record);
    
    // 更新统计数据
    this.globalData.userStats.totalDays = this.getUniqueTrainingDays();
    this.globalData.userStats.totalMinutes += record.duration;
    this.globalData.userStats.totalCalories += record.calories;
    this.globalData.userStats.continuousDays = this.getContinuousDays();
    
    // 保存数据
    this.saveUserData();
  },

  getUniqueTrainingDays() {
    // 获取不重复的训练天数
    const dates = this.globalData.trainingRecords.map(record => {
      const date = new Date(record.date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    });
    
    return new Set(dates).size;
  },

  getContinuousDays() {
    // 获取连续训练天数
    if (this.globalData.trainingRecords.length === 0) {
      return 0;
    }
    
    let continuousDays = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 检查今天是否有训练记录
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const hasTodayRecord = this.globalData.trainingRecords.some(record => {
      const recordDate = new Date(record.date);
      const recordDateStr = `${recordDate.getFullYear()}-${recordDate.getMonth() + 1}-${recordDate.getDate()}`;
      return recordDateStr === todayStr;
    });
    
    if (!hasTodayRecord) {
      // 如果今天没有训练，检查昨天
      today.setDate(today.getDate() - 1);
    }
    
    // 从今天或昨天开始往前计算连续天数
    const checkDate = new Date(today);
    
    while (true) {
      const checkDateStr = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
      
      const hasRecord = this.globalData.trainingRecords.some(record => {
        const recordDate = new Date(record.date);
        const recordDateStr = `${recordDate.getFullYear()}-${recordDate.getMonth() + 1}-${recordDate.getDate()}`;
        return recordDateStr === checkDateStr;
      });
      
      if (hasRecord) {
        continuousDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return continuousDays;
  }
})
