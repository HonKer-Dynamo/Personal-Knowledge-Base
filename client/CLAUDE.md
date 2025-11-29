[根目录](../CLAUDE.md) > **client**

# 前端模块

## 模块职责
提供用户界面和交互体验，包括 Markdown 编辑、文章浏览、版本历史、评论系统和多格式导出功能。

## 技术栈
- React 18 + TypeScript
- Tailwind CSS + Shadcn UI
- TanStack Query (React Query)
- react-markdown + remark-gfm
- react-syntax-highlighter

## 入口与启动
- 入口文件: `client/src/main.tsx`
- 启动命令: `npm run dev`

## 核心组件

### 1. ArticleCard (文章卡片)
- **位置**: `client/src/components/article-card.tsx`
- **功能**: 展示文章摘要信息的卡片组件，用于文章列表页面。
- **Props**:
  - `article`: Article 对象，包含文章标题、摘要、创建日期、阅读时间、标签等信息
  - `category`: 可选，Category 对象，文章所属分类
- **特点**:
  - 支持悬停效果
  - 显示分类标签、标题、摘要、创建日期、阅读时间和标签
  - 包含骨架屏组件 `ArticleCardSkeleton` 用于加载状态
- **使用**: 主要在首页和文章列表页面展示多篇文章。

### 2. Comments (评论系统)
- **位置**: `client/src/components/comments.tsx`
- **功能**: 实现文章评论功能，支持访客留言和评论列表展示。
- **Props**:
  - `articleSlug`: 文章 slug
  - `articleId`: 文章 ID
- **状态**:
  - 表单状态: author, email, content
  - 提交状态: isSubmitting
- **依赖**:
  - TanStack Query: 获取和缓存评论
  - 自定义 API 请求: 提交评论
- **功能点**:
  - 评论表单验证
  - 异步提交评论
  - 自动刷新评论列表
  - Toast 消息反馈

### 3. MarkdownRenderer (Markdown 渲染器)
- **位置**: `client/src/components/markdown-renderer.tsx`
- **功能**: 将 Markdown 文本渲染为美观的 HTML。
- **Props**:
  - `content`: Markdown 内容
  - `className`: 可选，容器类名
- **依赖**:
  - react-markdown + remark-gfm
  - rehype-raw
  - 自定义 CodeBlock 组件
- **特点**:
  - 支持 GFM (GitHub Flavored Markdown)
  - 自定义所有 Markdown 元素的渲染样式
  - 与 CodeBlock 集成实现代码高亮

### 4. ArticleEditor (文章编辑器)
- **位置**: `client/src/components/article-editor.tsx`
- **功能**: 实现 Markdown 文章的编写、编辑和预览功能。
- **Props**:
  - `categories`: 分类列表
  - `initialData`: 可选，初始文章数据
  - `onSubmit`: 提交回调
  - `isSubmitting`: 可选，提交状态
- **状态**:
  - `showPreview`: 预览模式切换
  - `tagInput`: 标签输入框内容
  - `activeTab`: 当前激活的标签页 (write/preview)
- **依赖**:
  - react-hook-form + zod
  - Shadcn UI 组件库
  - lucide-react 图标
  - 自定义 MarkdownRenderer
- **功能点**:
  - 表单验证 (标题、内容不能为空)
  - Markdown 实时预览
  - 标签添加/删除 (Enter 键快捷添加)
  - 自动生成 slug (基于标题)
  - 自动计算阅读时间
  - 分类选择器
  - 草稿/发布切换
  - 响应式布局

### 5. CategoryFilter (分类筛选器)
- **位置**: `client/src/components/category-filter.tsx`
- **功能**: 实现文章分类的筛选功能，支持横向滚动。
- **Props**:
  - `categories`: 分类列表
  - `selectedCategory`: 当前选中的分类 ID (null 表示"全部")
  - `onSelectCategory`: 分类选择回调
