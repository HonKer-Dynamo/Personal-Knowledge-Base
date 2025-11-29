import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  dracula,
  atomDark,
  ghcolors,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import type { CodeTheme } from "@shared/schema";

const themeStyles: Record<CodeTheme, any> = {
  "vscode-dark": vscDarkPlus,
  dracula: dracula,
  monokai: atomDark,
  "github-light": ghcolors,
  nord: nord,
};

const languageNames: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  py: "Python",
  python: "Python",
  java: "Java",
  cpp: "C++",
  "c++": "C++",
  c: "C",
  cs: "C#",
  csharp: "C#",
  go: "Go",
  rust: "Rust",
  rs: "Rust",
  rb: "Ruby",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  kt: "Kotlin",
  scala: "Scala",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  less: "Less",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  xml: "XML",
  markdown: "Markdown",
  md: "Markdown",
  bash: "Bash",
  shell: "Shell",
  sh: "Shell",
  zsh: "Zsh",
  powershell: "PowerShell",
  ps1: "PowerShell",
  dockerfile: "Dockerfile",
  docker: "Docker",
  nginx: "Nginx",
  apache: "Apache",
  graphql: "GraphQL",
  gql: "GraphQL",
  prisma: "Prisma",
  toml: "TOML",
  ini: "INI",
  lua: "Lua",
  r: "R",
  matlab: "MATLAB",
  perl: "Perl",
  haskell: "Haskell",
  hs: "Haskell",
  elixir: "Elixir",
  ex: "Elixir",
  clojure: "Clojure",
  clj: "Clojure",
  vim: "Vim",
  diff: "Diff",
  makefile: "Makefile",
  cmake: "CMake",
  asm: "Assembly",
  wasm: "WebAssembly",
  solidity: "Solidity",
  sol: "Solidity",
};

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "text",
  showLineNumbers = true,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { codeTheme, theme } = useTheme();

  const effectiveTheme = theme === "light" && codeTheme === "vscode-dark" ? "github-light" : codeTheme;
  const style = themeStyles[effectiveTheme];

  const displayLanguage = languageNames[language.toLowerCase()] || language.toUpperCase();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group relative rounded-md overflow-hidden border border-border/50 my-4 ${className}`}
      data-testid="code-block"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">
            {displayLanguage}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          data-testid="button-copy-code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={style}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            textAlign: "right",
            userSelect: "none",
            opacity: 0.5,
          }}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            },
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm text-foreground">
      {children}
    </code>
  );
}
