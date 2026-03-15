// pages/training-session/training-session.js
const app = getApp()

Page({
  data: {
    planId: 0,
    planTitle: '',
    exercises: [],
    currentExerciseIndex: 0,
    currentExercise: null,
    currentSet: 1,
    isResting: false,
    restTimeLeft: 0,
    exerciseTimeElapsed: 0,
    exerciseTimeFormatted: '00:00',
    totalTimeElapsed: 0,
    totalTimeFormatted: '00:00',
    timer: null,
    isRunning: false,
    completedExercises: [],
    totalCalories: 0,
    caloriesPerMinute: 8,
    sessionStartTime: 0,
    isPaused: false,
    showExerciseList: false
  },

  onLoad(options) {
    const planId = parseInt(options.id) || 1;
    const planTitle = decodeURIComponent(options.title || '训练计划');
    const isCustom = options.isCustom === 'true';
    
    this.setData({
      planId,
      planTitle,
      isCustom,
      sessionStartTime: Date.now()
    });
    
    this.loadPlanExercises(planId, isCustom);
  },

  onUnload() {
    // 页面卸载时清除计时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: null,
        isRunning: false
      });
    }
  },

  // 加载训练计划的动作列表
  loadPlanExercises(planId, isCustom) {
    let plan = null;
    
    if (isCustom) {
      // 从自定义计划中加载
      const customPlans = wx.getStorageSync('customPlans') || [];
      plan = customPlans.find(p => p.id === planId);
      
      if (plan && plan.exercises) {
        const exercises = plan.exercises.map((exercise, index) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets || 3,
          reps: exercise.reps || 12,
          rest: exercise.restTime || 60,
          image: exercise.image || '/images/ui/placeholder.png',
          description: exercise.description || `完成${exercise.sets}组，每组${exercise.reps}次`,
          caloriesPerSet: 10,
          index: index,
          completed: false,
          completedSets: 0,
          totalSets: exercise.sets || 3
        }));
        
        this.setData({
          exercises,
          currentExercise: exercises[0],
          currentExerciseIndex: 0,
          currentSet: 1,
          exerciseTimeFormatted: '00:00',
          totalTimeFormatted: '00:00'
        });
        
        // 开始第一个动作的计时
        this.startExerciseTimer();
        return;
      }
    }
    
    // 从预设计划中加载
    const plans = this.getAllPlans();
    plan = plans.find(p => p.id === planId);
    
    if (plan && plan.steps) {
      const exercises = plan.steps.map((step, index) => ({
        ...step,
        index: index,
        completed: false,
        completedSets: 0,
        totalSets: step.sets || 3
      }));
      
      this.setData({
        exercises,
        currentExercise: exercises[0],
        currentExerciseIndex: 0,
        currentSet: 1,
        exerciseTimeFormatted: '00:00',
        totalTimeFormatted: '00:00'
      });
      
      // 开始第一个动作的计时
      this.startExerciseTimer();
    }
  },

  // 获取所有训练计划
  getAllPlans() {
    return [
      {
        id: 1,
        title: '全身力量训练',
        steps: [
          {
            id: 1,
            name: '深蹲',
            sets: 3,
            reps: 12,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '双脚与肩同宽，脚尖微朝外，下蹲时膝盖不要超过脚尖，保持背部挺直',
            caloriesPerSet: 15
          },
          {
            id: 2,
            name: '俯卧撑',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '双手与肩同宽，身体保持一条直线，下降时胸部接近地面，推起时手臂伸直',
            caloriesPerSet: 12
          },
          {
            id: 3,
            name: '平板支撑',
            sets: 3,
            reps: 30,
            rest: 45,
            image: '/images/actions/action-placeholder.svg',
            description: '前臂和脚尖支撑身体，保持身体呈一条直线，收紧核心肌群',
            caloriesPerSet: 10
          },
          {
            id: 4,
            name: '弓步蹲',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/actions/action-placeholder.svg',
            description: '一脚向前迈出，下蹲至两膝成90度，前膝不超过脚尖，后膝接近地面',
            caloriesPerSet: 13
          }
        ]
      },
      {
        id: 2,
        title: 'HIIT燃脂训练',
        steps: [
          {
            id: 1,
            name: '开合跳',
            sets: 4,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '双脚跳开同时双臂举过头顶，然后跳回起始位置，保持节奏稳定',
            caloriesPerSet: 18
          },
          {
            id: 2,
            name: '高抬腿',
            sets: 4,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '原地跑步，膝盖尽量抬高至髋部高度，手臂配合摆动',
            caloriesPerSet: 20
          },
          {
            id: 3,
            name: '波比跳',
            sets: 3,
            reps: 10,
            rest: 45,
            image: '/images/actions/action-placeholder.svg',
            description: '下蹲-后踢腿成平板支撑-俯卧撑-收腿-跳跃，动作连贯流畅',
            caloriesPerSet: 25
          },
          {
            id: 4,
            name: '登山跑',
            sets: 4,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '平板支撑姿势，交替将膝盖拉向胸部，保持核心稳定',
            caloriesPerSet: 22
          }
        ]
      },
      {
        id: 3,
        title: '瑜伽拉伸',
        steps: [
          {
            id: 1,
            name: '猫牛式',
            sets: 1,
            reps: 10,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '四肢着地，吸气时背部下沉抬头，呼气时背部拱起低头，缓慢交替',
            caloriesPerSet: 5
          },
          {
            id: 2,
            name: '下犬式',
            sets: 1,
            reps: 60,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '手脚着地，臀部向上抬起，形成倒V形，手臂和背部伸直',
            caloriesPerSet: 8
          },
          {
            id: 3,
            name: '战士二式',
            sets: 2,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '一脚向前迈出，前腿弯曲，后腿伸直，双臂平举，目视前方',
            caloriesPerSet: 7
          },
          {
            id: 4,
            name: '树式',
            sets: 2,
            reps: 30,
            rest: 30,
            image: '/images/actions/action-placeholder.svg',
            description: '单腿站立，另一脚放在支撑腿内侧，双手合十举过头顶',
            caloriesPerSet: 6
          }
        ]
      },
      {
        id: 4,
        title: '腹肌撕裂者',
        steps: [
          {
            id: 1,
            name: '仰卧起坐',
            sets: 3,
            reps: 20,
            rest: 30,
            image: '/images/exercises/situp.svg',
            description: '仰卧，双手放于耳侧或胸前，利用腹肌力量坐起，避免颈部用力',
            caloriesPerSet: 14
          },
          {
            id: 2,
            name: '俄罗斯转体',
            sets: 3,
            reps: 20,
            rest: 30,
            image: '/images/exercises/russian-twist.svg',
            description: '坐姿，双腿离地，上身略后倾，双手合十左右转动身体',
            caloriesPerSet: 16
          },
          {
            id: 3,
            name: '平板支撑抬腿',
            sets: 3,
            reps: 15,
            rest: 30,
            image: '/images/exercises/mountain-climber.svg',
            description: '平板支撑姿势，交替抬起腿部，保持核心稳定，避免臀部下沉',
            caloriesPerSet: 15
          },
          {
            id: 4,
            name: '卷腹',
            sets: 3,
            reps: 20,
            rest: 30,
            image: '/images/exercises/crunch.svg',
            description: '仰卧，双手放于胸前或耳侧，利用腹肌力量将上身抬起，下背部不离地',
            caloriesPerSet: 13
          }
        ]
      },
      {
        id: 5,
        title: '有氧舞蹈',
        steps: [
          {
            id: 1,
            name: '热身舞步',
            sets: 1,
            reps: 300,
            rest: 60,
            image: '/images/exercises/dance-warmup.svg',
            description: '轻松的舞步动作，逐渐提高心率，活动全身关节',
            caloriesPerSet: 20
          },
          {
            id: 2,
            name: '基础舞步组合',
            sets: 3,
            reps: 120,
            rest: 45,
            image: '/images/exercises/dance.svg',
            description: '简单的舞蹈动作组合，保持节奏感，享受音乐',
            caloriesPerSet: 25
          },
          {
            id: 3,
            name: '高强度舞步',
            sets: 2,
            reps: 90,
            rest: 60,
            image: '/images/exercises/dance-cardio.svg',
            description: '加快节奏，提高动作幅度，增加心率',
            caloriesPerSet: 30
          },
          {
            id: 4,
            name: '放松舞步',
            sets: 1,
            reps: 180,
            rest: 30,
            image: '/images/exercises/dance.svg',
            description: '缓慢的舞步，逐渐降低心率，放松肌肉',
            caloriesPerSet: 15
          }
        ]
      },
      {
        id: 6,
        title: '普拉提核心',
        steps: [
          {
            id: 1,
            name: '百次拍',
            sets: 1,
            reps: 100,
            rest: 60,
            image: '/images/exercises/hundred.svg',
            description: '仰卧，双腿抬起，手臂上下小幅度摆动，配合呼吸节奏',
            caloriesPerSet: 12
          },
          {
            id: 2,
            name: '单腿拉伸',
            sets: 2,
            reps: 30,
            rest: 30,
            image: '/images/exercises/single-leg-stretch.svg',
            description: '仰卧，一腿伸直向天花板，另一腿屈膝拉向胸口，交替进行',
            caloriesPerSet: 10
          },
          {
            id: 3,
            name: '剪刀式',
            sets: 2,
            reps: 20,
            rest: 30,
            image: '/images/exercises/scissors.svg',
            description: '仰卧，双腿伸直向上，交替开合如剪刀，保持下背部贴地',
            caloriesPerSet: 11
          },
          {
            id: 4,
            name: '侧卧抬腿',
            sets: 2,
            reps: 15,
            rest: 30,
            image: '/images/exercises/side-leg-lift.svg',
            description: '侧卧，下方腿微屈，上方腿伸直向上抬起，控制缓慢下降',
            caloriesPerSet: 9
          }
        ]
      },
      {
        id: 7,
        title: '哑铃全身训练',
        steps: [
          {
            id: 1,
            name: '哑铃深蹲',
            sets: 3,
            reps: 12,
            rest: 60,
            image: '/images/exercises/dumbbell-squat.svg',
            description: '双手持哑铃，双脚与肩同宽，下蹲时保持背部挺直',
            caloriesPerSet: 18
          },
          {
            id: 2,
            name: '哑铃推举',
            sets: 3,
            reps: 10,
            rest: 60,
            image: '/images/exercises/dumbbell-press.svg',
            description: '双手持哑铃举至肩部，向上推举至手臂伸直',
            caloriesPerSet: 16
          },
          {
            id: 3,
            name: '哑铃划船',
            sets: 3,
            reps: 12,
            rest: 60,
            image: '/images/exercises/dumbbell-row.svg',
            description: '俯身，双手持哑铃，向上拉至腰部两侧',
            caloriesPerSet: 17
          },
          {
            id: 4,
            name: '哑铃弯举',
            sets: 3,
            reps: 15,
            rest: 45,
            image: '/images/exercises/dumbbell-curl.svg',
            description: '双手持哑铃，手臂自然下垂，向上弯举至肩部',
            caloriesPerSet: 14
          }
        ]
      },
      {
        id: 8,
        title: '晨间唤醒瑜伽',
        steps: [
          {
            id: 1,
            name: '山式',
            sets: 1,
            reps: 60,
            rest: 30,
            image: '/images/exercises/mountain-pose.svg',
            description: '站立，双脚并拢，双手自然下垂，保持身体挺直',
            caloriesPerSet: 5
          },
          {
            id: 2,
            name: '拜日式',
            sets: 2,
            reps: 5,
            rest: 30,
            image: '/images/exercises/sun-salutation.svg',
            description: '一套连续的瑜伽动作，从站立到俯卧再回到站立',
            caloriesPerSet: 8
          },
          {
            id: 3,
            name: '婴儿式',
            sets: 1,
            reps: 60,
            rest: 30,
            image: '/images/exercises/childs-pose.svg',
            description: '跪坐，上身前倾，额头触地，双臂向前伸展',
            caloriesPerSet: 4
          },
          {
            id: 4,
            name: '扭转式',
            sets: 2,
            reps: 30,
            rest: 30,
            image: '/images/exercises/spinal-twist.svg',
            description: '坐姿，一腿伸直，另一腿屈膝跨过，身体向后扭转',
            caloriesPerSet: 6
          }
        ]
      }
    ];
  },

  // 开始动作计时
  startExerciseTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    
    const timer = setInterval(() => {
      // 只有在未暂停且未休息时才计时动作时间
      if (!this.data.isPaused && !this.data.isResting) {
        const exerciseTimeElapsed = this.data.exerciseTimeElapsed + 1;
        const totalTimeElapsed = this.data.totalTimeElapsed + 1;
        const totalCalories = Math.floor(totalTimeElapsed / 60 * this.data.caloriesPerMinute);
        
        this.setData({
          exerciseTimeElapsed,
          exerciseTimeFormatted: this.formatTime(exerciseTimeElapsed),
          totalTimeElapsed,
          totalTimeFormatted: this.formatTime(totalTimeElapsed),
          totalCalories
        });
      }
      
      // 处理休息倒计时 - 修复：只有在未暂停时才倒计时
      if (!this.data.isPaused && this.data.isResting && this.data.restTimeLeft > 0) {
        const restTimeLeft = this.data.restTimeLeft - 1;
        this.setData({
          restTimeLeft
        });
        
        if (restTimeLeft === 0) {
          this.setData({
            isResting: false
          });
          
          wx.showToast({
            title: '休息结束，继续训练',
            icon: 'none',
            duration: 1500
          });
        }
      }
    }, 1000);
    
    this.setData({
      timer,
      isRunning: true,
      isPaused: false
    });
  },

  // 暂停/继续训练
  togglePause() {
    this.setData({
      isPaused: !this.data.isPaused
    });
    
    wx.showToast({
      title: this.data.isPaused ? '训练已暂停' : '继续训练',
      icon: 'none',
      duration: 1500
    });
  },

  // 跳过休息
  skipRest() {
    if (!this.data.isResting) {
      return;
    }
    
    this.setData({
      isResting: false,
      restTimeLeft: 0
    });
    
    wx.showToast({
      title: '已跳过休息，继续训练',
      icon: 'success',
      duration: 1500
    });
  },

  // 完成当前组
  completeSet() {
    const { currentExercise, currentSet, exercises, currentExerciseIndex } = this.data;
    
    if (!currentExercise) return;
    
    // 计算卡路里
    const setCalories = currentExercise.caloriesPerSet || 10;
    const totalCalories = this.data.totalCalories + setCalories;
    
    // 如果还有剩余组数
    if (currentSet < currentExercise.totalSets) {
      // 更新已完成组数
      const updatedExercises = [...exercises];
      updatedExercises[currentExerciseIndex].completedSets = currentSet;
      
      // 开始休息
      this.setData({
        currentSet: currentSet + 1,
        exercises: updatedExercises,
        isResting: true,
        restTimeLeft: currentExercise.rest || 60,
        totalCalories
      });
      
      wx.showToast({
        title: `第${currentSet}组完成，休息${currentExercise.rest}秒`,
        icon: 'success',
        duration: 2000
      });
    } else {
      // 完成当前动作的所有组
      this.completeExercise();
    }
  },

  // 完成当前动作
  completeExercise() {
    const { exercises, currentExerciseIndex, currentExercise } = this.data;
    
    // 标记当前动作为已完成
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].completed = true;
    updatedExercises[currentExerciseIndex].completedSets = currentExercise.totalSets;
    
    // 计算卡路里
    const setCalories = currentExercise.caloriesPerSet || 10;
    const totalCalories = this.data.totalCalories + setCalories;
    
    // 添加到已完成列表
    const completedExercises = [...this.data.completedExercises, currentExercise];
    
    // 检查是否还有下一个动作
    if (currentExerciseIndex < exercises.length - 1) {
      // 移动到下一个动作
      const nextIndex = currentExerciseIndex + 1;
      const nextExercise = updatedExercises[nextIndex];
      
      this.setData({
        exercises: updatedExercises,
        currentExerciseIndex: nextIndex,
        currentExercise: nextExercise,
        currentSet: 1,
        exerciseTimeElapsed: 0,
        exerciseTimeFormatted: '00:00',
        completedExercises,
        totalCalories
      });
      
      wx.showToast({
        title: `${currentExercise.name}完成！开始${nextExercise.name}`,
        icon: 'success',
        duration: 2000
      });
    } else {
      // 所有动作完成
      this.finishTraining();
    }
  },

  // 跳过当前动作
  skipExercise() {
    wx.showModal({
      title: '跳过动作',
      content: '确定要跳过当前动作吗？',
      success: (res) => {
        if (res.confirm) {
          const { exercises, currentExerciseIndex } = this.data;
          
          if (currentExerciseIndex < exercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            const nextExercise = exercises[nextIndex];
            
            this.setData({
              currentExerciseIndex: nextIndex,
              currentExercise: nextExercise,
              currentSet: 1,
              exerciseTimeElapsed: 0,
              exerciseTimeFormatted: '00:00',
              isResting: false,
              restTimeLeft: 0
            });
            
            wx.showToast({
              title: `已跳过，开始${nextExercise.name}`,
              icon: 'none',
              duration: 1500
            });
          } else {
            this.finishTraining();
          }
        }
      }
    });
  },

  // 完成训练
  finishTraining() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: null,
        isRunning: false
      });
    }
    
    const totalMinutes = Math.floor(this.data.totalTimeElapsed / 60);
    const totalSeconds = this.data.totalTimeElapsed % 60;
    const completedCount = this.data.exercises.filter(e => e.completed).length;
    const totalCount = this.data.exercises.length;
    
    wx.showModal({
      title: '训练完成',
      content: `完成动作：${completedCount}/${totalCount}\n训练时长：${totalMinutes}分${totalSeconds}秒\n消耗卡路里：${this.data.totalCalories}千卡`,
      confirmText: '保存',
      cancelText: '放弃',
      success: (res) => {
        if (res.confirm) {
          this.saveTrainingRecord();
          
          // 返回训练页面
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          // 用户选择放弃，直接返回
          wx.navigateBack();
        }
      }
    });
  },

  // 保存训练记录
  saveTrainingRecord() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    console.log('=== 开始保存训练记录 ===');
    console.log('保存日期:', dateStr);
    console.log('训练时长(秒):', this.data.totalTimeElapsed);
    console.log('消耗卡路里:', this.data.totalCalories);
    
    // 获取已有训练记录
    let trainingRecords = wx.getStorageSync('trainingRecords') || [];
    console.log('保存前的记录数:', trainingRecords.length);
    
    // 添加新记录
    const newRecord = {
      id: Date.now(),
      date: dateStr,
      duration: this.data.totalTimeElapsed,
      formatTime: this.formatTime(this.data.totalTimeElapsed),
      calories: this.data.totalCalories,
      type: 'plan',
      typeName: this.data.planTitle,
      planId: this.data.planId,
      completedExercises: this.data.exercises.filter(e => e.completed).length,
      totalExercises: this.data.exercises.length,
      timestamp: now.getTime()
    };
    
    console.log('新记录完整信息:', JSON.stringify(newRecord, null, 2));
    
    trainingRecords.push(newRecord);
    
    // 只保留最近30天的记录
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    trainingRecords = trainingRecords.filter(record => record.timestamp > thirtyDaysAgo);
    
    console.log('保存后的记录数:', trainingRecords.length);
    console.log('所有记录:', JSON.stringify(trainingRecords, null, 2));
    
    // 保存到本地存储
    wx.setStorageSync('trainingRecords', trainingRecords);
    
    console.log('训练记录已保存到本地存储');
    console.log('=== 保存训练记录完成 ===');
    
    // 不显示Toast，避免阻塞页面跳转
    // wx.showToast({
    //   title: '训练记录已保存',
    //   icon: 'success',
    //   duration: 1500
    // });
    
    // 触发首页数据更新
    console.log('触发首页数据更新');
    this.updateIndexPage();
    
    // 触发我的页面数据更新
    console.log('触发我的页面数据更新');
    this.updateProfilePage();
  },

  // 更新首页数据
  updateIndexPage() {
    console.log('=== updateIndexPage 被调用 ===');
    const pages = getCurrentPages();
    console.log('当前页面栈长度:', pages.length);
    console.log('当前页面栈:', pages.map(p => p.route));
    
    // 查找首页实例
    let foundIndex = false;
    for (let i = 0; i < pages.length; i++) {
      console.log(`检查页面 ${i}: ${pages[i].route}`);
      if (pages[i].route === 'pages/index/index') {
        console.log('✓ 找到首页实例');
        foundIndex = true;
        const indexPage = pages[i];
        if (indexPage.updateTrainingData) {
          console.log('✓ 调用首页的 updateTrainingData 方法');
          indexPage.updateTrainingData();
          console.log('✓ updateTrainingData 调用完成');
        } else {
          console.log('✗ 首页没有 updateTrainingData 方法');
        }
        break;
      }
    }
    
    if (!foundIndex) {
      console.log('✗ 未找到首页实例，首页可能未加载');
    }
    console.log('=== updateIndexPage 完成 ===');
  },

  // 更新我的页面数据
  updateProfilePage() {
    console.log('=== updateProfilePage 被调用 ===');
    const pages = getCurrentPages();
    console.log('当前页面栈长度:', pages.length);
    
    // 查找我的页面实例
    let foundProfile = false;
    for (let i = 0; i < pages.length; i++) {
      console.log(`检查页面 ${i}: ${pages[i].route}`);
      if (pages[i].route === 'pages/profile/profile') {
        console.log('✓ 找到我的页面实例');
        foundProfile = true;
        const profilePage = pages[i];
        
        // 重新加载训练记录
        if (profilePage.loadTrainingRecords) {
          console.log('✓ 调用 loadTrainingRecords');
          profilePage.loadTrainingRecords();
        }
        
        // 重新计算用户统计数据
        if (profilePage.calculateUserStats) {
          console.log('✓ 调用 calculateUserStats');
          profilePage.calculateUserStats();
        }
        
        // 重新生成日历
        if (profilePage.generateCalendar) {
          console.log('✓ 调用 generateCalendar');
          profilePage.generateCalendar();
        }
        
        // 重新计算本周数据
        if (profilePage.calculateWeeklyData) {
          console.log('✓ 调用 calculateWeeklyData');
          profilePage.calculateWeeklyData();
        }
        
        console.log('✓ 我的页面数据更新完成');
        break;
      }
    }
    
    if (!foundProfile) {
      console.log('✗ 未找到我的页面实例，页面可能未加载');
    }
    console.log('=== updateProfilePage 完成 ===');
  },

  // 格式化时间
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  // 显示/隐藏动作列表
  toggleExerciseList() {
    this.setData({
      showExerciseList: !this.data.showExerciseList
    });
  },

  // 跳转到指定动作
  goToExercise(e) {
    const index = e.currentTarget.dataset.index;
    const exercise = this.data.exercises[index];
    
    if (index < this.data.currentExerciseIndex) {
      wx.showToast({
        title: '该动作已完成',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      currentExerciseIndex: index,
      currentExercise: exercise,
      currentSet: exercise.completedSets + 1 || 1,
      exerciseTimeElapsed: 0,
      exerciseTimeFormatted: '00:00',
      showExerciseList: false,
      isResting: false,
      restTimeLeft: 0
    });
    
    wx.showToast({
      title: `切换到${exercise.name}`,
      icon: 'success'
    });
  },

  // 退出训练
  exitTraining() {
    console.log('exitTraining called');
    
    // 暂停计时器
    const wasRunning = this.data.isRunning;
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    
    const totalMinutes = Math.floor(this.data.totalTimeElapsed / 60);
    const totalSeconds = this.data.totalTimeElapsed % 60;
    const completedCount = this.data.exercises.filter(e => e.completed).length;
    const totalCount = this.data.exercises.length;
    
    console.log('Showing modal with progress:', {
      completedCount,
      totalCount,
      totalMinutes,
      totalSeconds,
      totalCalories: this.data.totalCalories
    });
    
    wx.showModal({
      title: '退出训练',
      content: `当前进度：\n完成动作：${completedCount}/${totalCount}\n训练时长：${totalMinutes}分${totalSeconds}秒\n消耗卡路里：${this.data.totalCalories}千卡\n\n确定要退出吗？进度将会保存。`,
      confirmText: '退出',
      cancelText: '继续',
      success: (res) => {
        console.log('Modal result:', res);
        if (res.confirm) {
          // 保存部分完成的记录（即使时长为0也保存）
          this.saveTrainingRecord();
          
          // 立即返回上一页
          wx.navigateBack({
            success: () => {
              console.log('成功返回上一页');
            },
            fail: (err) => {
              console.error('返回失败:', err);
              // 如果navigateBack失败，尝试跳转到训练页面
              wx.switchTab({
                url: '/pages/training/training'
              });
            }
          });
        } else {
          // 继续训练，重新启动计时器
          if (wasRunning) {
            this.startExerciseTimer();
          }
        }
      },
      fail: (err) => {
        console.error('Modal failed:', err);
        // 如果对话框失败，也要重新启动计时器
        if (wasRunning) {
          this.startExerciseTimer();
        }
      }
    });
  }
})
