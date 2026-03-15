// utils/ai-recommender.js - AI个性化训练计划推荐系统

/**
 * 用户体能等级
 */
const FITNESS_LEVELS = {
  BEGINNER: 'beginner',      // 初学者
  INTERMEDIATE: 'intermediate', // 中级
  ADVANCED: 'advanced'        // 高级
};

/**
 * 训练目标
 */
const TRAINING_GOALS = {
  WEIGHT_LOSS: 'weight_loss',    // 减脂
  MUSCLE_GAIN: 'muscle_gain',    // 增肌
  BODY_SHAPING: 'body_shaping',  // 塑形
  ENDURANCE: 'endurance',        // 耐力提升
  FLEXIBILITY: 'flexibility'     // 柔韧性
};

/**
 * 动作库
 */
const EXERCISE_DATABASE = {
  // 力量训练动作 - 大幅扩充
  strength: [
    // 徒手训练
    { name: '深蹲', difficulty: 1, calories: 15, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '俯卧撑', difficulty: 2, calories: 12, muscleGroups: ['胸部', '手臂'], equipment: '无' },
    { name: '平板支撑', difficulty: 1, calories: 10, muscleGroups: ['核心'], equipment: '无' },
    { name: '弓步蹲', difficulty: 2, calories: 13, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '臀桥', difficulty: 1, calories: 11, muscleGroups: ['臀部', '核心'], equipment: '无' },
    { name: '侧平板支撑', difficulty: 2, calories: 11, muscleGroups: ['核心', '肩部'], equipment: '无' },
    { name: '保加利亚深蹲', difficulty: 3, calories: 16, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '钻石俯卧撑', difficulty: 3, calories: 14, muscleGroups: ['胸部', '手臂'], equipment: '无' },
    { name: '宽距俯卧撑', difficulty: 2, calories: 13, muscleGroups: ['胸部', '肩部'], equipment: '无' },
    { name: '窄距俯卧撑', difficulty: 2, calories: 12, muscleGroups: ['手臂', '胸部'], equipment: '无' },
    { name: '单腿臀桥', difficulty: 2, calories: 13, muscleGroups: ['臀部', '腿部'], equipment: '无' },
    { name: '靠墙静蹲', difficulty: 1, calories: 9, muscleGroups: ['腿部'], equipment: '无' },
    
    // 哑铃训练
    { name: '哑铃深蹲', difficulty: 2, calories: 16, muscleGroups: ['腿部', '臀部'], equipment: '哑铃' },
    { name: '哑铃卧推', difficulty: 2, calories: 14, muscleGroups: ['胸部', '手臂'], equipment: '哑铃' },
    { name: '哑铃划船', difficulty: 2, calories: 13, muscleGroups: ['背部'], equipment: '哑铃' },
    { name: '哑铃肩推', difficulty: 2, calories: 12, muscleGroups: ['肩部', '手臂'], equipment: '哑铃' },
    { name: '哑铃弯举', difficulty: 1, calories: 8, muscleGroups: ['手臂'], equipment: '哑铃' },
    { name: '哑铃侧平举', difficulty: 2, calories: 10, muscleGroups: ['肩部'], equipment: '哑铃' },
    { name: '哑铃前平举', difficulty: 2, calories: 10, muscleGroups: ['肩部'], equipment: '哑铃' },
    { name: '哑铃飞鸟', difficulty: 2, calories: 11, muscleGroups: ['胸部'], equipment: '哑铃' },
    { name: '哑铃硬拉', difficulty: 3, calories: 18, muscleGroups: ['背部', '腿部'], equipment: '哑铃' },
    { name: '哑铃箭步蹲', difficulty: 2, calories: 14, muscleGroups: ['腿部', '臀部'], equipment: '哑铃' },
    { name: '哑铃俯身飞鸟', difficulty: 2, calories: 11, muscleGroups: ['肩部', '背部'], equipment: '哑铃' },
    { name: '哑铃锤式弯举', difficulty: 1, calories: 9, muscleGroups: ['手臂'], equipment: '哑铃' },
    { name: '哑铃集中弯举', difficulty: 1, calories: 8, muscleGroups: ['手臂'], equipment: '哑铃' },
    { name: '哑铃颈后臂屈伸', difficulty: 2, calories: 10, muscleGroups: ['手臂'], equipment: '哑铃' },
    
    // 杠铃训练
    { name: '杠铃深蹲', difficulty: 3, calories: 18, muscleGroups: ['腿部', '臀部'], equipment: '杠铃' },
    { name: '杠铃硬拉', difficulty: 3, calories: 20, muscleGroups: ['背部', '腿部'], equipment: '杠铃' },
    { name: '杠铃卧推', difficulty: 3, calories: 16, muscleGroups: ['胸部', '手臂'], equipment: '杠铃' },
    { name: '杠铃划船', difficulty: 3, calories: 15, muscleGroups: ['背部'], equipment: '杠铃' },
    { name: '杠铃肩推', difficulty: 3, calories: 14, muscleGroups: ['肩部', '手臂'], equipment: '杠铃' },
    { name: '杠铃弯举', difficulty: 2, calories: 10, muscleGroups: ['手臂'], equipment: '杠铃' },
    { name: '杠铃箭步蹲', difficulty: 3, calories: 16, muscleGroups: ['腿部', '臀部'], equipment: '杠铃' },
    { name: '杠铃前蹲', difficulty: 3, calories: 17, muscleGroups: ['腿部', '核心'], equipment: '杠铃' },
    { name: '杠铃罗马尼亚硬拉', difficulty: 3, calories: 18, muscleGroups: ['腿部', '臀部'], equipment: '杠铃' },
    
    // 壶铃训练
    { name: '壶铃摆荡', difficulty: 2, calories: 17, muscleGroups: ['全身'], equipment: '壶铃' },
    { name: '壶铃深蹲', difficulty: 2, calories: 15, muscleGroups: ['腿部', '臀部'], equipment: '壶铃' },
    { name: '壶铃高脚杯深蹲', difficulty: 2, calories: 16, muscleGroups: ['腿部', '核心'], equipment: '壶铃' },
    { name: '壶铃推举', difficulty: 2, calories: 12, muscleGroups: ['肩部', '手臂'], equipment: '壶铃' },
    { name: '壶铃土耳其起立', difficulty: 3, calories: 15, muscleGroups: ['全身'], equipment: '壶铃' },
    
    // 弹力带训练
    { name: '弹力带推胸', difficulty: 1, calories: 10, muscleGroups: ['胸部'], equipment: '弹力带' },
    { name: '弹力带划船', difficulty: 1, calories: 9, muscleGroups: ['背部'], equipment: '弹力带' },
    { name: '弹力带深蹲', difficulty: 1, calories: 12, muscleGroups: ['腿部', '臀部'], equipment: '弹力带' },
    { name: '弹力带侧平举', difficulty: 1, calories: 8, muscleGroups: ['肩部'], equipment: '弹力带' },
    { name: '弹力带臀桥', difficulty: 1, calories: 11, muscleGroups: ['臀部'], equipment: '弹力带' },
    
    // 单杠/双杠训练
    { name: '引体向上', difficulty: 3, calories: 14, muscleGroups: ['背部', '手臂'], equipment: '单杠' },
    { name: '反手引体向上', difficulty: 3, calories: 15, muscleGroups: ['背部', '手臂'], equipment: '单杠' },
    { name: '宽握引体向上', difficulty: 3, calories: 16, muscleGroups: ['背部', '肩部'], equipment: '单杠' },
    { name: '双杠臂屈伸', difficulty: 3, calories: 13, muscleGroups: ['胸部', '手臂'], equipment: '单杠' },
    { name: '悬垂举腿', difficulty: 3, calories: 12, muscleGroups: ['核心'], equipment: '单杠' },
    
    // 史密斯架训练
    { name: '史密斯深蹲', difficulty: 2, calories: 16, muscleGroups: ['腿部', '臀部'], equipment: '史密斯架' },
    { name: '史密斯卧推', difficulty: 2, calories: 15, muscleGroups: ['胸部', '手臂'], equipment: '史密斯架' },
    { name: '史密斯肩推', difficulty: 2, calories: 13, muscleGroups: ['肩部', '手臂'], equipment: '史密斯架' },
    { name: '史密斯箭步蹲', difficulty: 2, calories: 14, muscleGroups: ['腿部', '臀部'], equipment: '史密斯架' },
    
    // 龙门架训练
    { name: '龙门架夹胸', difficulty: 2, calories: 12, muscleGroups: ['胸部'], equipment: '龙门架' },
    { name: '龙门架下拉', difficulty: 2, calories: 11, muscleGroups: ['背部'], equipment: '龙门架' },
    { name: '龙门架飞鸟', difficulty: 2, calories: 11, muscleGroups: ['胸部'], equipment: '龙门架' },
    { name: '龙门架侧平举', difficulty: 2, calories: 10, muscleGroups: ['肩部'], equipment: '龙门架' },
    
    // 固定器械训练
    { name: '器械推胸', difficulty: 1, calories: 13, muscleGroups: ['胸部'], equipment: '推胸机' },
    { name: '器械划船', difficulty: 1, calories: 12, muscleGroups: ['背部'], equipment: '固定器械' },
    { name: '器械飞鸟', difficulty: 1, calories: 10, muscleGroups: ['胸部'], equipment: '飞鸟机' },
    { name: '器械肩推', difficulty: 1, calories: 11, muscleGroups: ['肩部'], equipment: '固定器械' },
    { name: '腿举', difficulty: 2, calories: 17, muscleGroups: ['腿部'], equipment: '腿举机' },
    { name: '腿屈伸', difficulty: 1, calories: 11, muscleGroups: ['腿部'], equipment: '蹬腿机' },
    { name: '腿弯举', difficulty: 1, calories: 10, muscleGroups: ['腿部'], equipment: '固定器械' },
    { name: '高位下拉', difficulty: 2, calories: 13, muscleGroups: ['背部', '手臂'], equipment: '高位下拉' },
    { name: '坐姿划船', difficulty: 2, calories: 12, muscleGroups: ['背部'], equipment: '划船机' },
    { name: '蝴蝶机夹胸', difficulty: 1, calories: 10, muscleGroups: ['胸部'], equipment: '飞鸟机' },
    { name: '坐姿推胸', difficulty: 1, calories: 12, muscleGroups: ['胸部', '手臂'], equipment: '推胸机' }
  ],
  
  // 有氧运动 - 扩充
  cardio: [
    { name: '开合跳', difficulty: 1, calories: 18, muscleGroups: ['全身'], equipment: '无' },
    { name: '高抬腿', difficulty: 2, calories: 20, muscleGroups: ['腿部', '核心'], equipment: '无' },
    { name: '波比跳', difficulty: 3, calories: 25, muscleGroups: ['全身'], equipment: '无' },
    { name: '登山跑', difficulty: 2, calories: 22, muscleGroups: ['核心', '腿部'], equipment: '无' },
    { name: '跳绳', difficulty: 2, calories: 20, muscleGroups: ['腿部', '心肺'], equipment: '跳绳' },
    { name: '原地跑', difficulty: 1, calories: 15, muscleGroups: ['腿部', '心肺'], equipment: '无' },
    { name: '深蹲跳', difficulty: 3, calories: 23, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '箭步跳', difficulty: 3, calories: 22, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '侧向跳', difficulty: 2, calories: 18, muscleGroups: ['腿部'], equipment: '无' },
    { name: '熊爬', difficulty: 2, calories: 19, muscleGroups: ['全身'], equipment: '无' },
    { name: '螃蟹步', difficulty: 2, calories: 17, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '滑雪跳', difficulty: 2, calories: 20, muscleGroups: ['腿部', '心肺'], equipment: '无' },
    { name: '跳跃箭步蹲', difficulty: 3, calories: 24, muscleGroups: ['腿部', '臀部'], equipment: '无' }
  ],
  
  // 柔韧性训练 - 扩充
  flexibility: [
    { name: '猫牛式', difficulty: 1, calories: 5, muscleGroups: ['背部', '核心'], equipment: '无' },
    { name: '下犬式', difficulty: 2, calories: 8, muscleGroups: ['全身'], equipment: '无' },
    { name: '战士二式', difficulty: 2, calories: 7, muscleGroups: ['腿部', '核心'], equipment: '无' },
    { name: '树式', difficulty: 2, calories: 6, muscleGroups: ['腿部', '核心'], equipment: '无' },
    { name: '婴儿式', difficulty: 1, calories: 4, muscleGroups: ['背部'], equipment: '无' },
    { name: '扭转式', difficulty: 2, calories: 6, muscleGroups: ['核心', '背部'], equipment: '无' },
    { name: '鸽子式', difficulty: 2, calories: 7, muscleGroups: ['臀部', '腿部'], equipment: '无' },
    { name: '蝴蝶式', difficulty: 1, calories: 5, muscleGroups: ['腿部', '臀部'], equipment: '无' },
    { name: '坐姿前屈', difficulty: 1, calories: 5, muscleGroups: ['腿部', '背部'], equipment: '无' },
    { name: '眼镜蛇式', difficulty: 1, calories: 6, muscleGroups: ['背部', '核心'], equipment: '无' },
    { name: '弓式', difficulty: 2, calories: 7, muscleGroups: ['背部', '核心'], equipment: '无' },
    { name: '桥式', difficulty: 2, calories: 8, muscleGroups: ['背部', '臀部'], equipment: '无' }
  ]
};

