// profile.js
const app = getApp()

Page({
  data: {
    userInfo: {
      name: '健身达人',
      avatar: '/images/ui/placeholder.png',
      level: 'Lv.1 新手'
    },
    userStats: {
      totalDays: 0,
      totalMinutes: 0,
      totalCalories: 0,
      continuousDays: 0
    },
    weeklyCalories: 0,
    weeklyData: [],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    calendarDays: [],
    trainingRecords: [],
    customPlans: []
  },

  onLoad() {
    console.log('Profile页面加载');
    this.loadUserData();
    this.loadTrainingRecords();
    this.loadCustomPlans();
    this.calculateUserStats(); // 计算用户统计数据
    this.generateCalendar();
    this.calculateWeeklyData();
  },

  onShow() {
    console.log('Profile页面显示');
    this.loadUserData(); // 重新加载用户数据
    this.loadTrainingRecords();
    this.loadCustomPlans();
    this.calculateUserStats(); // 计算用户统计数据
    this.generateCalendar();
    this.calculateWeeklyData();
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

  // 加载用户数据
  loadUserData() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const userStats = wx.getStorageSync('userStats') || {
      totalDays: 0,
      totalMinutes: 0,
      totalCalories: 0,
      continuousDays: 0
    };

    this.setData({
      userInfo: {
        name: userInfo.name || '健身达人',
        avatar: userInfo.avatar || '/images/ui/placeholder.png',
        level: userInfo.level || 'Lv.1 新手'
      },
      userStats
    });
  },

  // 加载训练记录
  loadTrainingRecords() {
    const trainingRecords = wx.getStorageSync('trainingRecords') || [];
    this.setData({
      trainingRecords
    });
  },

  // 计算用户统计数据
  calculateUserStats() {
    console.log('=== 开始计算用户统计数据 ===');
    const trainingRecords = this.data.trainingRecords || [];
    console.log('训练记录总数:', trainingRecords.length);
    
    if (trainingRecords.length === 0) {
      console.log('没有训练记录，统计数据为0');
      this.setData({
        userStats: {
          totalDays: 0,
          totalMinutes: 0,
          totalCalories: 0,
          continuousDays: 0
        }
      });
      return;
    }
    
    // 计算总训练天数（去重日期）
    const uniqueDates = new Set(trainingRecords.map(record => record.date));
    const totalDays = uniqueDates.size;
    console.log('总训练天数:', totalDays);
    
    // 计算总时长和总卡路里
    let totalMinutes = 0;
    let totalCalories = 0;
    
    trainingRecords.forEach(record => {
      totalMinutes += Math.floor((record.duration || 0) / 60);
      totalCalories += record.calories || 0;
    });
    
    console.log('总时长(分钟):', totalMinutes, '总卡路里:', totalCalories);
    
    // 计算连续训练天数（从今天往前推）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let continuousDays = 0;
    let checkDate = new Date(today);
    
    // 从今天开始往前检查
    while (true) {
      const checkDateStr = `${checkDate.getFullYear()}-${(checkDate.getMonth() + 1).toString().padStart(2, '0')}-${checkDate.getDate().toString().padStart(2, '0')}`;
      const hasRecord = trainingRecords.some(record => record.date === checkDateStr);
      
      console.log('检查日期:', checkDateStr, '有记录:', hasRecord);
      
      if (hasRecord) {
        continuousDays++;
        // 往前推一天
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // 如果是今天没有记录，继续检查昨天
        if (continuousDays === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        // 如果已经有连续天数了，遇到断开就停止
        break;
      }
      
      // 防止无限循环，最多检查365天
      if (continuousDays >= 365) {
        break;
      }
    }
    
    console.log('连续训练天数:', continuousDays);
    console.log('=== 用户统计数据计算完成 ===');
    
    const userStats = {
      totalDays,
      totalMinutes,
      totalCalories,
      continuousDays
    };
    
    this.setData({
      userStats
    });
    
    // 保存到本地存储
    wx.setStorageSync('userStats', userStats);
  },

  // 加载自定义计划
  loadCustomPlans() {
    const customPlans = wx.getStorageSync('customPlans') || [];
    this.setData({
      customPlans
    });
  },

  // 生成日历
  generateCalendar() {
    const now = new Date();
    const year = this.data.currentYear || now.getFullYear();
    const month = this.data.currentMonth || (now.getMonth() + 1);
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // 获取当月第一天是星期几（0=周日, 1=周一, ..., 6=周六）
    const firstDayWeek = firstDay.getDay();
    
    // 获取当月天数
    const daysInMonth = lastDay.getDate();
    
    const calendarDays = [];
    
    // 添加上个月的日期（填充）
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth, 0).getDate();
    
    // 填充上个月的日期，从周日开始
    if (firstDayWeek > 0) {
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        calendarDays.push({
          day,
          date,
          isCurrentMonth: false,
          isToday: false,
          hasTraining: this.hasTrainingOnDate(date)
        });
      }
    }
    
    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const isToday = date === todayStr;
      
      calendarDays.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
        hasTraining: this.hasTrainingOnDate(date)
      });
    }
    
    // 添加下个月的日期（填充到完整的周，最多6周=42天）
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const totalCells = Math.ceil(calendarDays.length / 7) * 7; // 确保是7的倍数
    const remainingDays = totalCells - calendarDays.length;
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      calendarDays.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
        hasTraining: this.hasTrainingOnDate(date)
      });
    }
    
    this.setData({
      calendarDays,
      currentYear: year,
      currentMonth: month
    });
  },

  // 检查指定日期是否有训练记录
  hasTrainingOnDate(date) {
    // 检查训练记录
    const hasTrainingRecord = this.data.trainingRecords.some(record => record.date === date);
    
    // 检查自定义计划记录
    const hasCustomPlanRecord = this.data.customPlans.some(plan => 
      plan.exercises && plan.exercises.some(exercise => exercise.completedDate === date)
    );
    
    return hasTrainingRecord || hasCustomPlanRecord;
  },

  // 计算本周数据
  calculateWeeklyData() {
    const now = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weeklyData = [];
    let weeklyCalories = 0;
    
    // 获取本周的日期范围
    const today = new Date(now);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      // 计算当天的卡路里消耗
      const dayRecords = this.data.trainingRecords.filter(record => record.date === dateStr);
      const dayCalories = dayRecords.reduce((total, record) => total + (record.calories || 0), 0);
      
      weeklyCalories += dayCalories;
      
      weeklyData.push({
        day: weekDays[i],
        calories: dayCalories,
        percentage: 0 // 稍后计算百分比
      });
    }
    
    // 计算百分比（基于最大值）
    const maxCalories = Math.max(...weeklyData.map(item => item.calories), 1);
    weeklyData.forEach(item => {
      item.percentage = (item.calories / maxCalories) * 100;
    });
    
    this.setData({
      weeklyData,
      weeklyCalories
    });
  },

  // 上一个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 1) {
      currentYear--;
      currentMonth = 12;
    } else {
      currentMonth--;
    }
    
    this.setData({
      currentYear,
      currentMonth
    });
    
    this.generateCalendar();
  },

  // 下一个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    
    if (currentMonth === 12) {
      currentYear++;
      currentMonth = 1;
    } else {
      currentMonth++;
    }
    
    this.setData({
      currentYear,
      currentMonth
    });
    
    this.generateCalendar();
  },

  // 选择日期
  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    const hasTraining = this.hasTrainingOnDate(date);
    
    if (hasTraining) {
      // 显示当天的训练记录
      const dayRecords = this.data.trainingRecords.filter(record => record.date === date);
      
      if (dayRecords.length > 0) {
        const recordsText = dayRecords.map(record => 
          `${record.typeName || '训练'}: ${Math.floor((record.duration || 0) / 60)}分钟, ${record.calories || 0}千卡`
        ).join('\n');
        
        wx.showModal({
          title: `${date} 训练记录`,
          content: recordsText,
          showCancel: false
        });
      }
    } else {
      wx.showToast({
        title: '当天无训练记录',
        icon: 'none'
      });
    }
  },

  // 编辑个人资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit'
    });
  },

  // 跳转到训练记录页面
  goToRecords() {
    wx.navigateTo({
      url: '/pages/training-records/training-records'
    });
  },

  // 跳转到成就中心
  goToAchievements() {
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    });
  },

  // 跳转到身体数据追踪
  goToBodyTracking() {
    wx.navigateTo({
      url: '/pages/body-tracking/body-tracking'
    });
  },

  // 跳转到设置页面
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 跳转到关于页面
  goToAbout() {
    wx.showModal({
      title: '关于健身助手',
      content: '版本: 1.0.0\n一款专业的健身训练小程序\n帮助您科学健身，记录成长',
      showCancel: false
    });
  }
})