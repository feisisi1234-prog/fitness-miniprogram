// 生成测试训练数据的工具函数
// 使用方法：在任意页面的 onLoad 中调用 generateTestData()

function generateTestData() {
  console.log('=== 开始生成测试数据 ===');
  
  // 2026年2月的10个随机日期
  const testDates = [
    '2026-02-03',
    '2026-02-05',
    '2026-02-08',
    '2026-02-10',
    '2026-02-12',
    '2026-02-15',
    '2026-02-18',
    '2026-02-20',
    '2026-02-23',
    '2026-02-25'
  ];
  
  // 训练计划模板
  const trainingPlans = [
    {
      id: 1,
      typeName: '全身力量训练',
      type: '力量训练',
      durationRange: [1200, 2100], // 20-35分钟
      caloriesRange: [150, 250]
    },
    {
      id: 2,
      typeName: 'HIIT燃脂训练',
      type: '有氧运动',
      durationRange: [900, 1500], // 15-25分钟
      caloriesRange: [200, 300]
    },
    {
      id: 3,
      typeName: '瑜伽拉伸',
      type: '柔韧性',
      durationRange: [1800, 2700], // 30-45分钟
      caloriesRange: [80, 150]
    },
    {
      id: 4,
      typeName: '腹肌撕裂者',
      type: '力量训练',
      durationRange: [600, 1200], // 10-20分钟
      caloriesRange: [100, 180]
    }
  ];
  
  // 生成训练记录
  const trainingRecords = [];
  
  testDates.forEach((dateStr, index) => {
    // 随机选择一个训练计划
    const plan = trainingPlans[Math.floor(Math.random() * trainingPlans.length)];
    
    // 生成随机时长（秒）
    const duration = Math.floor(
      Math.random() * (plan.durationRange[1] - plan.durationRange[0]) + plan.durationRange[0]
    );
    
    // 生成随机卡路里
    const calories = Math.floor(
      Math.random() * (plan.caloriesRange[1] - plan.caloriesRange[0]) + plan.caloriesRange[0]
    );
    
    // 生成随机时间（8:00-20:00之间）
    const hour = Math.floor(Math.random() * 12) + 8;
    const minute = Math.floor(Math.random() * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // 创建日期时间戳
    const [year, month, day] = dateStr.split('-');
    const timestamp = new Date(year, month - 1, day, hour, minute).getTime();
    
    // 格式化时长
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    let formatTime = '';
    if (hours > 0) {
      formatTime = `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      formatTime = `${minutes}分钟${seconds}秒`;
    } else {
      formatTime = `${seconds}秒`;
    }
    
    // 创建训练记录
    const record = {
      id: `test_${timestamp}_${index}`,
      planId: plan.id,
      typeName: plan.typeName,
      type: plan.type,
      date: dateStr,
      time: timeStr,
      duration: duration,
      formatTime: formatTime,
      calories: calories,
      timestamp: timestamp,
      completedExercises: Math.floor(Math.random() * 3) + 2, // 2-4个动作
      totalExercises: 4,
      progress: Math.floor((Math.random() * 30) + 70) // 70-100%的完成度
    };
    
    trainingRecords.push(record);
    
    console.log(`生成记录 ${index + 1}:`, {
      日期: record.date,
      时间: record.time,
      训练: record.typeName,
      时长: record.formatTime,
      卡路里: record.calories
    });
  });
  
  // 按时间戳排序（从旧到新）
  trainingRecords.sort((a, b) => a.timestamp - b.timestamp);
  
  // 保存到本地存储
  try {
    // 获取现有记录
    let existingRecords = wx.getStorageSync('trainingRecords') || [];
    
    // 删除2月份的旧测试数据（避免重复）
    existingRecords = existingRecords.filter(record => {
      return !record.date.startsWith('2026-02');
    });
    
    // 合并新旧记录
    const allRecords = [...existingRecords, ...trainingRecords];
    
    // 保存
    wx.setStorageSync('trainingRecords', allRecords);
    
    console.log('=== 测试数据生成成功 ===');
    console.log('总记录数:', allRecords.length);
    console.log('新增记录数:', trainingRecords.length);
    
    // 显示成功提示
    wx.showModal({
      title: '测试数据生成成功',
      content: `已生成2月份10天的训练记录\n总记录数: ${allRecords.length}\n新增: ${trainingRecords.length}条`,
      showCancel: false,
      success: () => {
        // 刷新当前页面
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage.onLoad) {
          currentPage.onLoad();
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error('保存测试数据失败:', error);
    wx.showToast({
      title: '生成数据失败',
      icon: 'error'
    });
    return false;
  }
}

// 清除所有训练记录（用于测试）
function clearAllRecords() {
  wx.showModal({
    title: '确认清除',
    content: '确定要清除所有训练记录吗？此操作不可恢复！',
    success: (res) => {
      if (res.confirm) {
        wx.setStorageSync('trainingRecords', []);
        console.log('所有训练记录已清除');
        wx.showToast({
          title: '已清除所有记录',
          icon: 'success'
        });
        
        // 刷新当前页面
        setTimeout(() => {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          if (currentPage.onLoad) {
            currentPage.onLoad();
          }
        }, 1500);
      }
    }
  });
}

// 查看当前所有记录
function viewAllRecords() {
  const records = wx.getStorageSync('trainingRecords') || [];
  console.log('=== 所有训练记录 ===');
  console.log('总数:', records.length);
  records.forEach((record, index) => {
    console.log(`${index + 1}. ${record.date} ${record.time} - ${record.typeName} (${record.formatTime}, ${record.calories}千卡)`);
  });
  console.log('===================');
  
  wx.showModal({
    title: '训练记录统计',
    content: `总记录数: ${records.length}\n详情请查看控制台`,
    showCancel: false
  });
}

module.exports = {
  generateTestData,
  clearAllRecords,
  viewAllRecords
};
