"use client"

import { useState, useEffect } from "react"
import { SiteCard } from "@/components/site-card"
import { architectSites } from "@/lib/dataConst"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react"

export function SiteGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showInternational, setShowInternational] = useState(true)
  const [showDomestic, setShowDomestic] = useState(true)
  const [showIframeOnly, setShowIframeOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState<"name" | "location">("name")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const filteredSites = architectSites
    .filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.furigana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = (showInternational && site.isInternational) || (showDomestic && !site.isInternational)

      const matchesIframeFilter = !showIframeOnly || site.canDisplayIframe

      return matchesSearch && matchesFilter && matchesIframeFilter
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name)
      } else {
        return a.location.localeCompare(b.location)
      }
    })

  return (
    <div className="space-y-8">
      <div
        className={`sticky top-16 z-10 py-4 backdrop-blur-md bg-background/80 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}
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

        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            Filter & Sort
            {isFilterOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
          </Button>

          {isFilterOpen && (
            <div className="mt-4 p-4 border rounded-md bg-card/50 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-medium">Filter by</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="domestic"
                      checked={showDomestic}
                      onCheckedChange={(checked) => setShowDomestic(checked as boolean)}
                    />
                    <Label htmlFor="domestic">国内</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="international"
                      checked={showInternational}
                      onCheckedChange={(checked) => setShowInternational(checked as boolean)}
                    />
                    <Label htmlFor="international">海外</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="iframe-only"
                      checked={showIframeOnly}
                      onCheckedChange={(checked) => setShowIframeOnly(checked as boolean)}
                    />
                    <Label htmlFor="iframe-only">iframeで表示可能なサイトのみ</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Sort by</h3>
                <RadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as "name" | "location")}>
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
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No results found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  )
}

