// subpages/social/ranking/ranking.js
const SocialManager = require('/utils/social.js');

Page({
  data: {
    currentType: 'week', // week, month
    currentMetric: 'minutes', // minutes, calories
    rankingList: [],
    myRanking: null
  },

  onLoad() {
    SocialManager.initMockData(true);
    this.loadRanking();
  },

  // 加载排行榜
  loadRanking() {
    const { currentType, currentMetric } = this.data;
    const rankingList = SocialManager.getRankingList(currentType, currentMetric);
    const myRanking = rankingList.find(r => r.isMe);

    console.log('=== 排行榜数据 ===');
    console.log('排行榜列表:', rankingList);
    console.log('前三名头像:', rankingList.slice(0, 3).map(r => ({ name: r.name, avatar: r.avatar })));

    this.setData({
      rankingList,
      myRanking
    });
  },

  // 切换时间类型
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type
    });
    this.loadRanking();
  },

  // 切换指标
  switchMetric(e) {
    const metric = e.currentTarget.dataset.metric;
    this.setData({
      currentMetric: metric
    });
    this.loadRanking();
  },

  // 查看用户详情
  viewUserDetail(e) {
    const userId = e.currentTarget.dataset.userid;
    if (userId.startsWith('friend_')) {
      wx.navigateTo({
        url: `/subpages/social/friend-detail/friend-detail?id=${userId}`
      });
    } else {
      wx.showToast({
        title: '这是你自己哦',
        icon: 'none'
      });
    }
  }
});
