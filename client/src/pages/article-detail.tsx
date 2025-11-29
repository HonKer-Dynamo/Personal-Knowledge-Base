import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  BookOpen,
  Edit,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Comments } from "@/components/comments";
import { VersionHistory } from "@/components/version-history";
import { useToast } from "@/hooks/use-toast";
import type { Article, Category } from "@shared/schema";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: article, isLoading: articleLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", slug],
    enabled: !!slug,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const category = article?.categoryId
    ? categories.find((c) => c.id === article.categoryId)
    : undefined;

  const formattedDate = article?.createdAt
    ? new Date(article.createdAt).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article?.title,
        text: article?.excerpt || "",
        url: window.location.href,
      });
    } catch (err) {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "链接已复制",
        description: "文章链接已复制到剪贴板",
      });
    }
  };

  const handleExportPDF = () => {
    if (!article) return;

    const element = document.getElementById("article-content");
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `${article.slug}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(element).save();
      toast({
        title: "导出成功",
        description: `${article.title}.pdf 已下载`,
      });
    }
  };

  if (articleLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <Skeleton className="h-8 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold mb-2">文章未找到</h1>
        <p className="text-muted-foreground mb-6">
          抱歉，您访问的文章不存在或已被删除
        </p>
        <Link href="/">
          <Button data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          {category && (
            <Badge
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
          {article.tags?.map((tag) => (
            <Badge key={tag} variant="outline" data-testid={`badge-tag-${tag}`}>
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          data-testid="text-article-title"
        >
          {article.title}
        </h1>

        {article.excerpt && (
          <p
            className="text-lg text-muted-foreground mb-6"
            data-testid="text-article-excerpt"
          >
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.createdAt?.toString()} data-testid="text-article-date">
              {formattedDate}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span data-testid="text-article-reading-time">
              {article.readingTime} 分钟阅读
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportPDF}
              data-testid="button-export-pdf"
              title="导出为PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Link href={`/edit/${article.slug}`}>
              <Button variant="ghost" size="icon" data-testid="button-edit">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      <div id="article-content" className="article-content" data-testid="article-content">
        <MarkdownRenderer content={article.content} />
      </div>

      <Separator className="my-12" />

      <VersionHistory articleId={article.id} />

      <Separator className="my-12" />

      <Comments articleSlug={article.slug} articleId={article.id} />

      <Separator className="my-12" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/">
          <Button variant="outline" data-testid="button-back-bottom">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回文章列表
          </Button>
        </Link>
        <Button onClick={handleShare} data-testid="button-share-bottom">
          <Share2 className="h-4 w-4 mr-2" />
          分享文章
        </Button>
      </div>
    </article>
  );
}
