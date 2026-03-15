// index.js
const app = getApp();
const StorageManager = require('../../utils/storage.js');
const StatsCalculator = require('../../utils/stats.js');
const AchievementManager = require('../../utils/achievement.js');

Page({
  data: {
    greeting: '早上好',
    userInfo: {
      name: '健身达人',
      avatar: '/images/ui/placeholder.png'
    },
    dailyGoal: {
      minutes: 30,
      calories: 200
    },
    todayMinutes: 0,
    todayCalories: 0,
    todayProgress: 0,
    recommendedPlans: [],
    weekStats: {
      totalDays: 0,
      totalMinutes: 0,
      totalCalories: 0,
      continuousDays: 0
    }
  },

  onLoad() {
    console.log('=== Index页面加载 ===');
    this.setGreeting();
    this.loadUserInfo();
    this.loadRecommendedPlans();
    this.calculateTodayProgress();
    this.calculateWeekStats();
    console.log('=== Index页面加载完成 ===');
  },

  onShow() {
    console.log('=== Index页面 onShow 触发 ===');
    console.log('重新计算今日进度和本周统计');
    this.setGreeting();
    this.calculateTodayProgress();
    this.calculateWeekStats();
    console.log('=== Index页面 onShow 完成 ===');
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    console.log('用户选择的头像:', avatarUrl);
    
    // 更新页面显示
    this.setData({
      'userInfo.avatar': avatarUrl
    });
    
    // 保存到本地存储
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.avatar = avatarUrl;
    wx.setStorageSync('userInfo', userInfo);
    
    wx.showToast({
      title: '头像更新成功',
      icon: 'success',
      duration: 1500
    });
  },

  setGreeting() {
    const hour = new Date().getHours();
    let greeting = '早上好';
    if (hour >= 6 && hour < 12) {
      greeting = '早上好';
    } else if (hour >= 12 && hour < 14) {
      greeting = '中午好';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好';
    } else {
      greeting = '夜深了';
    }
    this.setData({ greeting });
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('=== 用户触发下拉刷新 ===');
    this.calculateTodayProgress();
    this.calculateWeekStats();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 更新训练数据（供其他页面调用）
  updateTrainingData() {
    this.calculateTodayProgress();
    this.calculateWeekStats();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userInfo: {
        name: userInfo.name || '健身达人',
        avatar: userInfo.avatar || '/images/ui/placeholder.png'
      }
    });
  },

  // 加载推荐训练计划
  loadRecommendedPlans() {
    const plans = [
      {
        id: 1,
        title: '全身力量训练',
        description: '适合初学者的全身力量训练',
        category: '力量训练',
        coverImage: '/images/training-types/training-strength.svg',
        duration: '30分钟',
        calories: 200,
        difficulty: '初级',
        difficultyLevel: 'beginner',
        rating: 4.5,
        participants: 1280,
        formattedParticipants: '1.3k'
      },
      {
        id: 2,
        title: 'HIIT燃脂训练',
        description: '高强度间歇训练',
        category: '有氧运动',
        coverImage: '/images/training-types/training-hiit.svg',
        duration: '20分钟',
        calories: 250,
        difficulty: '中级',
        difficultyLevel: 'intermediate',
        rating: 4.7,
        participants: 2560,
        formattedParticipants: '2.6k'
      },
      {
        id: 3,
        title: '瑜伽拉伸',
        description: '舒缓身心的瑜伽练习',
        category: '柔韧性',
        coverImage: '/images/training-types/training-yoga.svg',
        duration: '40分钟',
        calories: 120,
        difficulty: '初级',
        difficultyLevel: 'beginner',
        rating: 4.3,
        participants: 890,
        formattedParticipants: '890'
      },
      {
        id: 4,
        title: '核心强化',
        description: '打造完美腹肌',
        category: '核心训练',
        coverImage: '/images/training-types/training-core.svg',
        duration: '25分钟',
        calories: 180,
        difficulty: '中级',
        difficultyLevel: 'intermediate',
        rating: 4.6,
        participants: 1890,
        formattedParticipants: '1.9k'
      }
    ];
    
    this.setData({
      recommendedPlans: plans
    });
  },

  // 计算今日进度
  calculateTodayProgress() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    console.log('=== 开始计算今日进度 ===');
    console.log('今日日期:', todayStr);
    
    const trainingRecords = wx.getStorageSync('trainingRecords') || [];
    console.log('所有训练记录总数:', trainingRecords.length);
    
    const todayRecords = trainingRecords.filter(record => record.date === todayStr);
    console.log('今日训练记录数:', todayRecords.length);
    
    let todayMinutes = 0;
    let todayCalories = 0;
    
    todayRecords.forEach((record, index) => {
      const durationInSeconds = record.duration || 0;
      const minutes = Math.floor(durationInSeconds / 60);
      const calories = record.calories || 0;
      console.log(`记录${index + 1}:`, {
        typeName: record.typeName,
        duration_seconds: durationInSeconds,
        calculated_minutes: minutes,
        calories: calories,
        date: record.date
      });
      todayMinutes += minutes;
      todayCalories += calories;
    });
    
    console.log('今日累计 - 总分钟数:', todayMinutes, '总卡路里:', todayCalories);
    console.log('每日目标 - 分钟:', this.data.dailyGoal.minutes, '卡路里:', this.data.dailyGoal.calories);
    
    // 只根据时长计算进度，更直观
    const todayProgress = Math.min(Math.floor((todayMinutes / this.data.dailyGoal.minutes) * 100), 100);
    
    console.log('进度计算 - 时长进度:', todayProgress + '%');
    console.log('=== 计算今日进度完成 ===');
    
    this.setData({
      todayMinutes,
      todayCalories,
      todayProgress
    });
  },

  // 计算本周统计
  calculateWeekStats() {
    const trainingRecords = wx.getStorageSync('trainingRecords') || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekRecords = trainingRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekAgo && recordDate <= now;
    });
    
    // 计算本周训练天数（去重）
    const uniqueDates = new Set(weekRecords.map(record => record.date));
    const totalDays = uniqueDates.size;
    
    // 计算总时长和卡路里
    let totalMinutes = 0;
    let totalCalories = 0;
    
    weekRecords.forEach(record => {
      totalMinutes += Math.floor((record.duration || 0) / 60);
      totalCalories += record.calories || 0;
    });
    
    // 计算连续训练天数
    let continuousDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const checkDateStr = `${checkDate.getFullYear()}-${(checkDate.getMonth() + 1).toString().padStart(2, '0')}-${checkDate.getDate().toString().padStart(2, '0')}`;
      
      const hasRecord = trainingRecords.some(record => record.date === checkDateStr);
      
      if (hasRecord) {
        continuousDays++;
      } else if (i > 0) {
        // 如果不是今天且没有记录，停止计算
        break;
      }
    }
    
    this.setData({
      weekStats: {
        totalDays,
        totalMinutes,
        totalCalories,
        continuousDays
      }
    });
  },

  // 跳转到训练页面
  goToTraining() {
    wx.switchTab({
      url: '/pages/training/training'
    });
  },

  // 跳转到自定义计划页面
  goToCustomPlans() {
    wx.switchTab({
      url: '/pages/custom-plans/custom-plans'
    });
  },

  // 跳转到肌肉分析页面
  goToMuscleAnalysis() {
    wx.navigateTo({
      url: '/pages/muscle-analysis/muscle-analysis'
    });
  },

  // 跳转到训练记录页面
  goToRecords() {
    wx.navigateTo({
      url: '/pages/training-records/training-records'
    });
  },

  // 跳转到食物识别页面
  goToFoodRecognition() {
    wx.navigateTo({
      url: '/pages/food-recognition/food-recognition'
    });
  },

  // 跳转到计划详情页面
  goToPlanDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/plan-detail/plan-detail?id=${id}`
    });
  }
})
