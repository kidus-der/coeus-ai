"use client";
import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDropzone } from "react-dropzone";
import { FilePlus, X, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFSelector } from "./PDFSelector";

// set the workerSrc (required by react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFFile {
  id: string;
  file: File;
  name: string;
  base64?: string;
  numPages?: number;
  currentPage: number;
}

interface MultiPdfViewerProps {
  onPdfUpload?: (pdfData: { id: string; name: string; base64: string }[]) => void;
  maxFiles?: number;
}

export function MultiPdfViewer({ onPdfUpload, maxFiles = 3 }: MultiPdfViewerProps) {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState<string>("");
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  // Set the first tab as active when PDFs are loaded
  useEffect(() => {
    if (pdfFiles.length > 0 && !activeTabId) {
      setActiveTabId(pdfFiles[0].id);
    } else if (pdfFiles.length === 0) {
      setActiveTabId(null);
    }
  }, [pdfFiles, activeTabId]);

  function onDocumentLoadSuccess(id: string, { numPages }: { numPages: number }) {
    setPdfFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, numPages, currentPage: 1 } : file
      )
    );
  }

  const goToPrevPage = (id: string) => {
    setPdfFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              currentPage:
                file.currentPage > 1 ? file.currentPage - 1 : 1,
            }
          : file
      )
    );
  };

  const goToNextPage = (id: string) => {
    setPdfFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              currentPage:
                file.currentPage < (file.numPages ?? 1)
                  ? file.currentPage + 1
                  : file.numPages ?? 1,
            }
          : file
      )
    );
  };
  
  const goToPage = (id: string, pageNumber: number) => {
    const pdf = pdfFiles.find(file => file.id === id);
    if (!pdf || !pdf.numPages) return;
    
    const page = Math.max(1, Math.min(pageNumber, pdf.numPages));
    
    setPdfFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              currentPage: page,
            }
          : file
      )
    );
    
    setPageInput("");
  };
  
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty string or numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPageInput(value);
  };
  
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const pageNumber = parseInt(pageInput, 10);
      if (!isNaN(pageNumber)) {
        goToPage(id, pageNumber);
      }
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check if we've reached the maximum number of files
      if (pdfFiles.length >= maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} PDF files.`);
        return;
      }

      const file = acceptedFiles[0];

      if (file.size > MAX_FILE_SIZE) {
        setFileError(
          `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
        );
        return;
      }

      setFileError(null); // clear any previous error

      // Create a unique ID for the new PDF
      const newPdfId = `pdf-${Date.now()}`;

      // Add the new PDF to the state
      setPdfFiles((prevFiles) => [
        ...prevFiles,
        {
          id: newPdfId,
          file,
          name: file.name,
          currentPage: 1,
        },
      ]);

      // Set the new PDF as the active tab
      setActiveTabId(newPdfId);

      // Upload PDF to our API
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload PDF");
        }

        const data = await response.json();

        // Update the PDF data with the base64 content
        if (data.success) {
          setPdfFiles((prevFiles) =>
            prevFiles.map((pdfFile) =>
              pdfFile.id === newPdfId
                ? { ...pdfFile, base64: data.base64 }
                : pdfFile
            )
          );

          // Notify the parent component about the updated PDFs
          if (onPdfUpload) {
            const updatedPdfs = [
              ...pdfFiles,
              {
                id: newPdfId,
                name: file.name,
                base64: data.base64,
                currentPage: 1,
              },
            ];
            onPdfUpload(
              updatedPdfs
                .filter((pdf) => pdf.base64)
                .map((pdf) => ({
                  id: pdf.id,
                  name: pdf.name,
                  base64: pdf.base64,
                }))
            );
          }
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
        toast.error("Error uploading PDF. Please try again.");

        // Remove the PDF from the state if upload failed
        setPdfFiles((prevFiles) =>
          prevFiles.filter((pdfFile) => pdfFile.id !== newPdfId)
        );
      }
    },
    [pdfFiles, maxFiles, onPdfUpload, MAX_FILE_SIZE]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: pdfFiles.length >= maxFiles,
  });

  const handleRemovePdf = (id: string) => {
    // Get the PDF to remove
    const pdfToRemove = pdfFiles.find((pdf) => pdf.id === id);

    // Remove the PDF from the state
    setPdfFiles((prevFiles) => prevFiles.filter((pdf) => pdf.id !== id));

    // If we're removing the active tab, set a new active tab
    if (activeTabId === id) {
      const remainingPdfs = pdfFiles.filter((pdf) => pdf.id !== id);
      if (remainingPdfs.length > 0) {
        setActiveTabId(remainingPdfs[0].id);
      } else {
        setActiveTabId(null);
      }
    }

    // Notify the parent component
    if (onPdfUpload) {
      const updatedPdfs = pdfFiles
        .filter((pdf) => pdf.id !== id && pdf.base64)
        .map((pdf) => ({
          id: pdf.id,
          name: pdf.name,
          base64: pdf.base64,
        }));
      onPdfUpload(updatedPdfs);
    }

    toast(`Removed PDF: ${pdfToRemove?.name || "document"}.`);
  };

  const handleError = (error: Error | unknown) => {
    console.error("Error loading PDF:", error);
    toast.error(
      "Uh oh! Something went wrong. Failed to load PDF. Please ensure it is a valid PDF file."
    );
  };

  // Get the active PDF file
  const activePdf = pdfFiles.find((pdf) => pdf.id === activeTabId);

  // Handle opening the remove PDF dialog
  const openRemoveDialog = () => {
    setIsRemoveDialogOpen(true);
  };

  // Handle PDF selection for removal
  const handleRemovePdfSelection = (selectedPdfIds: string[]) => {
    if (selectedPdfIds.length > 0) {
      handleRemovePdf(selectedPdfIds[0]);
    }
    setIsRemoveDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* PDF Selector Dialog for removal */}
      {pdfFiles.length > 0 && (
        <PDFSelector
          pdfFiles={pdfFiles.map(pdf => ({ id: pdf.id, name: pdf.name, base64: pdf.base64 || "" }))}
          isOpen={isRemoveDialogOpen}
          setIsOpen={setIsRemoveDialogOpen}
          onSelect={handleRemovePdfSelection}
          toolType="removePdf"
          multiSelect={false}
        />
      )}
      
      {/* PDF Action Bar - Above the PDF viewer but inside the component */}
      {pdfFiles.length > 0 && (
        <div className="w-full mb-2 pdf-action-bar">
          <div className="flex justify-between items-center">
            <Tabs
              value={activeTabId || undefined}
              onValueChange={setActiveTabId}
              className="flex-1"
            >
              <TabsList className="h-9">
                {pdfFiles.map((pdf) => (
                  <TabsTrigger
                    key={pdf.id}
                    value={pdf.id}
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <File className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{pdf.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              {/* Upload button (only show if we haven't reached max files) */}
              {pdfFiles.length < maxFiles && (
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex items-center justify-center h-9 px-3 rounded-md cursor-pointer border",
                    isDragActive ? "border-primary" : "border-muted"
                  )}
                >
                  <input {...getInputProps()} />
                  <FilePlus className="h-4 w-4 mr-1" />
                  <span className="text-sm">Add PDF</span>
                </div>
              )}
              
              {/* Remove PDF button */}
              {pdfFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openRemoveDialog}
                  className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  <span className="text-sm">Remove PDF</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Pagination controls - Now part of the action bar */}
          {pdfFiles.some(pdf => pdf.id === activeTabId && pdf.numPages) && (
            <div className="flex justify-end items-center mt-1">
              <Pagination>
                <PaginationContent>
                  {pdfFiles.map((pdf) => (
                    pdf.id === activeTabId && pdf.numPages ? (
                      <div key={pdf.id} className="flex items-center">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPrevPage(pdf.id);
                            }}
                            disabled={pdf.currentPage <= 1}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={pageInput !== "" ? pageInput : pdf.currentPage.toString()}
                              onChange={handlePageInputChange}
                              onFocus={() => setPageInput("")}
                              onBlur={() => {
                                // When user leaves the field without submitting, revert to showing current page
                                if (pageInput === "") {
                                  // If they didn't enter anything, just show current page
                                  setPageInput("");
                                } else {
                                  // If they entered something but didn't press Enter, apply the change
                                  const pageNumber = parseInt(pageInput, 10);
                                  if (!isNaN(pageNumber)) {
                                    goToPage(pdf.id, pageNumber);
                                  } else {
                                    // Reset if invalid input
                                    setPageInput("");
                                  }
                                }
                              }}
                              onKeyDown={(e) => handlePageInputKeyDown(e, pdf.id)}
                              className="w-10 h-8 text-center border rounded"
                              aria-label="Page number"
                            />
                            <span> / {pdf.numPages}</span>
                          </div>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToNextPage(pdf.id);
                            }}
                            disabled={pdf.currentPage >= (pdf.numPages || 1)}
                          />
                        </PaginationItem>
                      </div>
                    ) : null
                  ))}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* PDF Content */}
      {pdfFiles.length > 0 ? (
        <div className="grow border rounded-lg overflow-hidden relative">
          {pdfFiles.map((pdf) => (
            <div key={pdf.id} className={pdf.id === activeTabId ? "block" : "hidden"}>
              <ScrollArea className="h-[85vh] w-full">  {/* Increased height from 65vh to 85vh */}
                <Document
                  file={pdf.file}
                  onLoadSuccess={(result) =>
                    onDocumentLoadSuccess(pdf.id, result)
                  }
                  onLoadError={handleError}
                >
                  <Page
                    pageNumber={pdf.currentPage}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              </ScrollArea>
            </div>
          ))}
        </div>
      ) : (
        /* Display upload UI if no PDFs are uploaded */
        <div
          {...getRootProps()}
          className={cn(
            "grow border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
            isDragActive ? "border-primary" : "border-muted"
          )}
        >
          <input {...getInputProps()} />
          {fileError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )}
          <>
            <FilePlus className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop a PDF file here, or click to select a file
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You can upload up to {maxFiles} PDF files
            </p>
          </>
        </div>
      )}
    </div>
  );
}