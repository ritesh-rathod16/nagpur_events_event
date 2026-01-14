"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  bucket: "events" | "profiles";
}

export function ImageUpload({ value, onChange, onRemove, bucket }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const file = acceptedFiles[0];
      if (!file) return;

      const url = await uploadImage(file, bucket);
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  }, [bucket, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"]
    },
    maxFiles: 1,
    disabled: loading
  });

  if (value) {
    return (
      <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden border border-sapphire/20">
        <Image
          fill
          src={value}
          alt="Uploaded image"
          className="object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative w-full aspect-video md:aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
        ${isDragActive ? "border-gold bg-gold/5" : "border-sapphire/20 hover:border-gold/50"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader2 className="h-10 w-10 text-gold animate-spin" />
      ) : (
        <>
          <div className="p-4 rounded-full bg-gold/10 mb-4">
            <Upload className="h-6 w-6 text-gold" />
          </div>
          <p className="text-sm text-sapphire/60 font-medium">
            {isDragActive ? "Drop your image here" : "Click or drag image to upload"}
          </p>
          <p className="text-xs text-sapphire/40 mt-2">
            SVG, PNG, JPG or WebP (max. 5MB)
          </p>
        </>
      )}
    </div>
  );
}
