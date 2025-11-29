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
