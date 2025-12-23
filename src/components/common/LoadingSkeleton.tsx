import { memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  type?: 'list' | 'grid' | 'card' | 'table';
  count?: number;
  className?: string;
}

const ListSkeleton = memo(function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-6 space-y-4 bg-card">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
});

const GridSkeleton = memo(function GridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden bg-card">
          <Skeleton className="h-40 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
});

const CardSkeleton = memo(function CardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-4 bg-card">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

const TableSkeleton = memo(function TableSkeleton({ count }: { count: number }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden animate-fade-in">
      <div className="bg-muted p-3">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3 border-t border-border">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
});

export const LoadingSkeleton = memo(function LoadingSkeleton({ 
  type = 'list', 
  count = 3, 
  className 
}: LoadingSkeletonProps) {
  const content = (() => {
    switch (type) {
      case 'grid': return <GridSkeleton count={count} />;
      case 'card': return <CardSkeleton count={count} />;
      case 'table': return <TableSkeleton count={count} />;
      default: return <ListSkeleton count={count} />;
    }
  })();

  return <div className={cn(className)}>{content}</div>;
});
