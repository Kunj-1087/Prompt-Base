
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean;
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, fullScreen = false, message, className }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center z-50 bg-white/80 dark:bg-black/50 backdrop-blur-sm",
      fullScreen ? "fixed inset-0" : "absolute inset-0",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && <p className="mt-2 text-sm text-muted-foreground font-medium animate-pulse">{message}</p>}
    </div>
  )
}
