// 统计数据计算工具
const StorageManager = require('./storage.js');

const StatsCalculator = {
  // 计算用户统计数据
  calculateUserStats() {
    const trainingRecords = StorageManager.getTrainingRecords();
    
    if (trainingRecords.length === 0) {
      return {
        totalDays: 0,
        totalMinutes: 0,
        totalCalories: 0,
        continuousDays: 0,
        hasEarlyTraining: false,
        hasLateTraining: false
      };
    }

    // 计算总训练天数（去重日期）
    const uniqueDates = new Set(trainingRecords.map(record => record.date));
    const totalDays = uniqueDates.size;

    // 计算总时长和卡路里
    let totalMinutes = 0;
    let totalCalories = 0;
    let hasEarlyTraining = false;
    let hasLateTraining = false;

    trainingRecords.forEach(record => {
      totalMinutes += Math.floor((record.duration || 0) / 60);
      totalCalories += record.calories || 0;

      // 检查是否有早晨或深夜训练
      if (record.timestamp) {
        const hour = new Date(record.timestamp).getHours();
        if (hour < 6) hasEarlyTraining = true;
        if (hour >= 22) hasLateTraining = true;
      }
    });

    // 计算连续训练天数
    const continuousDays = this.calculateContinuousDays(trainingRecords);

    return {
      totalDays,
      totalMinutes,
      totalCalories,
      continuousDays,
      hasEarlyTraining,
      hasLateTraining
    };
  },

  // 计算连续训练天数
  calculateContinuousDays(records) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let continuousDays = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const checkDateStr = this.formatDate(checkDate);
      const hasRecord = records.some(record => record.date === checkDateStr);
      
      if (hasRecord) {
        continuousDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (i > 0) break;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
    
    return continuousDays;
  },

  // 计算今日进度
  calculateTodayProgress(dailyGoal) {
    const today = this.formatDate(new Date());
    const records = StorageManager.getTrainingRecords();
    const todayRecords = records.filter(record => record.date === today);
    
    let todayMinutes = 0;
    let todayCalories = 0;
    
    todayRecords.forEach(record => {
      todayMinutes += Math.floor((record.duration || 0) / 60);
      todayCalories += record.calories || 0;
    });
    
    const progress = Math.min(Math.floor((todayMinutes / dailyGoal.minutes) * 100), 100);
    
    return {
      todayMinutes,
      todayCalories,
      todayProgress: progress
    };
  },

  // 计算本周统计
  calculateWeekStats() {
    const records = StorageManager.getTrainingRecords();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekAgo && recordDate <= now;
    });
    
    const uniqueDates = new Set(weekRecords.map(record => record.date));
    const totalDays = uniqueDates.size;
    
    let totalMinutes = 0;
    let totalCalories = 0;
    
    weekRecords.forEach(record => {
      totalMinutes += Math.floor((record.duration || 0) / 60);
      totalCalories += record.calories || 0;
    });
    
    return {
      totalDays,
      totalMinutes,
      totalCalories
    };
  },

  // 生成训练热力图数据（类似 GitHub）
  generateHeatmapData(days = 365) {
    const records = StorageManager.getTrainingRecords();
    const today = new Date();
    const heatmapData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      
      const dayRecords = records.filter(r => r.date === dateStr);
      const totalMinutes = dayRecords.reduce((sum, r) => sum + Math.floor((r.duration || 0) / 60), 0);
      
      heatmapData.push({
        date: dateStr,
        count: dayRecords.length,
        minutes: totalMinutes,
        level: this.getHeatmapLevel(totalMinutes)
      });
    }
    
    return heatmapData;
  },

  // 获取热力图等级（0-4）
  getHeatmapLevel(minutes) {
    if (minutes === 0) return 0;
    if (minutes < 15) return 1;
    if (minutes < 30) return 2;
    if (minutes < 60) return 3;
    return 4;
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 生成月度报告
  generateMonthlyReport(year, month) {
    const records = StorageManager.getTrainingRecords();
    const monthRecords = records.filter(record => {
      const [y, m] = record.date.split('-');
      return parseInt(y) === year && parseInt(m) === month;
    });
    
    const uniqueDates = new Set(monthRecords.map(r => r.date));
    const totalDays = uniqueDates.size;
    
    let totalMinutes = 0;
    let totalCalories = 0;
    const categoryStats = {};
    
    monthRecords.forEach(record => {
      totalMinutes += Math.floor((record.duration || 0) / 60);
      totalCalories += record.calories || 0;
      
      const category = record.category || '其他';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, minutes: 0, calories: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].minutes += Math.floor((record.duration || 0) / 60);
      categoryStats[category].calories += record.calories || 0;
    });
    
    return {
      year,
      month,
      totalDays,
      totalMinutes,
      totalCalories,
      totalSessions: monthRecords.length,
      categoryStats,
      avgMinutesPerDay: totalDays > 0 ? Math.floor(totalMinutes / totalDays) : 0,
      avgCaloriesPerDay: totalDays > 0 ? Math.floor(totalCalories / totalDays) : 0
    };
  }
};

module.exports = StatsCalculator;
