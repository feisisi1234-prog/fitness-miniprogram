// 统一的本地存储管理工具
const StorageManager = {
  // 训练记录相关
  getTrainingRecords() {
    return wx.getStorageSync('trainingRecords') || [];
  },

  saveTrainingRecord(record) {
    const records = this.getTrainingRecords();
    records.push({
      ...record,
      id: record.id || Date.now(),
      timestamp: record.timestamp || Date.now()
    });
    
    // 只保留最近90天的记录
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const filteredRecords = records.filter(r => r.timestamp > ninetyDaysAgo);
    
    wx.setStorageSync('trainingRecords', filteredRecords);
    return filteredRecords;
  },

  // 用户信息相关
  getUserInfo() {
    return wx.getStorageSync('userInfo') || {
      name: '健身达人',
      avatar: '/images/ui/placeholder.png',
      level: 'Lv.1 新手'
    };
  },

  saveUserInfo(userInfo) {
    wx.setStorageSync('userInfo', userInfo);
  },

  // 成就系统
  getAchievements() {
    return wx.getStorageSync('achievements') || [];
  },

  unlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      wx.setStorageSync('achievements', achievements);
      return true;
    }
    return false;
  },

  // 身体数据记录
  getBodyRecords() {
    return wx.getStorageSync('bodyRecords') || [];
  },

  saveBodyRecord(record) {
    const records = this.getBodyRecords();
    records.push({
      ...record,
      date: record.date || new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    });
    wx.setStorageSync('bodyRecords', records);
  },

  // 饮食记录
  getFoodRecords() {
    return wx.getStorageSync('foodRecords') || [];
  },

  saveFoodRecord(record) {
    const records = this.getFoodRecords();
    records.push({
      ...record,
      id: Date.now(),
      timestamp: Date.now()
    });
    wx.setStorageSync('foodRecords', records);
  },

  // 清除所有数据
  clearAll() {
    wx.clearStorageSync();
  }
};

module.exports = StorageManager;
