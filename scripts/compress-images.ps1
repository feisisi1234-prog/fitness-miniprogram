# 图片压缩脚本
# 使用方法: 在项目根目录运行 powershell -ExecutionPolicy Bypass -File scripts/compress-images.ps1

Write-Host "开始压缩图片..." -ForegroundColor Green

# 检查是否安装了 ImageMagick
$imageMagickPath = "magick"
try {
    $null = & $imageMagickPath --version 2>&1
    $useImageMagick = $true
    Write-Host "检测到 ImageMagick，将使用高质量压缩" -ForegroundColor Cyan
} catch {
    $useImageMagick = $false
    Write-Host "未检测到 ImageMagick，将使用基础压缩方法" -ForegroundColor Yellow
    Write-Host "建议安装 ImageMagick 以获得更好的压缩效果: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
}

# 创建备份文件夹
$backupFolder = "images_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (-not (Test-Path $backupFolder)) {
    New-Item -ItemType Directory -Path $backupFolder | Out-Null
    Write-Host "创建备份文件夹: $backupFolder" -ForegroundColor Cyan
}

# 获取所有图片文件
$imageFiles = Get-ChildItem -Path "images" -File -Include *.png,*.jpg,*.jpeg,*.webp -Recurse

$totalFiles = $imageFiles.Count
$currentFile = 0
$totalOriginalSize = 0
$totalCompressedSize = 0

foreach ($file in $imageFiles) {
    $currentFile++
    $originalSize = $file.Length
    $totalOriginalSize += $originalSize
    
    Write-Host "[$currentFile/$totalFiles] 处理: $($file.Name) ($('{0:N2}' -f ($originalSize/1KB)) KB)" -ForegroundColor White
    
    # 备份原文件
    Copy-Item $file.FullName -Destination $backupFolder
    
    if ($useImageMagick) {
        # 使用 ImageMagick 压缩
        $outputPath = $file.FullName
        
        if ($file.Extension -eq ".png") {
            # PNG 压缩：减少颜色深度，优化
            & $imageMagickPath convert $file.FullName -strip -quality 85 -define png:compression-level=9 $outputPath
        } elseif ($file.Extension -eq ".jpg" -or $file.Extension -eq ".jpeg") {
            # JPG 压缩
            & $imageMagick convert $file.FullName -strip -quality 80 $outputPath
        } elseif ($file.Extension -eq ".webp") {
            # WebP 压缩
            & $imageMagick convert $file.FullName -strip -quality 80 $outputPath
        }
    } else {
        # 使用 .NET 基础压缩（仅支持 PNG 和 JPG）
        if ($file.Extension -eq ".png" -or $file.Extension -eq ".jpg" -or $file.Extension -eq ".jpeg") {
            Add-Type -AssemblyName System.Drawing
            
            $image = [System.Drawing.Image]::FromFile($file.FullName)
            $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 80)
            
            $tempPath = $file.FullName + ".tmp"
            $image.Save($tempPath, $encoder, $encoderParams)
            $image.Dispose()
            
            Move-Item -Path $tempPath -Destination $file.FullName -Force
        }
    }
    
    # 获取压缩后的大小
    $compressedFile = Get-Item $file.FullName
    $compressedSize = $compressedFile.Length
    $totalCompressedSize += $compressedSize
    
    $savedSize = $originalSize - $compressedSize
    $savedPercent = if ($originalSize -gt 0) { ($savedSize / $originalSize) * 100 } else { 0 }
    
    if ($savedSize -gt 0) {
        Write-Host "  ✓ 压缩成功: $('{0:N2}' -f ($compressedSize/1KB)) KB (节省 $('{0:N2}' -f ($savedSize/1KB)) KB, $([math]::Round($savedPercent, 1))%)" -ForegroundColor Green
    } else {
        Write-Host "  - 无需压缩" -ForegroundColor Gray
    }
}

# 显示总结
Write-Host "`n压缩完成！" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "处理文件数: $totalFiles" -ForegroundColor White
Write-Host "原始总大小: $('{0:N2}' -f ($totalOriginalSize/1KB)) KB ($('{0:N2}' -f ($totalOriginalSize/1MB)) MB)" -ForegroundColor White
Write-Host "压缩后大小: $('{0:N2}' -f ($totalCompressedSize/1KB)) KB ($('{0:N2}' -f ($totalCompressedSize/1MB)) MB)" -ForegroundColor White
$totalSaved = $totalOriginalSize - $totalCompressedSize
$totalSavedPercent = if ($totalOriginalSize -gt 0) { ($totalSaved / $totalOriginalSize) * 100 } else { 0 }
Write-Host "节省空间: $('{0:N2}' -f ($totalSaved/1KB)) KB ($('{0:N2}' -f ($totalSaved/1MB)) MB, $([math]::Round($totalSavedPercent, 1))%)" -ForegroundColor Green
Write-Host "备份位置: $backupFolder" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

Write-Host "`n提示: 如果压缩效果不理想，可以从备份文件夹恢复原文件" -ForegroundColor Yellow
