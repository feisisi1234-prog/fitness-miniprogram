// utils/social.js - 社交功能工具类

class SocialManager {
  constructor() {
    this.STORAGE_KEYS = {
      FRIENDS: 'friends',
      FRIEND_REQUESTS: 'friendRequests',
      DYNAMICS: 'dynamics',
      LIKES: 'likes',
      MY_USER_ID: 'myUserId'
    };
  }

  // 获取当前用户ID
  getMyUserId() {
    let userId = wx.getStorageSync(this.STORAGE_KEYS.MY_USER_ID);
    if (!userId) {
      userId = this.generateUserId();
      wx.setStorageSync(this.STORAGE_KEYS.MY_USER_ID, userId);
    }
    return userId;
  }

  // 生成用户ID（8位数字+字母）
  generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'FIT';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // 获取用户完整信息（包含ID）
  getMyUserInfo() {
    const userId = this.getMyUserId();
    const userInfo = wx.getStorageSync('userInfo') || {};
    return {
      id: userId,
      name: userInfo.name || '健身达人',
      avatar: userInfo.avatar || '/images/ui/placeholder.png',
      level: userInfo.level || 'Lv.1'
    };
  }

  // 初始化模拟数据
  initMockData(forceUpdate = false) {
    const friends = wx.getStorageSync(this.STORAGE_KEYS.FRIENDS) || [];
    
    // 如果强制更新，或者好友列表为空，或者好友没有头像字段，则重新生成
    const needUpdate = forceUpdate || friends.length === 0 || 
                      (friends.length > 0 && !friends[0].avatar.includes('avatars'));
    
    if (needUpdate) {
      const mockFriends = this.generateMockFriends();
      wx.setStorageSync(this.STORAGE_KEYS.FRIENDS, mockFriends);
    }

    const dynamics = wx.getStorageSync(this.STORAGE_KEYS.DYNAMICS) || [];
    if (dynamics.length === 0 || forceUpdate) {
      const mockDynamics = this.generateMockDynamics();
      wx.setStorageSync(this.STORAGE_KEYS.DYNAMICS, mockDynamics);
    }
  }

  // 生成模拟好友数据
  generateMockFriends() {
    const names = ['张健', '李强', '王芳', '刘洋', '陈晨', '赵雪', '孙明', '周杰'];
    const avatars = [
      '/images/avatars/avatar-1.svg',
      '/images/avatars/avatar-2.svg',
      '/images/avatars/avatar-3.svg',
      '/images/avatars/avatar-4.svg',
      '/images/avatars/avatar-5.svg',
      '/images/avatars/avatar-6.svg',
      '/images/avatars/avatar-7.svg',
      '/images/avatars/avatar-8.svg'
    ];
    
    return names.map((name, index) => ({
      id: 'friend_' + (index + 1),
      userId: this.generateUserId(), // 添加显示用的用户ID
      name: name,
      avatar: avatars[index],
      level: `Lv.${Math.floor(Math.random() * 10) + 1}`,
      totalDays: Math.floor(Math.random() * 100) + 10,
      weekMinutes: Math.floor(Math.random() * 300) + 50,
      weekCalories: Math.floor(Math.random() * 2000) + 500,
      continuousDays: Math.floor(Math.random() * 30) + 1,
      addTime: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    }));
  }

