Page({
  data: {
    actionId: '',
    actionName: '',
    muscleGroup: '',
    fiberDirection: '',
    description: '',
    tips: ''
  },

  onLoad: function (options) {
    // 获取传递的参数
    this.setData({
      actionId: options.id || '',
      actionName: options.name || '',
      muscleGroup: options.muscleGroup || '',
      fiberDirection: decodeURIComponent(options.fiberDirection || ''),
      description: decodeURIComponent(options.description || ''),
      tips: decodeURIComponent(options.tips || '')
    });
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  },

  // 开始训练
  startTraining: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 2000
    });
  }
});
