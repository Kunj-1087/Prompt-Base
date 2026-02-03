import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 w-full max-w-7xl animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};
