import * as React from "react";
import {
  GraduationCap,
  Sparkles,
  Brain,
  BicepsFlexed,
} from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ToolboxProps {
  onToolClick?: (toolType: string) => void;
}

export function Toolbox({ onToolClick }: ToolboxProps) {
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Generate Study Plan"
              onClick={() => onToolClick?.("studyPlan")}
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
              onClick={() => onToolClick?.("quickSummary")}
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
              onClick={() => onToolClick?.("detailedExplanation")}
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
              onClick={() => onToolClick?.("practiceQuestions")}
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