import { Link } from "wouter";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-404-title">404</h1>
        <h2 className="text-xl font-semibold mb-4">页面未找到</h2>
        <p className="text-muted-foreground mb-8">
          抱歉，您访问的页面不存在或已被移动到其他位置。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => window.history.back()} variant="outline" data-testid="button-go-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上一页
          </Button>
          <Link href="/">
            <Button data-testid="button-go-home">
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
