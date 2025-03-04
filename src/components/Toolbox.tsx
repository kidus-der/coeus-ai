// src/components/Toolbox.tsx
import * as React from "react";
import {
  GraduationCap,
  Sparkles,
  Brain,
  BicepsFlexed,
} from "@/components/Icons"; // Replace with proper icon files
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function Toolbox() {
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Generate Study Plan"
            >
              <GraduationCap className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate Study Plan</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Generate a Quick Summary"
            >
              <Sparkles className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate a Quick Summary</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Generate a Detailed Explanation"
            >
              <Brain className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate a Detailed Explanation</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Generate Practice Questions"
            >
              <BicepsFlexed className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate Practice Questions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
