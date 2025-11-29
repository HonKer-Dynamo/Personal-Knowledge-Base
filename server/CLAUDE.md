[根目录](../CLAUDE.md) > **server**

# 后端模块

## 模块职责
提供 API 服务和数据处理，包括文章管理、版本历史、评论系统和分类管理功能。

## 技术栈
- Express.js
- Drizzle ORM + PostgreSQL
- Zod 数据验证
- TypeScript

## 入口与启动
- 入口文件: `server/index.ts`
- 启动命令: `npm run dev`

## 核心 API 端点

### 文章管理
- `GET /api/articles`: 获取所有文章
  - 响应：所有文章列表

- `POST /api/articles`: 创建文章
  - 请求体：文章数据（标题、内容、摘要、分类ID、标签、是否发布）
  - 自动处理重复 slug：在重复 slug 后添加时间戳
  - 响应：创建的文章

- `GET /api/articles/:slug`: 获取文章详情
  - 参数：slug - 文章唯一标识
  - 响应：文章详情

- `PATCH /api/articles/:id`: 更新文章
  - 参数：id - 文章 ID
  - 请求体：部分文章数据
  - 响应：更新后的文章

- `DELETE /api/articles/:id`: 删除文章
  - 参数：id - 文章 ID
  - 响应：204 No Content

### 分类管理
- `GET /api/categories`: 获取所有分类
  - 响应：所有分类列表

- `POST /api/categories`: 创建分类
  - 请求体：分类数据（名称、slug、颜色）
  - 响应：创建的分类

- `GET /api/categories/:id`: 获取分类详情
  - 参数：id - 分类 ID
  - 响应：分类详情

- `PATCH /api/categories/:id`: 更新分类
  - 参数：id - 分类 ID
  - 请求体：部分分类数据
  - 响应：更新后的分类

- `DELETE /api/categories/:id`: 删除分类
  - 参数：id - 分类 ID
  - 响应：204 No Content

### 版本历史
- `GET /api/articles/:id/versions`: 获取版本历史
  - 参数：id - 文章 ID
  - 响应：版本历史列表

- `POST /api/articles/:id/versions`: 保存新版本
  - 参数：id - 文章 ID
  - 请求体：版本数据（标题、内容、摘要等）
  - 自动保留最新 10 个版本
  - 响应：创建的版本

### 评论系统
- `GET /api/articles/:slug/comments`: 获取评论
  - 参数：slug - 文章 slug
  - 仅返回已批准的评论
  - 响应：评论列表

- `POST /api/comments`: 创建评论
  - 请求体：评论数据（文章 ID、作者、邮箱、内容）
  - 评论默认处于未批准状态
  - 响应：创建的评论

- `DELETE /api/comments/:id`: 删除评论
  - 参数：id - 评论 ID
  - 响应：204 No Content

### 错误处理
所有 API 端点均包含：
- Zod 验证错误（400 Bad Request）
- 资源不存在错误（404 Not Found）
- 服务器内部错误（500 Internal Server Error）

## 主要文件
- `server/routes.ts`: API 路由定义
- `server/storage.ts`: 数据存储操作
- `server/index.ts`: 服务器入口

## 服务器入口 (server/index.ts)
- **功能**: 后端服务器的入口文件，负责初始化 Express 应用和配置中间件
- **核心特性**:
  - 创建 Express 应用和 HTTP 服务器
  - 配置 JSON 和 URL 编码解析中间件
  - 实现请求日志记录，包括请求时间、路径、状态码和响应内容
  - 注册所有 API 路由
  - 设置生产环境的静态文件服务
  - 开发环境下配置 Vite 中间件
  - 监听环境变量指定的端口（默认 5000）
  - 统一错误处理中间件

## 数据层

### Storage Interface (`IStorage`)
定义了所有数据操作的统一接口，包括：
- 用户管理 (getUser, getUserByUsername, createUser)
- 文章管理 (getArticles, getArticleById, getArticleBySlug, createArticle, updateArticle, deleteArticle)
- 分类管理 (getCategories, getCategoryById, createCategory, updateCategory, deleteCategory)
- 版本历史 (getArticleVersions, createArticleVersion, deleteArticleVersionsBefore)
- 评论系统 (getComments, createComment, approveComment, deleteComment)

### In-Memory Storage Implementation (`MemStorage`)
- 使用 Maps 实现的内存存储
- 初始化时加载示例数据
- 保留最新 10 个文章版本
- 评论需要审批才能显示
- 数据仅在服务器运行时存在，重启后会丢失

## 变更记录 (Changelog)
- 2025-11-29: 初始 AI 上下文文档创建
- 2025-11-29: 数据存储层文档更新
