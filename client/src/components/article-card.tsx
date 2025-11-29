import { Link } from "wouter";
import { Clock, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article, Category } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  category?: Category;
}

export function ArticleCard({ article, category }: ArticleCardProps) {
  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link href={`/article/${article.slug}`}>
      <Card
        className="h-full hover-elevate cursor-pointer transition-all duration-200 group"
        data-testid={`card-article-${article.id}`}
      >
        <CardHeader className="pb-3">
          {category && (
            <Badge
              variant="secondary"
              className="w-fit text-xs"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                borderColor: `${category.color}40`,
              }}
              data-testid={`badge-category-${category.id}`}
            >
              {category.name}
            </Badge>
          )}
          <h3
            className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors"
            data-testid={`text-title-${article.id}`}
          >
            {article.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-3">
          {article.excerpt && (
            <p
              className="text-muted-foreground line-clamp-3 text-sm leading-relaxed"
              data-testid={`text-excerpt-${article.id}`}
            >
              {article.excerpt}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap items-center gap-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-date-${article.id}`}>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-reading-time-${article.id}`}>
              {article.readingTime} 分钟阅读
            </span>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="h-4 w-4" />
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs" data-testid={`tag-${tag}`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ArticleCardSkeleton() {
  return (
    <Card className="h-full animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-5 w-20 bg-muted rounded" />
        <div className="h-6 w-full bg-muted rounded mt-2" />
        <div className="h-6 w-3/4 bg-muted rounded mt-1" />
      </CardHeader>
      <CardContent className="pb-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded mt-2" />
        <div className="h-4 w-2/3 bg-muted rounded mt-2" />
      </CardContent>
      <CardFooter className="flex items-center gap-4 pt-0">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}
