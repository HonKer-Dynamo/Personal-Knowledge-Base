import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArticleEditor } from "@/components/article-editor";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category, InsertArticle, Article } from "@shared/schema";

export default function WritePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return await response.json() as Article;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: data.published ? "文章已发布" : "草稿已保存",
        description: data.published
          ? "您的文章已成功发布！"
          : "您的草稿已保存，可以稍后继续编辑。",
      });
      if (data.published) {
        setLocation(`/article/${data.slug}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "保存失败",
        description: error.message || "无法保存文章，请稍后重试",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertArticle) => {
    createArticleMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
                  <Sparkles className="h-6 w-6 text-primary" />
                  写文章
                </h1>
                <p className="text-sm text-muted-foreground">
                  使用 Markdown 格式编写您的技术文章
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <ArticleEditor
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={createArticleMutation.isPending}
        />
      </main>
    </div>
  );
}
