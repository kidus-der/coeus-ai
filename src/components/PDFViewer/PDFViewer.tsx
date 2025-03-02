// src/components/PdfViewer/PdfViewer.tsx
"use client";
import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css'; // Import styles
import 'react-pdf/dist/Page/TextLayer.css'; // Import styles
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area"; // Imported
import { useDropzone } from 'react-dropzone'; // Add this import
import { Button } from "@/components/ui/button"; // Shadcn Button
import { FilePlus, Upload } from 'lucide-react'; // Icons
import { cn } from "@/lib/utils"

// Set the workerSrc (required by react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  
interface PdfViewerProps {} //No more file requirement

export function PdfViewer({}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPageNumber(1)
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: !!selectedFile //Disable once a file is there
  });

  return (
    <div className="flex flex-col h-full w-full">
      {/* Display upload UI or PDF based on selectedFile */}
      {!selectedFile ? (
        <div {...getRootProps()} className={cn("flex-grow border-2 border-dashed rounded-md p-6 text-center cursor-pointer", isDragActive ? "border-primary" : "border-muted")}>
          <input {...getInputProps()} />
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
        <div className="flex-grow border rounded-md overflow-hidden">
            <ScrollArea className="h-[75vh] w-full">
                <Document
                    file={selectedFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
                </Document>
            </ScrollArea>
        </div>
          {/* Pagination (Bottom) */}
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