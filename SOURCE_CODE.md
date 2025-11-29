# 个人知识库 - 完整源码

## 项目概览

一个全栈 TypeScript 个人知识库网站，支持 Markdown 编辑、代码高亮（5 种主题）、分类/标签系统。

**技术栈**: React + TypeScript + Tailwind CSS + Shadcn UI + Express.js + 内存存储

---

## 目录结构

```
.
├── shared/
│   └── schema.ts                 # 数据模型定义
├── server/
│   ├── storage.ts                # 内存存储实现
│   └── routes.ts                 # API 路由
├── client/src/
│   ├── App.tsx                   # 应用入口
│   ├── index.css                 # 全局样式
│   ├── lib/
│   │   ├── queryClient.ts        # TanStack Query 配置
│   │   ├── theme-context.tsx     # 主题管理
│   │   └── utils.ts              # 工具函数
│   ├── pages/
│   │   ├── home.tsx              # 首页
│   │   ├── article-detail.tsx    # 文章详情
│   │   ├── write.tsx             # 写文章
│   │   ├── edit.tsx              # 编辑文章
│   │   └── not-found.tsx         # 404 页面
│   ├── components/
│   │   ├── header.tsx            # 导航栏
│   │   ├── footer.tsx            # 页脚
│   │   ├── article-card.tsx      # 文章卡片
│   │   ├── article-editor.tsx    # Markdown 编辑器
│   │   ├── category-filter.tsx   # 分类/标签筛选
│   │   ├── code-block.tsx        # 代码高亮
│   │   ├── markdown-renderer.tsx # Markdown 渲染
│   │   └── ui/                   # Shadcn UI 组件库
│   ├── hooks/
│   │   └── use-toast.ts          # Toast 钩子
│   └── index.tsx                 # React 入口
├── design_guidelines.md          # 设计规范
├── replit.md                     # 项目信息
└── SOURCE_CODE.md                # 本文件
```

---

## 核心源码

### 1. shared/schema.ts - 数据模型

```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#3b82f6"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  categoryId: varchar("category_id"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  published: boolean("published").notNull().default(false),
  readingTime: integer("reading_time").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type CodeTheme = 'vscode-dark' | 'dracula' | 'monokai' | 'github-light' | 'nord';

export const CODE_THEMES: { id: CodeTheme; name: string; description: string }[] = [
  { id: 'vscode-dark', name: 'VS Code Dark', description: '深色背景，温暖的语法颜色' },
  { id: 'dracula', name: 'Dracula', description: '紫色/粉色配色方案' },
  { id: 'monokai', name: 'Monokai', description: '经典的深色主题' },
  { id: 'github-light', name: 'GitHub Light', description: '清新的浅色背景' },
  { id: 'nord', name: 'Nord', description: '冷蓝灰色调' },
];
```

### 2. server/storage.ts - 存储层

```typescript
import {
  type User,
  type InsertUser,
  type Article,
  type InsertArticle,
  type Category,
  type InsertCategory,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;
  private categories: Map<string, Category>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.categories = new Map();
    this.initSampleData();
  }

  private initSampleData() {
    const categories: Category[] = [
      { id: "cat-1", name: "前端开发", slug: "frontend", color: "#3b82f6" },
      { id: "cat-2", name: "后端开发", slug: "backend", color: "#10b981" },
      { id: "cat-3", name: "系统设计", slug: "system-design", color: "#8b5cf6" },
      { id: "cat-4", name: "DevOps", slug: "devops", color: "#f59e0b" },
      { id: "cat-5", name: "数据库", slug: "database", color: "#ef4444" },
    ];

    categories.forEach((cat) => this.categories.set(cat.id, cat));

    // 初始化示例文章（6 篇）...
    // （详见原始文件）
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // ... 其他 CRUD 方法
}

export const storage = new MemStorage();
```

