"use client";
import { useState } from "react";
import { File } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PDFFile {
  id: string;
  name: string;
  base64: string;
}

interface PDFSelectorProps {
  pdfFiles: PDFFile[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelect: (selectedPdfIds: string[]) => void;
  toolType?: string;
  multiSelect?: boolean;
}

export function PDFSelector({
  pdfFiles,
  isOpen,
  setIsOpen,
  onSelect,
  toolType,
  multiSelect = false,
}: PDFSelectorProps) {
  const [selectedPdfIds, setSelectedPdfIds] = useState<string[]>([]);

  const handleSelect = (pdfId: string) => {
    if (multiSelect) {
      // Toggle selection for multi-select
      setSelectedPdfIds((prev) =>
        prev.includes(pdfId)
          ? prev.filter((id) => id !== pdfId)
          : [...prev, pdfId]
      );
    } else {
      // Single select mode - immediately select and close
      onSelect([pdfId]);
      setIsOpen(false);
    }
  };

  const handleSubmit = () => {
    if (selectedPdfIds.length > 0) {
      onSelect(selectedPdfIds);
      setSelectedPdfIds([]);
      setIsOpen(false);
    }
  };

  const getToolName = (type?: string) => {
    if (!type) return "";
    
    switch (type) {
      case "studyPlan": return "Study Plan";
      case "quickSummary": return "Quick Summary";
      case "detailedExplanation": return "Detailed Explanation";
      case "practiceQuestions": return "Practice Questions";
      default: return type;
    }
  };

  const dialogTitle = toolType
    ? `Select PDF${multiSelect ? "s" : ""} for ${getToolName(toolType)}`
    : `Select PDF${multiSelect ? "s" : ""}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search PDFs..." />
          <CommandList>
            <CommandEmpty>No PDFs found.</CommandEmpty>
            <CommandGroup heading="Available PDFs">
              {pdfFiles.map((pdf) => (
                <CommandItem
                  key={pdf.id}
                  onSelect={() => handleSelect(pdf.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <File className="h-4 w-4 text-blue-500" />
                    <span>{pdf.name}</span>
                  </div>
                  {multiSelect && (
                    <div
                      className={`h-4 w-4 rounded-sm border ${
                        selectedPdfIds.includes(pdf.id)
                          ? "bg-primary border-primary text-primary-foreground flex items-center justify-center"
                          : "border-input"
                      }`}
                    >
                      {selectedPdfIds.includes(pdf.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {multiSelect && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={selectedPdfIds.length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPdfIds.length > 0
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Use Selected PDFs
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}