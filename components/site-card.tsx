"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ArchitectSite } from "@/lib/dataConst";
import { ExternalLink, Globe, MapPin } from "lucide-react";
import Link from "next/link";

interface SiteCardProps {
  site: ArchitectSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // iframeのエラーを検出するためのタイムアウト
  useEffect(() => {
    if (!site.canDisplayIframe) return;

    // 5秒後にまだロード中の場合はエラーとみなす
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, site.canDisplayIframe]);

  // コンソールエラーを抑制するためのエラーハンドラー
  useEffect(() => {
    const originalConsoleError = console.error;

    // 特定のエラーメッセージを抑制
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || "";

      // React関連のエラーやiframe関連のエラーを抑制
      if (
        errorMessage.includes("Minified React error") ||
        errorMessage.includes("X-Frame-Options") ||
        errorMessage.includes("Content Security Policy") ||
        errorMessage.includes("frame-ancestors")
      ) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // サイトのプレビューを表示
  const renderPreview = () => {
    if (site.thumbnail) {
      return (
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${site.thumbnail})` }}
        />
      );
    }

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <h2 className="text-lg font-bold mb-2">{site.name}</h2>{" "}
          <p className="text-sm text-muted-foreground">
            セキュリティの設定により
          </p>
          <p className="text-sm text-muted-foreground">
            プレビューを表示できません
          </p>
          <Link
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-primary hover:underline"
          >
            サイトを開く
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border-border/50">
      <CardContent className="p-0 relative flex-1">
        <div className="aspect-video w-full overflow-hidden bg-background">
          {site.canDisplayIframe && !hasError ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={site.url}
                title={site.name}
                className="w-full h-full border-0"
                style={{ opacity: isLoading ? 0 : 1 }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </>
          ) : (
            renderPreview()
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
