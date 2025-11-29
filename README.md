# 🧠 个人知识库 - Personal Knowledge Base
[![GitHub stars](https://img.shields.io/github/stars/HonKer-Dynamo/Personal-Knowledge-Base?style=social)](https://github.com/HonKer-Dynamo/Personal-Knowledge-Base)
[![Gitee stars](https://gitee.com/HonKer-Dynamo/personal-knowledge-base/badge/star.svg)](https://gitee.com/HonKer-Dynamo/personal-knowledge-base)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![Last Commit](https://img.shields.io/github/last-commit/HonKer-Dynamo/Personal-Knowledge-Base.svg)](https://github.com/HonKer-Dynamo/Personal-Knowledge-Base/commits/main)

一个完整的全栈 Markdown 知识库网站，支持文章编辑、版本历史、评论系统、多格式导出和 5 种代码配色主题。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 核心特性

### 🎯 完整功能
- ✅ **Markdown 编辑** - 支持完整 GFM 语法，实时预览
- ✅ **代码高亮** - 5 种配色主题，30+ 编程语言支持
- ✅ **版本历史** - 自动保存编辑版本（最多 10 个）
- ✅ **评论系统** - 支持访客留言和审核
- ✅ **多格式导出** - PDF、Markdown、HTML、JSON
- ✅ **分类标签** - 多维度筛选和全文搜索
- ✅ **主题切换** - 亮/暗模式 + 5 种代码主题

### 🛠️ 技术栈
- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI
- **后端**: Express.js + 内存存储
- **查询**: TanStack Query (React Query)
- **代码高亮**: react-syntax-highlighter
- **Markdown**: react-markdown + remark-gfm
- **导出**: html2pdf.js

### 📁 项目结构
```
├── client/src/
│   ├── components/     # UI 组件（编辑器、评论、版本历史等）
│   ├── pages/          # 页面（首页、文章详情、写文章等）
│   ├── lib/            # 工具库（主题、查询配置等）
│   └── index.css       # 全局样式
├── server/
│   ├── routes.ts       # API 路由
│   └── storage.ts      # 数据存储
├── shared/
│   └── schema.ts       # 数据模型
└── design_guidelines.md # 设计规范
```

## 核心 API 端点

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/articles` | 获取所有文章 |
| POST | `/api/articles` | 创建文章 |
| GET | `/api/articles/:slug` | 获取文章详情 |
| PATCH | `/api/articles/:id` | 更新文章 |
| DELETE | `/api/articles/:id` | 删除文章 |
| GET | `/api/articles/:id/versions` | 获取版本历史 |
| POST | `/api/articles/:id/versions` | 保存新版本 |
| GET | `/api/articles/:slug/comments` | 获取评论 |
| POST | `/api/comments` | 创建评论 |
| DELETE | `/api/comments/:id` | 删除评论 |

## 5 种代码配色主题

1. **VS Code Dark** - 深色背景，温暖语法颜色
2. **Dracula** - 紫色/粉色配色方案
3. **Monokai** - 经典深色主题
4. **GitHub Light** - 清新浅色背景
5. **Nord** - 冷蓝灰色调

## 使用示例

### 创建文章
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "# Hello\nMarkdown 内容...",
    "excerpt": "文章摘要",
    "categoryId": "cat-1",
    "tags": ["javascript", "react"],
    "published": true
  }'
```

### 获取文章列表
```bash
curl http://localhost:5000/api/articles
```

### 留下评论
```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "art-1",
    "author": "张三",
    "email": "user@example.com",
    "content": "很好的文章！"
  }'
```

## 设计理念

- **内容优先**: 最大化可读性和内容呈现
- **代码至上**: 代码块专业演示，多种主题选择
- **易用性**: 直观的编辑器和导航体验
- **响应式**: 完美适配桌面、平板、手机

## 数据模型

### Articles（文章）
- `id`: 唯一标识
- `title`: 文章标题
- `slug`: URL 友好的标识符
- `content`: Markdown 内容
- `excerpt`: 文章摘要
- `categoryId`: 分类 ID
- `tags`: 标签数组
- `published`: 是否发布
- `readingTime`: 阅读时间（分钟）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### ArticleVersions（版本历史）
- `id`: 版本标识
- `articleId`: 文章 ID
- 包含文章的所有字段快照
- `createdAt`: 版本创建时间

### Comments（评论）
- `id`: 评论标识
- `articleId`: 文章 ID
- `author`: 评论者名称
- `email`: 评论者邮箱
- `content`: 评论内容
- `approved`: 是否已批准
- `createdAt`: 创建时间

## 许可证

MIT

## 作者

HonKer-Dynamo
