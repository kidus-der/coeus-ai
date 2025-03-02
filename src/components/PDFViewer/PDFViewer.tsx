"use client";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css'; // Import styles
import 'react-pdf/dist/Page/TextLayer.css'; // Import styles

// Set the workerSrc (required by react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
  
  interface PdfViewerProps {
    file: string | File | null; // Accept a URL, File object, or null
  }
  
  export function PdfViewer({ file }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
  
    function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }) {
      setNumPages(nextNumPages);
      setPageNumber(1); // Reset to page 1 when a new document loads
    }
  
    const goToPrevPage = () =>
      setPageNumber((prevPageNumber) => (prevPageNumber > 1 ? prevPageNumber - 1 : 1));
    const goToNextPage = () =>
      setPageNumber((prevPageNumber) =>
        prevPageNumber < (numPages ?? 1) ? prevPageNumber + 1 : numPages ?? 1
      );
  
    return (
      <div className="flex flex-col items-center">
        {/* PDF Document Container */}
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="border rounded-md" // Add some basic styling
        >
          <Page pageNumber={pageNumber} width={300} className="shadow-lg" /> {/* Display a single page, Shadow for modern look*/}
        </Document>
  
        {/* Navigation (Optional, but good for UX) */}
        {numPages && (
          <div className="flex items-center mt-4 space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages ?? 0)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }