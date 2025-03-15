"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ArchitectSite } from "@/lib/dataConst";
import { ExternalLink, Globe, MapPin } from "lucide-react";
import Link from "next/link";

interface SiteCardProps {
  site: ArchitectSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border-border/50">
      <CardContent className="p-0 relative flex-1">
        <div className="aspect-video w-full overflow-hidden bg-background">
          {site.canDisplayIframe ? (
            <iframe
              ref={iframeRef}
              src={site.url}
              title={site.name}
              className="w-full h-full border-0"
              style={{ opacity: isLoading ? 0 : 1 }}
              onLoad={handleIframeLoad}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <h2 className="text-lg font-bold">
                サイトのセキュリティの設定により、
              </h2>
              <h2 className="text-lg font-bold">
                埋め込みが許可されてません。
              </h2>
              <h2 className="text-lg font-bold">
                リンクからサイトにアクセスしてください。
              </h2>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 gap-2 bg-card">
        <div className="flex items-center gap-2 w-full">
          <h3 className="font-bold text-lg line-clamp-1 flex-1">{site.name}</h3>
          <Link
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={18} />
            <span className="sr-only">Visit {site.name}</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {site.isInternational ? (
            <Globe size={16} className="text-primary/70" />
          ) : (
            <MapPin size={16} className="text-primary/70" />
          )}
          <span>{site.location}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
