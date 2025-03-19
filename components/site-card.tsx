"use client";

import { useRef, useEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import type { ArchitectSite } from "@/lib/dataConst";
import { Globe, MapPin } from "lucide-react";

interface SiteCardProps {
  site: ArchitectSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observerを使って要素が表示されたかどうかを監視
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 将来的な拡張のために、可視性の検出を残しておく
        if (entries[0].isIntersecting) {
          // 必要に応じて将来ここにコードを追加
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

  const handleClick = () => {
    window.open(site.url, "_blank");
  };

  return (
    <Card
      className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border-border/50"
      ref={cardRef}
      onClick={handleClick}
    >
      <CardFooter className="flex flex-col items-start p-4 gap-2 bg-card">
        <div className="flex items-center gap-2 w-full">
          <h3 className="font-bold text-lg line-clamp-1 flex-1">{site.name}</h3>
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
