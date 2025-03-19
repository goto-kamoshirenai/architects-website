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
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);

    // iframeがロードに失敗した理由をコンソールに出力
    console.warn(
      `[Site Error] ${site.name}: iframeのロードに失敗しました。サイトのセキュリティ設定により埋め込みが制限されている可能性があります。`
    );
  };

  // Intersection Observerを使って要素が表示されたかどうかを監視
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // 10%以上表示されたら可視と判定
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // 可視状態になったらiframeをロード
  useEffect(() => {
    if (isVisible && site.canDisplayIframe) {
      setShouldLoad(true);
    }
  }, [isVisible, site.canDisplayIframe]);

  // iframeのエラーを検出するためのタイムアウト
  useEffect(() => {
    if (!shouldLoad || !site.canDisplayIframe) return;

    // 5秒後にまだロード中の場合はエラーとみなす
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, shouldLoad, site.canDisplayIframe]);

  // コンソールエラーを抑制するためのエラーハンドラー
  useEffect(() => {
    // オリジナルのコンソールメソッドを保存
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;
    const originalConsoleDebug = console.debug;

    // すべてのコンソールメソッドをオーバーライド
    type ConsoleMethod = (...data: unknown[]) => void;

    const handleConsoleMessage = (
      originalMethod: ConsoleMethod
    ): ConsoleMethod => {
      return (...args: unknown[]) => {
        const errorMessage = args[0]?.toString() || "";

        // 自分のアプリからの特定のメッセージは常に表示
        if (typeof args[0] === "string" && args[0].startsWith("[Site Error]")) {
          originalMethod(...args);
          return;
        }

        // iframe関連のエラーを検出
        const isIframeRelated =
          errorMessage.includes("X-Frame-Options") ||
          errorMessage.includes("Content Security Policy") ||
          errorMessage.includes("frame-ancestors") ||
          errorMessage.includes("Minified React error") ||
          // その他のiframe関連キーワード
          errorMessage.includes("iframe") ||
          errorMessage.includes("frame") ||
          errorMessage.includes("cross-origin") ||
          errorMessage.includes("CORS") ||
          errorMessage.includes("Mixed Content") ||
          errorMessage.includes("Refused to display") ||
          errorMessage.includes("Refused to connect");

        // スタックトレースにサイトのURLが含まれているかチェック
        const isFromSite =
          site.url &&
          (errorMessage.includes(site.url) ||
            (args[1] && args[1].toString().includes(site.url)));

        // iframeに関連するエラーを検出した場合、カスタムメッセージをログに出す
        if (
          isIframeRelated &&
          site.url &&
          originalMethod === originalConsoleError
        ) {
          // エラーの種類を判別
          let errorType = "不明なエラー";
          if (errorMessage.includes("X-Frame-Options")) {
            errorType = "X-Frame-Optionsポリシー違反";
          } else if (errorMessage.includes("Content Security Policy")) {
            errorType = "Content Security Policy違反";
          } else if (
            errorMessage.includes("cross-origin") ||
            errorMessage.includes("CORS")
          ) {
            errorType = "クロスオリジンポリシー違反";
          } else if (errorMessage.includes("Mixed Content")) {
            errorType = "混合コンテンツポリシー違反";
          } else if (errorMessage.includes("Refused to")) {
            errorType = "接続拒否";
          }

          // カスタムメッセージを出力
          originalConsoleWarn(
            `[Site Error] ${
              site.name
            }: ${errorType}により埋め込みが制限されています。詳細: ${errorMessage.substring(
              0,
              150
            )}...`
          );
          return;
        }

        // iframeに関連するエラーまたはサイトからのエラーの場合は抑制
        if (isIframeRelated || isFromSite) {
          return;
        }

        // それ以外のメッセージは通常通り出力
        originalMethod(...args);
      };
    };

    // すべてのコンソールメソッドを置き換え
    console.error = handleConsoleMessage(originalConsoleError);
    console.log = handleConsoleMessage(originalConsoleLog);
    console.warn = handleConsoleMessage(originalConsoleWarn);
    console.info = handleConsoleMessage(originalConsoleInfo);
    console.debug = handleConsoleMessage(originalConsoleDebug);

    return () => {
      // クリーンアップ時に元のメソッドに戻す
      console.error = originalConsoleError;
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
      console.debug = originalConsoleDebug;
    };
  }, [site.url]);

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
    <Card
      className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border-border/50"
      ref={cardRef}
    >
      <CardContent className="p-0 relative flex-1">
        <div className="aspect-video w-full overflow-hidden bg-background">
          {site.canDisplayIframe && !hasError ? (
            <>
              {isLoading && shouldLoad && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
              {shouldLoad ? (
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
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground">
                      スクロールすると表示されます
                    </p>
                  </div>
                </div>
              )}
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
