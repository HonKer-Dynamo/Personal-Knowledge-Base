import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema, insertCommentSchema, insertArticleVersionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertCategorySchema.partial().parse(req.body);
      
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Article Versions API
  app.get("/api/articles/:id/versions", async (req, res) => {
    try {
      const { id } = req.params;
      const versions = await storage.getArticleVersions(id);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  });

  app.post("/api/articles/:id/versions", async (req, res) => {
    try {
      const { id } = req.params;
      const versionData = req.body;
      const validatedData = insertArticleVersionSchema.parse({
        ...versionData,
        articleId: id,
      });
      
      const version = await storage.createArticleVersion(validatedData);
      res.status(201).json(version);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save version" });
    }
  });

  // Comments API
  app.get("/api/articles/:slug/comments", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      const comments = await storage.getComments(article.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteComment(id);
      if (!deleted) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  return httpServer;
}
