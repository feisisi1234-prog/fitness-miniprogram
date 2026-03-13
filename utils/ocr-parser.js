// OCR文字识别和训练计划解析工具

/**
 * 解析OCR识别的文字，提取训练计划信息
 * @param {string} text - OCR识别的文字
 * @returns {object} - 解析后的训练计划
 */
function parseTrainingPlan(text) {
  console.log('=== 开始解析训练计划 ===');
  console.log('原始文字:', text);
  
  // 清理文本 - 保留换行符
  const cleanText = text.trim();
  
  // 提取计划标题
  const title = extractTitle(cleanText);
  
  // 提取计划类别
  const category = extractCategory(cleanText);
  
  // 提取训练动作
  const exercises = extractExercises(cleanText);
  
  const plan = {
    title: title || '扫描的训练计划',
    category: category || '力量训练',
    exercises: exercises.length > 0 ? exercises : getDefaultExercises()
  };
  
  console.log('解析结果:', plan);
  console.log('=== 解析完成 ===');
  
  return plan;
}

/**
 * 提取计划标题
 */
function extractTitle(text) {
  // 常见的标题关键词
  const titlePatterns = [
    /(?:训练计划|计划|训练)[：:]\s*([^\n]+)/i,
    /^([^：:\n]{1,20})[训练计划]/,
    /^([胸背腿肩臂腹][部]?)\s/,  // 单字部位：胸、背、腿、肩、臂、腹
    /^([一-龥]{1,20})(?:\s|$)/  // 行首的中文（1-20个字）
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim();
      // 过滤掉太长或包含数字的标题
      if (title.length <= 20 && !/\d{2,}/.test(title)) {
        return title;
      }
    }
  }
  
  return null;
}

/**
 * 提取计划类别
 */
