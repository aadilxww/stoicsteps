"use client";

import * as React from "react";
import { SisyphusAndBoulderIcon } from "./SisyphusAndBoulderIcon";

interface SisyphusProgressBarProps {
  progress: number;
}

const SisyphusProgressBar: React.FC<SisyphusProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full my-8">
      <div className="w-full h-10 bg-muted border-2 border-foreground relative flex items-center">
        <div 
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${clampedProgress}%` }}
        />
        <div
          className="absolute transition-all duration-500 ease-out h-full flex items-center"
          style={{ left: `calc(${clampedProgress}% - 16px)` }}
        >
          <SisyphusAndBoulderIcon className="w-8 h-6 text-foreground" />
        </div>
      </div>
    </div>
  );
};

export default SisyphusProgressBar;
