import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Edit } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleEditor } from "@/components/article-editor";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category, InsertArticle, Article } from "@shared/schema";

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: article, isLoading: articleLoading } = useQuery<Article>({
    queryKey: ["/api/articles", slug],
    enabled: !!slug,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await apiRequest("PATCH", `/api/articles/${article?.id}`, data);
      return await response.json() as Article;
    },
    onSuccess: async (data) => {
      // 自动保存版本
      try {
        await apiRequest("POST", `/api/articles/${article?.id}/versions`, {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          categoryId: data.categoryId,
          tags: data.tags,
          published: data.published,
          readingTime: data.readingTime,
        });
      } catch (err) {
        console.error("版本保存失败:", err);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles", slug] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles", article?.id, "versions"] });
      
      toast({
        title: data.published ? "文章已更新" : "草稿已保存",
        description: data.published
          ? "您的文章已成功更新！"
          : "您的草稿已保存。",
      });
      if (data.published) {
        setLocation(`/article/${data.slug}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "更新失败",
        description: error.message || "无法更新文章，请稍后重试",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertArticle) => {
    updateArticleMutation.mutate(data);
  };

  if (articleLoading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border/50 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">文章未找到</h1>
          <p className="text-muted-foreground mb-4">无法找到要编辑的文章</p>
          <Link href="/">
            <Button data-testid="button-back-home">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/article/${slug}`}>
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
                  <Edit className="h-6 w-6 text-primary" />
                  编辑文章
                </h1>
                <p className="text-sm text-muted-foreground">
                  修改您的文章内容
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <ArticleEditor
          categories={categories}
          initialData={{
            title: article.title,
            content: article.content,
            excerpt: article.excerpt || "",
            categoryId: article.categoryId || "",
            tags: article.tags || [],
            published: article.published,
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateArticleMutation.isPending}
        />
      </main>
    </div>
  );
}
