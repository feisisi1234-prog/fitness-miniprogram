// pages/body-tracking/body-tracking.js
const StorageManager = require('../../utils/storage.js');

Page({
  data: {
    currentTab: 'weight',
    showAddModal: false,
    
    // 表单数据
    formData: {
      date: '',
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      hips: '',
      arm: '',
      thigh: ''
    },
    
    // 历史记录
    records: [],
    
    // 图表数据
    chartData: {
      labels: [],
      values: [],
      chartBars: []
    },
    
    // 统计数据
    stats: {
      current: 0,
      change: 0,
      highest: 0,
      lowest: 0
    }
  },

  onLoad() {
    this.initDate();
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  initDate() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    this.setData({
      'formData.date': dateStr
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    this.updateChartData(tab);
  },

  loadRecords() {
    const records = StorageManager.getBodyRecords();
    this.setData({
      records: records.reverse()
    });
    this.updateChartData(this.data.currentTab);
    this.calculateStats(this.data.currentTab);
  },

  updateChartData(type) {
    const records = StorageManager.getBodyRecords();
    const recentRecords = records.slice(-30); // 最近30条记录
    
    const labels = [];
    const values = [];
    
    recentRecords.forEach(record => {
      if (record[type]) {
        labels.push(record.date.substring(5)); // MM-DD
        values.push(parseFloat(record[type]));
      }
    });
    
    // 计算最大值用于图表高度计算
    const maxValue = values.length > 0 ? Math.max(...values) : 1;
    
    // 为每个值计算百分比高度
    const chartBars = values.map(value => ({
      value: value,
      height: (value / maxValue) * 100
    }));
    
    this.setData({
      chartData: {
        labels,
        values,
        chartBars
      }
    });
  },

  calculateStats(type) {
    const records = StorageManager.getBodyRecords();
    const values = records
      .filter(r => r[type])
      .map(r => parseFloat(r[type]));
    
    if (values.length === 0) {
      this.setData({
        stats: {
          current: 0,
          change: 0,
          highest: 0,
          lowest: 0
        }
      });
      return;
    }
    
    const current = values[values.length - 1];
    const previous = values.length > 1 ? values[values.length - 2] : current;
    const change = current - previous;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    
    this.setData({
      stats: {
        current: current.toFixed(1),
        change: change.toFixed(1),
        highest: highest.toFixed(1),
        lowest: lowest.toFixed(1)
      }
    });
  },

  showAddRecord() {
    this.setData({
      showAddModal: true
    });
  },

  hideAddModal() {
    this.setData({
      showAddModal: false
    });
  },

  onDateChange(e) {
    this.setData({
      'formData.date': e.detail.value
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  saveRecord() {
    const { formData } = this.data;
    
    // 验证至少填写一项
    if (!formData.weight && !formData.bodyFat && !formData.chest && 
        !formData.waist && !formData.hips && !formData.arm && !formData.thigh) {
      wx.showToast({
        title: '请至少填写一项数据',
        icon: 'none'
      });
      return;
    }
    
    // 保存记录
    const record = {
      date: formData.date,
      weight: formData.weight || null,
      bodyFat: formData.bodyFat || null,
      chest: formData.chest || null,
      waist: formData.waist || null,
      hips: formData.hips || null,
      arm: formData.arm || null,
      thigh: formData.thigh || null
    };
    
    StorageManager.saveBodyRecord(record);
    
    // 重置表单
    this.initDate();
    this.setData({
      'formData.weight': '',
      'formData.bodyFat': '',
      'formData.chest': '',
      'formData.waist': '',
      'formData.hips': '',
      'formData.arm': '',
      'formData.thigh': '',
      showAddModal: false
    });
    
    // 重新加载数据
    this.loadRecords();
    
    wx.showToast({
      title: '记录已保存',
      icon: 'success'
    });
  },

  deleteRecord(e) {
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const records = StorageManager.getBodyRecords();
          records.splice(records.length - 1 - index, 1);
          wx.setStorageSync('bodyRecords', records);
          this.loadRecords();
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  }
});
