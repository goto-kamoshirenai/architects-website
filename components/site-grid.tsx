"use client";

import React, { useState, useEffect } from "react";
import { SiteCard } from "@/components/site-card";
import { ArchitectSite } from "@/lib/dataConst";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  HelpCircle,
  Settings,
  Filter,
  Info,
  Menu,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface SiteGridProps {
  sites: ArchitectSite[];
}

export function SiteGrid({ sites }: SiteGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showInternational, setShowInternational] = useState(true);
  const [showDomestic, setShowDomestic] = useState(true);
  const [sortOrder, setSortOrder] = useState<"name" | "location" | "rate">(
    "rate"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 表示項目の設定
  const [showLocation, setShowLocation] = useState(true);
  const [showTech, setShowTech] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ページが変わったときに一番上にスクロール
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // 検索条件が変わったらページを1に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showInternational, showDomestic, itemsPerPage]);

  const filteredSites = sites
    .filter((site) => {
      // notQuoteがtrueのデータは除外
      // if (site.notQuote) {
      //   return false;
      // }

      const matchesSearch =
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.furigana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        (showInternational && site.isInternational) ||
        (showDomestic && !site.isInternational);

      const shouldInclude = matchesSearch && matchesFilter;

      return shouldInclude;
    })
    .sort((a, b) => {
      if (sortOrder === "rate") {
        return b.rate - a.rate;
      } else if (sortOrder === "name") {
        return a.furigana.localeCompare(b.furigana);
      } else if (sortOrder === "location") {
        return a.location.localeCompare(b.location);
      } else {
        // おすすめ順（rateの高い順）
        return b.rate - a.rate;
      }
    });

  // ページネーション用の計算
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSites.slice(indexOfFirstItem, indexOfLastItem);

  // ページ変更ハンドラー
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 前のページへ
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 次のページへ
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // アニメーション用の設定
  const panelVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="space-y-8">
      <div
        className={`sm:sticky top-16 z-10 backdrop-blur-md bg-background/95 border-b border-forest/20 rounded-lg transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-forest/90 rounded-l-md flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <Input
              type="search"
              placeholder="建築家や事務所を検索..."
              className="pl-12 h-11 border border-forest/30 rounded-md focus-visible:ring-1 focus-visible:ring-forest/50 focus-visible:border-forest/50 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest hover:text-forest"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="w-full flex flex-wrap justify-between items-center gap-3">
            <div className="w-full flex justify-between items-center sm:hidden">
              <Button
                variant={isMobileMenuOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-40 mx-auto transition-all duration-200 ${
                  isMobileMenuOpen
                    ? "bg-forest text-white"
                    : "border-forest/50 text-forest hover:bg-forest/5"
                }`}
              >
                <Menu size={16} className="mr-2" />
                メニュー
                {isMobileMenuOpen ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </Button>
            </div>

            <div
              className={`w-full sm:flex flex-wrap justify-between items-center gap-3 ${
                isMobileMenuOpen ? "flex" : "hidden"
              }`}
            >
              <div className="flex sm:flex-row flex-col items-center gap-2">
                <Button
                  variant={isFilterOpen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-40 transition-all duration-200 ${
                    isFilterOpen
                      ? "bg-forest text-white"
                      : "border-forest/50 text-forest hover:bg-forest/5"
                  }`}
                >
                  <Filter
                    size={16}
                    className={`mr-2 ${
                      isFilterOpen ? "text-white" : "text-forest/70"
                    }`}
                  />
                  フィルター
                  {isFilterOpen ? (
                    <ChevronUp size={16} className="ml-2" />
                  ) : (
                    <ChevronDown size={16} className="ml-2" />
                  )}
                </Button>

                <Button
                  variant={isHelpOpen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsHelpOpen(!isHelpOpen)}
                  className={`w-40 transition-all duration-200 ${
                    isHelpOpen
                      ? "bg-forest text-white"
                      : "border-forest/50 text-forest hover:bg-forest/5"
                  }`}
                >
                  <Info
                    size={16}
                    className={`mr-2 ${
                      isHelpOpen ? "text-white" : "text-forest/70"
                    }`}
                  />
                  表示について
                  {isHelpOpen ? (
                    <ChevronUp size={16} className="ml-2" />
                  ) : (
                    <ChevronDown size={16} className="ml-2" />
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-2 bg-muted/30 px-2 py-1.5 rounded-md">
                <Label htmlFor="items-per-page" className="text-sm text-forest">
                  表示件数:
                </Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[70px] h-8 border-forest/30 focus:ring-forest/20 bg-white/80">
                    <SelectValue placeholder="25" />
                  </SelectTrigger>
                  <SelectContent className="border-forest/20">
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
              className="overflow-hidden"
            >
              <div className="mx-4 mb-4 p-4 border border-forest/20 rounded-md bg-white/80 grid gap-6 md:grid-cols-3 shadow-sm">
                <div className="space-y-3">
                  <h3 className="font-medium text-forest flex items-center gap-2">
                    <Globe size={16} className="text-forest/70" />
                    表示フィルター
                  </h3>
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <Checkbox
                        id="domestic"
                        checked={showDomestic}
                        onCheckedChange={(checked) =>
                          setShowDomestic(checked as boolean)
                        }
                        className="border-forest/50 data-[state=checked]:bg-forest data-[state=checked]:text-white"
                      />
                      <Label htmlFor="domestic" className="cursor-pointer">
                        国内
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <Checkbox
                        id="international"
                        checked={showInternational}
                        onCheckedChange={(checked) =>
                          setShowInternational(checked as boolean)
                        }
                        className="border-forest/50 data-[state=checked]:bg-forest data-[state=checked]:text-white"
                      />
                      <Label htmlFor="international" className="cursor-pointer">
                        海外
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-forest flex items-center gap-2">
                    <Settings size={16} className="text-forest/70" />
                    並び順
                  </h3>
                  <RadioGroup
                    value={sortOrder}
                    onValueChange={(value) =>
                      setSortOrder(value as "name" | "location" | "rate")
                    }
                    className="pl-1 space-y-2"
                  >
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <RadioGroupItem
                        value="rate"
                        id="sort-rate"
                        className="border-forest/50 text-forest"
                      />
                      <Label htmlFor="sort-rate" className="cursor-pointer">
                        おすすめ順
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <RadioGroupItem
                        value="name"
                        id="sort-name"
                        className="border-forest/50 text-forest"
                      />
                      <Label htmlFor="sort-name" className="cursor-pointer">
                        名前順
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <RadioGroupItem
                        value="location"
                        id="sort-location"
                        className="border-forest/50 text-forest"
                      />
                      <Label htmlFor="sort-location" className="cursor-pointer">
                        所在地順
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-forest flex items-center gap-2">
                    <Settings size={16} className="text-forest/70" />
                    表示項目
                  </h3>
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <Checkbox
                        id="show-location"
                        checked={showLocation}
                        onCheckedChange={(checked) =>
                          setShowLocation(checked as boolean)
                        }
                        className="border-forest/50 data-[state=checked]:bg-forest data-[state=checked]:text-white"
                      />
                      <Label htmlFor="show-location" className="cursor-pointer">
                        所在地
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 hover:bg-forest/5 p-1.5 rounded-md transition-colors">
                      <Checkbox
                        id="show-tech"
                        checked={showTech}
                        onCheckedChange={(checked) =>
                          setShowTech(checked as boolean)
                        }
                        className="border-forest/50 data-[state=checked]:bg-forest data-[state=checked]:text-white"
                      />
                      <Label htmlFor="show-tech" className="cursor-pointer">
                        使用技術
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 表示方法の説明 */}
        <AnimatePresence>
          {isHelpOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
              className="overflow-hidden"
            >
              <div className="mx-4 mb-4 p-4 border border-forest/20 rounded-md bg-white/80 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-forest flex items-center gap-2">
                        <Info size={16} className="text-forest/70" />
                        建築事務所について
                      </h3>
                    </div>
                    <p className="text-sm text-forest/80 pl-1">
                      カードをクリックすると、その事務所のウェブサイトが新しいタブで開きます。
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-forest flex items-center gap-2">
                        <HelpCircle size={16} className="text-forest/70" />
                        アイコンの説明
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-forest/80 pl-1">
                      <div className="flex items-center gap-1.5">
                        <Globe size={14} className="text-forest" />
                        <span>海外事務所</span>
                      </div>
                      <span className="mx-1 text-forest/40">|</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-forest" />
                        <span>国内事務所</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-forest flex items-center gap-2">
                        <Settings size={16} className="text-forest/70" />
                        使用技術
                      </h3>
                    </div>
                    <div className="text-sm text-forest/80 pl-1">
                      <span>
                        Webサイトで使用されている技術をアイコンで表示しています。
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">
            No results found. Try adjusting your search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((site, index) => (
              <div key={site.id || `site-${index}`} className="w-full">
                <SiteCard
                  site={site}
                  showLocation={showLocation}
                  showTech={showTech}
                />
              </div>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                aria-label="前のページ"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // 現在のページの前後2ページまでと、最初と最後のページを表示
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2
                    );
                  })
                  .map((page, i, array) => {
                    // 省略記号を表示するかどうか
                    const showEllipsisBefore =
                      i > 0 && array[i - 1] !== page - 1;
                    const showEllipsisAfter =
                      i < array.length - 1 && array[i + 1] !== page + 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}

                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          aria-label={`ページ ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                        >
                          {page}
                        </Button>

                        {showEllipsisAfter && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                aria-label="次のページ"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* 表示件数と総件数 */}
          <div className="text-center text-sm text-muted-foreground">
            {filteredSites.length}件中 {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredSites.length)}件を表示
          </div>
        </>
      )}
    </div>
  );
}
