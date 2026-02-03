import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 py-6 bg-slate-950 text-slate-400 text-sm">
      <div className="container mx-auto px-4 text-center flex items-center justify-center space-x-1">
        <span>Built with</span>
        <Heart className="h-3 w-3 text-red-500 fill-red-500" />
        <span>for developers.</span>
      </div>
    </footer>
  );
};
