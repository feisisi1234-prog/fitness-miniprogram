// subpages/social/friends/friends.js
const SocialManager = require('../../../utils/social.js');

Page({
  data: {
    friends: [],
    searchKeyword: '',
    showSearchResult: false,
    searchResults: []
  },

  onLoad() {
    SocialManager.initMockData(true);
    this.loadFriends();
  },

  onShow() {
    this.loadFriends();
  },

  // 加载好友列表
  loadFriends() {
    const friends = SocialManager.getFriends();
    this.setData({
      friends: friends
    });
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });

    if (keyword) {
      const results = SocialManager.searchUsers(keyword);
      this.setData({
        showSearchResult: true,
        searchResults: results
      });
    } else {
      this.setData({
        showSearchResult: false,
        searchResults: []
      });
    }
  },

  // 添加好友
  addFriend(e) {
    const user = e.currentTarget.dataset.user;
    
    wx.showModal({
      title: '添加好友',
      content: `确定要添加 ${user.name} 为好友吗？`,
      success: (res) => {
        if (res.confirm) {
          SocialManager.addFriend(user);
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
          this.loadFriends();
          this.setData({
            showSearchResult: false,
            searchKeyword: ''
          });
        }
      }
    });
  },

  // 删除好友
  deleteFriend(e) {
    const friendId = e.currentTarget.dataset.id;
    const friendName = e.currentTarget.dataset.name;

    wx.showModal({
      title: '删除好友',
      content: `确定要删除好友 ${friendName} 吗？`,
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          SocialManager.removeFriend(friendId);
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
          this.loadFriends();
        }
      }
    });
  },

  // 查看好友详情
  viewFriendDetail(e) {
    const friend = e.currentTarget.dataset.friend;
    wx.navigateTo({
      url: `/subpages/social/friend-detail/friend-detail?id=${friend.id}`
    });
  },

  // 取消搜索
  cancelSearch() {
    this.setData({
      showSearchResult: false,
      searchKeyword: ''
    });
  }
});
