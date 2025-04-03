"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    desktop: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
    },
    mobile: {
      initial: { y: "-100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "-100%", opacity: 0 },
    },
  };

  return (
    <header className="fixed top-0 right-0 z-50 p-6">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-[60] text-white hover:text-white/80 bg-forest hover:bg-white/20 w-12 h-12 p-0"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute w-6 flex flex-col items-center gap-[6px]">
            <motion.div
              className="w-full h-[2px] bg-white origin-center"
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? 8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="w-full h-[2px] bg-white origin-center"
              animate={{
                opacity: isMenuOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="w-full h-[2px] bg-white origin-center"
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? -8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </Button>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>
            {/* Desktop menu */}
            <motion.div
              className="fixed hidden md:block top-0 right-0 m-6 w-64 bg-forest backdrop-blur-md z-50"
              variants={menuVariants.desktop}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col pt-20 px-8">
                <Link
                  href="/"
                  className="text-white text-lg py-4 hover:text-white/80 transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="text-white text-lg py-4 hover:text-white/80 transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </motion.div>

            {/* Mobile menu */}
            <motion.div
              className="fixed md:hidden block top-0 right-0 left-0 bg-forest backdrop-blur-md z-50 m-6"
              variants={menuVariants.mobile}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col px-8 py-16">
                <Link
                  href="/"
                  className="text-white text-lg py-3 hover:text-white/80 transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="text-white text-lg py-3 hover:text-white/80 transition-colors block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