  // 生成模拟动态数据
  generateMockDynamics() {
    const friends = this.generateMockFriends();
    const activities = [
      // 训练动态
      { 
        type: 'training', 
        content: '完成了HIIT燃脂训练，感觉超棒！', 
        duration: 20, 
        calories: 250 
      },
      { 
        type: 'training', 
        content: '今天的全身力量训练，突破了自己的极限💪', 
        duration: 30, 
        calories: 200 
      },
      { 
        type: 'training', 
        content: '晨练瑜伽，开启美好的一天🧘', 
        duration: 40, 
        calories: 120 
      },
      { 
        type: 'training', 
        content: '核心强化训练打卡，腹肌在燃烧🔥', 
        duration: 25, 
        calories: 180 
      },
      
      // 饮食分享
      { 
        type: 'food', 
        content: '今日减脂餐：蔬菜沙拉+鸡胸肉，营养又健康！', 
        image: '/images/foods/salad.svg',
        tags: ['减脂餐', '健康饮食']
      },
      { 
        type: 'food', 
        content: '训练后的蛋白质补充：香蕉奶昔🍌', 
        image: '/images/foods/smoothie.svg',
        tags: ['蛋白质', '增肌']
      },
      { 
        type: 'food', 
        content: '高蛋白晚餐：鸡胸肉+西兰花+水煮蛋', 
        image: '/images/foods/protein.svg',
        tags: ['高蛋白', '增肌餐']
      },
      
      // 健身技巧
      { 
        type: 'tip', 
        content: '健身小贴士：训练前后记得充分拉伸，可以有效预防运动损伤哦！', 
        image: '/images/tips/stretching.svg',
        tags: ['健身技巧', '拉伸']
      },
      { 
        type: 'tip', 
        content: '每天至少喝8杯水，保持身体水分充足，提高训练效果💧', 
        image: '/images/tips/water.svg',
        tags: ['健康习惯', '补水']
      },
      { 
        type: 'tip', 
        content: '深蹲技巧：膝盖不要超过脚尖，保持背部挺直，臀部向后坐', 
        tags: ['训练技巧', '深蹲']
      },
      
      // 成就动态
      { 
        type: 'achievement', 
        content: '解锁成就：连续训练7天！坚持就是胜利🏆', 
        icon: '🏆' 
      },
      { 
        type: 'achievement', 
        content: '解锁成就：累计训练30天，养成好习惯！', 
        icon: '🎖️' 
      },
      { 
        type: 'record', 
        content: '刷新个人最佳：单次训练消耗500卡路里！', 
        icon: '🔥' 
      },
      
      // 打卡动态
      { 
        type: 'checkin', 
        content: '早起晨练打卡！一日之计在于晨☀️', 
        time: '06:30'
      },
      { 
        type: 'checkin', 
        content: '夜跑5公里完成，释放一天的压力🌙', 
        time: '20:00'
      }
    ];

    const dynamics = [];
    const now = Date.now();

    friends.forEach((friend, friendIndex) => {
      const dynamicCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < dynamicCount; i++) {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const timestamp = now - (friendIndex * 3 + i) * 2 * 60 * 60 * 1000;
        
        // 生成随机评论
        const comments = this.generateMockComments(2 + Math.floor(Math.random() * 3));
        
        dynamics.push({
          id: `dynamic_${friendIndex}_${i}`,
          userId: friend.id,
          userName: friend.name,
          userAvatar: friend.avatar,
          type: activity.type,
          content: activity.content,
          duration: activity.duration,
          calories: activity.calories,
          image: activity.image,
          tags: activity.tags || [],
          icon: activity.icon,
          time: activity.time,
          timestamp: timestamp,
          likes: Math.floor(Math.random() * 30),
          comments: comments,
          commentCount: comments.length,
          isLiked: false
        });
      }
    });

