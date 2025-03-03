import * as React from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { GraduationCap, Sparkles, Brain, BicepsFlexed } from "@/components/Icons"; //Replace with proper icon files
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Toolbox() {
  return (
    <>
      <TooltipProvider>
        <Menubar className="absolute bottom-0 left-0 mb-2 ml-2">
          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger><GraduationCap /></MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Study Plan</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>
          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger><Sparkles /></MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a Quick Summary</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>
          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger><Brain /></MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a Detailed Explanation</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>
          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger><BicepsFlexed /></MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Practice Questions</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>
        </Menubar>
      </TooltipProvider>
    </>
  );
}