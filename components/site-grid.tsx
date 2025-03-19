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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  return (
    <div className="space-y-8">
      <div
        className={`sticky top-16 z-10 p-2 backdrop-blur-md bg-background transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search architects..."
            className="pl-10 h-12 bg-muted/50 focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            Filter & Sort
            {isFilterOpen ? (
              <ChevronUp size={16} className="ml-2" />
            ) : (
              <ChevronDown size={16} className="ml-2" />
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <Label
              htmlFor="items-per-page"
              className="text-sm text-muted-foreground"
            >
              表示件数:
            </Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mt-4 p-4 border rounded-md bg-card/50 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium">Filter by</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="domestic"
                    checked={showDomestic}
                    onCheckedChange={(checked) =>
                      setShowDomestic(checked as boolean)
                    }
                  />
                  <Label htmlFor="domestic">国内</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="international"
                    checked={showInternational}
                    onCheckedChange={(checked) =>
                      setShowInternational(checked as boolean)
                    }
                  />
                  <Label htmlFor="international">海外</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Sort by</h3>
              <RadioGroup
                value={sortOrder}
                onValueChange={(value) =>
                  setSortOrder(value as "name" | "location" | "rate")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rate" id="sort-rate" />
                  <Label htmlFor="sort-rate">おすすめ順</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id="sort-name" />
                  <Label htmlFor="sort-name">名前</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="location" id="sort-location" />
                  <Label htmlFor="sort-location">所在地</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">
            No results found. Try adjusting your search.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {currentItems.map((site, index) => (
              <SiteCard key={site.id || `site-${index}`} site={site} />
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 ">
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
