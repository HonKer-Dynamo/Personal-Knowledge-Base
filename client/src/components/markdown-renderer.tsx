import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CodeBlock, InlineCode } from "./code-block";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;
            
            if (isInline) {
              return <InlineCode>{children}</InlineCode>;
            }

            return (
              <CodeBlock
                code={String(children).replace(/\n$/, "")}
                language={match ? match[1] : "text"}
              />
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 pb-2 border-b border-border" data-testid="markdown-h1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-8 mb-4" data-testid="markdown-h2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-6 mb-3" data-testid="markdown-h3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mt-4 mb-2" data-testid="markdown-h4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-lg leading-relaxed mb-6 text-foreground/90" data-testid="markdown-p">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-6 space-y-2" data-testid="markdown-ul">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-6 space-y-2" data-testid="markdown-ol">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-lg leading-relaxed text-foreground/90">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-muted/30 italic text-foreground/80" data-testid="markdown-blockquote">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
              data-testid="markdown-link"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <figure className="my-8">
              <img
                src={src}
                alt={alt}
                className="rounded-md w-full h-auto"
                loading="lazy"
                data-testid="markdown-img"
              />
              {alt && (
                <figcaption className="text-center text-sm text-muted-foreground mt-2">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border" data-testid="markdown-table">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-muted/30">
              {children}
            </tr>
          ),
          hr: () => <hr className="my-8 border-border" />,
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
