[根目录](../CLAUDE.md) > **shared**

# 共享模块

## 模块职责
定义数据模型和验证规则，为前后端提供一致的数据结构。

## 技术栈
- TypeScript
- Drizzle ORM
- Zod

## 核心功能
- 定义数据库表结构
- 生成 TypeScript 类型
- 提供数据验证 schemas
- 定义代码主题枚举和配置

## 数据模型

### 用户 (Users)
- id: 唯一标识
- username: 用户名
- password: 密码

### 分类 (Categories)
- id: 唯一标识
- name: 分类名称
- slug: URL 友好的标识符
- color: 分类颜色

### 文章 (Articles)
- id: 唯一标识
- title: 文章标题
- slug: URL 友好的标识符
- content: Markdown 内容
- excerpt: 文章摘要
- categoryId: 分类 ID
- tags: 标签数组
- published: 是否发布
- readingTime: 阅读时间 (分钟)
- createdAt: 创建时间
- updatedAt: 更新时间

### 版本历史 (ArticleVersions)
- id: 版本标识
- articleId: 文章 ID
- ... 包含文章的所有字段快照
- createdAt: 版本创建时间

### 评论 (Comments)
- id: 评论标识
- articleId: 文章 ID
- author: 评论者名称
- email: 评论者邮箱
- content: 评论内容
- approved: 是否已批准
- createdAt: 创建时间

## 代码主题配置
- CODE_THEMES: 包含 5 种代码配色主题的配置
- CodeTheme: 定义代码主题类型

## 变更记录 (Changelog)
- 2025-11-29: 初始 AI 上下文文档创建
