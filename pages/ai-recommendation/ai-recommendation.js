// pages/ai-recommendation/ai-recommendation.js
const { AIRecommender, FITNESS_LEVELS, TRAINING_GOALS } = require('../../utils/ai-recommender.js');

Page({
  data: {
    currentStep: 1,
    totalSteps: 4,
    
    // 用户选择
    fitnessLevel: '',
    goal: '',
    duration: 30,
    equipment: [],
    
    // 选项
    fitnessLevels: [
      { id: FITNESS_LEVELS.BEGINNER, name: '初学者', desc: '刚开始健身，体能基础较弱', icon: '🌱' },
      { id: FITNESS_LEVELS.INTERMEDIATE, name: '中级', desc: '有一定健身经验，体能良好', icon: '💪' },
      { id: FITNESS_LEVELS.ADVANCED, name: '高级', desc: '健身老手，体能优秀', icon: '🔥' }
    ],
    
    goals: [
      { id: TRAINING_GOALS.WEIGHT_LOSS, name: '减脂瘦身', desc: '降低体脂率，塑造苗条身材', icon: '🔥', color: '#ef4444' },
      { id: TRAINING_GOALS.MUSCLE_GAIN, name: '增肌增重', desc: '增加肌肉量，强壮体魄', icon: '💪', color: '#10b981' },
      { id: TRAINING_GOALS.BODY_SHAPING, name: '身材塑形', desc: '雕塑身材线条，提升形体美', icon: '✨', color: '#8b5cf6' },
      { id: TRAINING_GOALS.ENDURANCE, name: '耐力提升', desc: '增强心肺功能，提高耐力', icon: '🏃', color: '#3b82f6' },
      { id: TRAINING_GOALS.FLEXIBILITY, name: '柔韧拉伸', desc: '提高身体柔韧性，放松肌肉', icon: '🧘', color: '#ec4899' }
    ],
    
    equipmentOptions: [
      { id: '无', name: '徒手训练', icon: '🤸' },
      { id: '哑铃', name: '哑铃', icon: '🏋️' },
      { id: '杠铃', name: '杠铃', icon: '💪' },
      { id: '壶铃', name: '壶铃', icon: '⚖️' },
      { id: '弹力带', name: '弹力带', icon: '🎗️' },
      { id: '跳绳', name: '跳绳', icon: '🪢' },
      { id: '单杠', name: '单杠/双杠', icon: '🏗️' },
      { id: '固定器械', name: '固定器械', icon: '🎰' },
      { id: '史密斯架', name: '史密斯架', icon: '🏛️' },
      { id: '龙门架', name: '龙门架', icon: '🚪' },
      { id: '推胸机', name: '器械推胸', icon: '🦾' },
      { id: '划船机', name: '划船机', icon: '🚣' },
      { id: '腿举机', name: '腿举机', icon: '🦵' },
      { id: '蹬腿机', name: '蹬腿机', icon: '👟' },
      { id: '飞鸟机', name: '飞鸟机', icon: '🦅' },
      { id: '高位下拉', name: '高位下拉', icon: '⬇️' }
    ],
    
    generating: false
  },

  // 选择体能等级
  selectFitnessLevel(e) {
    const level = e.currentTarget.dataset.level;
    this.setData({
      fitnessLevel: level
    });
  },

  // 选择训练目标
  selectGoal(e) {
    const goal = e.currentTarget.dataset.goal;
    this.setData({
      goal: goal
    });
  },

  // 调整时长
  onDurationChange(e) {
    this.setData({
      duration: e.detail.value
    });
  },

  // 切换器材选择
  toggleEquipment(e) {
    const equipment = e.currentTarget.dataset.equipment;
    let selected = [...this.data.equipment];
    
    console.log('点击器材:', equipment);
    console.log('当前选中:', selected);
    
    const index = selected.indexOf(equipment);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(equipment);
    }
    
    console.log('更新后选中:', selected);
    
    this.setData({
      equipment: selected
    });
    
    // 震动反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  // 下一步
  nextStep() {
    const { currentStep, fitnessLevel, goal } = this.data;
    
    if (currentStep === 1 && !fitnessLevel) {
      wx.showToast({
        title: '请选择体能等级',
        icon: 'none'
      });
      return;
    }
    
    if (currentStep === 2 && !goal) {
      wx.showToast({
        title: '请选择训练目标',
        icon: 'none'
      });
      return;
    }
    
    if (currentStep < this.data.totalSteps) {
      this.setData({
        currentStep: currentStep + 1
      });
    }
  },

  // 上一步
  prevStep() {
    if (this.data.currentStep > 1) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });
    }
  },

  // 生成计划
  generatePlan() {
    const { fitnessLevel, goal, duration, equipment } = this.data;
    
    if (!fitnessLevel || !goal) {
      wx.showToast({
        title: '请完成所有选择',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ generating: true });
    
    wx.showLoading({
      title: 'AI生成中...',
      mask: true
    });
    
    // 模拟AI生成延迟
    setTimeout(() => {
      try {
        const userProfile = {
          fitnessLevel,
          goal,
          duration,
          equipment: equipment.length > 0 ? equipment : ['无'],
          preferences: {}
        };
        
        console.log('用户配置:', userProfile);
        
        const plan = AIRecommender.generatePlan(userProfile);
        
        console.log('生成的计划:', plan);
        console.log('动作数量:', plan.exercises.length);
        console.log('动作列表:', plan.exercises.map(e => e.name));
        
        // 保存到自定义计划
        this.savePlan(plan);
        
        wx.hideLoading();
        this.setData({ generating: false });
        
        wx.showModal({
          title: '✨ 计划生成成功',
          content: `${plan.title}\n\n包含${plan.exercises.length}个动作\n预计${plan.estimatedDuration}\n消耗${plan.estimatedCalories}千卡\n\n已保存到我的计划`,
          confirmText: '查看计划',
          cancelText: '继续定制',
          success: (res) => {
            if (res.confirm) {
              // 返回计划页面
              wx.navigateBack();
            } else {
              // 重置到第一步
              this.setData({
                currentStep: 1,
                fitnessLevel: '',
                goal: '',
                duration: 30,
                equipment: []
              });
            }
          }
        });
      } catch (error) {
        console.error('生成计划失败:', error);
        wx.hideLoading();
        this.setData({ generating: false });
        wx.showToast({
          title: '生成失败，请重试',
          icon: 'error'
        });
      }
    }, 1500);
  },

  // 保存计划
  savePlan(plan) {
    const customPlans = wx.getStorageSync('customPlans') || [];
    
    console.log('保存前的计划列表:', customPlans.length);
    
    const planToAdd = {
      id: Date.now(),
      title: plan.title,
      category: plan.category,
      icon: '/images/ui/placeholder.png',
      duration: plan.estimatedDuration,
      calories: plan.estimatedCalories,
      difficulty: plan.difficulty,
      rating: 0,
      participants: 0,
      tags: plan.tags,
      exercises: plan.exercises,
      isCustom: true,
      fromAI: true,
      createdAt: new Date().toISOString()
    };
    
    console.log('要保存的计划:', planToAdd);
    
    customPlans.unshift(planToAdd); // 添加到列表开头
    wx.setStorageSync('customPlans', customPlans);
    
    console.log('保存后的计划列表:', customPlans.length);
    console.log('保存成功，计划ID:', planToAdd.id);
  }
});
