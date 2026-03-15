// 训练计划详情页面
const app = getApp()

Page({
  data: {
    planId: 0,
    plan: {}
  },

  onLoad(options) {
    const planId = parseInt(options.id) || 1;
    this.setData({
      planId: planId
    });
    this.loadPlanDetail(planId);
  },

  // 加载训练计划详情
  loadPlanDetail(planId) {
    // 模拟数据，实际应用中应从服务器获取
    const plans = [
      {
        id: 1,
        title: '全身力量训练',
        description: '适合初学者的全身力量训练，包括主要肌群的基础动作。通过复合动作锻炼多个肌群，提高基础力量和肌肉耐力。',
        duration: '30分钟',
        calories: 200,
        difficulty: '初级',
        category: '力量训练',
        icon: '/images/ui/placeholder.png',
        rating: 4.5,
        participants: 1280,
        tags: ['全身', '基础', '复合动作'],
        equipment: ['无器械', '哑铃(可选)'],
        targetMuscles: ['胸肌', '背肌', '腿部', '核心'],
        benefits: ['增强全身力量', '提高肌肉耐力', '促进新陈代谢', '改善体态'],
        steps: [
          {
            id: 1,
            name: '深蹲',
            sets: 3,
            reps: 12,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '双脚与肩同宽，脚尖微朝外，下蹲时膝盖不要超过脚尖，保持背部挺直'
          },
          {
            id: 2,
            name: '俯卧撑',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '双手与肩同宽，身体保持一条直线，下降时胸部接近地面，推起时手臂伸直'
          },
          {
            id: 3,
            name: '平板支撑',
            sets: 3,
            reps: 30,
            rest: 45,
            image: '/images/actions/action-placeholder.svg',
            description: '前臂和脚尖支撑身体，保持身体呈一条直线，收紧核心肌群'
          },
          {
            id: 4,
            name: '弓步蹲',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '一脚向前迈出，下蹲至两膝成90度，前膝不超过脚尖，后膝接近地面'
          }
        ],
        tips: [
          '训练前请做好热身运动，避免肌肉拉伤',
          '保持动作标准，感受目标肌群的发力',
          '根据自身能力调整训练强度，循序渐进',
          '训练后进行适当拉伸，帮助肌肉恢复'
        ]
      },
      {
        id: 2,
        title: 'HIIT燃脂训练',
        description: '高强度间歇训练，快速燃烧脂肪，提高心肺功能。通过高强度运动和短暂休息交替进行，提高代谢率。',
        duration: '20分钟',
        calories: 250,
        difficulty: '中级',
        category: '有氧运动',
        icon: '/images/ui/placeholder.png',
        rating: 4.7,
        participants: 2560,
        tags: ['燃脂', '间歇训练', '心肺功能'],
        equipment: ['无器械'],
        targetMuscles: ['全身', '心肺'],
        benefits: ['快速燃烧脂肪', '提高心肺功能', '增强耐力', '提高代谢率'],
        steps: [
          {
            id: 1,
            name: '开合跳',
            sets: 4,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '双脚跳开同时双臂举过头顶，然后跳回起始位置，保持节奏稳定'
          },
          {
            id: 2,
            name: '高抬腿',
            sets: 4,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '原地跑步，膝盖尽量抬高至髋部高度，手臂配合摆动'
          },
          {
            id: 3,
            name: '波比跳',
            sets: 3,
            reps: 10,
            rest: 45,
            image: '/images/actions/action-placeholder.svg',
            description: '下蹲-后踢腿成平板支撑-俯卧撑-收腿-跳跃，动作连贯流畅'
          },
          {
            id: 4,
            name: '登山跑',
            sets: 4,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '平板支撑姿势，交替将膝盖拉向胸部，保持核心稳定'
          }
        ],
        tips: [
          'HIIT训练强度大，请确保身体状况良好',
          '保持呼吸均匀，避免憋气',
          '如果感到不适，请立即停止训练',
          '训练后补充水分，帮助身体恢复'
        ]
      },
      {
        id: 3,
        title: '瑜伽拉伸',
        description: '舒缓身心的瑜伽练习，提高身体柔韧性和平衡能力。通过缓慢的动作和深呼吸，放松身心。',
        duration: '40分钟',
        calories: 120,
        difficulty: '初级',
        category: '柔韧性',
        icon: '/images/ui/placeholder.png',
        rating: 4.3,
        participants: 890,
        tags: ['放松', '柔韧性', '平衡'],
        equipment: ['瑜伽垫'],
        targetMuscles: ['全身', '脊柱', '核心'],
        benefits: ['提高柔韧性', '改善体态', '缓解压力', '增强平衡能力'],
        steps: [
          {
            id: 1,
            name: '猫牛式',
            sets: 1,
            reps: 10,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '四肢着地，吸气时背部下沉抬头，呼气时背部拱起低头，缓慢交替'
          },
          {
            id: 2,
            name: '下犬式',
            sets: 1,
            reps: 60,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '手脚着地，臀部向上抬起，形成倒V形，手臂和背部伸直'
          },
          {
            id: 3,
            name: '战士二式',
            sets: 2,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '一脚向前迈出，前腿弯曲，后腿伸直，双臂平举，目视前方'
          },
          {
            id: 4,
            name: '树式',
            sets: 2,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '单腿站立，另一脚放在支撑腿内侧，双手合十举过头顶'
          }
        ],
        tips: [
          '穿着舒适宽松的服装进行练习',
          '在瑜伽垫上进行练习，确保安全',
          '动作缓慢进行，感受身体的伸展',
          '保持深呼吸，放松身心'
        ]
      },
      {
        id: 4,
        title: '腹肌撕裂者',
        description: '专注于核心肌群的训练，打造完美腹肌线条。通过多种腹部训练动作，全面刺激腹肌。',
        duration: '15分钟',
        calories: 150,
        difficulty: '高级',
        category: '力量训练',
        icon: '/images/ui/placeholder.png',
        rating: 4.6,
        participants: 1680,
        tags: ['核心', '腹肌', '高级'],
        equipment: ['瑜伽垫'],
        targetMuscles: ['上腹肌', '下腹肌', '侧腹肌', '核心'],
        benefits: ['强化核心', '塑造腹肌', '提高稳定性', '改善体态'],
        steps: [
          {
            id: 1,
            name: '仰卧起坐 💪',
            sets: 3,
            reps: 20,
            rest: 30,
            image: '/images/exercises/situp.svg',
            description: '仰卧，双手放于耳侧或胸前，利用腹肌力量坐起，避免颈部用力'
          },
          {
            id: 2,
            name: '俄罗斯转体 🔄',
            sets: 3,
            reps: 20,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '坐姿，双腿离地，上身略后倾，双手合十左右转动身体'
          },
          {
            id: 3,
            name: '平板支撑抬腿 🦵',
            sets: 3,
            reps: 15,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '平板支撑姿势，交替抬起腿部，保持核心稳定，避免臀部下沉'
          },
          {
            id: 4,
            name: '卷腹 ⚡',
            sets: 3,
            reps: 20,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '仰卧，双手放于胸前或耳侧，利用腹肌力量将上身抬起，下背部不离地'
          }
        ],
        tips: [
          '训练时保持核心收紧，避免腰部代偿',
          '动作幅度要完整，感受腹肌的收缩',
          '呼吸要均匀，发力时呼气',
          '初学者可以减少组数和次数'
        ]
      },
      {
        id: 5,
        title: '有氧舞蹈',
        description: '结合音乐的有氧运动，在愉悦氛围中燃烧卡路里。通过动感的舞蹈动作，提高心肺功能和协调性。',
        duration: '35分钟',
        calories: 300,
        difficulty: '中级',
        category: '有氧运动',
        icon: '/images/ui/placeholder.png',
        rating: 4.8,
        participants: 3200,
        tags: ['舞蹈', '音乐', '燃脂'],
        equipment: ['无器械'],
        targetMuscles: ['全身', '心肺', '协调性'],
        benefits: ['燃烧卡路里', '提高心肺功能', '增强协调性', '愉悦身心'],
        steps: [
          {
            id: 1,
            name: '热身舞步 🎵',
            sets: 1,
            reps: 300,
            rest: 30,
            image: '/images/exercises/dance-warmup.svg',
            description: '跟随音乐节奏，进行简单的舞步热身，活动全身关节'
          },
          {
            id: 2,
            name: '有氧舞蹈组合 💃',
            sets: 3,
            reps: 480,
            rest: 60,
            image: '/images/exercises/dance.svg',
            description: '结合多种舞蹈动作，保持动作连贯流畅，跟随音乐节奏'
          },
          {
            id: 3,
            name: '高强度舞步 🔥',
            sets: 2,
            reps: 300,
            rest: 60,
            image: '/images/exercises/dance-cardio.svg',
            description: '加快节奏，增加动作幅度，提高心率，燃烧更多卡路里'
          },
          {
            id: 4,
            name: '放松舞步 ✨',
            sets: 1,
            reps: 180,
            rest: 0,
            image: '/images/exercises/dance.svg',
            description: '缓慢的舞步，逐渐降低心率，放松身体'
          }
        ],
        tips: [
          '选择自己喜欢的音乐，增加训练乐趣',
          '动作不必完全标准，享受过程最重要',
          '保持呼吸顺畅，避免憋气',
          '穿着舒适的运动鞋，保护脚踝'
        ]
      },
      {
        id: 6,
        title: '普拉提核心',
        description: '通过普拉提动作强化核心肌群，改善体态和稳定性。专注于深层肌肉的控制和呼吸配合。',
        duration: '25分钟',
        calories: 180,
        difficulty: '中级',
        category: '柔韧性',
        icon: '/images/ui/placeholder.png',
        rating: 4.4,
        participants: 1100,
        tags: ['核心', '体态', '稳定性'],
        equipment: ['瑜伽垫'],
        targetMuscles: ['核心', '深层肌肉', '脊柱'],
        benefits: ['强化核心', '改善体态', '提高稳定性', '增强控制力'],
        steps: [
          {
            id: 1,
            name: '百次呼吸 🌬️',
            sets: 1,
            reps: 100,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '仰卧，双腿抬起，上身微抬，双臂上下摆动，配合呼吸'
          },
          {
            id: 2,
            name: '单腿画圈 ⭕',
            sets: 2,
            reps: 10,
            rest: 30,
            image: '/images/exercises/leg-circle.svg',
            description: '仰卧，一腿抬起画圈，保持骨盆稳定，核心收紧'
          },
          {
            id: 3,
            name: '滚动如球 🎱',
            sets: 3,
            reps: 10,
            rest: 30,
            image: '/images/exercises/roll-like-ball.svg',
            description: '坐姿抱膝，向后滚动至肩部，再滚回坐姿，保持平衡'
          },
          {
            id: 4,
            name: '侧卧抬腿 🦿',
            sets: 2,
            reps: 15,
            rest: 30,
            image: '/images/ui/placeholder.png',
            description: '侧卧，上腿抬起放下，保持身体稳定，感受侧腹发力'
          }
        ],
        tips: [
          '动作要缓慢控制，注重质量而非数量',
          '保持深呼吸，呼吸与动作配合',
          '专注于核心肌群的发力',
          '初学者可以降低动作难度'
        ]
      },
      {
        id: 7,
        title: '哑铃全身训练',
        description: '使用哑铃进行全身力量训练，增强肌肉力量和体型。通过器械训练，更有效地刺激肌肉生长。',
        duration: '35分钟',
        calories: 220,
        difficulty: '中级',
        category: '力量训练',
        icon: '/images/ui/placeholder.png',
        rating: 4.6,
        participants: 1890,
        tags: ['哑铃', '器械', '塑形'],
        equipment: ['哑铃(5-10kg)'],
        targetMuscles: ['胸肌', '背肌', '肩部', '手臂', '腿部'],
        benefits: ['增强肌肉力量', '塑造体型', '提高代谢', '增加肌肉量'],
        steps: [
          {
            id: 1,
            name: '哑铃深蹲',
            sets: 3,
            reps: 12,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '双手持哑铃于身体两侧，进行深蹲动作，增加负重强度'
          },
          {
            id: 2,
            name: '哑铃卧推',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '仰卧，双手持哑铃推举，感受胸肌发力'
          },
          {
            id: 3,
            name: '哑铃划船',
            sets: 3,
            reps: 12,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '俯身，单手持哑铃向上拉，锻炼背部肌肉'
          },
          {
            id: 4,
            name: '哑铃肩推',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '站姿或坐姿，双手持哑铃向上推举，锻炼肩部'
          }
        ],
        tips: [
          '选择合适重量的哑铃，能完成目标次数',
          '动作要标准，避免借力',
          '训练前充分热身，避免受伤',
          '逐渐增加重量，循序渐进'
        ]
      },
      {
        id: 8,
        title: '晨间唤醒瑜伽',
        description: '适合早晨练习的瑜伽动作，温和唤醒身体。通过舒缓的动作和呼吸，开启充满活力的一天。',
        duration: '15分钟',
        calories: 80,
        difficulty: '初级',
        category: '柔韧性',
        icon: '/images/ui/placeholder.png',
        rating: 4.5,
        participants: 2100,
        tags: ['早晨', '唤醒', '温和'],
        equipment: ['瑜伽垫'],
        targetMuscles: ['全身', '脊柱', '关节'],
        benefits: ['唤醒身体', '提高精神', '增加柔韧性', '改善循环'],
        steps: [
          {
            id: 1,
            name: '婴儿式',
            sets: 1,
            reps: 60,
            rest: 0,
            image: '/images/actions/action-placeholder.svg',
            description: '跪坐，上身前倾，额头触地，双臂前伸，放松全身'
          },
          {
            id: 2,
            name: '猫牛式',
            sets: 1,
            reps: 10,
            rest: 0,
            image: '/images/actions/action-placeholder.svg',
            description: '四肢着地，吸气时背部下沉抬头，呼气时背部拱起低头'
          },
          {
            id: 3,
            name: '下犬式',
            sets: 1,
            reps: 60,
            rest: 0,
            image: '/images/actions/action-placeholder.svg',
            description: '手脚着地，臀部向上抬起，形成倒V形，伸展全身'
          },
          {
            id: 4,
            name: '山式',
            sets: 1,
            reps: 60,
            rest: 0,
            image: '/images/actions/action-placeholder.svg',
            description: '站立，双脚并拢，身体挺直，双手合十于胸前，深呼吸'
          }
        ],
        tips: [
          '早晨练习前可以喝一杯温水',
          '动作要轻柔，不要勉强身体',
          '配合深呼吸，感受身体的苏醒',
          '可以在床上进行部分动作'
        ]
      }
    ];

    const plan = plans.find(p => p.id === planId) || plans[0];
    
    // 为每个计划添加格式化后的参与人数
    plan.formattedParticipants = this.formatParticipants(plan.participants);
    
    this.setData({
      plan: plan
    });
  },

  // 格式化参与人数显示
  formatParticipants(num) {
    return num > 1000 ? (num/1000).toFixed(1) + 'k' : num;
  },

  // 开始训练
  startTraining() {
    // 跳转到训练执行页面
    wx.navigateTo({
      url: `/pages/training-session/training-session?id=${this.data.planId}&title=${this.data.plan.title}`
    });
  }
})
