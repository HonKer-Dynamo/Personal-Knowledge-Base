import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Comment } from "@shared/schema";

interface CommentsProps {
  articleSlug: string;
  articleId: string;
}

export function Comments({ articleSlug, articleId }: CommentsProps) {
  const { toast } = useToast();
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/articles", articleSlug, "comments"],
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: { author: string; email: string; content: string }) =>
      apiRequest("POST", "/api/comments", {
        articleId,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/articles", articleSlug, "comments"],
      });
      setAuthor("");
      setEmail("");
      setContent("");
      toast({
        title: "评论已提交",
        description: "感谢您的评论！我们会尽快审核。",
      });
    },
    onError: () => {
      toast({
        title: "提交失败",
        description: "评论提交失败，请重试",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !email.trim() || !content.trim()) {
      toast({
        title: "请填写所有字段",
        description: "名字、邮箱和评论内容不能为空",
        variant: "destructive",
      });
      return;
    }
    createCommentMutation.mutate({ author, email, content });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-2xl font-bold">评论 ({comments.length})</h2>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">留下你的评论</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="你的名字"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={createCommentMutation.isPending}
                data-testid="input-comment-author"
              />
              <Input
                placeholder="你的邮箱"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={createCommentMutation.isPending}
                data-testid="input-comment-email"
              />
            </div>
            <Textarea
              placeholder="说出你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={createCommentMutation.isPending}
              className="min-h-24"
              data-testid="textarea-comment-content"
            />
            <Button
              type="submit"
              disabled={createCommentMutation.isPending}
              data-testid="button-submit-comment"
            >
              <Send className="h-4 w-4 mr-2" />
              {createCommentMutation.isPending ? "提交中..." : "提交评论"}
            </Button>
          </form>
        </Card>
      </div>

      {comments.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">最新评论</h3>
          {comments.map((comment, index) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium" data-testid={`text-comment-author-${index}`}>
                    {comment.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
              </div>
              <p className="text-foreground" data-testid={`text-comment-content-${index}`}>
                {comment.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
