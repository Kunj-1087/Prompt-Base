
import { SkeletonCard } from "./SkeletonCard"

interface PromptListSkeletonProps {
  count?: number;
}

export function PromptListSkeleton({ count = 6 }: PromptListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
