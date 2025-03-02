"use client";
import { useState, useCallback } from 'react';
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PDFViewer/PDFViewer";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Header />
      <main className="container mx-auto p-4 flex">
        {/* PDF Viewer (1/2 width, including file upload) */}
        <div className="w-1/2">
          <PdfViewer />
        </div>

        {/* Chat Interface (1/2 width) - Placeholder for now */}
        <div className="w-1/2 p-4 bg-gray-100">
          Chat Interface (Coming soon...)
        </div>
      </main>
    </ThemeProvider>
  );
}