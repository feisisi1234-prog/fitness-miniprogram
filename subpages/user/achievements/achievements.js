// pages/achievements/achievements.js
const AchievementManager = require('../../utils/achievement.js');
const StatsCalculator = require('../../utils/stats.js');

Page({
  data: {
    progress: {
      unlocked: 0,
      total: 0,
      percentage: 0
    },
    categories: {},
    currentTab: 'all'
  },

  onLoad() {
    this.loadAchievements();
  },

  onShow() {
    this.loadAchievements();
  },

  loadAchievements() {
    const progress = AchievementManager.getProgress();
    const categories = AchievementManager.getAchievementsByCategory();
    
    this.setData({
      progress,
      categories
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  showAchievementDetail(e) {
    const { id, name, description, unlocked } = e.currentTarget.dataset;
    
    wx.showModal({
      title: name,
      content: description + (unlocked ? '\n\n✅ 已解锁' : '\n\n🔒 未解锁'),
      showCancel: false
    });
  },

  shareAchievements() {
    const { unlocked, total } = this.data.progress;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: `已解锁 ${unlocked}/${total} 个成就`,
      icon: 'success'
    });
  }
});
