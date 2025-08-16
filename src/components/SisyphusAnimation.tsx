"use client";

import * as React from "react";
import { SisyphusAndBoulderIcon } from "./SisyphusAndBoulderIcon";
import { cn } from "@/lib/utils";

interface SisyphusAnimationProps {
  progress: number;
}

const SisyphusAnimation: React.FC<SisyphusAnimationProps> = ({ progress }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full my-8">
      <div className="w-full h-10 relative overflow-hidden">
        {/* Pixelated line */}
        <div className="absolute bottom-0 w-full h-1 border-b-4 border-dashed border-foreground" />
        
        <div
          className="absolute bottom-0 transition-all duration-500 ease-out h-full flex items-end"
          style={{ left: `calc(${clampedProgress}% - 16px)` }}
        >
          <div className="relative">
            <SisyphusAndBoulderIcon className={cn(
                "w-8 h-8 text-foreground animate-walk"
              )} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SisyphusAnimation;
