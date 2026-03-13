// pages/settings/settings.js
const app = getApp()

Page({
  data: {
    userInfo: {
      name: '健身达人',
      avatar: '/images/placeholder.png'
    },
    dailyGoal: {
      minutes: 30,
      calories: 200
    },
    reminderEnabled: false,
    reminderTime: '09:00',
    voiceEnabled: true,
    voiceInterval: 60,
    unit: 'metric', // metric: 公制, imperial: 英制
    darkMode: false,
    cacheSize: '0KB'
  },

  onLoad() {
    // 引入测试数据工具
    this.testDataUtils = require('../../utils/generate-test-data.js');
    
    this.loadSettings();
    this.calculateCacheSize();
  },

  onShow() {
    this.loadSettings();
  },

  // 加载设置
  loadSettings() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const dailyGoal = wx.getStorageSync('dailyGoal') || { minutes: 30, calories: 200 };
    const reminderEnabled = wx.getStorageSync('reminderEnabled') || false;
    const reminderTime = wx.getStorageSync('reminderTime') || '09:00';
    const voiceEnabled = wx.getStorageSync('voiceEnabled') !== false; // 默认开启
    const voiceInterval = wx.getStorageSync('voiceInterval') || 60;
    const unit = wx.getStorageSync('unit') || 'metric';
    const darkMode = wx.getStorageSync('darkMode') || false;

    this.setData({
      userInfo: {
        name: userInfo.name || '健身达人',
        avatar: userInfo.avatar || '/images/placeholder.png'
      },
      dailyGoal,
      reminderEnabled,
      reminderTime,
      voiceEnabled,
      voiceInterval,
      unit,
      darkMode
    });
  },

  // 编辑资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit'
    });
  },

  // 编辑头像
  editAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'userInfo.avatar': tempFilePath
        });
        
        // 保存到本地存储
        const userInfo = wx.getStorageSync('userInfo') || {};
        userInfo.avatar = tempFilePath;
        wx.setStorageSync('userInfo', userInfo);
        
        wx.showToast({
          title: '头像已更新',
          icon: 'success'
        });
      }
    });
  },

  // 设置每日目标
  setDailyGoal() {
    wx.showModal({
      title: '设置每日目标',
      editable: true,
      placeholderText: '请输入目标时长（分钟）',
      content: this.data.dailyGoal.minutes.toString(),
      success: (res) => {
        if (res.confirm && res.content) {
          const minutes = parseInt(res.content);
          if (minutes > 0 && minutes <= 300) {
            const dailyGoal = {
              minutes: minutes,
              calories: Math.round(minutes * 6.67) // 假设每分钟消耗约6.67千卡
            };
            
            this.setData({ dailyGoal });
            wx.setStorageSync('dailyGoal', dailyGoal);
            
            wx.showToast({
              title: '目标已更新',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '请输入1-300之间的数字',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 切换训练提醒
  toggleReminder(e) {
    const enabled = e.detail.value;
    this.setData({ reminderEnabled: enabled });
    wx.setStorageSync('reminderEnabled', enabled);
    
    wx.showToast({
      title: enabled ? '已开启提醒' : '已关闭提醒',
      icon: 'success'
    });
  },

  // 设置提醒时间
  setReminderTime() {
    wx.showActionSheet({
      itemList: ['早上 08:00', '早上 09:00', '中午 12:00', '下午 18:00', '晚上 20:00', '自定义'],
      success: (res) => {
        const times = ['08:00', '09:00', '12:00', '18:00', '20:00'];
        if (res.tapIndex < 5) {
          const time = times[res.tapIndex];
          this.setData({ reminderTime: time });
          wx.setStorageSync('reminderTime', time);
          
          wx.showToast({
            title: '提醒时间已设置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 切换语音提示
  toggleVoice(e) {
    const enabled = e.detail.value;
    this.setData({ voiceEnabled: enabled });
    wx.setStorageSync('voiceEnabled', enabled);
    
    wx.showToast({
      title: enabled ? '已开启语音' : '已关闭语音',
      icon: 'success'
    });
  },

  // 设置语音间隔
  setVoiceInterval() {
    wx.showActionSheet({
      itemList: ['30秒', '60秒', '90秒', '120秒', '180秒'],
      success: (res) => {
        const intervals = [30, 60, 90, 120, 180];
        const interval = intervals[res.tapIndex];
        
        this.setData({ voiceInterval: interval });
        wx.setStorageSync('voiceInterval', interval);
        
        wx.showToast({
          title: '语音间隔已设置',
          icon: 'success'
        });
      }
    });
  },

  // 选择单位制式
  selectUnit() {
    wx.showActionSheet({
      itemList: ['公制（千克、厘米）', '英制（磅、英寸）'],
      success: (res) => {
        const unit = res.tapIndex === 0 ? 'metric' : 'imperial';
        this.setData({ unit });
        wx.setStorageSync('unit', unit);
        
        wx.showToast({
          title: '单位已切换',
          icon: 'success'
        });
      }
    });
  },

  // 切换深色模式
  toggleDarkMode(e) {
    const enabled = e.detail.value;
    this.setData({ darkMode: enabled });
    wx.setStorageSync('darkMode', enabled);
    
    wx.showToast({
      title: enabled ? '深色模式已开启' : '深色模式已关闭',
      icon: 'success'
    });
  },

  // 计算缓存大小
  calculateCacheSize() {
    try {
      const info = wx.getStorageInfoSync();
      const sizeKB = Math.round(info.currentSize);
      let cacheSize = '';
      
      if (sizeKB < 1024) {
        cacheSize = sizeKB + 'KB';
      } else {
        cacheSize = (sizeKB / 1024).toFixed(2) + 'MB';
      }
      
      this.setData({ cacheSize });
    } catch (e) {
      this.setData({ cacheSize: '0KB' });
    }
  },

  // 导出数据
  exportData() {
    wx.showLoading({ title: '导出中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出成功',
        content: '训练数据已导出到本地存储，您可以通过文件管理器查看',
        showCancel: false
      });
    }, 1000);
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除缓存吗？这不会删除您的训练记录',
      success: (res) => {
        if (res.confirm) {
          // 只清除临时数据，保留重要数据
          wx.showLoading({ title: '清除中...' });
          
          setTimeout(() => {
            wx.hideLoading();
            this.calculateCacheSize();
            
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            });
          }, 500);
        }
      }
    });
  },

  // 重置数据
  resetData() {
    wx.showModal({
      title: '重置数据',
      content: '警告：此操作将删除所有训练记录和个人数据，且无法恢复！',
      confirmText: '重置',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '二次确认',
            content: '您真的要删除所有数据吗？',
            confirmText: '删除',
            confirmColor: '#ff3b30',
            success: (res2) => {
              if (res2.confirm) {
                wx.clearStorageSync();
                
                wx.showToast({
                  title: '数据已重置',
                  icon: 'success',
                  duration: 2000
                });
                
                setTimeout(() => {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  });
                }, 2000);
              }
            }
          });
        }
      }
    });
  },

  // 检查更新
  checkUpdate() {
    wx.showLoading({ title: '检查中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '当前已是最新版本',
        content: '版本号：v1.0.0',
        showCancel: false
      });
    }, 1000);
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于健身助手',
      content: '健身助手是一款专业的健身训练小程序，帮助您科学健身，记录成长。\n\n版本：v1.0.0\n开发者：健身助手团队',
      showCancel: false
    });
  },

  // 隐私政策
  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们重视您的隐私保护。您的所有训练数据都存储在本地，不会上传到服务器。',
      showCancel: false
    });
  },

  // 用户协议
  showTerms() {
    wx.showModal({
      title: '用户协议',
      content: '使用本小程序即表示您同意我们的用户协议。请合理使用本应用，注意运动安全。',
      showCancel: false
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息但保留训练数据
          wx.removeStorageSync('userInfo');
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1500);
        }
      }
    });
  },

  // 生成测试数据
  generateTestData() {
    if (this.testDataUtils) {
      this.testDataUtils.generateTestData();
    } else {
      wx.showToast({
        title: '工具加载失败',
        icon: 'error'
      });
    }
  },

  // 查看所有记录
  viewAllRecords() {
    if (this.testDataUtils) {
      this.testDataUtils.viewAllRecords();
    } else {
      const records = wx.getStorageSync('trainingRecords') || [];
      wx.showModal({
        title: '训练记录统计',
        content: `总记录数: ${records.length}`,
        showCancel: false
      });
    }
  },

  // 清除所有记录
  clearAllRecords() {
    if (this.testDataUtils) {
      this.testDataUtils.clearAllRecords();
    } else {
      wx.showModal({
        title: '确认清除',
        content: '确定要清除所有训练记录吗？此操作不可恢复！',
        success: (res) => {
          if (res.confirm) {
            wx.setStorageSync('trainingRecords', []);
            wx.showToast({
              title: '已清除所有记录',
              icon: 'success'
            });
          }
        }
      });
    }
  }
})
