const app = getApp();

Page({
  data: {
    exerciseIndex: 0,
    exercise: null,
    customWeight: '',
    customLeverArm: '',
    showAdvanced: false,
    calculatedTension: 0,
    calculatedMoment: 0,
    
    // 所有训练动作数据
    dumbbellData: [
      {
        exercise: '哑铃弯举',
        muscle: '肱二头肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.2',
        formulaNote: '标准力臂约0.3m，考虑肌肉杠杆比',
        leverArm: 0.3,
        data: [
          { weight: 2.5, moment: '7.35', tension: 3.0 },
          { weight: 5, moment: '14.7', tension: 6.0 },
          { weight: 7.5, moment: '22.05', tension: 9.0 },
          { weight: 10, moment: '29.4', tension: 12.0 },
          { weight: 12.5, moment: '36.75', tension: 15.0 },
          { weight: 15, moment: '44.1', tension: 18.0 },
          { weight: 17.5, moment: '51.45', tension: 21.0 },
          { weight: 20, moment: '58.8', tension: 24.0 }
        ],
        trainingTip: '建议：初学者5-10kg，进阶者12-20kg'
      },
      {
        exercise: '哑铃肩推',
        muscle: '三角肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.5',
        formulaNote: '标准力臂约0.35m，肩关节杠杆效率',
        leverArm: 0.35,
        data: [
          { weight: 2.5, moment: '8.58', tension: 3.75 },
          { weight: 5, moment: '17.15', tension: 7.5 },
          { weight: 7.5, moment: '25.73', tension: 11.25 },
          { weight: 10, moment: '34.3', tension: 15.0 },
          { weight: 12.5, moment: '42.88', tension: 18.75 },
          { weight: 15, moment: '51.45', tension: 22.5 },
          { weight: 17.5, moment: '60.03', tension: 26.25 },
          { weight: 20, moment: '68.6', tension: 30.0 }
        ],
        trainingTip: '建议：初学者3-8kg，进阶者10-20kg'
      },
      {
        exercise: '哑铃深蹲',
        muscle: '股四头肌',
        tensionFormula: '张力(kg) = 重量(kg) × 2.0',
        formulaNote: '标准力臂约0.4m，考虑身体重心和杠杆',
        leverArm: 0.4,
        data: [
          { weight: 5, moment: '19.6', tension: 10.0 },
          { weight: 10, moment: '39.2', tension: 20.0 },
          { weight: 15, moment: '58.8', tension: 30.0 },
          { weight: 20, moment: '78.4', tension: 40.0 },
          { weight: 25, moment: '98.0', tension: 50.0 },
          { weight: 30, moment: '117.6', tension: 60.0 },
          { weight: 35, moment: '137.2', tension: 70.0 },
          { weight: 40, moment: '156.8', tension: 80.0 }
        ],
        trainingTip: '建议：初学者10-20kg，进阶者25-40kg'
      },
      {
        exercise: '哑铃硬拉',
        muscle: '臀大肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.8',
        formulaNote: '标准力臂约0.45m，髋关节杠杆',
        leverArm: 0.45,
        data: [
          { weight: 10, moment: '44.1', tension: 18.0 },
          { weight: 15, moment: '66.15', tension: 27.0 },
          { weight: 20, moment: '88.2', tension: 36.0 },
          { weight: 25, moment: '110.25', tension: 45.0 },
          { weight: 30, moment: '132.3', tension: 54.0 },
          { weight: 35, moment: '154.35', tension: 63.0 },
          { weight: 40, moment: '176.4', tension: 72.0 },
          { weight: 50, moment: '220.5', tension: 90.0 }
        ],
        trainingTip: '建议：初学者15-25kg，进阶者30-50kg'
      },
      {
        exercise: '哑铃卧推',
        muscle: '胸大肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.3',
        formulaNote: '标准力臂约0.32m，胸部推举杠杆',
        leverArm: 0.32,
        data: [
          { weight: 5, moment: '15.68', tension: 6.5 },
          { weight: 10, moment: '31.36', tension: 13.0 },
          { weight: 15, moment: '47.04', tension: 19.5 },
          { weight: 20, moment: '62.72', tension: 26.0 },
          { weight: 25, moment: '78.4', tension: 32.5 },
          { weight: 30, moment: '94.08', tension: 39.0 },
          { weight: 35, moment: '109.76', tension: 45.5 },
          { weight: 40, moment: '125.44', tension: 52.0 }
        ],
        trainingTip: '建议：初学者8-15kg，进阶者20-35kg'
      },
      {
        exercise: '哑铃划船',
        muscle: '背阔肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.4',
        formulaNote: '标准力臂约0.38m，背部拉伸杠杆',
        leverArm: 0.38,
        data: [
          { weight: 5, moment: '18.62', tension: 7.0 },
          { weight: 10, moment: '37.24', tension: 14.0 },
          { weight: 15, moment: '55.86', tension: 21.0 },
          { weight: 20, moment: '74.48', tension: 28.0 },
          { weight: 25, moment: '93.1', tension: 35.0 },
          { weight: 30, moment: '111.72', tension: 42.0 },
          { weight: 35, moment: '130.34', tension: 49.0 },
          { weight: 40, moment: '148.96', tension: 56.0 }
        ],
        trainingTip: '建议：初学者8-15kg，进阶者20-35kg'
      },
      {
        exercise: '哑铃侧平举',
        muscle: '三角肌中束',
        tensionFormula: '张力(kg) = 重量(kg) × 2.2',
        formulaNote: '标准力臂约0.5m，侧举杠杆效应大',
        leverArm: 0.5,
        data: [
          { weight: 2, moment: '9.8', tension: 4.4 },
          { weight: 3, moment: '14.7', tension: 6.6 },
          { weight: 5, moment: '24.5', tension: 11.0 },
          { weight: 7, moment: '34.3', tension: 15.4 },
          { weight: 10, moment: '49.0', tension: 22.0 },
          { weight: 12, moment: '58.8', tension: 26.4 },
          { weight: 15, moment: '73.5', tension: 33.0 },
          { weight: 18, moment: '88.2', tension: 39.6 }
        ],
        trainingTip: '建议：初学者2-5kg，进阶者8-15kg'
      },
      {
        exercise: '哑铃臂屈伸',
        muscle: '肱三头肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.1',
        formulaNote: '标准力臂约0.28m，肘关节伸展',
        leverArm: 0.28,
        data: [
          { weight: 5, moment: '13.72', tension: 5.5 },
          { weight: 8, moment: '21.95', tension: 8.8 },
          { weight: 10, moment: '27.44', tension: 11.0 },
          { weight: 12, moment: '32.93', tension: 13.2 },
          { weight: 15, moment: '41.16', tension: 16.5 },
          { weight: 18, moment: '49.39', tension: 19.8 },
          { weight: 20, moment: '54.88', tension: 22.0 },
          { weight: 25, moment: '68.6', tension: 27.5 }
        ],
        trainingTip: '建议：初学者5-10kg，进阶者12-20kg'
      },
      {
        exercise: '哑铃弓步蹲',
        muscle: '股四头肌+臀大肌',
        tensionFormula: '张力(kg) = 重量(kg) × 1.9',
        formulaNote: '标准力臂约0.42m，复合动作杠杆',
        leverArm: 0.42,
        data: [
          { weight: 5, moment: '20.58', tension: 9.5 },
          { weight: 8, moment: '32.93', tension: 15.2 },
          { weight: 10, moment: '41.16', tension: 19.0 },
          { weight: 12, moment: '49.39', tension: 22.8 },
          { weight: 15, moment: '61.74', tension: 28.5 },
          { weight: 18, moment: '74.09', tension: 34.2 },
          { weight: 20, moment: '82.32', tension: 38.0 },
          { weight: 25, moment: '102.9', tension: 47.5 }
        ],
        trainingTip: '建议：初学者5-12kg，进阶者15-25kg'
      },
      {
        exercise: '哑铃提踵',
        muscle: '腓肠肌',
        tensionFormula: '张力(kg) = 重量(kg) × 0.8',
        formulaNote: '标准力臂约0.15m，踝关节跖屈',
        leverArm: 0.15,
        data: [
          { weight: 10, moment: '14.7', tension: 8.0 },
          { weight: 15, moment: '22.05', tension: 12.0 },
          { weight: 20, moment: '29.4', tension: 16.0 },
          { weight: 25, moment: '36.75', tension: 20.0 },
          { weight: 30, moment: '44.1', tension: 24.0 },
          { weight: 35, moment: '51.45', tension: 28.0 },
          { weight: 40, moment: '58.8', tension: 32.0 },
          { weight: 50, moment: '73.5', tension: 40.0 }
        ],
        trainingTip: '建议：初学者15-25kg，进阶者30-50kg'
      }
    ]
  },

  onLoad: function(options) {
    const exerciseIndex = parseInt(options.exerciseIndex) || 0;
    const exercise = this.data.dumbbellData[exerciseIndex];
    
    this.setData({
      exerciseIndex: exerciseIndex,
      exercise: exercise
    });
  },

  // 输入自定义重量
  onWeightInput: function(e) {
    this.setData({
      customWeight: e.detail.value
    });
  },

  // 输入自定义力臂
  onLeverArmInput: function(e) {
    this.setData({
      customLeverArm: e.detail.value
    });
  },

  // 切换高级选项显示
  toggleAdvanced: function() {
    this.setData({
      showAdvanced: !this.data.showAdvanced
    });
  },

  // 计算肌肉张力
  calculateTension: function() {
    const weight = parseFloat(this.data.customWeight);
    if (isNaN(weight) || weight <= 0) {
      wx.showToast({
        title: '请输入有效的重量',
        icon: 'none'
      });
      return;
    }

    const exercise = this.data.exercise;
    
    // 使用标准力臂或自定义力臂
    let leverArm = exercise.leverArm;
    if (this.data.customLeverArm && parseFloat(this.data.customLeverArm) > 0) {
      leverArm = parseFloat(this.data.customLeverArm);
    }
    
    // 计算弯矩：M = F × L = (重量 × 9.8) × 力臂
    const force = weight * 9.8; // 转换为牛顿
    const moment = force * leverArm; // 弯矩，单位：N·m
    
    // 根据简化公式计算肌肉张力（考虑肌肉杠杆比）
    let tension = 0;
    const exerciseName = exercise.exercise;
    
    const coefficientMap = {
      '哑铃弯举': 1.2,
      '哑铃肩推': 1.5,
      '哑铃深蹲': 2.0,
      '哑铃硬拉': 1.8,
      '哑铃卧推': 1.3,
      '哑铃划船': 1.4,
      '哑铃侧平举': 2.2,
      '哑铃臂屈伸': 1.1,
      '哑铃弓步蹲': 1.9,
      '哑铃提踵': 0.8
    };
    
    tension = weight * (coefficientMap[exerciseName] || 1.0);

    this.setData({
      calculatedTension: tension.toFixed(2),
      calculatedMoment: moment.toFixed(2)
    });

    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    });
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  }
});
