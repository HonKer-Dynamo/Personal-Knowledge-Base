import { BookOpen, Github, Twitter, Mail, Heart, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">知识库</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              分享技术文章和代码片段的个人博客。专注于前端开发、后端架构和系统设计。
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/write" className="hover:text-foreground transition-colors">
                  写文章
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">技术栈</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                React + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Express.js
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">联系方式</h4>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-github"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:contact@example.com" data-testid="link-email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} 知识库. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> using React
          </p>
        </div>
      </div>
    </footer>
  );
}