function extractCategory(text) {
  const categories = {
    '力量训练': ['力量', '肌肉', '增肌', '塑形', '深蹲', '卧推', '硬拉', '哑铃', '杠铃', '臀腿', '胸', '背', '肩', '臂'],
    '有氧运动': ['有氧', '跑步', '跳绳', '燃脂', 'HIIT', '开合跳', '波比', '登山', '减脂', '心肺'],
    '柔韧性': ['柔韧', '拉伸', '瑜伽', '放松', '灵活', '伸展']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  return '力量训练';
}

/**
 * 提取训练动作 - 超级增强版
 */
function extractExercises(text) {
  const exercises = [];
  
  // 超级扩展的动作名称库（包含更多变体、错别字、简写）
  const exerciseDatabase = {
    // 下肢动作
    '深蹲': ['深蹲', '蹲起', '下蹲', '蹲', '深蹲起', '深蹲跳', 'squat', 'squats', '深墩', '深顿'],
    '硬拉': ['硬拉', '直腿硬拉', '罗马尼亚硬拉', 'deadlift', 'deadlifts', '硬啦'],
    '弓步蹲': ['弓步蹲', '箭步蹲', '弓箭步', '弓步', '箭步', 'lunge', 'lunges', '弓布蹲'],
    '臀桥': ['臀桥', '桥式', '臀冲', '臀部桥', 'bridge', 'glute bridge', '臀轿'],
    '腿举': ['腿举', '蹬腿', '腿推', 'leg press', '退举'],
    
    // 胸部动作（新增）
    '坐姿下斜推': ['坐姿下斜推', '下斜推', '坐姿下推', '下斜卧推'],
    '上斜推': ['上斜推', '上斜卧推', '上斜推胸'],
    '平板推': ['平板推', '平推', '平板卧推'],
    '飞鸟': ['飞鸟', '哑铃飞鸟', '夹胸'],
    '绳索夹胸': ['绳索夹胸', '夹胸', '龙门架夹胸'],
    
    // 上肢动作
    '卧推': ['卧推', '平板卧推', '推胸', '胸推', 'bench press', 'bench', '握推', '卧堆'],
    '引体向上': ['引体向上', '拉单杠', '单杠', '引体', 'pull up', 'pullup', 'chin up', '引休向上'],
    '俯卧撑': ['俯卧撑', '伏地挺身', '掌上压', '俯卧', 'push up', 'pushup', 'push-up', '俯握撑', '伏卧撑'],
    '肩推': ['肩推', '推肩', '肩上推举', '肩部推举', 'shoulder press', 'overhead press', '肩堆'],
    '侧平举': ['侧平举', '侧举', '侧平', 'lateral raise', 'side raise', '测平举'],
    '二头弯举': ['二头弯举', '弯举', '肱二头', '二头', 'curl', 'bicep curl', '二投弯举'],
    '三头屈伸': ['三头屈伸', '臂屈伸', '肱三头', '三头', 'extension', 'tricep extension', '三投屈伸'],
    
    // 背部动作（新增）
    '高位下拉': ['高位下拉', '下拉', '背阔肌下拉'],
    '坐姿划船': ['坐姿划船', '划船', '坐姿拉'],
    '杠铃划船': ['杠铃划船', '俯身划船'],
    '直臂下压': ['直臂下压', '直臂下拉'],
    
    // 核心动作
    '平板支撑': ['平板支撑', '平板', '支撑', 'plank', 'planks', '平版支撑', '平板之撑'],
    '仰卧起坐': ['仰卧起坐', '起坐', '仰卧', 'sit up', 'situp', 'sit-up', '仰握起坐'],
    '卷腹': ['卷腹', '腹部卷曲', '卷', 'crunch', 'crunches', '卷复'],
    '俄罗斯转体': ['俄罗斯转体', '转体', '俄式转体', 'russian twist', '俄罗斯专体'],
    
    // 有氧动作
    '开合跳': ['开合跳', '跳跃', '开合', 'jumping jack', 'jumping jacks', 'jack', '开和跳'],
    '波比跳': ['波比跳', '波比', '立卧撑', 'burpee', 'burpees', '波比条', '波比调'],
    '高抬腿': ['高抬腿', '抬腿', '高抬', 'high knee', 'high knees', '高太腿'],
    '登山跑': ['登山跑', '登山者', '登山', 'mountain climber', 'climber', '登山炮'],
    '跳绳': ['跳绳', '绳跳', '跳', 'jump rope', 'rope jump', '跳生'],
    '跑步': ['跑步', '慢跑', '跑', 'run', 'running', 'jog', 'jogging', '炮步'],
    
    // 瑜伽动作
    '猫牛式': ['猫牛式', '猫牛', '猫式', '牛式', 'cat cow', 'cat-cow'],
    '下犬式': ['下犬式', '下犬', '下狗式', 'downward dog', 'down dog'],
    '战士式': ['战士式', '战士', '战士一式', '战士二式', 'warrior', 'warrior pose'],
    '树式': ['树式', '树', '树姿', 'tree', 'tree pose'],
    '婴儿式': ['婴儿式', '婴儿', '儿童式', 'child', 'child pose', 'childs pose']
  };
  
  // 预处理：统一格式，去除干扰字符
  const preprocessedText = text
    .replace(/[，。、；！？""''（）【】《》]/g, ' ') // 替换中文标点为空格（保留冒号）
    .replace(/\s+/g, ' ') // 多个空格合并为一个
    .trim();
  
  // 预处理：智能分割文本
  let processedText = preprocessedText;
  
  // 如果文本很长且没有换行符，尝试智能分割
  const lines = processedText.split(/[\n\r]+/);
  if (lines.length === 1 && processedText.length > 100) {
    console.log('检测到长文本，尝试智能分割...');
    // 在常见分隔符处分割：组数标记后面
    processedText = processedText
      .replace(/(\d+\s*秒)/g, '$1\n')  // 在"秒"后换行
      .replace(/([一-龥]{2,8})\s+(\d+\s*[组組])/g, '\n$1 $2')  // 在动作名称前换行
      .replace(/休息\s*\d+\s*秒/g, match => match + '\n');  // 在休息时间后换行
    console.log('分割后的文本:', processedText);
  }
  
  // 分行处理
  const finalLines = processedText.split(/[\n\r]+/);
  
  console.log(`共${finalLines.length}行待处理`);
  
  for (let i = 0; i < finalLines.length; i++) {
    const line = finalLines[i].trim();
    if (!line || line.length < 2) continue;
    
    console.log(`处理第${i + 1}行: "${line}"`);
    
    // 跳过标题行和无关内容（但不跳过长行，因为可能包含多个动作）
    if (line.includes('训练计划') || 
        line.includes('计划名称') || 
        (line.includes('动作') && line.includes('组数'))) {
      console.log('跳过标题行');
      continue;
    }
    
    let exerciseName = null;
    let sets = 3;
    let reps = 12;
    let restTime = 60;
    
    // 方法1: 精确匹配（优先级最高）
    for (const [standardName, variants] of Object.entries(exerciseDatabase)) {
      for (const variant of variants) {
        // 精确匹配（整词匹配）
        const regex = new RegExp(`\\b${variant}\\b`, 'i');
        if (regex.test(line)) {
          exerciseName = standardName;
          console.log(`精确匹配到: ${variant} -> ${standardName}`);
          break;
        }
      }
      if (exerciseName) break;
    }
    
    // 方法2: 模糊匹配（包含即可）
    if (!exerciseName) {
      for (const [standardName, variants] of Object.entries(exerciseDatabase)) {
        for (const variant of variants) {
          if (line.toLowerCase().includes(variant.toLowerCase())) {
            exerciseName = standardName;
            console.log(`模糊匹配到: ${variant} -> ${standardName}`);
            break;
          }
        }
        if (exerciseName) break;
      }
    }
    
    // 方法3: 提取行首的中文词组
    if (!exerciseName) {
      const nameMatch = line.match(/^([一-龥]{2,8})/);
      if (nameMatch) {
        const extractedName = nameMatch[1];
        // 检查是否包含常见动作关键字
        const actionKeywords = ['蹲', '跳', '推', '拉', '举', '撑', '跑', '卧', '式', '桥', '腿', '臂', '肩', '腹'];
        if (actionKeywords.some(keyword => extractedName.includes(keyword))) {
          exerciseName = extractedName;
          console.log(`提取行首词组: ${extractedName}`);
        }
      }
    }
    
    // 方法4: 提取英文词组
    if (!exerciseName) {
      const englishMatch = line.match(/\b([a-z]+(?:\s+[a-z]+){0,2})\b/i);
      if (englishMatch) {
        exerciseName = englishMatch[1];
        console.log(`提取英文词组: ${exerciseName}`);
      }
    }
    
    if (exerciseName) {
      // 提取所有数字
      const allNumbers = line.match(/\d+/g);
      console.log(`提取到的数字: ${allNumbers ? allNumbers.join(', ') : '无'}`);
      
      // 提取组数 - 超级增强版
      const setsPatterns = [
        /(\d+)\s*[组組组]/,
        /(\d+)\s*sets?/i,
        /(\d+)\s*[xX×*]/,
        /^(\d+)\s+\d+/, // 开头的数字通常是组数
      ];
      
      let setsFound = false;
      for (const pattern of setsPatterns) {
        const match = line.match(pattern);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 1 && value <= 10) { // 组数通常在1-10之间
            sets = value;
            setsFound = true;
            console.log(`识别组数: ${sets}`);
            break;
          }
        }
      }
      
      // 提取次数/时长 - 超级增强版
      const repsPatterns = [
        /[xX×*]\s*(\d+)(?:\+\d+)?/, // x后面的数字，支持10+5格式
        /(\d+)\+\d+/, // 组内暂停格式：10+5
        /(\d+)\s*[次个reps]/i,
        /(\d+)\s*秒/,
        /(\d+)\s*s(?:ec)?(?!.*休息)/i, // s但不是休息时间
        /组.*?(\d+)/, // "组"后面的数字
      ];
      
      let repsFound = false;
      for (const pattern of repsPatterns) {
        const match = line.match(pattern);
        if (match) {
          const value = parseInt(match[1]);
          // 次数通常在5-100之间，时长通常在10-300之间
          if (value >= 5 && value <= 300) {
            reps = value;
            repsFound = true;
            console.log(`识别次数/时长: ${reps}`);
            break;
          }
        }
      }
      
      // 如果没有找到次数，尝试从所有数字中推断
      if (!repsFound && allNumbers && allNumbers.length >= 2) {
        const secondNumber = parseInt(allNumbers[1]);
        if (secondNumber >= 5 && secondNumber <= 100) {
          reps = secondNumber;
          console.log(`推断次数: ${reps}`);
        }
      }
      
      // 提取休息时间 - 超级增强版
      const restPatterns = [
        /(?:休息|间歇|rest)\s*[：:]?\s*(\d+)\s*[秒s]/i,
        /(\d+)\s*[秒s]\s*(?:休息|间歇)/i,
        /(\d+)\s*s\s*rest/i,
        /rest\s*(\d+)/i,
      ];
      
      let restFound = false;
      for (const pattern of restPatterns) {
        const match = line.match(pattern);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 10 && value <= 300) { // 休息时间通常在10-300秒之间
            restTime = value;
            restFound = true;
            console.log(`识别休息时间: ${restTime}秒`);
            break;
          }
        }
      }
      
      // 如果没有找到休息时间，尝试从所有数字中推断
      if (!restFound && allNumbers && allNumbers.length >= 3) {
        const thirdNumber = parseInt(allNumbers[2]);
        if (thirdNumber >= 10 && thirdNumber <= 300) {
          restTime = thirdNumber;
          console.log(`推断休息时间: ${restTime}秒`);
          restFound = true;
        }
      }
      
      // 如果仍然没有找到休息时间，使用智能默认值
      if (!restFound) {
        // 根据动作类型设置默认休息时间
        if (['深蹲', '硬拉', '卧推', '引体向上'].includes(exerciseName)) {
          restTime = 90;
        } else if (['开合跳', '波比跳', '高抬腿', '登山跑'].includes(exerciseName)) {
          restTime = 30;
        } else if (['平板支撑', '仰卧起坐', '卷腹'].includes(exerciseName)) {
          restTime = 45;
        } else {
          restTime = 60;
        }
        console.log(`使用默认休息时间: ${restTime}秒`);
      }
      
      exercises.push({
        id: Date.now() + exercises.length,
        name: exerciseName,
        sets: sets,
        reps: reps,
        restTime: restTime,
        image: '/images/exercise-generic.svg',
        completed: false
      });
      
      console.log(`识别动作: ${exerciseName} - ${sets}组 x ${reps}次, 休息${restTime}秒`);
    }
  }
  
  // 如果没有识别到动作，尝试智能提取
  if (exercises.length === 0) {
    console.log('常规识别失败，尝试智能提取...');
    exercises.push(...smartExtractExercises(text));
  }
  
  return exercises;
}

