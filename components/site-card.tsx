"use client";

import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { ArchitectSite } from "@/lib/dataConst";
import { iconMapping } from "@/lib/icon.const";
import { Globe, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteCardProps {
  site: ArchitectSite;
  showLocation?: boolean;
  showTech?: boolean;
}

export function SiteCard({
  site,
  showLocation = true,
  showTech = true,
}: SiteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

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

  // 技術アイコンがあるかどうかをチェック
  const hasTech =
    site.tech &&
    site.tech.length > 0 &&
    site.tech.some((tech) => iconMapping.find((item) => item.key === tech));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="overflow-hidden h-full flex flex-col cursor-pointer relative p-4"
        ref={cardRef}
        onClick={handleClick}
        style={{
          backgroundColor: isHovered
            ? "var(--card)"
            : "rgba(255, 255, 255, 0.01)",
          borderColor: "hsl(var(--primary))",
          borderWidth: "0.5px",
          boxShadow: isHovered
            ? "0 10px 25px -5px rgba(54, 86, 60, 0.25), 0 8px 10px -6px rgba(54, 86, 60, 0.1), 0 0 0 1.5px hsl(var(--primary-light))"
            : "none",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex items-center gap-2 w-full">
          <motion.h3
            className="font-bold text-lg line-clamp-1 flex-1"
            animate={{
              color: isHovered
                ? "var(--forest, hsl(var(--primary)))"
                : "var(--foreground)",
            }}
            transition={{ duration: 0.2 }}
          >
            {site.name}
          </motion.h3>
        </div>

        {showLocation && (
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            animate={{
              opacity: isHovered ? 0.9 : 0.7,
              color: isHovered
                ? "hsl(var(--primary))"
                : "hsl(var(--foreground))",
            }}
            transition={{ duration: 0.2 }}
          >
            {site.isInternational ? (
              <Globe size={16} className="text-forest" />
            ) : (
              <MapPin size={16} className="text-forest" />
            )}
            <span>{site.location}</span>
          </motion.div>
        )}

        {showTech && (
          <motion.div
            className="flex items-center gap-2 mt-1 min-h-[24px]"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {hasTech
              ? site.tech.map((techName, index) => {
                  const techItem = iconMapping.find(
                    (item) => item.key === techName
                  );
                  return (
                    techItem && (
                      <div key={index} className="relative">
                        <motion.span
                          className="text-muted-foreground"
                          onHoverStart={() => setHoveredTech(techItem.key)}
                          onHoverEnd={() => setHoveredTech(null)}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          animate={{
                            color: isHovered
                              ? "hsl(var(--primary))"
                              : "hsl(var(--foreground))",
                          }}
                        >
                          {techItem.icon}
                        </motion.span>
                        <AnimatePresence>
                          {hoveredTech === techItem.key && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-10 bg-forest text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                              style={{
                                top: "-25px",
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            >
                              {techItem.label}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  );
                })
              : null}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
