"use client";

import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background ">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
