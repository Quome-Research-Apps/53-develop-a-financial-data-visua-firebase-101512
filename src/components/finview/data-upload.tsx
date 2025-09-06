"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2 } from 'lucide-react';

type DataUploadProps = {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
};

export function DataUpload({ onFileUpload, isLoading }: DataUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    }
  }, [onFileUpload]);


  return (
    <div className="flex justify-center items-center w-full mt-16">
      <Card 
        className="w-full max-w-lg text-center"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Upload Your Financial Data</CardTitle>
          <CardDescription>Drag and drop a CSV file or click to select one. Your data is processed securely in your browser and is never stored.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <UploadCloud className={`w-12 h-12 mb-4 text-muted-foreground transition-colors ${isDragging ? 'text-primary' : ''}`} />
            <p className="mb-4 text-muted-foreground">Drop your CSV file here</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv"
              disabled={isLoading}
            />
            <Button onClick={handleButtonClick} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Select File'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
