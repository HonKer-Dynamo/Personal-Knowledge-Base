import { Download, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

interface ExportMenuProps {
  article: Article;
}

export function ExportMenu({ article }: ExportMenuProps) {
  const { toast } = useToast();

  const handleExportMarkdown = () => {
    const markdown = `# ${article.title}

${article.excerpt ? `> ${article.excerpt}\n\n` : ""}${article.content}`;
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "导出成功",
      description: `${article.title}.md 已下载`,
    });
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(
      {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        tags: article.tags,
        categoryId: article.categoryId,
        published: article.published,
        readingTime: article.readingTime,
        createdAt: article.createdAt,
      },
      null,
      2
    );
    
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "导出成功",
      description: `${article.title}.json 已下载`,
    });
  };

  const handleExportHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: "Courier New", monospace; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .metadata { color: #666; font-size: 0.9em; margin-bottom: 2em; }
    .metadata p { margin: 0.3em 0; }
  </style>
</head>
<body>
  <h1>${article.title}</h1>
  <div class="metadata">
    <p><strong>发布时间:</strong> ${new Date(article.createdAt || "").toLocaleDateString("zh-CN")}</p>
    <p><strong>阅读时间:</strong> ${article.readingTime} 分钟</p>
    ${article.tags && article.tags.length > 0 ? `<p><strong>标签:</strong> ${article.tags.join(", ")}</p>` : ""}
  </div>
  ${article.excerpt ? `<p><em>${article.excerpt}</em></p>` : ""}
  <hr>
  <div>${article.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "导出成功",
      description: `${article.title}.html 已下载`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-export-menu">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>导出文章</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportMarkdown} data-testid="menu-export-markdown">
          <FileText className="h-4 w-4 mr-2" />
          导出为 Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportHTML} data-testid="menu-export-html">
          <FileText className="h-4 w-4 mr-2" />
          导出为 HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} data-testid="menu-export-json">
          <FileJson className="h-4 w-4 mr-2" />
          导出为 JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
