
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/common/LoadingButton";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { PromptListSkeleton } from "@/components/common/PromptListSkeleton";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";

export function TestLoading() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBtnClick = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  const handleOverlayClick = () => {
    setOverlayLoading(true);
    setTimeout(() => setOverlayLoading(false), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="container mx-auto py-10 space-y-8 relative min-h-screen">
      <LoadingOverlay isLoading={overlayLoading} fullScreen={true} message="Simulating Global Loading..." />
      
      <PageHeader title="Loading States Verification" description="Demonstration of implemented loading components" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Loading Buttons</h2>
        <div className="flex gap-4">
          <LoadingButton onClick={handleBtnClick} isLoading={btnLoading}>
            Click to Load (2s)
          </LoadingButton>
          <LoadingButton isLoading variant="secondary">
            Always Loading
          </LoadingButton>
          <LoadingButton isLoading variant="danger">
            Destructive Action
          </LoadingButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Progress Bar</h2>
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Card</CardTitle>
            <p className="text-sm text-slate-400">This is how content loads</p>
          </CardHeader>
          <CardContent>
             <Progress value={progress} className="w-[60%]" />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Loading Overlay</h2>
        <LoadingButton onClick={handleOverlayClick} variant="outline">
          Trigger Full Screen Overlay (3s)
        </LoadingButton>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Skeleton Screens</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Single Card</h3>
          <div className="w-[300px]">
            <SkeletonCard />
          </div>
          
          <h3 className="text-lg font-medium">List Skeleton (Grid)</h3>
          <PromptListSkeleton count={3} />
        </div>
      </section>
    </div>
  );
}
