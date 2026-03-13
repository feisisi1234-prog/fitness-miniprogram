// components/training-card/training-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 训练计划ID
    id: {
      type: Number,
      value: 0
    },
    // 训练标题
    title: {
      type: String,
      value: ''
    },
    // 训练描述
    description: {
      type: String,
      value: ''
    },
    // 训练分类
    category: {
      type: String,
      value: ''
    },
    // 训练图标
    icon: {
      type: String,
      value: '/images/default-training.png'
    },
    // 训练时长
    duration: {
      type: String,
      value: ''
    },
    // 消耗卡路里
    calories: {
      type: Number,
      value: 0
    },
    // 训练难度
    difficulty: {
      type: String,
      value: ''
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击卡片
    onCardTap() {
      this.triggerEvent('cardtap', {
        id: this.properties.id
      });
    },
    
    // 开始训练
    onStart(e) {
      e.stopPropagation();
      this.triggerEvent('start', {
        id: this.properties.id,
        title: this.properties.title
      });
    },
    
    // 查看详情
    onDetail(e) {
      e.stopPropagation();
      this.triggerEvent('detail', {
        id: this.properties.id
      });
    }
  }
})