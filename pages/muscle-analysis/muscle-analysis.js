// pages/muscle-analysis/muscle-analysis.js
const app = getApp()

Page({
  data: {
    // 当前选中的标签页
    currentTab: 0,
    // 人体视图：front(正面) 或 back(背面)
    bodyView: 'front',
    // 触摸相关
    touchStartX: 0,
    touchStartY: 0,
    showSwipeHint: true,
    // 肌肉动作数据 - 完整的健身肌肉群
    muscleActions: [
      // 胸部肌群
      {
        id: 1,
        name: '胸部推举',
        muscleGroup: '胸大肌',
        fiberDirection: '从锁骨内侧、胸骨和肋软骨呈扇形向外延伸至肱骨大结节嵴',
        description: '胸大肌是胸部最大的肌肉，分为上束、中束、下束，肌纤维呈扇形分布，负责肩关节内收、内旋和前屈',
        image: '',
        modelPosition: { x: 50, y: 35, z: 0 },
        highlightMuscles: ['pectoralis']
      },
      {
        id: 2,
        name: '胸部夹胸',
        muscleGroup: '胸小肌',
        fiberDirection: '从第3-5肋骨向外上方延伸至肩胛骨喙突',
        description: '胸小肌位于胸大肌深层，肌纤维从肋骨向外上方延伸，协助肩胛骨前伸和下回旋',
        image: '',
        modelPosition: { x: 50, y: 35, z: 0 },
        highlightMuscles: ['pectoralis']
      },
      
      // 背部肌群
      {
        id: 3,
        name: '背部拉伸',
        muscleGroup: '背阔肌',
        fiberDirection: '从下胸椎、腰椎、骶骨和髂嵴呈扇形向上外侧延伸至肱骨小结节嵴',
        description: '背阔肌是背部最宽大的肌肉，肌纤维从脊柱向外上方呈扇形分布，负责肩关节内收、后伸和内旋',
        image: '',
        modelPosition: { x: 50, y: 40, z: 0 },
        highlightMuscles: ['latissimus']
      },
      {
        id: 4,
        name: '耸肩动作',
        muscleGroup: '斜方肌',
        fiberDirection: '上束：从枕骨和颈椎向外下方延伸至锁骨外1/3；中束：水平纤维；下束：向外上方延伸',
        description: '斜方肌分为上、中、下三束，肌纤维方向各异，负责肩胛骨的上提、内收和下回旋',
        image: '',
        modelPosition: { x: 50, y: 25, z: 0 },
        highlightMuscles: ['trapezius']
      },
      {
        id: 5,
        name: '肩胛内收',
        muscleGroup: '菱形肌',
        fiberDirection: '从第7颈椎至第5胸椎棘突向外下方延伸至肩胛骨内侧缘',
        description: '菱形肌位于斜方肌深层，肌纤维从脊柱向外下方延伸，负责肩胛骨内收和下回旋',
        image: '',
        modelPosition: { x: 50, y: 30, z: 0 },
        highlightMuscles: ['rhomboid']
      },
      {
        id: 6,
        name: '脊柱伸展',
        muscleGroup: '竖脊肌',
        fiberDirection: '从骶骨和髂嵴垂直向上延伸至枕骨，分为棘肌、最长肌、髂肋肌',
        description: '竖脊肌是脊柱两侧的长肌群，肌纤维垂直分布，负责脊柱伸展和维持躯干直立',
        image: '',
        modelPosition: { x: 50, y: 45, z: 0 },
        highlightMuscles: ['erector']
      },
      
      // 肩部肌群
      {
        id: 7,
        name: '肩外展',
        muscleGroup: '三角肌',
        fiberDirection: '前束：从锁骨外1/3向下；中束：从肩峰向下；后束：从肩胛冈向下，汇聚至肱骨三角肌粗隆',
        description: '三角肌分为前、中、后三束，肌纤维从不同起点向下汇聚，是上肢最大的肌肉，负责肩关节各方向运动',
        image: '',
        modelPosition: { x: 50, y: 30, z: 0 },
        highlightMuscles: ['deltoid']
      },
      {
        id: 8,
        name: '肩外旋',
        muscleGroup: '冈上肌',
        fiberDirection: '从肩胛骨冈上窝水平向外延伸至肱骨大结节上部',
        description: '冈上肌是旋转肌袖的一部分，肌纤维水平分布，负责肩关节外展的启动和稳定',
        image: '',
        modelPosition: { x: 50, y: 30, z: 0 },
        highlightMuscles: ['supraspinatus']
      },
      
      // 手臂肌群
      {
        id: 9,
        name: '肘屈曲',
        muscleGroup: '肱二头肌',
        fiberDirection: '长头：从肩胛骨盂上结节；短头：从喙突，向下汇聚至桡骨粗隆',
        description: '肱二头肌有长短两头，肌纤维从肩胛骨向下延伸，负责肘关节屈曲和前臂旋后',
        image: '',
        modelPosition: { x: 30, y: 40, z: 0 },
        highlightMuscles: ['biceps']
      },
      {
        id: 10,
        name: '肘伸展',
        muscleGroup: '肱三头肌',
        fiberDirection: '长头：从肩胛骨盂下结节；外侧头和内侧头：从肱骨后面，向下汇聚至尺骨鹰嘴',
        description: '肱三头肌有三个头，是上肢最大的肌肉，肌纤维向下汇聚，负责肘关节伸展',
        image: '',
        modelPosition: { x: 70, y: 40, z: 0 },
        highlightMuscles: ['triceps']
      },
      {
        id: 11,
        name: '腕屈曲',
        muscleGroup: '前臂屈肌群',
        fiberDirection: '从肱骨内上髁向下延伸至手掌，包括桡侧腕屈肌、尺侧腕屈肌等',
        description: '前臂屈肌群位于前臂前面，肌纤维纵向分布，负责腕关节和手指的屈曲运动',
        image: '',
        modelPosition: { x: 30, y: 50, z: 0 },
        highlightMuscles: ['forearm_flexors']
      },
      
      // 核心肌群
      {
        id: 12,
        name: '躯干屈曲',
        muscleGroup: '腹直肌',
        fiberDirection: '从耻骨联合和耻骨嵴垂直向上延伸至第5-7肋软骨和剑突',
        description: '腹直肌位于腹部正中，肌纤维垂直分布，被腱划分为多个肌腹，负责躯干屈曲',
        image: '',
        modelPosition: { x: 50, y: 50, z: 0 },
        highlightMuscles: ['rectus']
      },
      {
        id: 13,
        name: '躯干旋转',
        muscleGroup: '腹外斜肌',
        fiberDirection: '从下8个肋骨向内下方斜行延伸至髂嵴、腹股沟韧带和腹白线',
        description: '腹外斜肌位于腹部两侧，肌纤维向内下方斜行，负责躯干屈曲和同侧侧屈、对侧旋转',
        image: '',
        modelPosition: { x: 40, y: 50, z: 0 },
        highlightMuscles: ['external_oblique']
      },
      {
        id: 14,
        name: '深层稳定',
        muscleGroup: '腹内斜肌',
        fiberDirection: '从髂嵴、腹股沟韧带向内上方延伸至下3个肋骨和腹白线',
        description: '腹内斜肌位于腹外斜肌深层，肌纤维向内上方延伸，与腹外斜肌纤维方向垂直',
        image: '',
        modelPosition: { x: 40, y: 50, z: 0 },
        highlightMuscles: ['internal_oblique']
      },
      {
        id: 15,
        name: '核心稳定',
        muscleGroup: '腹横肌',
        fiberDirection: '从下6个肋软骨、腰筋膜和髂嵴水平环绕至腹白线',
        description: '腹横肌是最深层的腹肌，肌纤维水平环绕，如天然腰带，负责腹内压调节和脊柱稳定',
        image: '',
        modelPosition: { x: 50, y: 50, z: 0 },
        highlightMuscles: ['transverse_abdominis']
      },
      
      // 臀部肌群
      {
        id: 16,
        name: '髋伸展',
        muscleGroup: '臀大肌',
        fiberDirection: '从髂骨翼后部、骶骨和尾骨向外下方延伸至股骨臀肌粗隆和髂胫束',
        description: '臀大肌是人体最大最强的肌肉，肌纤维向外下方延伸，负责髋关节伸展和外旋',
        image: '',
        modelPosition: { x: 50, y: 60, z: 0 },
        highlightMuscles: ['gluteus']
      },
      {
        id: 17,
        name: '髋外展',
        muscleGroup: '臀中肌',
        fiberDirection: '从髂骨翼外面呈扇形向下延伸至股骨大转子',
        description: '臀中肌位于臀大肌深层，肌纤维呈扇形分布，负责髋关节外展和稳定骨盆',
        image: '',
        modelPosition: { x: 45, y: 60, z: 0 },
        highlightMuscles: ['gluteus_medius']
      },
      
      // 大腿肌群
      {
        id: 18,
        name: '膝伸展',
        muscleGroup: '股四头肌',
        fiberDirection: '股直肌：从髂前下棘；股外侧肌、股内侧肌、股中间肌：从股骨，向下汇聚至胫骨粗隆',
        description: '股四头肌由四个头组成，是大腿前面最大的肌群，肌纤维向下汇聚，负责膝关节伸展',
        image: '',
        modelPosition: { x: 50, y: 70, z: 0 },
        highlightMuscles: ['quadriceps']
      },
      {
        id: 19,
        name: '膝屈曲',
        muscleGroup: '腘绳肌',
        fiberDirection: '股二头肌、半腱肌、半膜肌从坐骨结节和股骨向下延伸至胫骨和腓骨',
        description: '腘绳肌位于大腿后面，包括三块肌肉，肌纤维纵向分布，负责膝关节屈曲和髋关节伸展',
        image: '',
        modelPosition: { x: 50, y: 75, z: 0 },
        highlightMuscles: ['hamstrings']
      },
      {
        id: 20,
        name: '大腿内收',
        muscleGroup: '内收肌群',
        fiberDirection: '从耻骨和坐骨向外侧延伸至股骨内侧，包括大收肌、长收肌、短收肌等',
        description: '内收肌群位于大腿内侧，肌纤维从骨盆向外侧延伸，负责髋关节内收和稳定',
        image: '',
        modelPosition: { x: 50, y: 70, z: 0 },
        highlightMuscles: ['adductors']
      },
      
      // 小腿肌群
      {
        id: 21,
        name: '踝跖屈',
        muscleGroup: '腓肠肌',
        fiberDirection: '内外侧头从股骨内外侧髁向下汇聚，与比目鱼肌共同形成跟腱止于跟骨',
        description: '腓肠肌是小腿后面浅层的大肌肉，有内外两头，肌纤维向下汇聚，负责踝关节跖屈',
        image: '',
        modelPosition: { x: 50, y: 85, z: 0 },
        highlightMuscles: ['gastrocnemius']
      },
      {
        id: 22,
        name: '深层跖屈',
        muscleGroup: '比目鱼肌',
        fiberDirection: '从胫骨后面和腓骨向下延伸，与腓肠肌汇合形成跟腱',
        description: '比目鱼肌位于腓肠肌深层，肌纤维向下延伸，是持久性抗重力肌，负责维持站立姿势',
        image: '',
        modelPosition: { x: 50, y: 85, z: 0 },
        highlightMuscles: ['soleus']
      },
      {
        id: 23,
        name: '踝背屈',
        muscleGroup: '胫骨前肌',
        fiberDirection: '从胫骨外侧面向下内侧延伸至第一跖骨和内侧楔骨',
        description: '胫骨前肌位于小腿前面，肌纤维向下内侧延伸，负责踝关节背屈和足内翻',
        image: '',
        modelPosition: { x: 48, y: 85, z: 0 },
        highlightMuscles: ['tibialis_anterior']
      }
    ],
    // 当前选中的动作
    selectedAction: 0,
    // 哑铃重量和肌肉张力数据 - 扩展更多训练动作
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
    ],
    // 当前选中的练习
    selectedExercise: 0,
    // 自定义重量输入
    customWeight: '',
    // 自定义力臂输入
    customLeverArm: '',
    // 显示高级选项
    showAdvanced: false,
    // 计算结果
    calculatedTension: 0,
    calculatedMoment: 0,
    // 模型加载状态
    isModelLoading: false,
    // 视频加载错误状态
    videoLoadError: false,
    // 动画相关
    isAnimating: false,
    animationProgress: 0,
    // 肌肉详情
    showMuscleDetail: false,
    selectedMuscle: '',
    muscleDetails: {
      'deltoid': {
        name: '三角肌',
        function: '肩关节外展、前屈、后伸',
        origin: '锁骨外侧1/3、肩峰、肩胛冈',
        insertion: '肱骨三角肌粗隆',
        innervation: '腋神经',
        bloodSupply: '旋肱后动脉、胸肩峰动脉'
      },
      'pectoralis': {
        name: '胸大肌',
        function: '肩关节内收、内旋、前屈',
        origin: '锁骨内侧半、胸骨、肋软骨',
        insertion: '肱骨大结节嵴',
        innervation: '胸前神经',
        bloodSupply: '胸肩峰动脉、胸外侧动脉'
      },
      'latissimus': {
        name: '背阔肌',
        function: '肩关节内收、后伸、内旋',
        origin: '下胸椎、腰椎、骶骨、髂嵴',
        insertion: '肱骨小结节嵴',
        innervation: '胸背神经',
        bloodSupply: '胸背动脉、肋间后动脉'
      },
      'trapezius': {
        name: '斜方肌',
        function: '肩胛骨上提、内收、上回旋',
        origin: '枕骨、颈椎和胸椎棘突',
        insertion: '锁骨外1/3、肩峰、肩胛冈',
        innervation: '副神经、颈丛',
        bloodSupply: '枕动脉、颈横动脉'
      },
      'rhomboid': {
        name: '菱形肌',
        function: '肩胛骨内收、下回旋',
        origin: '第7颈椎至第5胸椎棘突',
        insertion: '肩胛骨内侧缘',
        innervation: '肩胛背神经',
        bloodSupply: '颈横动脉'
      },
      'erector': {
        name: '竖脊肌',
        function: '脊柱伸展、维持躯干直立',
        origin: '骶骨、髂嵴、腰椎',
        insertion: '肋骨、胸椎、颈椎、枕骨',
        innervation: '脊神经后支',
        bloodSupply: '肋间后动脉、腰动脉'
      },
      'supraspinatus': {
        name: '冈上肌',
        function: '肩关节外展启动、稳定',
        origin: '肩胛骨冈上窝',
        insertion: '肱骨大结节上部',
        innervation: '肩胛上神经',
        bloodSupply: '肩胛上动脉'
      },
      'rectus': {
        name: '腹直肌',
        function: '躯干屈曲、骨盆后倾',
        origin: '耻骨联合、耻骨嵴',
        insertion: '第5-7肋软骨、剑突',
        innervation: '肋间神经',
        bloodSupply: '腹壁上动脉、腹壁下动脉'
      },
      'external_oblique': {
        name: '腹外斜肌',
        function: '躯干屈曲、同侧侧屈、对侧旋转',
        origin: '下8个肋骨',
        insertion: '髂嵴、腹股沟韧带、腹白线',
        innervation: '肋间神经、髂腹下神经',
        bloodSupply: '肋间动脉、腹壁浅动脉'
      },
      'internal_oblique': {
        name: '腹内斜肌',
        function: '躯干屈曲、同侧侧屈和旋转',
        origin: '髂嵴、腹股沟韧带',
        insertion: '下3个肋骨、腹白线',
        innervation: '肋间神经、髂腹下神经',
        bloodSupply: '肋间动脉、腹壁深动脉'
      },
      'transverse_abdominis': {
        name: '腹横肌',
        function: '腹内压调节、脊柱稳定',
        origin: '下6个肋软骨、腰筋膜、髂嵴',
        insertion: '腹白线',
        innervation: '肋间神经、髂腹下神经',
        bloodSupply: '肋间动脉、腹壁深动脉'
      },
      'gluteus': {
        name: '臀大肌',
        function: '髋关节伸展、外旋',
        origin: '髂骨翼后部、骶骨背面',
        insertion: '臀肌粗隆、髂胫束',
        innervation: '臀下神经',
        bloodSupply: '臀上动脉、臀下动脉'
      },
      'gluteus_medius': {
        name: '臀中肌',
        function: '髋关节外展、骨盆稳定',
        origin: '髂骨翼外面',
        insertion: '股骨大转子',
        innervation: '臀上神经',
        bloodSupply: '臀上动脉'
      },
      'biceps': {
        name: '肱二头肌',
        function: '肘关节屈曲、前臂旋后',
        origin: '肩胛骨盂上结节、喙突',
        insertion: '桡骨粗隆',
        innervation: '肌皮神经',
        bloodSupply: '肱动脉'
      },
      'triceps': {
        name: '肱三头肌',
        function: '肘关节伸展',
        origin: '肩胛骨盂下结节、肱骨后面',
        insertion: '尺骨鹰嘴',
        innervation: '桡神经',
        bloodSupply: '肱深动脉'
      },
      'forearm_flexors': {
        name: '前臂屈肌群',
        function: '腕关节和手指屈曲',
        origin: '肱骨内上髁',
        insertion: '腕骨、掌骨、指骨',
        innervation: '正中神经、尺神经',
        bloodSupply: '尺动脉、桡动脉'
      },
      'quadriceps': {
        name: '股四头肌',
        function: '膝关节伸展、髋关节屈曲',
        origin: '髂骨、股骨',
        insertion: '胫骨粗隆',
        innervation: '股神经',
        bloodSupply: '股动脉'
      },
      'hamstrings': {
        name: '腘绳肌',
        function: '膝关节屈曲、髋关节伸展',
        origin: '坐骨结节、股骨',
        insertion: '胫骨、腓骨',
        innervation: '坐骨神经',
        bloodSupply: '股深动脉'
      },
      'adductors': {
        name: '内收肌群',
        function: '髋关节内收、稳定',
        origin: '耻骨、坐骨',
        insertion: '股骨内侧',
        innervation: '闭孔神经',
        bloodSupply: '闭孔动脉、股深动脉'
      },
      'gastrocnemius': {
        name: '腓肠肌',
        function: '踝关节跖屈、膝关节屈曲',
        origin: '股骨内外侧髁',
        insertion: '跟骨（通过跟腱）',
        innervation: '胫神经',
        bloodSupply: '腘动脉'
      },
      'soleus': {
        name: '比目鱼肌',
        function: '踝关节跖屈、维持站立',
        origin: '胫骨后面、腓骨',
        insertion: '跟骨（通过跟腱）',
        innervation: '胫神经',
        bloodSupply: '腘动脉、胫后动脉'
      },
      'tibialis_anterior': {
        name: '胫骨前肌',
        function: '踝关节背屈、足内翻',
        origin: '胫骨外侧面',
        insertion: '第一跖骨、内侧楔骨',
        innervation: '腓深神经',
        bloodSupply: '胫前动脉'
      }
    }
  },

  onLoad: function (options) {
    // 页面加载完成
    this.setData({
      currentTab: this.data.currentTab || 0,
      selectedExercise: this.data.selectedExercise || 0
    });
  },

  // 切换标签页
  switchTab: function(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      currentTab: index
    });
  },

  // 选择肌肉动作
  selectAction: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedAction: index,
      isAnimating: true,
      animationProgress: 0
    });
    
    // 执行动画
    this.animateModelHighlight();
  },

  // 3D模型高亮动画
  animateModelHighlight: function() {
    const action = this.data.muscleActions[this.data.selectedAction];
    const highlightMuscles = action.highlightMuscles;
    
    // 模拟动画过程
    let progress = 0;
    const animationInterval = setInterval(() => {
      progress += 5;
      this.setData({
        animationProgress: progress
      });
      
      if (progress >= 100) {
        clearInterval(animationInterval);
        this.setData({
          isAnimating: false
        });
      }
    }, 50);
  },


  // 点击肌肉显示详情
  showMuscleInfo: function(e) {
    const muscle = e.currentTarget.dataset.muscle;
    this.setData({
      showMuscleDetail: true,
      selectedMuscle: muscle
    });
  },

  // 关闭肌肉详情
  hideMuscleDetail: function() {
    this.setData({
      showMuscleDetail: false
    });
  },

  // 选择练习
  selectExercise: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedExercise: index,
      customWeight: '',
      customLeverArm: '',
      calculatedTension: 0,
      calculatedMoment: 0
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

    const exercise = this.data.dumbbellData[this.data.selectedExercise];
    
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
    
    if (exerciseName === '哑铃弯举') {
      tension = weight * 1.2;
    } else if (exerciseName === '哑铃肩推') {
      tension = weight * 1.5;
    } else if (exerciseName === '哑铃深蹲') {
      tension = weight * 2.0;
    } else if (exerciseName === '哑铃硬拉') {
      tension = weight * 1.8;
    } else if (exerciseName === '哑铃卧推') {
      tension = weight * 1.3;
    } else if (exerciseName === '哑铃划船') {
      tension = weight * 1.4;
    } else if (exerciseName === '哑铃侧平举') {
      tension = weight * 2.2;
    } else if (exerciseName === '哑铃臂屈伸') {
      tension = weight * 1.1;
    } else if (exerciseName === '哑铃弓步蹲') {
      tension = weight * 1.9;
    } else if (exerciseName === '哑铃提踵') {
      tension = weight * 0.8;
    } else {
      // 默认系数
      tension = weight * 1.0;
    }

    this.setData({
      calculatedTension: tension.toFixed(2),
      calculatedMoment: moment.toFixed(2)
    });

    wx.showToast({
      title: `弯矩: ${moment.toFixed(2)}N·m`,
      icon: 'none',
      duration: 2000
    });
  },

  // 切换人体视图（正面/背面）
  switchBodyView(e) {
    const view = e.currentTarget.dataset.view;
    this.setData({
      bodyView: view,
      showSwipeHint: false
    });
  },

  // 视频播放事件
  onVideoPlay(e) {
    console.log('✅ 视频开始播放', e.detail);
  },

  onVideoPause(e) {
    console.log('⏸ 视频暂停', e.detail);
  },

  onVideoEnded(e) {
    console.log('✅ 视频播放结束', e.detail);
  },

  onVideoWaiting(e) {
    console.log('⏳ 视频加载中...', e.detail);
  },

  onVideoLoaded(e) {
    console.log('✅ 视频元数据加载完成', e.detail);
  },

  onVideoError(e) {
    console.error('❌ 视频加载失败', e.detail);
    
    // 设置错误状态
    this.setData({
      videoLoadError: true
    });
    
    let errorMsg = '视频加载失败';
    let suggestion = '';
    
    // 根据错误类型提供具体信息
    if (e.detail.errMsg) {
      const errMsg = e.detail.errMsg;
      
      if (errMsg.includes('ERR_NAME_NOT_RESOLVED') || errMsg.includes('ERR_FAILED')) {
        errorMsg = '无法连接到视频服务器';
        suggestion = '可能的原因：\n\n1. 域名未配置白名单\n   需在微信公众平台配置：\n   jrchbzzwgqndaxsckvub.supabase.co\n\n2. 网络连接问题\n   请检查网络连接\n\n3. 开发者工具限制\n   建议在真机上测试\n\n配置路径：\n微信公众平台 > 开发 > 开发管理 > 开发设置 > 服务器域名 > request合法域名';
      } else if (errMsg.includes('SRC_NOT_SUPPORTED') || errMsg.includes('Format error')) {
        errorMsg = '视频格式错误';
        suggestion = '请确保视频格式为MP4，编码为H.264';
      } else if (errMsg.includes('DECODE')) {
        errorMsg = '视频解码失败';
        suggestion = '请检查视频编码格式';
      }
    }
    
    console.log('错误提示:', errorMsg, suggestion);
  },

  // 显示视频配置说明
  showVideoConfig() {
    wx.showModal({
      title: '视频域名配置',
      content: '请在微信公众平台配置以下域名到request合法域名：\n\njrchbzzwgqndaxsckvub.supabase.co\n\n配置路径：\n开发 > 开发管理 > 开发设置 > 服务器域名\n\n配置后需要重新编译小程序。',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '复制域名',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'jrchbzzwgqndaxsckvub.supabase.co',
            success: () => {
              wx.showToast({
                title: '域名已复制',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 触摸开始
  onTouchStart(e) {
    this.setData({
      touchStartX: e.touches[0].pageX,
      touchStartY: e.touches[0].pageY
    });
  },

  // 触摸移动
  onTouchMove(e) {
    // 可以在这里添加实时跟随手指的动画效果
  },

  // 触摸结束
  onTouchEnd(e) {
    const touchEndX = e.changedTouches[0].pageX;
    const touchEndY = e.changedTouches[0].pageY;
    const deltaX = touchEndX - this.data.touchStartX;
    const deltaY = touchEndY - this.data.touchStartY;

    // 判断是否为有效的水平滑动（水平距离大于50px，且水平距离大于垂直距离）
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        // 向右滑动 - 切换到正面
        this.setData({
          bodyView: 'front',
          showSwipeHint: false
        });
      } else {
        // 向左滑动 - 切换到背面
        this.setData({
          bodyView: 'back',
          showSwipeHint: false
        });
      }
    }
  }
})