/**
 * 智能提取动作（当常规方法失败时）
 */
function smartExtractExercises(text) {
  const exercises = [];
  
  // 查找所有数字
  const numbers = text.match(/\d+/g);
  
  if (!numbers || numbers.length < 2) {
    return getDefaultExercises();
  }
  
  // 尝试按行分组数字
  const lines = text.split(/[\n\r]+/).filter(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 提取这一行的所有数字
    const lineNumbers = line.match(/\d+/g);
    
    if (lineNumbers && lineNumbers.length >= 2) {
      // 提取可能的动作名称（行首的文字）
      const nameMatch = line.match(/^([^\d]{2,10})/);
      const name = nameMatch ? nameMatch[1].trim() : `动作${i + 1}`;
      
      const sets = Math.min(parseInt(lineNumbers[0]), 10);
      const reps = Math.min(parseInt(lineNumbers[1]), 100);
      const restTime = lineNumbers[2] ? Math.min(parseInt(lineNumbers[2]), 300) : 60;
      
      exercises.push({
        id: Date.now() + exercises.length,
        name: name,
        sets: sets,
        reps: reps,
        restTime: restTime,
        image: '/images/exercise-generic.svg',
        completed: false
      });
      
      console.log(`智能提取: ${name} - ${sets}组 x ${reps}次, 休息${restTime}秒`);
    }
  }
  
  return exercises.length > 0 ? exercises : getDefaultExercises();
}