- **特点**:
  - 默认显示"全部"按钮
  - 选中状态使用分类的自定义颜色
  - 支持横向滚动 (针对分类较多的情况)
  - 响应式设计

### 6. TagCloud (标签云)
- **位置**: `client/src/components/category-filter.tsx`
- **功能**: 展示文章标签并支持标签筛选。
- **Props**:
  - `tags`: 标签列表
  - `selectedTags`: 当前选中的标签列表
  - `onToggleTag`: 标签切换回调
- **特点**:
  - 标签为空时自动隐藏
  - 选中状态使用默认主题色
  - 支持点击切换标签状态
  - 悬停效果提升交互体验

### 7. CodeBlock (代码块)
- **位置**: `client/src/components/code-block.tsx`
- **功能**: 实现代码高亮和复制功能。
- **Props**:
  - `code`: 代码内容
  - `language`: 可选，代码语言
  - `showLineNumbers`: 可选，是否显示行号 (默认: true)
  - `className`: 可选，容器类名
- **依赖**:
  - react-syntax-highlighter
  - lucide-react 图标
  - 自定义主题上下文
- **支持的主题**:
  - VS Code Dark (默认)
  - Dracula
  - Monokai
  - GitHub Light
  - Nord
- **特点**:
  - 自动识别并展示40+种编程语言名称
  - 支持明暗主题自适应
  - 悬浮时显示复制按钮
  - 复制成功后显示勾选动画
  - 响应式设计，支持横向滚动

### 8. InlineCode (内联代码)
- **位置**: `client/src/components/code-block.tsx`
- **功能**: 实现内联代码的样式化展示。
- **Props**:
  - `children`: 代码内容
- **特点**:
  - 简洁的背景色和边框样式
  - 使用等宽字体
  - 与文本内容自然融合

### 9. ExportMenu (导出菜单)
- **位置**: `client/src/components/export-menu.tsx`
- **功能**: 实现文章的多格式导出功能。
- **Props**:
  - `article`: 要导出的文章对象
- **依赖**:
  - lucide-react 图标
  - Shadcn UI DropdownMenu 组件
  - 自定义 Toast 通知系统
- **支持的导出格式**:
  - Markdown (.md)
  - HTML (.html)
  - JSON (.json)
- **特点**:
  - 下拉菜单样式，支持多种导出选项
  - 客户端直接生成文件，无需服务器请求
  - 导出成功后显示 Toast 通知
  - 自动使用文章 slug 作为文件名

### 10. Footer (页脚)
- **位置**: `client/src/components/footer.tsx`
- **功能**: 显示网站页脚，包含导航链接、技术栈信息和联系方式。
- **Props**: 无
- **依赖**:
  - lucide-react 图标
  - Shadcn UI 组件库
- **结构**:
  - 网站标识和描述
  - 快速链接
  - 技术栈列表
  - 社交媒体联系方式
- **特点**:
  - 响应式网格布局
  - 自动更新当前年份
  - 简洁的社交媒体按钮样式
  - 与主题风格一致的配色方案

### 11. Header (导航栏)
- **位置**: `client/src/components/header.tsx`
- **功能**: 网站导航栏，包含logo、导航链接、主题切换和代码配色主题选择。
- **Props**: 无
- **依赖**:
  - lucide-react 图标
  - Shadcn UI 组件库
  - 自定义主题上下文
- **结构**:
  - 网站logo和名称
  - 桌面端导航链接
  - 代码配色主题下拉菜单
  - 明暗主题切换按钮
  - 移动端菜单
- **特点**:
  - 顶部粘性定位
  - 半透明背景模糊效果
  - 导航链接激活状态指示
  - 支持5种代码配色主题切换
  - 响应式设计，移动端适配
  - 平滑的主题切换动画

## 主要页面