/**
 * AI推荐引擎
 */
class AIRecommender {
  /**
   * 根据用户信息生成个性化训练计划
   */
  static generatePlan(userProfile) {
    const { fitnessLevel, goal, duration, equipment, preferences } = userProfile;
    
    // 1. 选择合适的动作
    const selectedExercises = this.selectExercises(fitnessLevel, goal, equipment, preferences);
    
    // 2. 计算训练参数（组数、次数、休息时间）
    const exercises = this.calculateTrainingParams(selectedExercises, fitnessLevel, goal, duration);
    
    // 3. 生成计划标题和描述
    const planInfo = this.generatePlanInfo(goal, fitnessLevel, duration);
    
    return {
      title: planInfo.title,
      description: planInfo.description,
      category: planInfo.category,
      exercises: exercises,
      estimatedDuration: this.calculateTotalDuration(exercises),
      estimatedCalories: this.calculateTotalCalories(exercises),
      difficulty: this.mapFitnessLevelToDifficulty(fitnessLevel),
      tags: this.generateTags(goal, fitnessLevel, equipment)
    };
  }

  /**
   * 选择合适的动作
   */
  static selectExercises(fitnessLevel, goal, equipment, preferences) {
    let exercises = [];
    
    // 先打乱所有动作库，增加随机性
    const shuffledStrength = this.shuffleArray(EXERCISE_DATABASE.strength);
    const shuffledCardio = this.shuffleArray(EXERCISE_DATABASE.cardio);
    const shuffledFlexibility = this.shuffleArray(EXERCISE_DATABASE.flexibility);
    
    // 根据目标选择动作类型和数量
    switch (goal) {
      case TRAINING_GOALS.WEIGHT_LOSS:
        // 减脂：高强度有氧 + 力量训练 (5有氧 + 4力量)
        exercises = [
          ...this.filterByDifficulty(shuffledCardio, fitnessLevel).slice(0, 5),
          ...this.filterByDifficulty(shuffledStrength, fitnessLevel).slice(0, 4)
        ];
        break;
        
      case TRAINING_GOALS.MUSCLE_GAIN:
        // 增肌：力量训练为主 (8-10个动作)
        exercises = this.filterByDifficulty(shuffledStrength, fitnessLevel).slice(0, 10);
        break;
        
      case TRAINING_GOALS.BODY_SHAPING:
        // 塑形：力量 + 有氧平衡 (5力量 + 4有氧)
        exercises = [
          ...this.filterByDifficulty(shuffledStrength, fitnessLevel).slice(0, 5),
          ...this.filterByDifficulty(shuffledCardio, fitnessLevel).slice(0, 4)
        ];
        break;
        
      case TRAINING_GOALS.ENDURANCE:
        // 耐力：有氧为主 (6有氧 + 3力量)
        exercises = [
          ...this.filterByDifficulty(shuffledCardio, fitnessLevel).slice(0, 6),
          ...this.filterByDifficulty(shuffledStrength, fitnessLevel).slice(0, 3)
        ];
        break;
        
      case TRAINING_GOALS.FLEXIBILITY:
        // 柔韧性：拉伸为主 (7拉伸 + 2力量)
        exercises = [
          ...shuffledFlexibility.slice(0, 7),
          ...this.filterByDifficulty(shuffledStrength, fitnessLevel).slice(0, 2)
        ];
        break;
    }
    
    // 根据器材过滤
    if (equipment && equipment.length > 0 && !equipment.includes('无')) {
      // 如果用户选择了特定器材，保留对应器材的动作和徒手动作
      exercises = exercises.filter(ex => 
        equipment.includes(ex.equipment) || ex.equipment === '无'
      );
    }
    
    // 如果过滤后动作太少，补充更多动作
    if (exercises.length < 6) {
      const allExercises = [
        ...EXERCISE_DATABASE.strength,
        ...EXERCISE_DATABASE.cardio,
        ...EXERCISE_DATABASE.flexibility
      ];
      
      const additionalExercises = this.filterByDifficulty(allExercises, fitnessLevel)
        .filter(ex => !exercises.find(e => e.name === ex.name))
        .slice(0, 6 - exercises.length);
      
      exercises = [...exercises, ...additionalExercises];
    }
    
    // 根据偏好调整
    if (preferences && preferences.avoidMuscleGroups) {
      exercises = exercises.filter(ex => 
        !ex.muscleGroups.some(mg => preferences.avoidMuscleGroups.includes(mg))
      );
    }
    
    // 最终再打乱一次，确保每次生成都不同
    exercises = this.shuffleArray(exercises);
    
    return exercises;
  }

