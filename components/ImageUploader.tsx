import React, { useCallback, useState } from "react";
import { LanguageCode } from "../types";

const UPLOAD_TEXT: Record<LanguageCode, { main: string; sub: string }> = {
  vi: {
    main: "Nhấn để chụp hoặc tải nhiều ảnh",
    sub: "hoặc kéo thả các ảnh vào đây",
  },
  en: {
    main: "Click to take photos or upload",
    sub: "or drag and drop images here",
  },
  fr: {
    main: "Cliquez pour prendre des photos ou télécharger",
    sub: "ou glisser-déposer des images ici",
  },
  ja: {
    main: "クリックして写真を撮るかアップロード",
    sub: "またはここに画像をドラッグ＆ドロップ",
  },
  zh: {
    main: "点击拍照或上传多张照片",
    sub: "或拖放图片到此处",
  },
};

interface ImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  language?: LanguageCode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  language = "vi",
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const t = UPLOAD_TEXT[language];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onImageSelect(Array.from(e.dataTransfer.files));
      }
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onImageSelect(Array.from(e.target.files));
      }
    },
    [onImageSelect]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ease-in-out cursor-pointer
        ${
          isDragging
            ? "border-emerald-500 bg-emerald-50 scale-[1.02]"
            : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50 bg-white"
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        multiple // Enable multiple file selection
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`p-4 rounded-full ${
            isDragging ? "bg-emerald-100" : "bg-gray-100"
          } transition-colors`}
        >
          <svg
            className={`w-10 h-10 ${
              isDragging ? "text-emerald-600" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-gray-600">
          <p className="font-medium text-lg">{t.main}</p>
          <p className="text-sm text-gray-400 mt-1">{t.sub}</p>{" "}
        </div>
      </div>
    </div>
  );
};