    return dynamics.sort((a, b) => b.timestamp - a.timestamp);
  }

  // 生成模拟评论
  generateMockComments(count) {
    const commentTexts = [
      '加油！💪',
      '太棒了！',
      '坚持就是胜利！',
      '向你学习！',
      '好厉害啊！',
      '一起加油💪',
      '请教一下训练方法',
      '这个动作怎么做？',
      '效果怎么样？',
      '我也要试试',
      '看起来很不错',
      '继续保持！',
      '真自律！',
      '羡慕你的毅力',
      '求分享食谱',
      '这个餐看起来好健康',
      '多久能看到效果？',
      '有什么注意事项吗？'
    ];

    const names = ['小明', '小红', '小刚', '小丽', '小华', '小芳', '小军', '小美'];
    const comments = [];

    for (let i = 0; i < count; i++) {
      comments.push({
        id: `comment_${Date.now()}_${i}`,
        userName: names[Math.floor(Math.random() * names.length)],
        userAvatar: `/images/avatars/avatar-${Math.floor(Math.random() * 8) + 1}.svg`,
        content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        timestamp: Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000
      });
    }

    return comments;
  }

  // 获取好友列表
  getFriends() {
    return wx.getStorageSync(this.STORAGE_KEYS.FRIENDS) || [];
  }

  // 添加好友
  addFriend(friend) {
    const friends = this.getFriends();
    friends.push({
      ...friend,
      addTime: Date.now()
    });
    wx.setStorageSync(this.STORAGE_KEYS.FRIENDS, friends);
    return true;
  }

  // 删除好友
  removeFriend(friendId) {
    let friends = this.getFriends();
    friends = friends.filter(f => f.id !== friendId);
    wx.setStorageSync(this.STORAGE_KEYS.FRIENDS, friends);
    return true;
  }

  // 搜索用户（模拟）
  searchUsers(keyword) {
    const mockUsers = [
      { id: 'user_101', userId: 'FIT8K2M9', name: '健身达人小王', avatar: '/images/avatars/avatar-1.svg', level: 'Lv.8' },
      { id: 'user_102', userId: 'FIT3N7P5', name: '运动爱好者', avatar: '/images/avatars/avatar-2.svg', level: 'Lv.5' },
      { id: 'user_103', userId: 'FIT9Q4R1', name: '马拉松跑者', avatar: '/images/avatars/avatar-3.svg', level: 'Lv.12' }
    ];

    if (!keyword) return mockUsers;
    
    // 支持按名称或ID搜索
    return mockUsers.filter(u => 
      u.name.includes(keyword) || 
      u.userId.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 获取动态列表
  getDynamics() {
    return wx.getStorageSync(this.STORAGE_KEYS.DYNAMICS) || [];
  }

  // 发布动态
  publishDynamic(dynamic) {
    const dynamics = this.getDynamics();
    const myUserId = this.getMyUserId();
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    const newDynamic = {
      id: 'dynamic_' + Date.now(),
      userId: myUserId,
      userName: userInfo.name || '我',
      userAvatar: userInfo.avatar || '/images/ui/placeholder.png',
      ...dynamic,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      commentCount: 0,
      isLiked: false
    };

    dynamics.unshift(newDynamic);
    wx.setStorageSync(this.STORAGE_KEYS.DYNAMICS, dynamics);
    return newDynamic;
  }

  // 点赞/取消点赞
  toggleLike(dynamicId) {
    const dynamics = this.getDynamics();
    const dynamic = dynamics.find(d => d.id === dynamicId);
    
    if (dynamic) {
      if (dynamic.isLiked) {
        dynamic.likes = Math.max(0, dynamic.likes - 1);
        dynamic.isLiked = false;
      } else {
        dynamic.likes += 1;
        dynamic.isLiked = true;
      }
      wx.setStorageSync(this.STORAGE_KEYS.DYNAMICS, dynamics);
      return dynamic;
    }
    return null;
  }

  // 添加评论
  addComment(dynamicId, content) {
    const dynamics = this.getDynamics();
    const dynamic = dynamics.find(d => d.id === dynamicId);
    
    if (dynamic) {
      const userInfo = wx.getStorageSync('userInfo') || {};
      const newComment = {
        id: `comment_${Date.now()}`,
        userName: userInfo.name || '我',
        userAvatar: userInfo.avatar || '/images/ui/placeholder.png',
        content: content,
        timestamp: Date.now()
      };
      
      if (!dynamic.comments) {
        dynamic.comments = [];
      }
      dynamic.comments.push(newComment);
      dynamic.commentCount = dynamic.comments.length;
      
      wx.setStorageSync(this.STORAGE_KEYS.DYNAMICS, dynamics);
      return newComment;
    }
    return null;
  }

  // 删除评论
  deleteComment(dynamicId, commentId) {
    const dynamics = this.getDynamics();
    const dynamic = dynamics.find(d => d.id === dynamicId);
    
    if (dynamic && dynamic.comments) {
      dynamic.comments = dynamic.comments.filter(c => c.id !== commentId);
      dynamic.commentCount = dynamic.comments.length;
      wx.setStorageSync(this.STORAGE_KEYS.DYNAMICS, dynamics);
      return true;
    }
    return false;
  }

  // 获取排行榜数据
  getRankingList(type = 'week', metric = 'minutes') {
    const friends = this.getFriends();
    const myUserId = this.getMyUserId();
    const userInfo = wx.getStorageSync('userInfo') || {};
    const userStats = wx.getStorageSync('userStats') || {};

    // 添加自己到排行榜
    const myData = {
      id: myUserId,
      userId: myUserId, // 显示用的ID
      name: userInfo.name || '我',
      avatar: userInfo.avatar || '/images/ui/placeholder.png',
      level: userInfo.level || 'Lv.1',
      weekMinutes: userStats.totalMinutes || 0,
      weekCalories: userStats.totalCalories || 0,
      monthMinutes: userStats.totalMinutes || 0,
      monthCalories: userStats.totalCalories || 0,
      isMe: true
    };

    // 合并好友数据
    let rankingList = [myData, ...friends.map(f => ({
      ...f,
      monthMinutes: f.weekMinutes * 4,
      monthCalories: f.weekCalories * 4,
      isMe: false
    }))];

    // 根据类型和指标排序
    const sortKey = type === 'week' 
      ? (metric === 'minutes' ? 'weekMinutes' : 'weekCalories')
      : (metric === 'minutes' ? 'monthMinutes' : 'monthCalories');

    rankingList.sort((a, b) => b[sortKey] - a[sortKey]);

    // 添加排名
    rankingList = rankingList.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return rankingList;
  }

  // 格式化时间
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
      return Math.floor(diff / hour) + '小时前';
    } else if (diff < 7 * day) {
      return Math.floor(diff / day) + '天前';
    } else {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}-${date.getDate()}`;
    }
  }
}

module.exports = new SocialManager();