  /**
   * 打乱数组顺序
   */
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 根据难度过滤动作
   */
  static filterByDifficulty(exercises, fitnessLevel) {
    const maxDifficulty = {
      [FITNESS_LEVELS.BEGINNER]: 2,
      [FITNESS_LEVELS.INTERMEDIATE]: 3,
      [FITNESS_LEVELS.ADVANCED]: 3
    }[fitnessLevel];
    
    return exercises.filter(ex => ex.difficulty <= maxDifficulty);
  }

  /**
   * 计算训练参数
   */
  static calculateTrainingParams(exercises, fitnessLevel, goal, duration) {
    const params = this.getBaseParams(fitnessLevel, goal);
    
    return exercises.map((exercise, index) => ({
      id: Date.now() + index,
      name: exercise.name,
      sets: params.sets,
      reps: this.calculateReps(exercise, goal),
      restTime: params.restTime,
      image: this.getExerciseImage(exercise.name),
      description: `${exercise.muscleGroups.join('、')}训练`,
      caloriesPerSet: exercise.calories,
      completed: false
    }));
  }

  /**
   * 获取基础训练参数
   */
  static getBaseParams(fitnessLevel, goal) {
    const params = {
      [FITNESS_LEVELS.BEGINNER]: {
        sets: 2,
        restTime: 60
      },
      [FITNESS_LEVELS.INTERMEDIATE]: {
        sets: 3,
        restTime: 45
      },
      [FITNESS_LEVELS.ADVANCED]: {
        sets: 4,
        restTime: 30
      }
    };
    
    // 根据目标调整
    const levelParams = params[fitnessLevel];
    if (goal === TRAINING_GOALS.WEIGHT_LOSS || goal === TRAINING_GOALS.ENDURANCE) {
      levelParams.restTime = Math.max(20, levelParams.restTime - 15);
    }
    
    return levelParams;
  }

