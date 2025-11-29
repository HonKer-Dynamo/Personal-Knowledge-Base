# 个人知识库 (Personal Knowledge Base)

一个基于 Markdown 的个人知识库网站，支持代码语法高亮和多种配色主题。

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI
- **后端**: Express.js + 内存存储
- **Markdown**: react-markdown + remark-gfm + rehype-raw
- **代码高亮**: react-syntax-highlighter (Prism)

## 项目结构

```
client/
├── src/
│   ├── components/     # UI 组件
│   │   ├── article-card.tsx      # 文章卡片
│   │   ├── article-editor.tsx    # Markdown 编辑器
│   │   ├── category-filter.tsx   # 分类/标签筛选
│   │   ├── code-block.tsx        # 代码高亮块
│   │   ├── footer.tsx            # 页脚
│   │   ├── header.tsx            # 导航栏
│   │   └── markdown-renderer.tsx # Markdown 渲染器
│   ├── lib/
│   │   ├── queryClient.ts        # TanStack Query 配置
│   │   ├── theme-context.tsx     # 主题上下文
│   │   └── utils.ts              # 工具函数
│   ├── pages/
│   │   ├── article-detail.tsx    # 文章详情页
│   │   ├── edit.tsx              # 编辑文章页
│   │   ├── home.tsx              # 首页
│   │   ├── not-found.tsx         # 404 页面
│   │   └── write.tsx             # 写文章页
│   ├── App.tsx                   # 应用入口
│   └── index.css                 # 样式
server/
├── routes.ts           # API 路由
└── storage.ts          # 内存存储
shared/
└── schema.ts           # 数据模型
```

## 功能特性

### 文章管理
- 创建、编辑、删除文章
- Markdown 格式支持
- 实时预览
- 自动生成 slug
- 阅读时间估算

### 代码高亮
支持 5 种配色主题：
- **VS Code Dark** - 深色背景，温暖语法颜色
- **Dracula** - 紫色/粉色配色方案
- **Monokai** - 经典深色主题
- **GitHub Light** - 清新浅色背景
- **Nord** - 冷蓝灰色调

支持的编程语言：
JavaScript, TypeScript, Python, Java, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, HTML, CSS, Shell, 等等

### 分类和标签
- 文章分类筛选
- 标签云
- 搜索功能

### 主题切换
- 明/暗模式切换
- 代码配色主题切换

## API 端点

### 文章
- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:slug` - 获取单篇文章
- `POST /api/articles` - 创建文章
- `PATCH /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章

### 分类
- `GET /api/categories` - 获取所有分类
- `GET /api/categories/:id` - 获取单个分类
- `POST /api/categories` - 创建分类
- `PATCH /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

## 开发命令

```bash
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
```

## 设计规范

参考 `design_guidelines.md` 文件了解详细的设计规范。

## 近期更新

- 2024-11-29: 初始版本发布
  - 完整的 Markdown 编辑器
  - 代码高亮支持 5 种主题
  - 文章 CRUD 功能
  - 分类和标签系统
  - 响应式设计
