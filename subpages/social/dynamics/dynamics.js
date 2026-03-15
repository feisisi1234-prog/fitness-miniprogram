// subpages/social/dynamics/dynamics.js
const SocialManager = require('/utils/social.js');

Page({
  data: {
    dynamics: [],
    refreshing: false,
    showCommentModal: false,
    currentDynamic: null,
    commentInput: '',
    // 发布动态相关
    showPublishModal: false,
    publishContent: '',
    publishImages: [],
    maxImages: 9
  },

  onLoad() {
    SocialManager.initMockData(true);
    this.loadDynamics();
  },

  onShow() {
    this.loadDynamics();
  },

  // 加载动态列表
  loadDynamics() {
    const dynamics = SocialManager.getDynamics();
    const formattedDynamics = dynamics.map(d => ({
      ...d,
      timeText: SocialManager.formatTime(d.timestamp),
      showComments: false
    }));

    this.setData({
      dynamics: formattedDynamics
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ refreshing: true });
    
    setTimeout(() => {
      this.loadDynamics();
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 点赞
  toggleLike(e) {
    const dynamicId = e.currentTarget.dataset.id;
    const dynamic = SocialManager.toggleLike(dynamicId);
    
    if (dynamic) {
      this.loadDynamics();
      
      if (dynamic.isLiked) {
        wx.vibrateShort({
          type: 'light'
        });
      }
    }
  },

  // 显示/隐藏评论
  toggleComments(e) {
    const index = e.currentTarget.dataset.index;
    const dynamics = this.data.dynamics;
    dynamics[index].showComments = !dynamics[index].showComments;
    
    this.setData({
      dynamics: dynamics
    });
  },

  // 打开评论输入框
  openCommentInput(e) {
    const dynamic = e.currentTarget.dataset.dynamic;
    this.setData({
      showCommentModal: true,
      currentDynamic: dynamic,
      commentInput: ''
    });
  },

  // 关闭评论输入框
  closeCommentModal() {
    this.setData({
      showCommentModal: false,
      currentDynamic: null,
      commentInput: ''
    });
  },

  // 评论输入
  onCommentInput(e) {
    this.setData({
      commentInput: e.detail.value
    });
  },

  // 提交评论
  submitComment() {
    const { currentDynamic, commentInput } = this.data;
    
    if (!commentInput.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    const comment = SocialManager.addComment(currentDynamic.id, commentInput);
    
    if (comment) {
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
      
      this.closeCommentModal();
      this.loadDynamics();
    }
  },

  // 查看用户详情
  viewUserDetail(e) {
    const userId = e.currentTarget.dataset.userid;
    if (userId.startsWith('friend_')) {
      wx.navigateTo({
        url: `/subpages/social/friend-detail/friend-detail?id=${userId}`
      });
    }
  },

  // 发布动态
  publishDynamic() {
    this.setData({
      showPublishModal: true,
      publishContent: '',
      publishImages: []
    });
  },

  // 关闭发布弹窗
  closePublishModal() {
    this.setData({
      showPublishModal: false,
      publishContent: '',
      publishImages: []
    });
  },

  // 输入动态内容
  onPublishInput(e) {
    const value = e.detail.value;
    console.log('输入动态内容:', value);
    
    this.setData({
      publishContent: value
    });
    
    console.log('设置后的publishContent:', this.data.publishContent);
  },

  // 选择图片
  chooseImage() {
    const currentImages = this.data.publishImages || [];
    const maxImages = this.data.maxImages;
    const remainCount = maxImages - currentImages.length;

    if (remainCount <= 0) {
      wx.showToast({
        title: `最多上传${maxImages}张图片`,
        icon: 'none'
      });
      return;
    }

    wx.chooseImage({
      count: remainCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 使用函数式更新，确保获取最新状态
        const newImages = [...this.data.publishImages, ...res.tempFilePaths];
        
        this.setData({
          publishImages: newImages
        }, () => {
          console.log('图片选择成功，当前状态:', {
            publishContent: this.data.publishContent,
            publishImages: this.data.publishImages.length
          });
        });
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 预览图片
  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.publishImages[index],
      urls: this.data.publishImages
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.publishImages]; // 创建副本
    
    images.splice(index, 1);
    
    this.setData({
      publishImages: images
    }, () => {
      console.log('删除图片后的状态:', {
        publishContent: this.data.publishContent,
        publishImages: this.data.publishImages.length
      });
    });
  },

  // 提交发布
  submitPublish() {
    const { publishContent, publishImages } = this.data;

    if (!publishContent.trim() && publishImages.length === 0) {
      wx.showToast({
        title: '请输入内容或选择图片',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '发布中...'
    });

    // 模拟上传延迟
    setTimeout(() => {
      const dynamicData = {
        type: publishImages.length > 0 ? 'share' : 'text',
        content: publishContent,
        images: publishImages
      };

      const newDynamic = SocialManager.publishDynamic(dynamicData);

      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      this.closePublishModal();
      this.loadDynamics();
    }, 800);
  }
});
