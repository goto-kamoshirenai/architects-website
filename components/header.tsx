"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background backdrop-blur-md border-b border-border/50"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Image
          src="/logo-short.svg"
          alt="logo"
          width={70}
          height={24}
          style={{ height: "auto" }}
        />
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="font-medium text-primary/80 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/contact"
            className="font-medium text-primary/80 hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-16">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
            <Link
              href="/"
              className="font-medium text-primary/80 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/contact"
              className="font-medium text-primary/80 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
