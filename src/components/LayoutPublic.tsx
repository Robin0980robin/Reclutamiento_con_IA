// src/components/LayoutPublic.tsx (CREAR ESTE ARCHIVO)

import React, { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LayoutPublicProps {
  children: ReactNode;
  mainClassName?: string;
}

const LayoutPublic: React.FC<LayoutPublicProps> = ({ children, mainClassName = '' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow ${mainClassName}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutPublic;