// edit.js
const app = getApp()

Page({
  data: {
    userInfo: {
      avatar: '',
      name: '',
      gender: '',
      height: '',
      weight: '',
      phone: ''
    }
  },

  onLoad() {
    this.getUserInfo();
  },

  getUserInfo() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: {
          avatar: userInfo.avatar || '',
          name: userInfo.name || '',
          gender: userInfo.gender || '',
          height: userInfo.height || '',
          weight: userInfo.weight || '',
          phone: userInfo.phone || ''
        }
      });
    }
  },

  saveUserInfo() {
    // 保存用户信息到本地存储
    wx.setStorageSync('userInfo', this.data.userInfo);
  },

  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'userInfo.avatar': tempFilePath
        });
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },

  onNameInput(e) {
    this.setData({
      'userInfo.name': e.detail.value
    });
  },

  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      'userInfo.gender': gender
    });
  },

  onHeightInput(e) {
    this.setData({
      'userInfo.height': e.detail.value
    });
  },

  onWeightInput(e) {
    this.setData({
      'userInfo.weight': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'userInfo.phone': e.detail.value
    });
  },

  saveProfile() {
    // 验证手机号格式（如果填写了手机号）
    if (this.data.userInfo.phone && !/^1[3-9]\d{9}$/.test(this.data.userInfo.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }

    // 保存用户信息
    this.saveUserInfo();

    // 返回上一页
    wx.navigateBack({
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      }
    });
  }
})