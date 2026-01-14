"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    reload?: any; // Trigger to force height update
  }
>(({ className, children, reload, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const childPort = React.useRef<HTMLDivElement | null>(null);
  // Effect untuk memaksa ScrollArea mengupdate layout saat reload berubah
  // React.useEffect(() => {
  //   if (viewportRef?.current && childPort?.current) {
  //     // viewportRef.current.style.height = "auto"; // Reset height
  //     // requestAnimationFrame(() => {
  //     //   viewportRef.current?.scrollHeight; // Trigger repaint
  //     // });
  //   }
  // }, [reload]); // Dependensi pada reload untuk trigger ulang

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        className="h-full w-full rounded-[inherit] relative"
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full" ref={childPort}>
            {children}
          </div>
        </div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "hover:bg-gray-100/50 flex touch-none select-none transition-colors ",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent ",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent ",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border bg-gray-300" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
