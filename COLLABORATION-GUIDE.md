# 团队协作指南

## 📋 当前状态

目前仓库只有 `master` 分支。当协作者创建新分支并推送后，你可以按照以下步骤操作。

## 🔄 查看所有分支

### 1. 获取最新的远程分支信息

```bash
# 获取所有远程分支
git fetch --all

# 查看所有分支（本地+远程）
git branch -a
```

输出示例：
```
* master                          # 当前所在分支（带*号）
  remotes/origin/master           # 远程master分支
  remotes/origin/feature-login    # 协作者的分支
  remotes/origin/dev              # 开发分支
```

### 2. 查看远程分支详情

```bash
# 查看远程仓库信息
git remote -v

# 查看远程分支
git branch -r
```

## 🌿 切换到协作者的分支

### 方法1：创建本地分支跟踪远程分支（推荐）

```bash
# 假设协作者的分支名是 feature-login
git checkout -b feature-login origin/feature-login
```

这会：
- 创建本地分支 `feature-login`
- 自动跟踪远程分支 `origin/feature-login`
- 切换到该分支

### 方法2：直接切换（Git 2.23+）

```bash
# Git会自动创建并跟踪远程分支
git checkout feature-login
```

### 方法3：先创建后切换

```bash
# 创建分支
git branch feature-login origin/feature-login

# 切换到该分支
git checkout feature-login
```

## 🔀 合并协作者的分支到你的分支

### 场景1：合并到master分支

```bash
# 1. 确保在master分支
git checkout master

# 2. 拉取最新的master
git pull origin master

# 3. 合并协作者的分支（假设是feature-login）
git merge origin/feature-login

# 4. 如果有冲突，解决后提交
git add .
git commit -m "merge: 合并feature-login分支"

# 5. 推送到远程
git push origin master
```

### 场景2：在协作者分支上工作后合并

```bash
# 1. 切换到协作者的分支
git checkout feature-login

# 2. 拉取最新更改
git pull origin feature-login

# 3. 进行你的修改...

# 4. 提交你的更改
git add .
git commit -m "feat: 添加新功能"

# 5. 推送到该分支
git push origin feature-login

# 6. 切换回master并合并
git checkout master
git merge feature-login
git push origin master
```

## 🔍 查看分支差异

### 查看两个分支的差异

```bash
# 查看当前分支和目标分支的差异
git diff master..feature-login

# 查看文件列表差异
git diff --name-only master..feature-login

# 查看统计信息
git diff --stat master..feature-login
```

### 查看提交历史差异

```bash
# 查看feature-login有但master没有的提交
git log master..feature-login

# 图形化查看
git log --oneline --graph --all
```

## ⚠️ 处理合并冲突

当合并时出现冲突：

```bash
# 1. Git会提示哪些文件有冲突
git status

# 2. 打开冲突文件，会看到类似这样的标记：
<<<<<<< HEAD
你的代码
=======
协作者的代码
>>>>>>> feature-login

# 3. 手动编辑文件，保留需要的代码，删除标记

# 4. 标记冲突已解决
git add 冲突文件名

# 5. 完成合并
git commit -m "merge: 解决合并冲突"

# 6. 推送
git push
```

### 取消合并

如果合并出错，想要撤销：

```bash
# 取消合并（在合并完成前）
git merge --abort

# 回退到合并前的状态（合并已提交）
git reset --hard HEAD~1
```

## 📊 实用命令

### 查看分支信息

```bash
# 查看本地分支
git branch

# 查看远程分支
git branch -r

# 查看所有分支
git branch -a

# 查看分支详细信息（包括跟踪关系）
git branch -vv
```

### 删除分支

```bash
# 删除本地分支
git branch -d feature-login

# 强制删除本地分支
git branch -D feature-login

# 删除远程分支
git push origin --delete feature-login
```

### 重命名分支

```bash
# 重命名当前分支
git branch -m 新分支名

# 重命名其他分支
git branch -m 旧分支名 新分支名
```

## 🎯 推荐工作流程

### 标准协作流程

1. **协作者创建功能分支**
   ```bash
   git checkout -b feature-new-function
   # 开发功能...
   git add .
   git commit -m "feat: 完成新功能"
   git push origin feature-new-function
   ```

2. **你拉取并审查**
   ```bash
   git fetch --all
   git checkout feature-new-function
   # 审查代码...
   ```

3. **测试通过后合并**
   ```bash
   git checkout master
   git merge feature-new-function
   git push origin master
   ```

4. **删除功能分支（可选）**
   ```bash
   git branch -d feature-new-function
   git push origin --delete feature-new-function
   ```

### 使用Pull Request（推荐）

更好的方式是在GitHub上使用Pull Request：

1. 协作者推送分支到GitHub
2. 在GitHub上创建Pull Request
3. 你在网页上审查代码、讨论
4. 点击"Merge"按钮合并
5. 本地拉取最新代码：`git pull`

## 🛠️ 常见场景

### 场景1：协作者推送了新分支

```bash
# 获取最新信息
git fetch --all

# 查看新分支
git branch -r

# 切换到新分支
git checkout 新分支名

# 查看代码
```

### 场景2：同时在不同分支工作

```bash
# 你在master，协作者在feature分支

# 定期同步master到feature分支
git checkout feature
git merge master
git push origin feature
```

### 场景3：需要协作者的某个提交

```bash
# 使用cherry-pick挑选特定提交
git cherry-pick 提交哈希值
```

## 📝 最佳实践

1. **经常拉取更新**
   ```bash
   git fetch --all
   git pull
   ```

2. **提交前先拉取**
   ```bash
   git pull
   git add .
   git commit -m "..."
   git push
   ```

3. **使用有意义的分支名**
   - `feature/功能名` - 新功能
   - `fix/bug名` - 修复bug
   - `docs/文档名` - 文档更新
   - `refactor/模块名` - 重构

4. **保持master分支稳定**
   - 不要直接在master上开发
   - 通过分支合并更新master

5. **及时沟通**
   - 开始新功能前告知团队
   - 遇到冲突及时讨论
   - 使用GitHub Issues跟踪任务

## 🔧 Git配置优化

```bash
# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置合并工具
git config --global merge.tool vscode

# 显示更友好的日志
git config --global alias.lg "log --oneline --graph --all"

# 使用后可以用 git lg 查看图形化日志
```

## 📚 相关资源

- [Git分支管理](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%80%E4%BB%8B)
- [GitHub协作流程](https://docs.github.com/cn/pull-requests/collaborating-with-pull-requests)
- [解决合并冲突](https://docs.github.com/cn/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)

---

**需要帮助？** 随时询问！
