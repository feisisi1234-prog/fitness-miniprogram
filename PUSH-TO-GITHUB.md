# 推送项目到GitHub完整指南

## 📋 准备工作

你的项目已经完成了Git初始化和提交，现在只需要推送到GitHub。

## 🚀 快速开始

### 步骤1：在GitHub上创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `fitness-miniprogram` （或你喜欢的名字）
   - **Description**: `健身训练微信小程序 - 包含训练计划、食物识别、肌肉分析等功能`
   - **Public/Private**: 选择公开或私有
   - ⚠️ **重要**: 不要勾选 "Add a README file"（我们已经有了）
   - ⚠️ **重要**: 不要勾选 "Add .gitignore"（我们已经有了）
3. 点击 **Create repository**

### 步骤2：复制仓库URL

创建完成后，GitHub会显示一个页面，复制仓库URL，格式如下：
```
https://github.com/你的用户名/fitness-miniprogram.git
```

### 步骤3：连接远程仓库并推送

在项目目录中打开命令行（PowerShell或Git Bash），执行以下命令：

```bash
# 添加远程仓库（替换成你的仓库URL）
git remote add origin https://github.com/你的用户名/fitness-miniprogram.git

# 推送代码到GitHub
git push -u origin master
```

如果GitHub提示使用main分支，执行：
```bash
git branch -M main
git push -u origin main
```

### 步骤4：输入GitHub凭证

首次推送时，会要求输入GitHub凭证：

**方法1：使用Personal Access Token（推荐）**
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" > "Generate new token (classic)"
3. 设置token名称和权限（至少勾选 `repo`）
4. 复制生成的token（只显示一次！）
5. 在命令行中：
   - Username: 输入你的GitHub用户名
   - Password: 粘贴刚才复制的token

**方法2：使用SSH密钥**
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 在GitHub添加SSH密钥
# Settings > SSH and GPG keys > New SSH key
```

然后使用SSH URL：
```bash
git remote set-url origin git@github.com:你的用户名/fitness-miniprogram.git
git push -u origin master
```

## ✅ 验证推送成功

访问你的GitHub仓库页面，应该能看到：
- ✅ 所有文件已上传
- ✅ README.md正确显示
- ✅ 提交历史可见
- ✅ 文件数量：176个文件

## 📊 项目统计

你的项目包含：
- **总文件数**: 176个
- **代码行数**: 27,000+行
- **提交次数**: 2次
- **SVG图标**: 31个
- **页面数**: 11个
- **组件数**: 3个

## 🔄 后续更新代码

当你修改代码后，使用以下命令推送更新：

```bash
# 1. 查看修改的文件
git status

# 2. 添加所有修改
git add .

# 3. 提交修改（写清楚改了什么）
git commit -m "描述你的修改内容"

# 4. 推送到GitHub
git push
```

### 提交信息规范（建议）

使用语义化的提交信息：

```bash
# 新功能
git commit -m "feat: 添加新的训练计划"

# 修复bug
git commit -m "fix: 修复视频播放问题"

# 文档更新
git commit -m "docs: 更新README文档"

# 样式调整
git commit -m "style: 优化首页布局"

# 重构代码
git commit -m "refactor: 重构训练记录模块"

# 性能优化
git commit -m "perf: 优化图片加载速度"
```

## 🌿 分支管理

### 创建新分支开发新功能

```bash
# 创建并切换到新分支
git checkout -b feature/新功能名称

# 开发完成后提交
git add .
git commit -m "feat: 完成新功能"

# 推送新分支到GitHub
git push -u origin feature/新功能名称

# 在GitHub上创建Pull Request合并到主分支
```

### 切换分支

```bash
# 查看所有分支
git branch -a

# 切换到主分支
git checkout master

# 切换到其他分支
git checkout 分支名
```

## 🔧 常见问题

### Q1: 推送时提示 "failed to push some refs"

**原因**: 远程仓库有本地没有的提交

**解决方法**:
```bash
# 先拉取远程更改
git pull origin master --rebase

# 再推送
git push origin master
```

### Q2: 推送时提示 "Permission denied"

**原因**: 认证失败

**解决方法**:
- 检查用户名和密码/token是否正确
- 使用SSH密钥认证
- 重新生成Personal Access Token

### Q3: 推送时提示 "remote: Repository not found"

**原因**: 仓库URL错误或没有权限

**解决方法**:
```bash
# 检查远程仓库URL
git remote -v

# 修改远程仓库URL
git remote set-url origin 正确的URL
```

### Q4: 文件太大无法推送

**原因**: GitHub单个文件限制100MB

**解决方法**:
```bash
# 查看大文件
find . -type f -size +50M

# 从Git历史中删除大文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch 大文件路径" \
  --prune-empty --tag-name-filter cat -- --all

# 或使用Git LFS管理大文件
git lfs install
git lfs track "*.mp4"
git add .gitattributes
```

### Q5: 想要撤销某次提交

```bash
# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃更改）
git reset --hard HEAD~1

# 撤销已推送的提交
git revert HEAD
git push
```

## 📚 有用的Git命令

```bash
# 查看提交历史
git log
git log --oneline --graph

# 查看某个文件的修改历史
git log -p 文件名

# 查看远程仓库信息
git remote -v

# 拉取最新代码
git pull

# 查看差异
git diff

# 暂存更改
git stash
git stash pop

# 清理未跟踪的文件
git clean -fd

# 查看配置
git config --list
```

## 🎯 下一步

推送成功后，你可以：

1. **添加仓库描述和标签**
   - 在GitHub仓库页面点击 "About" 旁边的设置图标
   - 添加描述、网站、标签

2. **创建Release版本**
   - 在GitHub仓库页面点击 "Releases"
   - 创建新的release，标记版本号

3. **设置GitHub Pages**（如果需要展示文档）
   - Settings > Pages
   - 选择分支和文件夹

4. **邀请协作者**
   - Settings > Collaborators
   - 添加其他开发者

5. **设置保护规则**
   - Settings > Branches
   - 添加分支保护规则

## 📖 相关资源

- [Git官方文档](https://git-scm.com/doc)
- [GitHub官方文档](https://docs.github.com/)
- [Git教程 - 廖雪峰](https://www.liaoxuefeng.com/wiki/896043488029600)
- [GitHub Desktop](https://desktop.github.com/) - 图形化Git工具

---

**祝你推送顺利！** 🎉

如有问题，欢迎查看文档或寻求帮助。
