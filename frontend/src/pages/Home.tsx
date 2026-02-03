import { Button } from "../components/ui/button";
import { MainLayout } from "../components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Shield } from "lucide-react";

import { SEO } from "../components/common/SEO";

export const Home = () => {
  return (
    <MainLayout>
      <SEO 
        title="Prompt-Base | AI Prompt Generator" 
        description="Generate professional-grade AI prompts for ChatGPT, Claude, and Gemini in seconds."
      />
      <div className="flex flex-col items-center justify-center space-y-12 text-center pt-10">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400 animate-fade-in-up">
            Transform Your Rough Ideas into Structured Prompts
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
             Generate professional-grade AI prompts for ChatGPT, Claude, and Gemini in seconds. 
             Stop wrestling with context and start building.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/login">
               <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-500/20">
                 Get Started
                 <Sparkles className="ml-2 h-4 w-4" />
               </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl pt-12">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-yellow-400" />}
            title="Instant Structure"
            description="Automatically organizes your thought into Role, Context, Task, and Constraints."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-green-400" />}
            title="Production Ready"
            description="Outputs prompts optimized for reliability and reduced hallucinations."
          />
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6 text-purple-400" />}
            title="Developer Focus"
            description="Tailored for coding tasks, architecture planning, and debugging."
          />
        </div>
      </div>
    </MainLayout>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors text-left">
    <div className="mb-4 p-3 bg-slate-950 rounded-lg w-fit border border-slate-800">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);
