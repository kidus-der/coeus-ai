"use client";
import { Header } from "@/components/Header";
import { PdfViewer } from "@/components/PDFViewer/PDFViewer";
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  // Placeholder PDF URL (replace with a real PDF URL or use state later)
  const placeholderPdfUrl = "/example.pdf"; // Put a sample PDF in your public folder

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
    >
      <Header />
      <main className="container mx-auto p-4 flex">
        {/* PDF Viewer (1/3 width) */}
        <div className="w-1/3">
          <PdfViewer file={placeholderPdfUrl} />
        </div>
        {/* Chat Interface (2/3 width) - Placeholder for now */}
        <div className="w-2/3 p-4 bg-gray-100">
          Chat Interface (Coming soon...)
        </div>
      </main>
    </ThemeProvider>
  );
}