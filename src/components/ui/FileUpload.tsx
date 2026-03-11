"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import clsx from "clsx";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

interface FileUploadProps {
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({
  onChange,
  maxFiles = 10,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const accepted = Array.from(incoming).filter((f) =>
        ["image/png", "image/jpeg", "image/jpg"].includes(f.type)
      );

      const next: UploadedFile[] = accepted
        .slice(0, maxFiles - files.length)
        .map((file) => ({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        }));

      if (next.length === 0) return;

      const updated = [...files, ...next];
      setFiles(updated);
      onChange?.(updated.map((f) => f.file));
    },
    [files, maxFiles, onChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      const target = files.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);

      const updated = files.filter((f) => f.id !== id);
      setFiles(updated);
      onChange?.(updated.map((f) => f.file));
    },
    [files, onChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const atLimit = files.length >= maxFiles;

  return (
    <div className={clsx("w-full space-y-4", className)}>
      {/* Drop zone */}
      {!atLimit && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200",
            isDragOver
              ? "border-apple-blue bg-apple-blue/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
          )}
        >
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200",
              isDragOver ? "bg-apple-blue/10 text-apple-blue" : "bg-gray-100 text-gray-400"
            )}
          >
            <Upload size={22} strokeWidth={2} />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Drag &amp; drop images here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              or click to browse &middot; PNG, JPG
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {files.map((f) => (
            <div
              key={f.id}
              className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.preview}
                alt={f.file.name}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/80"
              >
                <X size={14} strokeWidth={2.5} />
              </button>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="flex items-center gap-1">
                  <ImageIcon size={10} className="text-white/80" />
                  <p className="text-[10px] text-white truncate">
                    {f.file.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
