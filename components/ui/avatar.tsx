import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback?: string;
  src?: string;
}

export function Avatar({ className, fallback, src, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-semibold text-accent-foreground",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={fallback} className="h-full w-full object-cover" />
      ) : (
        fallback?.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}
