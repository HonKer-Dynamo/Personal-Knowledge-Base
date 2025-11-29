import { Link, useLocation } from "wouter";
import { Sun, Moon, BookOpen, PenSquare, Home, Settings, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme-context";
import { CODE_THEMES, type CodeTheme } from "@shared/schema";

export function Header() {
  const { theme, toggleTheme, codeTheme, setCodeTheme } = useTheme();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden sm:inline">知识库</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              className="gap-2"
              data-testid="link-home"
            >
              <Home className="h-4 w-4" />
              首页
            </Button>
          </Link>
          <Link href="/write">
            <Button
              variant={isActive("/write") ? "secondary" : "ghost"}
              className="gap-2"
              data-testid="link-write"
            >
              <PenSquare className="h-4 w-4" />
              写文章
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-code-theme">
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>代码配色主题</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CODE_THEMES.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => setCodeTheme(t.id as CodeTheme)}
                  className={codeTheme === t.id ? "bg-accent" : ""}
                  data-testid={`menu-theme-${t.id}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.description}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <div className="flex items-center gap-2 w-full">
                      <Home className="h-4 w-4" />
                      首页
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/write">
                    <div className="flex items-center gap-2 w-full">
                      <PenSquare className="h-4 w-4" />
                      写文章
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
