// 图片压缩脚本 (Node.js 版本)
// 使用方法: 
// 1. 先安装依赖: npm install sharp
// 2. 运行脚本: node scripts/compress-images.js

const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
  sharp = require('sharp');
  console.log('✓ 检测到 sharp 库');
} catch (err) {
  console.error('❌ 未安装 sharp 库');
  console.error('请先运行: npm install sharp');
  process.exit(1);
}

const imagesDir = path.join(__dirname, '..', 'images');
const backupDir = path.join(__dirname, '..', `images_backup_${Date.now()}`);

// 创建备份文件夹
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log(`创建备份文件夹: ${backupDir}\n`);
}

// 获取所有图片文件
function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (/\.(png|jpg|jpeg|webp)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function compressImage(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const originalSize = fs.statSync(filePath).size;
  
  console.log(`处理: ${fileName} (${(originalSize / 1024).toFixed(2)} KB)`);
  
  // 备份原文件
  fs.copyFileSync(filePath, path.join(backupDir, fileName));
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // 根据文件类型压缩
    if (ext === '.png') {
      await image
        .png({ 
          quality: 80, 
          compressionLevel: 9,
          palette: true // 使用调色板减少文件大小
        })
        .toFile(filePath + '.tmp');
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ 
          quality: 80,
          mozjpeg: true // 使用 mozjpeg 获得更好的压缩
        })
        .toFile(filePath + '.tmp');
    } else if (ext === '.webp') {
      await image
        .webp({ 
          quality: 80 
        })
        .toFile(filePath + '.tmp');
    }
    
    // 替换原文件
    fs.renameSync(filePath + '.tmp', filePath);
    
    const compressedSize = fs.statSync(filePath).size;
    const savedSize = originalSize - compressedSize;
    const savedPercent = ((savedSize / originalSize) * 100).toFixed(1);
    
    if (savedSize > 0) {
      console.log(`  ✓ 压缩成功: ${(compressedSize / 1024).toFixed(2)} KB (节省 ${(savedSize / 1024).toFixed(2)} KB, ${savedPercent}%)\n`);
    } else {
      console.log(`  - 无需压缩\n`);
    }
    
    return { originalSize, compressedSize };
  } catch (err) {
    console.error(`  ❌ 压缩失败: ${err.message}\n`);
    return { originalSize, compressedSize: originalSize };
  }
}

async function main() {
  console.log('开始压缩图片...\n');
  
  const imageFiles = getImageFiles(imagesDir);
  console.log(`找到 ${imageFiles.length} 个图片文件\n`);
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  
  for (const filePath of imageFiles) {
    const result = await compressImage(filePath);
    totalOriginalSize += result.originalSize;
    totalCompressedSize += result.compressedSize;
  }
  
  // 显示总结
  console.log('========================================');
  console.log('压缩完成！');
  console.log('========================================');
  console.log(`处理文件数: ${imageFiles.length}`);
  console.log(`原始总大小: ${(totalOriginalSize / 1024).toFixed(2)} KB (${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`压缩后大小: ${(totalCompressedSize / 1024).toFixed(2)} KB (${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB)`);
  
  const totalSaved = totalOriginalSize - totalCompressedSize;
  const totalSavedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(1);
  console.log(`节省空间: ${(totalSaved / 1024).toFixed(2)} KB (${(totalSaved / 1024 / 1024).toFixed(2)} MB, ${totalSavedPercent}%)`);
  console.log(`备份位置: ${backupDir}`);
  console.log('========================================');
  console.log('\n提示: 如果压缩效果不理想，可以从备份文件夹恢复原文件');
}

main().catch(console.error);
