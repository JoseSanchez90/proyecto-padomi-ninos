"use client";

import { useState } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  isOpen: boolean;
}

export function ImageViewer({
  images,
  initialIndex = 0,
  onClose,
  isOpen,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `imagen_${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col bg-background rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            Imagen {currentIndex + 1} de {images.length}
          </p>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-muted/30">
          <img
            src={currentImage}
            alt={`Imagen ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={images.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={images.length <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar
          </Button>
        </div>
      </div>
    </div>
  );
}