  /**
   * 计算次数
   */
  static calculateReps(exercise, goal) {
    const baseReps = {
      [TRAINING_GOALS.WEIGHT_LOSS]: 15,
      [TRAINING_GOALS.MUSCLE_GAIN]: 10,
      [TRAINING_GOALS.BODY_SHAPING]: 12,
      [TRAINING_GOALS.ENDURANCE]: 20,
      [TRAINING_GOALS.FLEXIBILITY]: 30
    };
    
    return baseReps[goal] || 12;
  }

  /**
   * 获取动作图片
   */
  static getExerciseImage(exerciseName) {
    const imageMap = {
      '深蹲': '/images/actions/squat.svg',
      '俯卧撑': '/images/actions/pushup.svg',
      '平板支撑': '/images/actions/plank.svg',
      '弓步蹲': '/images/actions/lunge.svg',
      '开合跳': '/images/actions/jumping-jack.svg',
      '高抬腿': '/images/actions/high-knee.svg',
      '波比跳': '/images/actions/burpee.svg',
      '登山跑': '/images/actions/mountain-climber.svg'
    };
    
    return imageMap[exerciseName] || '/images/ui/placeholder.png';
  }

  /**
   * 生成计划信息
   */
  static generatePlanInfo(goal, fitnessLevel, duration) {
    const goalNames = {
      [TRAINING_GOALS.WEIGHT_LOSS]: '燃脂减脂',
      [TRAINING_GOALS.MUSCLE_GAIN]: '增肌塑形',
      [TRAINING_GOALS.BODY_SHAPING]: '身材塑形',
      [TRAINING_GOALS.ENDURANCE]: '耐力提升',
      [TRAINING_GOALS.FLEXIBILITY]: '柔韧拉伸'
    };
    
    const levelNames = {
      [FITNESS_LEVELS.BEGINNER]: '入门',
      [FITNESS_LEVELS.INTERMEDIATE]: '进阶',
      [FITNESS_LEVELS.ADVANCED]: '高级'
    };
    
    const categories = {
      [TRAINING_GOALS.WEIGHT_LOSS]: '有氧运动',
      [TRAINING_GOALS.MUSCLE_GAIN]: '力量训练',
      [TRAINING_GOALS.BODY_SHAPING]: '力量训练',
      [TRAINING_GOALS.ENDURANCE]: '有氧运动',
      [TRAINING_GOALS.FLEXIBILITY]: '柔韧性'
    };
    
    return {
      title: `AI推荐 - ${goalNames[goal]}${levelNames[fitnessLevel]}计划`,
      description: `根据您的体能水平和训练目标，AI为您定制的${duration}分钟${goalNames[goal]}训练计划`,
      category: categories[goal]
    };
  }

