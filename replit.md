# 个人知识库 (Personal Knowledge Base)

一个完整的全栈 Markdown 知识库网站，支持文章编辑、版本历史、评论系统、多格式导出和 5 种代码配色主题。

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS + Shadcn UI + Wouter
- **后端**: Express.js + 内存存储 + TanStack Query
- **Markdown**: react-markdown + remark-gfm + rehype-raw
- **代码高亮**: react-syntax-highlighter (Prism)
- **导出**: html2pdf.js + 自定义导出器

## 项目结构

```
client/src/
├── components/              # UI 组件库
│   ├── article-card.tsx      # 文章卡片
│   ├── article-editor.tsx    # Markdown 编辑器
│   ├── category-filter.tsx   # 分类/标签筛选
│   ├── code-block.tsx        # 代码高亮（5种主题）
│   ├── footer.tsx            # 页脚
│   ├── header.tsx            # 导航栏（主题切换、代码主题）
│   ├── markdown-renderer.tsx # Markdown 渲染器
│   ├── comments.tsx          # 评论系统
│   ├── version-history.tsx   # 版本历史
│   ├── export-menu.tsx       # 多格式导出菜单
│   └── ui/                   # Shadcn UI 组件
├── lib/
│   ├── queryClient.ts        # TanStack Query 配置
│   ├── theme-context.tsx     # 主题管理（深色+代码主题）
│   └── utils.ts              # 工具函数
├── pages/
│   ├── home.tsx              # 首页（搜索、筛选、排序）
│   ├── article-detail.tsx    # 文章详情（版本历史、评论）
│   ├── write.tsx             # 写文章（自动保存版本）
│   ├── edit.tsx              # 编辑文章（自动保存版本）
│   └── not-found.tsx         # 404 页面
├── App.tsx                   # 应用入口与路由
└── index.css                 # 全局样式

server/
├── routes.ts                 # 完整 API 路由（文章、分类、版本、评论）
├── storage.ts                # 内存存储实现
└── index.ts                  # 服务器入口

shared/
├── schema.ts                 # 数据模型（Drizzle ORM + Zod）
```

## 完整功能列表

### 📝 文章管理
- ✅ 创建、编辑、删除文章
- ✅ Markdown 格式支持（完整 GFM 语法）
- ✅ 实时预览与编辑器
- ✅ 自动生成 slug（支持中文）
- ✅ 自动计算阅读时间
- ✅ 摘要自动生成
- ✅ 发布与草稿管理

### 🎨 代码高亮与主题
**5 种代码配色主题：**
- **VS Code Dark** - 深色背景，温暖语法颜色
- **Dracula** - 紫色/粉色配色方案
- **Monokai** - 经典深色主题
- **GitHub Light** - 清新浅色背景
- **Nord** - 冷蓝灰色调

**支持 30+ 编程语言：**
JavaScript, TypeScript, Python, Java, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, HTML, CSS, Bash, JSON, YAML, XML, Markdown 等

**界面主题：**
- ✅ 亮色/深色模式（自动系统偏好）
- ✅ 主题持久化（localStorage）
- ✅ 平滑主题切换

### 🏷️ 分类与标签
- ✅ 多分类筛选（带颜色标识）
- ✅ 多标签筛选
- ✅ 标签云显示
- ✅ 实时搜索（标题、摘要、内容）

### 📚 版本历史
- ✅ 编辑时自动保存版本
- ✅ 保留最多 10 个版本
- ✅ 可展开查看版本详情
- ✅ 版本时间戳记录
- ✅ 版本内容预览

### 💬 评论系统
- ✅ 访客留言功能
- ✅ 评论表单（名字、邮箱、内容）
- ✅ 评论审核机制
- ✅ 已批准评论展示
- ✅ 评论计数统计

### 📥 多格式导出
- ✅ **PDF 导出** - 完整格式保留
- ✅ **Markdown 导出** - 原始 Markdown 文本
- ✅ **HTML 导出** - 独立 HTML 文件
- ✅ **JSON 导出** - 文章元数据
- ✅ 导出菜单（文章头部按钮）

### 🔍 搜索与导航
- ✅ 全文搜索（实时过滤）
- ✅ 文章列表排序（按日期）
- ✅ 分类导航
- ✅ 标签导航
- ✅ 文章分享功能

## 完整 API 端点

### 文章 (Articles)
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/articles` | 获取所有文章列表 |
| GET | `/api/articles/:slug` | 获取单篇文章详情 |
| POST | `/api/articles` | 创建新文章 |
| PATCH | `/api/articles/:id` | 更新文章内容 |
| DELETE | `/api/articles/:id` | 删除文章 |

### 分类 (Categories)
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类 |
| GET | `/api/categories/:id` | 获取单个分类 |
| POST | `/api/categories` | 创建分类 |
| PATCH | `/api/categories/:id` | 更新分类 |
| DELETE | `/api/categories/:id` | 删除分类 |

### 版本历史 (Article Versions)
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/articles/:id/versions` | 获取文章版本列表 |
| POST | `/api/articles/:id/versions` | 保存新版本 |

### 评论 (Comments)
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/articles/:slug/comments` | 获取已批准评论 |
| POST | `/api/comments` | 创建新评论 |
| DELETE | `/api/comments/:id` | 删除评论 |

## 开发命令

```bash
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
```

## 设计规范

参考 `design_guidelines.md` 文件了解详细的设计规范。

## 更新历史

### 版本 1.0 (2024-11-29) - 完整版本发布
**核心功能：**
- ✅ 完整的 Markdown 编辑器（GFM 支持）
- ✅ 代码高亮（5 种主题）
- ✅ 文章 CRUD 管理
- ✅ 分类和标签系统
- ✅ 全文搜索功能
- ✅ 主题切换（深色/亮色）
- ✅ 响应式设计

**高级功能：**
- ✅ 自动版本历史保存（最多 10 个）
- ✅ 完整评论系统
- ✅ 多格式导出（PDF、Markdown、HTML、JSON）
- ✅ 代码主题切换
- ✅ 文章分享功能
- ✅ 阅读时间自动计算

**数据模型：**
- Articles（文章）- 完整的 CRUD
- Categories（分类）- 带色彩标识
- ArticleVersions（版本）- 自动追踪
- Comments（评论）- 带审核机制

**技术亮点：**
- Drizzle ORM + Zod 类型安全
- TanStack Query 数据管理
- Shadcn UI 高质量组件库
- 完整的 TypeScript 支持
- 响应式 Tailwind CSS 设计
