import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Save, Send, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownRenderer } from "./markdown-renderer";
import type { Category, InsertArticle } from "@shared/schema";

const articleFormSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题不能超过200个字符"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

interface ArticleEditorProps {
  categories: Category[];
  initialData?: Partial<ArticleFormData>;
  onSubmit: (data: InsertArticle) => void;
  isSubmitting?: boolean;
}

export function ArticleEditor({
  categories,
  initialData,
  onSubmit,
  isSubmitting = false,
}: ArticleEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      categoryId: initialData?.categoryId || "",
      tags: initialData?.tags || [],
      published: initialData?.published || false,
    },
  });

  const content = form.watch("content");
  const tags = form.watch("tags");

  const addTag = useCallback(() => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      form.setValue("tags", [...tags, trimmedTag]);
      setTagInput("");
    }
  }, [tagInput, tags, form]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      form.setValue(
        "tags",
        tags.filter((t) => t !== tagToRemove)
      );
    },
    [tags, form]
  );

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100);
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const charsPerMinute = 500;
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.replace(/\s+/g, "").length;
    return Math.max(1, Math.ceil((words + chars / 2) / ((wordsPerMinute + charsPerMinute) / 2)));
  };

  const handleFormSubmit = (data: ArticleFormData) => {
    const slug = generateSlug(data.title);
    const readingTime = calculateReadingTime(data.content);
    
    onSubmit({
      ...data,
      slug,
      readingTime,
      categoryId: data.categoryId || null,
      excerpt: data.excerpt || data.content.substring(0, 200).replace(/[#*`\n]/g, "").trim(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>文章标题</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入文章标题..."
                      className="text-lg font-medium"
                      data-testid="input-title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>文章摘要 (可选)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="简短描述文章内容..."
                      data-testid="input-excerpt"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          data-testid={`option-category-${cat.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>标签</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="添加标签..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  data-testid="input-tag"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addTag}
                  data-testid="button-add-tag"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1"
                      data-testid={`badge-tag-${tag}`}
                    >
                      #{tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "write" | "preview")}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              <TabsTrigger value="write" data-testid="tab-write">
                <Eye className="h-4 w-4 mr-2" />
                编辑
              </TabsTrigger>
              <TabsTrigger value="preview" data-testid="tab-preview">
                <EyeOff className="h-4 w-4 mr-2" />
                预览
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="write" className="mt-0">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="使用 Markdown 格式编写文章内容...

# 标题
## 二级标题

普通段落文本

```javascript
// 代码块示例
const hello = 'world';
console.log(hello);
```

- 列表项 1
- 列表项 2

> 引用文本

**粗体** 和 *斜体*"
                      className="min-h-[500px] font-mono text-sm resize-none"
                      data-testid="textarea-content"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <Card className="min-h-[500px] p-6 overflow-auto">
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  暂无内容预览
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => form.setValue("published", false)}
            data-testid="button-save-draft"
          >
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => form.setValue("published", true)}
            data-testid="button-publish"
          >
            <Send className="h-4 w-4 mr-2" />
            发布文章
          </Button>
        </div>
      </form>
    </Form>
  );
}
