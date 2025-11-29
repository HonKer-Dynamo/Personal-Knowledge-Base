import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen, FileText, Tag, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArticleCard, ArticleCardSkeleton } from "@/components/article-card";
import { CategoryFilter, TagCloud } from "@/components/category-filter";
import type { Article, Category } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      article.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => article.published)
      .filter((article) => {
        if (selectedCategory && article.categoryId !== selectedCategory) {
          return false;
        }
        if (selectedTags.length > 0) {
          const articleTags = article.tags || [];
          if (!selectedTags.some((tag) => articleTags.includes(tag))) {
            return false;
          }
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            article.title.toLowerCase().includes(query) ||
            article.excerpt?.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [articles, selectedCategory, selectedTags, searchQuery]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getCategoryById = (id: string | null) => {
    if (!id) return undefined;
    return categories.find((c) => c.id === id);
  };

  const stats = useMemo(() => ({
    totalArticles: articles.filter((a) => a.published).length,
    totalCategories: categories.length,
    totalTags: allTags.length,
  }), [articles, categories, allTags]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            个人知识库
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            探索技术世界的
            <span className="text-primary">无限可能</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-subtitle">
            分享技术文章、代码片段和开发经验。支持多种编程语言的代码高亮，让阅读更加愉悦。
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-background/80 backdrop-blur"
              data-testid="input-search"
            />
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span data-testid="text-stats-articles">{stats.totalArticles} 篇文章</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span data-testid="text-stats-categories">{stats.totalCategories} 个分类</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span data-testid="text-stats-tags">{stats.totalTags} 个标签</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {!categoriesLoading && categories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">分类筛选</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </section>
        )}

        {allTags.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">热门标签</h2>
            <TagCloud
              tags={allTags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
            />
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-articles-heading">
              {selectedCategory
                ? `${getCategoryById(selectedCategory)?.name || ""} 分类的文章`
                : selectedTags.length > 0
                ? "筛选结果"
                : searchQuery
                ? "搜索结果"
                : "最新文章"}
            </h2>
            <span className="text-sm text-muted-foreground" data-testid="text-article-count">
              共 {filteredArticles.length} 篇
            </span>
          </div>

          {articlesLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  category={getCategoryById(article.categoryId)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">暂无文章</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "没有找到匹配的文章，请尝试其他关键词"
                  : "快去写第一篇文章吧！"}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