### 1. home.tsx (首页/文章列表)
- **功能**: 展示所有已发布的文章列表，支持分类筛选、标签筛选和关键词搜索。
- **核心特性**:
  - 英雄区展示网站介绍和搜索框
  - 分类筛选器（横向滚动）
  - 标签云筛选
  - 文章卡片列表（响应式网格布局）
  - 实时统计信息（文章数、分类数、标签数）
- **技术实现**:
  - React Query 获取文章和分类数据
  - useMemo 实现数据过滤和统计
  - 支持模糊搜索（标题、摘要、内容）
  - 骨架屏加载状态
  - 分类和标签的组合筛选

### 2. article-detail.tsx (文章详情)
- **功能**: 展示单篇文章的完整内容，包括版本历史、评论系统和多格式导出功能。
- **核心特性**:
  - 文章标题、摘要和分类标签展示
  - 完整的 Markdown 内容渲染
  - 版本历史记录
  - 评论系统
  - 多种格式导出（Markdown、HTML、JSON、PDF）
  - 分享功能
  - 编辑入口
- **技术实现**:
  - React Query 获取文章和分类数据
  - MarkdownRenderer 实现内容渲染
  - VersionHistory 组件展示版本历史
  - Comments 组件提供评论功能
  - ExportMenu 实现多格式导出
  - html2pdf 实现 PDF 导出
  - Navigator.share API 实现分享功能
  - 加载状态和错误处理

### 3. write.tsx (写文章)
- **功能**: 提供 Markdown 编辑器，用于创建新文章。
- **核心特性**:
  - Markdown 实时编辑与预览
  - 标签添加与管理
  - 分类选择
  - 草稿/发布选项
- **技术实现**:
  - React-hook-form + Zod 表单验证
  - ArticleEditor 组件提供编辑功能
  - 自动生成文章 slug
  - 自动计算阅读时间

### 4. edit.tsx (编辑文章)
- **功能**: 提供 Markdown 编辑器，用于修改已有的文章。
- **核心特性**:
  - 基于文章 slug 加载现有内容
  - 与新建文章相同的编辑功能
  - 保留文章创建时间
- **技术实现**:
  - React Query 获取文章数据
  - ArticleEditor 组件提供编辑功能
  - 表单数据预填充

### 5. not-found.tsx (404页面)
- **功能**: 当用户访问不存在的页面时显示的错误页面。
- **核心特性**:
  - 友好的 404 错误提示
  - 返回上一页按钮
  - 返回首页按钮
- **技术实现**:
  - 响应式设计
  - 清晰的视觉引导
  - 简单的页面布局

## 设计特点
- 响应式设计，适配桌面、平板、手机
- 亮/暗模式切换

## 工具函数与上下文

### 1. queryClient.ts
- **位置**: `client/src/lib/queryClient.ts`
- **功能**: React Query 配置和 API 请求工具
- **核心特性**:
  - `apiRequest()`: 统一的 API 请求函数，自动处理 JSON 格式和错误
  - `getQueryFn()`: React Query 查询函数生成器，支持 401 错误处理
  - `queryClient`: 配置好的 React Query 实例，默认禁用自动刷新和重试

### 2. theme-context.tsx
- **位置**: `client/src/lib/theme-context.tsx`
- **功能**: 主题管理上下文
- **核心特性**:
  - 支持亮/暗模式切换
  - 支持 5 种代码配色主题切换
  - 使用 localStorage 持久化主题设置
  - 响应系统默认主题偏好
  - 提供 `useTheme()` Hook 方便组件使用

### 3. utils.ts
- **位置**: `client/src/lib/utils.ts`
- **功能**: 通用工具函数
- **核心特性**:
  - `cn()`: 结合 clsx 和 twMerge 的 Tailwind CSS 类合并函数
- 5种代码配色主题: VS Code Dark、Dracula、Monokai、GitHub Light、Nord

## 相关文件清单
- `client/src/components/`: UI 组件
- `client/src/pages/`: 页面
- `client/src/lib/`: 工具库
- `client/src/App.tsx`: 应用入口
