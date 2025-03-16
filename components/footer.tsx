"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/50 py-4 mt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <Image src="/logo.svg" alt="logo" width={150} height={30} />
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-muted-foreground">
              © {year} Architect&apos;s website. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
