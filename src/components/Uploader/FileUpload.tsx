// src/components/Uploader/FileUpload.tsx
"use client";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button"; // Shadcn Button
import { cn } from "@/lib/utils"
import { FilePlus, Upload } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void; // Callback to pass the file to PdfViewer
}

export function FileUpload({ onFileChange }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Take the first accepted file
    setSelectedFile(file);
    onFileChange(file); // Pass the file to the parent component
  }, [onFileChange]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'], // Only allow PDF files
    },
    maxFiles: 1
  })

  return (
    <div {...getRootProps()} className={cn("border-2 border-dashed rounded-md p-6 text-center cursor-pointer", isDragActive ? "border-primary" : "border-muted")}>
      <input {...getInputProps()} />
      {selectedFile ? (
        <p>Selected file: {selectedFile.name}</p>
      ) : (
        <>
        
        <FilePlus className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop some files here, or click to select files
        </p>
        </>
      )}
    </div>
  );
}