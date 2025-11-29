import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ArticleVersion } from "@shared/schema";

interface VersionHistoryProps {
  articleId: string;
}

export function VersionHistory({ articleId }: VersionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: versions = [] } = useQuery<ArticleVersion[]>({
    queryKey: ["/api/articles", articleId, "versions"],
  });

  if (versions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5" />
        <h2 className="text-2xl font-bold">版本历史 ({versions.length})</h2>
      </div>

      <div className="space-y-2">
        {versions.map((version, index) => (
          <Card
            key={version.id}
            className="p-4 cursor-pointer hover-elevate"
            onClick={() =>
              setExpandedId(expandedId === version.id ? null : version.id)
            }
            data-testid={`card-version-${index}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    版本 {versions.length - index}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(version.createdAt).toLocaleString("zh-CN")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {version.title}
                </p>
              </div>
              {expandedId === version.id ? (
                <ChevronUp className="h-5 w-5 ml-2 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 ml-2 flex-shrink-0" />
              )}
            </div>

            {expandedId === version.id && (
              <>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      标题
                    </p>
                    <p className="text-sm">{version.title}</p>
                  </div>
                  {version.excerpt && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        摘要
                      </p>
                      <p className="text-sm">{version.excerpt}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      内容预览
                    </p>
                    <p className="text-sm line-clamp-3 text-muted-foreground">
                      {version.content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
