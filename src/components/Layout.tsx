
import React, { ReactNode } from "react";
import { Header } from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8 px-6">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <footer className="py-4 px-6 text-center text-sm text-gray-500 bg-white border-t">
        Polkadot Yield Compass © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