/**
 * 获取默认动作（当识别失败时）
 */
function getDefaultExercises() {
  return [
    {
      id: Date.now(),
      name: '动作1',
      sets: 3,
      reps: 12,
      restTime: 60,
      image: '/images/exercise-generic.svg',
      completed: false
    },
    {
      id: Date.now() + 1,
      name: '动作2',
      sets: 3,
      reps: 12,
      restTime: 60,
      image: '/images/exercise-generic.svg',
      completed: false
    }
  ];
}

/**
 * 验证和评估OCR文本质量
 */
function evaluateOCRQuality(text) {
  const quality = {
    score: 0,
    issues: [],
    suggestions: []
  };
  
  // 检查文本长度
  if (!text || text.trim().length < 10) {
    quality.issues.push('文本太短，可能识别失败');
    quality.suggestions.push('请确保图片清晰，文字可见');
    return quality;
  }
  
  // 检查是否包含数字
  const hasNumbers = /\d/.test(text);
  if (!hasNumbers) {
    quality.issues.push('未检测到数字');
    quality.suggestions.push('训练计划应包含组数、次数等数字信息');
    quality.score -= 30;
  } else {
    quality.score += 30;
  }
  
  // 检查是否包含中文或英文
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  if (!hasChinese && !hasEnglish) {
    quality.issues.push('未检测到有效文字');
    quality.suggestions.push('请确保图片包含训练动作名称');
    quality.score -= 40;
  } else {
    quality.score += 40;
  }
  
  // 检查行数
  const lines = text.split(/[\n\r]+/).filter(l => l.trim());
  if (lines.length < 2) {
    quality.issues.push('内容行数太少');
    quality.suggestions.push('建议每个动作占一行');
    quality.score -= 20;
  } else {
    quality.score += 30;
  }
  
  // 检查是否包含常见关键词
  const keywords = ['组', '次', '秒', 'x', 'X', 'sets', 'reps', '休息'];
  const keywordCount = keywords.filter(k => text.includes(k)).length;
  if (keywordCount === 0) {
    quality.issues.push('未检测到训练相关关键词');
    quality.suggestions.push('建议使用标准格式：动作名 3组 x 12次 休息60秒');
  }
  quality.score += keywordCount * 10;
  
  // 限制分数范围
  quality.score = Math.max(0, Math.min(100, quality.score));
  
  return quality;
}

/**
 * 格式化识别结果为可读文本
 */
function formatPlanSummary(plan) {
  let summary = `计划名称: ${plan.title}\n`;
  summary += `类别: ${plan.category}\n`;
  summary += `动作数量: ${plan.exercises.length}\n\n`;
  summary += '动作列表:\n';
  
  plan.exercises.forEach((exercise, index) => {
    summary += `${index + 1}. ${exercise.name} - ${exercise.sets}组 x ${exercise.reps}次, 休息${exercise.restTime}秒\n`;
  });
  
  return summary;
}

module.exports = {
  parseTrainingPlan,
  formatPlanSummary,
  evaluateOCRQuality
};
