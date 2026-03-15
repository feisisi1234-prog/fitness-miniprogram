// 成就系统管理
const StorageManager = require('./storage.js');

// 成就定义
const ACHIEVEMENTS = [
  {
    id: 'first_training',
    name: '初次尝试',
    description: '完成第一次训练',
    icon: '🎯',
    category: 'training',
    condition: (stats) => stats.totalDays >= 1
  },
  {
    id: 'week_warrior',
    name: '一周战士',
    description: '连续训练7天',
    icon: '🔥',
    category: 'streak',
    condition: (stats) => stats.continuousDays >= 7
  },
  {
    id: 'month_master',
    name: '月度大师',
    description: '连续训练30天',
    icon: '💪',
    category: 'streak',
    condition: (stats) => stats.continuousDays >= 30
  },
  {
    id: 'hundred_club',
    name: '百日俱乐部',
    description: '连续训练100天',
    icon: '👑',
    category: 'streak',
    condition: (stats) => stats.continuousDays >= 100
  },
  {
    id: 'ten_sessions',
    name: '十全十美',
    description: '完成10次训练',
    icon: '⭐',
    category: 'training',
    condition: (stats) => stats.totalDays >= 10
  },
  {
    id: 'fifty_sessions',
    name: '半百勇士',
    description: '完成50次训练',
    icon: '🌟',
    category: 'training',
    condition: (stats) => stats.totalDays >= 50
  },
  {
    id: 'calorie_burner_1k',
    name: '卡路里杀手',
    description: '累计消耗1000千卡',
    icon: '🔥',
    category: 'calories',
    condition: (stats) => stats.totalCalories >= 1000
  },
  {
    id: 'calorie_burner_5k',
    name: '燃脂达人',
    description: '累计消耗5000千卡',
    icon: '💥',
    category: 'calories',
    condition: (stats) => stats.totalCalories >= 5000
  },
  {
    id: 'calorie_burner_10k',
    name: '燃脂传奇',
    description: '累计消耗10000千卡',
    icon: '🏆',
    category: 'calories',
    condition: (stats) => stats.totalCalories >= 10000
  },
  {
    id: 'time_master_10h',
    name: '时间管理者',
    description: '累计训练10小时',
    icon: '⏰',
    category: 'time',
    condition: (stats) => stats.totalMinutes >= 600
  },
  {
    id: 'time_master_50h',
    name: '时间投资家',
    description: '累计训练50小时',
    icon: '⌚',
    category: 'time',
    condition: (stats) => stats.totalMinutes >= 3000
  },
  {
    id: 'early_bird',
    name: '早起的鸟儿',
    description: '早上6点前完成训练',
    icon: '🌅',
    category: 'special',
    condition: (stats) => stats.hasEarlyTraining
  },
  {
    id: 'night_owl',
    name: '夜猫子',
    description: '晚上10点后完成训练',
    icon: '🌙',
    category: 'special',
    condition: (stats) => stats.hasLateTraining
  }
];

const AchievementManager = {
  // 获取所有成就定义
  getAllAchievements() {
    return ACHIEVEMENTS;
  },

  // 获取已解锁的成就
  getUnlockedAchievements() {
    return StorageManager.getAchievements();
  },

  // 检查并解锁成就
  checkAndUnlock(stats) {
    const unlockedIds = this.getUnlockedAchievements();
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
        if (StorageManager.unlockAchievement(achievement.id)) {
          newlyUnlocked.push(achievement);
        }
      }
    });

    return newlyUnlocked;
  },

  // 显示成就解锁提示
  showUnlockNotification(achievement) {
    wx.showModal({
      title: '🎉 成就解锁',
      content: `${achievement.icon} ${achievement.name}\n${achievement.description}`,
      showCancel: false,
      confirmText: '太棒了'
    });
  },

  // 计算成就完成度
  getProgress() {
    const unlocked = this.getUnlockedAchievements().length;
    const total = ACHIEVEMENTS.length;
    return {
      unlocked,
      total,
      percentage: Math.floor((unlocked / total) * 100)
    };
  },

  // 按类别获取成就
  getAchievementsByCategory() {
    const categories = {
      training: { name: '训练成就', achievements: [] },
      streak: { name: '连续训练', achievements: [] },
      calories: { name: '卡路里消耗', achievements: [] },
      time: { name: '训练时长', achievements: [] },
      special: { name: '特殊成就', achievements: [] }
    };

    const unlocked = this.getUnlockedAchievements();

    ACHIEVEMENTS.forEach(achievement => {
      const isUnlocked = unlocked.includes(achievement.id);
      categories[achievement.category].achievements.push({
        ...achievement,
        unlocked: isUnlocked
      });
    });

    return categories;
  }
};

module.exports = AchievementManager;
