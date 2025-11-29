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

    const sampleArticles: Article[] = [
      {
        id: "art-1",
        title: "React 18 新特性详解：Concurrent Mode 与 Suspense",
        slug: "react-18-new-features",
        content: `# React 18 新特性详解

React 18 带来了许多令人兴奋的新特性，让我们一起来深入了解。

## Concurrent Mode

Concurrent Mode 是 React 18 中最重要的特性之一。它允许 React 在渲染过程中暂停和恢复工作，从而实现更流畅的用户体验。

\`\`\`javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

## Automatic Batching

React 18 引入了自动批处理，可以将多个状态更新合并为一次重新渲染。

\`\`\`javascript
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 18 会自动批处理这些更新
}
\`\`\`

## Suspense 改进

Suspense 现在支持在服务端渲染中使用：

\`\`\`tsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
\`\`\`

## useTransition Hook

新的 \`useTransition\` Hook 让你可以标记某些更新为"过渡"状态：

\`\`\`javascript
import { useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  
  const handleChange = (e) => {
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };
  
  return (
    <div>
      <input onChange={handleChange} />
      {isPending && <Spinner />}
    </div>
  );
}
\`\`\`

> React 18 是一个重要的里程碑，标志着 React 向更高效的并发渲染迈出了重要一步。`,
        excerpt: "深入解析 React 18 的 Concurrent Mode、Automatic Batching、Suspense 改进和 useTransition Hook 等新特性。",
        categoryId: "cat-1",
        tags: ["react", "javascript", "frontend"],
        published: true,
        readingTime: 5,
        createdAt: new Date("2024-11-25"),
        updatedAt: new Date("2024-11-25"),
      },
      {
        id: "art-2",
        title: "TypeScript 高级类型技巧：提升代码质量的秘诀",
        slug: "typescript-advanced-types",
        content: `# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，让我们来学习一些高级技巧。

## 条件类型

条件类型允许我们根据条件选择不同的类型：

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
\`\`\`

## 映射类型

映射类型可以基于现有类型创建新类型：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
\`\`\`

## 模板字面量类型

TypeScript 4.1 引入的模板字面量类型非常强大：

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>;  // 'onClick'
type HoverEvent = EventName<'hover'>;  // 'onHover'
\`\`\`

## infer 关键字

\`infer\` 关键字用于在条件类型中推断类型：

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string {
  return 'Hello';
}

type GreetReturn = ReturnType<typeof greet>;  // string
\`\`\`

## 实用工具类型

TypeScript 内置了许多实用工具类型：

\`\`\`typescript
// Partial - 使所有属性可选
type PartialUser = Partial<User>;

// Required - 使所有属性必填
type RequiredUser = Required<User>;

// Pick - 选择特定属性
type UserName = Pick<User, 'name'>;

// Omit - 排除特定属性
type UserWithoutAge = Omit<User, 'age'>;
\`\`\`

掌握这些高级类型技巧，可以帮助你写出更安全、更可维护的代码。`,
        excerpt: "学习 TypeScript 的条件类型、映射类型、模板字面量类型和 infer 关键字等高级技巧。",
        categoryId: "cat-1",
        tags: ["typescript", "javascript", "types"],
        published: true,
        readingTime: 6,
        createdAt: new Date("2024-11-20"),
        updatedAt: new Date("2024-11-20"),
      },
      {
        id: "art-3",
        title: "Node.js 性能优化实战：从入门到精通",
        slug: "nodejs-performance-optimization",
        content: `# Node.js 性能优化实战

在生产环境中，Node.js 应用的性能至关重要。本文将介绍一些实用的优化技巧。

## 使用 Cluster 模块

Node.js 是单线程的，但我们可以使用 Cluster 模块利用多核 CPU：

\`\`\`javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork(); // 自动重启
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World');
  }).listen(8000);
  
  console.log(\`Worker \${process.pid} started\`);
}
\`\`\`

## 内存优化

监控和优化内存使用：

\`\`\`javascript
// 查看内存使用情况
const used = process.memoryUsage();
console.log(\`heapTotal: \${Math.round(used.heapTotal / 1024 / 1024)} MB\`);
console.log(\`heapUsed: \${Math.round(used.heapUsed / 1024 / 1024)} MB\`);

// 使用 Stream 处理大文件
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('large-file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('large-file.txt.gz'));
\`\`\`

## 缓存策略

实现有效的缓存策略：

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 100 });

async function getData(key) {
  // 先检查缓存
  const cached = cache.get(key);
  if (cached) return cached;
  
  // 从数据库获取
  const data = await db.query(key);
  cache.set(key, data);
  return data;
}
\`\`\`

## 异步优化

正确使用 async/await 和 Promise.all：

\`\`\`javascript
// 错误示例 - 串行执行
async function slow() {
  const a = await fetchA();
  const b = await fetchB();
  return [a, b];
}

// 正确示例 - 并行执行
async function fast() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]);
  return [a, b];
}
\`\`\`

通过这些优化技巧，你可以显著提升 Node.js 应用的性能。`,
        excerpt: "深入学习 Node.js 性能优化技巧，包括 Cluster 模块、内存优化、缓存策略和异步优化等。",
        categoryId: "cat-2",
        tags: ["nodejs", "backend", "performance"],
        published: true,
        readingTime: 7,
        createdAt: new Date("2024-11-15"),
        updatedAt: new Date("2024-11-15"),
      },
      {
        id: "art-4",
        title: "Go 语言并发编程：Goroutine 和 Channel 详解",
        slug: "go-concurrency-programming",
        content: `# Go 语言并发编程

Go 语言以其强大的并发支持而闻名。让我们深入了解 Goroutine 和 Channel。

## Goroutine 基础

Goroutine 是 Go 语言的轻量级线程：

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")  // 启动一个 goroutine
    say("hello")
}
\`\`\`

## Channel 通信

Channel 用于 goroutine 之间的通信：

\`\`\`go
package main

import "fmt"

func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum  // 发送 sum 到 channel
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}
    c := make(chan int)
    
    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    
    x, y := <-c, <-c  // 从 channel 接收
    fmt.Println(x, y, x+y)
}
\`\`\`

## 带缓冲的 Channel

\`\`\`go
ch := make(chan int, 2)  // 创建缓冲大小为 2 的 channel
ch <- 1
ch <- 2
fmt.Println(<-ch)
fmt.Println(<-ch)
\`\`\`

## Select 语句

Select 用于处理多个 channel 操作：

\`\`\`go
select {
case msg1 := <-c1:
    fmt.Println("received", msg1)
case msg2 := <-c2:
    fmt.Println("received", msg2)
case <-time.After(time.Second):
    fmt.Println("timeout")
default:
    fmt.Println("no message received")
}
\`\`\`

## Worker Pool 模式

实现一个简单的 Worker Pool：

\`\`\`go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // 发送 9 个任务
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // 收集结果
    for a := 1; a <= 9; a++ {
        <-results
    }
}
\`\`\`

掌握 Go 的并发编程，可以让你编写高效的并发应用程序。`,
        excerpt: "深入学习 Go 语言的 Goroutine、Channel、Select 语句和 Worker Pool 模式等并发编程技巧。",
        categoryId: "cat-2",
        tags: ["go", "concurrency", "backend"],
        published: true,
        readingTime: 8,
        createdAt: new Date("2024-11-10"),
        updatedAt: new Date("2024-11-10"),
      },
      {
        id: "art-5",
        title: "PostgreSQL 查询优化：索引策略与执行计划分析",
        slug: "postgresql-query-optimization",
        content: `# PostgreSQL 查询优化

数据库性能优化是后端开发的重要技能。本文将介绍 PostgreSQL 的查询优化技巧。

## 索引基础

创建合适的索引是优化查询的第一步：

\`\`\`sql
-- 创建 B-tree 索引（默认）
CREATE INDEX idx_users_email ON users(email);

-- 创建复合索引
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- 创建部分索引
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- 创建表达式索引
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
\`\`\`

## 执行计划分析

使用 EXPLAIN ANALYZE 分析查询：

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

## 常见优化策略

### 1. 避免 SELECT *

\`\`\`sql
-- 不推荐
SELECT * FROM users WHERE id = 1;

-- 推荐
SELECT id, name, email FROM users WHERE id = 1;
\`\`\`

### 2. 使用 EXISTS 代替 IN

\`\`\`sql
-- 可能较慢
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);

-- 通常更快
SELECT * FROM users u WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
\`\`\`

### 3. 批量操作

\`\`\`sql
-- 批量插入
INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');

-- 使用 CTE 进行复杂更新
WITH updated AS (
  SELECT id FROM users WHERE status = 'pending' LIMIT 100
)
UPDATE users SET status = 'processed' WHERE id IN (SELECT id FROM updated);
\`\`\`

## 分区表

对于大表，考虑使用分区：

\`\`\`sql
-- 创建分区表
CREATE TABLE orders (
  id SERIAL,
  user_id INT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP
) PARTITION BY RANGE (created_at);

-- 创建分区
CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
  
CREATE TABLE orders_2024_q2 PARTITION OF orders
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
\`\`\`

## 查询缓存和连接池

\`\`\`sql
-- 查看缓存命中率
SELECT 
  sum(blks_hit) / (sum(blks_hit) + sum(blks_read)) as cache_hit_ratio
FROM pg_stat_database;

-- 查看当前连接数
SELECT count(*) FROM pg_stat_activity;
\`\`\`

通过这些优化技巧，你可以显著提升 PostgreSQL 数据库的查询性能。`,
        excerpt: "学习 PostgreSQL 的索引策略、执行计划分析、查询优化和分区表等数据库优化技巧。",
        categoryId: "cat-5",
        tags: ["postgresql", "database", "sql", "optimization"],
        published: true,
        readingTime: 9,
        createdAt: new Date("2024-11-05"),
        updatedAt: new Date("2024-11-05"),
      },
      {
        id: "art-6",
        title: "Rust 入门：所有权与借用系统深度解析",
        slug: "rust-ownership-borrowing",
        content: `# Rust 入门：所有权与借用

Rust 的所有权系统是其最独特的特性，让我们深入了解。

## 所有权规则

Rust 的所有权规则：

1. 每个值都有一个所有者
2. 同一时间只能有一个所有者
3. 当所有者离开作用域时，值会被丢弃

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 的所有权转移给 s2
    
    // println!("{}", s1);  // 错误！s1 不再有效
    println!("{}", s2);  // 正确
}
\`\`\`

## 克隆与复制

\`\`\`rust
// 使用 clone 进行深拷贝
let s1 = String::from("hello");
let s2 = s1.clone();
println!("{}, {}", s1, s2);  // 两个都有效

// 实现 Copy trait 的类型会自动复制
let x = 5;
let y = x;
println!("{}, {}", x, y);  // 两个都有效
\`\`\`

## 引用与借用

引用允许你使用值而不获取所有权：

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // 借用 s1
    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
\`\`\`

## 可变引用

\`\`\`rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s);  // 输出: hello, world
}

fn change(s: &mut String) {
    s.push_str(", world");
}
\`\`\`

## 借用规则

1. 同一时间只能有一个可变引用
2. 可以有多个不可变引用
3. 引用必须总是有效的

\`\`\`rust
let mut s = String::from("hello");

let r1 = &s;      // 不可变引用
let r2 = &s;      // 不可变引用
println!("{} and {}", r1, r2);

let r3 = &mut s;  // 可变引用
println!("{}", r3);
\`\`\`

## 生命周期

生命周期确保引用的有效性：

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("long string");
    let s2 = String::from("xyz");
    let result = longest(&s1, &s2);
    println!("The longest string is {}", result);
}
\`\`\`

## 结构体中的生命周期

\`\`\`rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
}
\`\`\`

理解所有权和借用系统是掌握 Rust 的关键。`,
        excerpt: "深入了解 Rust 的所有权规则、引用与借用、可变引用、借用规则和生命周期等核心概念。",
        categoryId: "cat-2",
        tags: ["rust", "ownership", "programming"],
        published: true,
        readingTime: 10,
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date("2024-11-01"),
      },
    ];

    sampleArticles.forEach((article) => this.articles.set(article.id, article));
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

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(
    id: string,
    updates: Partial<InsertArticle>
  ): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date(),
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(
    id: string,
    updates: Partial<InsertCategory>
  ): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }
}

export const storage = new MemStorage();
