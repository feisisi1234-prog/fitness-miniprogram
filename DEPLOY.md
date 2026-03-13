# 部署到GitHub指南

## 步骤1：在GitHub上创建新仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - Repository name: 例如 `fitness-miniprogram`
   - Description: 健身训练微信小程序
   - 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
4. 点击 "Create repository"

## 步骤2：连接本地仓库到GitHub

复制GitHub上显示的仓库URL（例如：`https://github.com/你的用户名/fitness-miniprogram.git`）

然后在命令行中执行：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/fitness-miniprogram.git

# 推送代码到GitHub
git push -u origin master
```

如果使用的是main分支而不是master，使用：
```bash
git branch -M main
git push -u origin main
```

## 步骤3：验证

访问你的GitHub仓库页面，应该能看到所有文件已经上传成功。

## 后续更新代码

当你修改了代码后，使用以下命令推送更新：

```bash
# 查看修改的文件
git status

# 添加所有修改的文件
git add .

# 提交修改
git commit -m "描述你的修改内容"

# 推送到GitHub
git push
```

## 常用Git命令

```bash
# 查看当前状态
git status

# 查看提交历史
git log

# 查看远程仓库信息
git remote -v

# 拉取最新代码
git pull

# 创建新分支
git checkout -b 分支名

# 切换分支
git checkout 分支名

# 合并分支
git merge 分支名
```

## 注意事项

1. **敏感信息**：确保不要提交包含敏感信息的文件（如API密钥、密码等）
2. **大文件**：GitHub单个文件限制100MB，项目已配置.gitignore忽略大文件
3. **私有配置**：`project.private.config.json` 已被忽略，不会上传到GitHub

## 克隆项目

其他人可以通过以下命令克隆你的项目：

```bash
git clone https://github.com/你的用户名/fitness-miniprogram.git
```

## 协作开发

如果要与他人协作开发：

1. 在GitHub仓库页面点击 "Settings" > "Collaborators"
2. 添加协作者的GitHub用户名
3. 协作者接受邀请后即可推送代码

## 问题排查

### 推送失败

如果推送时提示认证失败，可能需要：

1. 使用GitHub Personal Access Token代替密码
2. 配置SSH密钥

### 文件冲突

如果出现冲突：

```bash
# 拉取最新代码
git pull

# 手动解决冲突后
git add .
git commit -m "解决冲突"
git push
```

---

更多Git使用技巧，请参考 [Git官方文档](https://git-scm.com/doc)
