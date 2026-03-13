// 测试OCR解析器
const ocrParser = require('./ocr-parser.js');

// 测试文本（模拟你的OCR输出）
const testText = `胸
坐姿下斜推 3 组 × 12 次 组内暂停 10+5 休息 60
上斜推 3 组 × 12 次 休息 60
飞鸟 3 组 × 15 次 休息 45`;

console.log('测试OCR解析器');
console.log('================');

const result = ocrParser.parseTrainingPlan(testText);

console.log('\n最终结果:');
console.log('标题:', result.title);
console.log('类别:', result.category);
console.log('动作数量:', result.exercises.length);
console.log('\n动作列表:');
result.exercises.forEach((ex, i) => {
  console.log(`${i + 1}. ${ex.name} - ${ex.sets}组 x ${ex.reps}次, 休息${ex.restTime}秒`);
});
