// src/components/PdfViewer/PdfViewer.tsx
"use client";
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDropzone } from 'react-dropzone';
import { FilePlus } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" //New Alert component
import { AlertCircle } from "lucide-react"

// Set the workerSrc (required by react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  
interface PdfViewerProps {}

export function PdfViewer({}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }) {
    setNumPages(nextNumPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => (prevPageNumber > 1 ? prevPageNumber - 1 : 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) =>
      prevPageNumber < (numPages ?? 1) ? prevPageNumber + 1 : numPages ?? 1
    );
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      setSelectedFile(null);
      return;
    }

    setFileError(null); // Clear any previous error
    setSelectedFile(file);
    setPageNumber(1);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: !!selectedFile
  });

  const handleError = (error: any) => {
    console.error("Error loading PDF:", error);
    setFileError("Failed to load PDF. Please ensure it is a valid PDF file.");
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Display upload UI or PDF based on selectedFile */}
      {!selectedFile ? (
        <div {...getRootProps()} className={cn("flex-grow border-2 border-dashed rounded-md p-6 text-center cursor-pointer", isDragActive ? "border-primary" : "border-muted")}>
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
              Drag and drop some files here, or click to select files
            </p>
          </>
        </div>
      ) : (
        <>
          {/* PDF Document Container  */}
          <div className="flex-grow border rounded-lg overflow-hidden">
            <ScrollArea className="h-[75vh] w-full">
              <Document
                file={selectedFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={handleError}
              >
                <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </ScrollArea>
          </div>
          {/* Bottom Pagination */}
          {numPages && (
            <div className="flex justify-center items-center pt-2 pb-1">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPrevPage();
                      }}
                      disabled={pageNumber <= 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span>{pageNumber} / {numPages}</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToNextPage();
                      }}
                      disabled={pageNumber >= (numPages ?? 0)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}