### 3. server/routes.ts - API 路由

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // 文章 API
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      
      const existingArticle = await storage.getArticleBySlug(validatedData.slug);
      if (existingArticle) {
        const uniqueSlug = `${validatedData.slug}-${Date.now()}`;
        validatedData.slug = uniqueSlug;
      }
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertArticleSchema.partial().parse(req.body);
      
      const article = await storage.updateArticle(id, updates);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteArticle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // 分类 API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // ... 其他分类路由

  return httpServer;
}
```

### 4. client/src/App.tsx - 应用入口

```typescript
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import ArticleDetail from "@/pages/article-detail";
import WritePage from "@/pages/write";
import EditPage from "@/pages/edit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:slug" component={ArticleDetail} />
      <Route path="/write" component={WritePage} />
      <Route path="/edit/:slug" component={EditPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### 5. client/src/lib/theme-context.tsx - 主题管理

```typescript
import { createContext, useContext, useEffect, useState } from "react";
import type { CodeTheme } from "@shared/schema";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  codeTheme: CodeTheme;
  setTheme: (theme: Theme) => void;
  setCodeTheme: (theme: CodeTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const [codeTheme, setCodeThemeState] = useState<CodeTheme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("codeTheme") as CodeTheme;
      if (stored) return stored;
    }
    return "vscode-dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("codeTheme", codeTheme);
  }, [codeTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setCodeTheme = (newCodeTheme: CodeTheme) => {
    setCodeThemeState(newCodeTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, codeTheme, setTheme, setCodeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

### 6. client/src/components/code-block.tsx - 代码高亮

```typescript
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  dracula,
  atomDark,
  ghcolors,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import type { CodeTheme } from "@shared/schema";

const themeStyles: Record<CodeTheme, any> = {
  "vscode-dark": vscDarkPlus,
  dracula: dracula,
  monokai: atomDark,
  "github-light": ghcolors,
  nord: nord,
};

const languageNames: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  py: "Python",
  python: "Python",
  java: "Java",
  cpp: "C++",
  go: "Go",
  rust: "Rust",
  rb: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  bash: "Bash",
  shell: "Shell",
  json: "JSON",
  yaml: "YAML",
  // ... 更多语言支持
};

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "text",
  showLineNumbers = true,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { codeTheme, theme } = useTheme();

  const effectiveTheme = theme === "light" && codeTheme === "vscode-dark" ? "github-light" : codeTheme;
  const style = themeStyles[effectiveTheme];

  const displayLanguage = languageNames[language.toLowerCase()] || language.toUpperCase();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group relative rounded-md overflow-hidden border border-border/50 my-4 ${className}`}
      data-testid="code-block"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">
            {displayLanguage}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          data-testid="button-copy-code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={style}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            textAlign: "right",
            userSelect: "none",
            opacity: 0.5,
          }}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            },
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm text-foreground">
      {children}
    </code>
  );
}
```

### 7. client/src/components/markdown-renderer.tsx - Markdown 渲染

```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CodeBlock, InlineCode } from "./code-block";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;
            
            if (isInline) {
              return <InlineCode>{children}</InlineCode>;
            }

            return (
              <CodeBlock
                code={String(children).replace(/\n$/, "")}
                language={match ? match[1] : "text"}
              />
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 pb-2 border-b border-border">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-8 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-lg leading-relaxed mb-6 text-foreground/90">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-6 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-6 space-y-2">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-muted/30 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

---

## 功能特性

✅ **文章管理** - 创建、编辑、删除、发布文章  
✅ **Markdown 编辑** - 实时预览、自动 slug 生成、阅读时间计算  
✅ **代码高亮** - 5 种主题，支持 50+ 编程语言  
✅ **分类系统** - 分类筛选、标签云、全文搜索  
✅ **主题切换** - 明/暗模式、代码配色主题  
✅ **响应式设计** - 完全适配移动端  
✅ **用户体验** - 加载状态、错误处理、成功提示  

---

## 部署说明

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start
```

---

## 环境变量

无需额外环境变量，内存存储已预装示例数据。

---

## 项目亮点

1. **完整的 TypeScript** - 前后端均使用 TypeScript，类型安全
2. **现代开发工具** - Vite + React 18 + TanStack Query v5
3. **UI 组件库** - Shadcn UI + Tailwind CSS
4. **专业代码高亮** - react-syntax-highlighter + Prism，支持多主题
5. **内存存储** - 快速、轻量级，无需数据库配置
6. **Markdown 渲染** - react-markdown + remark-gfm + rehype-raw

---

## 核心依赖版本

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Vite 5+
- Express.js
- Zod
- Drizzle ORM
- TanStack Query v5
- Wouter (路由)
- Lucide Icons
- react-syntax-highlighter

---

生成时间：2024-11-29
