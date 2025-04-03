"use client";

import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { ArchitectSite } from "@/lib/dataConst";
import { iconMapping } from "@/lib/icon.const";
import { Globe, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RadarChart } from "./radar-chart";

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

  console.log(site);

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
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="overflow-hidden h-full flex flex-col cursor-pointer relative p-6"
        ref={cardRef}
        onClick={handleClick}
        style={{
          backgroundColor: isHovered
            ? "var(--card)"
            : "rgba(255, 255, 255, 0.02)",
          borderColor: "hsl(var(--primary))",
          borderWidth: "0.5px",
          boxShadow: isHovered
            ? "0 20px 40px -15px rgba(54, 86, 60, 0.2), 0 0 0 1px hsl(var(--primary-light))"
            : "none",
          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex items-center gap-3 w-full">
          <motion.h3
            className="font-light text-xl line-clamp-1 flex-1 text-size-adjust-auto"
            style={{
              fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
            }}
            animate={{
              color: isHovered
                ? "var(--forest, hsl(var(--primary)))"
                : "var(--foreground)",
            }}
            transition={{ duration: 0.3 }}
          >
            {site.name}
          </motion.h3>
        </div>

        {showLocation && (
          <motion.div
            className="flex items-center gap-2 text-sm mt-2"
            animate={{
              opacity: isHovered ? 0.9 : 0.7,
              color: isHovered
                ? "hsl(var(--primary))"
                : "hsl(var(--foreground))",
            }}
            transition={{ duration: 0.3 }}
          >
            {site.isInternational ? (
              <Globe size={16} className="text-forest/80" />
            ) : (
              <MapPin size={16} className="text-forest/80" />
            )}
            <span>{site.location}</span>
          </motion.div>
        )}

        <div className="flex justify-center ">
          <RadarChart
            performance={site.performancePoint || 0}
            seo={site.seoPoint || 0}
            accessibility={site.accessibilityPoint || 0}
            techStack={site.techStackPoint || 0}
            responsive={site.responsivePoint || 0}
            rate={site.rate}
          />
        </div>

        {showTech && hasTech && (
          <motion.div
            className="flex items-center gap-3 mt-2 min-h-[24px]"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {site.tech.map((techName, index) => {
              const techItem = iconMapping.find(
                (item) => item.key === techName
              );
              return (
                techItem && (
                  <div key={index} className="relative">
                    <motion.span
                      className="text-muted-foreground sm:text-xl"
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
                          className="absolute z-10 bg-forest text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
                          style={{
                            top: "-30px",
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
            })}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