  /**
   * 计算总时长
   */
  static calculateTotalDuration(exercises) {
    const totalSeconds = exercises.reduce((total, ex) => {
      return total + (ex.sets * (ex.reps * 2 + ex.restTime));
    }, 0);
    
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes}分钟`;
  }

  /**
   * 计算总卡路里
   */
  static calculateTotalCalories(exercises) {
    return exercises.reduce((total, ex) => {
      return total + (ex.sets * ex.caloriesPerSet);
    }, 0);
  }

  /**
   * 映射体能等级到难度
   */
  static mapFitnessLevelToDifficulty(fitnessLevel) {
    return {
      [FITNESS_LEVELS.BEGINNER]: '入门',
      [FITNESS_LEVELS.INTERMEDIATE]: '中级',
      [FITNESS_LEVELS.ADVANCED]: '高级'
    }[fitnessLevel];
  }

  /**
   * 生成标签
   */
  static generateTags(goal, fitnessLevel, equipment) {
    const tags = ['AI推荐', '个性化'];
    
    const goalTags = {
      [TRAINING_GOALS.WEIGHT_LOSS]: '减脂',
      [TRAINING_GOALS.MUSCLE_GAIN]: '增肌',
      [TRAINING_GOALS.BODY_SHAPING]: '塑形',
      [TRAINING_GOALS.ENDURANCE]: '耐力',
      [TRAINING_GOALS.FLEXIBILITY]: '柔韧'
    };
    
    tags.push(goalTags[goal]);
    
    if (!equipment || equipment.length === 0 || equipment.includes('无')) {
      tags.push('徒手训练');
    }
    
    return tags;
  }
}

module.exports = {
  AIRecommender,
  FITNESS_LEVELS,
  TRAINING_GOALS
};
