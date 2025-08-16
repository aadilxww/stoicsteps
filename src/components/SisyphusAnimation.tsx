"use client";

import * as React from "react";
import { SisyphusAndBoulderIcon } from "./SisyphusAndBoulderIcon";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SisyphusAnimationProps {
  progress: number;
}

const SisyphusAnimation: React.FC<SisyphusAnimationProps> = ({ progress }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full my-8 relative flex items-center">
      <Progress value={clampedProgress} className="w-full h-4 border-2 border-foreground rounded-none" />
      <div
        className="absolute transition-all duration-500 ease-out h-full flex items-center"
        style={{ left: `calc(${clampedProgress}% - 16px)` }}
      >
        <SisyphusAndBoulderIcon
          className={cn(
            "w-8 h-8 text-foreground"
          )}
        />
      </div>
    </div>
  );
};

export default SisyphusAnimation;
