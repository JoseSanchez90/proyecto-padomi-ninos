"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setUploadIndex(index ?? images.length);

    const file = files[0]; // Tomar solo el primer archivo
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        const newImages = [...images];

        if (index !== undefined && index < maxImages) {
          // Reemplazar imagen en posición específica
          newImages[index] = event.target.result as string;
        } else {
          // Agregar nueva imagen en la primera posición disponible
          if (newImages.length < maxImages) {
            newImages.push(event.target.result as string);
          }
        }

        onImagesChange(newImages);
      }
      setIsLoading(false);
      setUploadIndex(null);

      // Resetear el input para permitir subir la misma imagen si se elimina
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setIsLoading(false);
      setUploadIndex(null);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const triggerFileInput = (index?: number) => {
    if (images.length >= maxImages && index === undefined) return;
    setUploadIndex(index ?? images.length);
    fileInputRef.current?.click();
  };

  // Crear array de slots (imágenes + espacios vacíos hasta maxImages)
  const slots = Array.from({ length: maxImages }, (_, i) => ({
    index: i,
    hasImage: i < images.length,
    image: images[i],
  }));

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isLoading}
        className="hidden"
      />

      {/* Grid de cuadrados */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.index}
            className={`
              relative aspect-square rounded-lg border-2 border-dashed
              transition-all duration-200 overflow-hidden group
                slot.hasImage
                  ? "border-solid border-border"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }
              ${isLoading && uploadIndex === slot.index ? "animate-pulse" : ""}
            `}
          >
            {slot.hasImage ? (
              <>
                {/* Imagen cargada */}
                <img
                  src={slot.image}
                  alt={`Imagen ${slot.index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay con acciones al hacer hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Botón para reemplazar */}
                  <button
                    type="button"
                    onClick={() => triggerFileInput(slot.index)}
                    disabled={isLoading}
                    className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer"
                    title="Reemplazar imagen"
                  >
                    <Upload className="w-4 h-4 text-foreground" />
                  </button>

                  {/* Botón para eliminar */}
                  <button
                    type="button"
                    onClick={() => removeImage(slot.index)}
                    disabled={isLoading}
                    className="p-2 bg-destructive/90 hover:bg-destructive rounded-full transition-colors cursor-pointer"
                    title="Eliminar imagen"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Badge de número */}
                <div className="absolute top-1 left-1 w-5 h-5 bg-black/60 text-white text-xs rounded-full flex items-center justify-center">
                  {slot.index + 1}
                </div>
              </>
            ) : (
              // Slot vacío con botón de upload
              <button
                type="button"
                onClick={() => triggerFileInput(slot.index)}
                disabled={isLoading || images.length >= maxImages}
                className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading && uploadIndex === slot.index ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-medium">Subir</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Texto de ayuda */}
      <p className="text-xs text-muted-foreground text-center">
        {images.length} de {maxImages} imágenes subidas
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onImagesChange([])}
            className="ml-2 text-destructive hover:underline"
          >
            Limpiar todas
          </button>
        )}
      </p>
    </div>
  );
}
