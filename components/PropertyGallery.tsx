"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid3X3, Play, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* Resilient media tile: real first-frame poster for videos,
   graceful branded fallback for unavailable images. */
function MediaThumb({
  item, alt, sizes, priority, big,
}: { item: MediaItem; alt: string; sizes: string; priority?: boolean; big?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (item.type === "video") {
    return (
      <div className="relative w-full h-full bg-[#210A0B]">
        {/* shows the first frame for direct video files; branded surface otherwise */}
        <video
          src={item.url}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#210A0B]/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "rounded-full bg-[#FBF5F2]/15 backdrop-blur-sm border border-[#FBF5F2]/60 flex items-center justify-center text-[#FBF5F2]",
            big ? "w-16 h-16" : "w-10 h-10"
          )}>
            <Play size={big ? 22 : 15} fill="currentColor" className="ml-0.5" />
          </span>
        </div>
      </div>
    );
  }

  if (errored) {
    return (
      <div className="w-full h-full bg-[#F3EFE9] flex flex-col items-center justify-center gap-2 text-[#82000D]/55">
        <ImageOff size={big ? 26 : 18} strokeWidth={1.5} />
        <span className="text-[7px] lg:text-[8px] font-bold tracking-[0.3em] uppercase">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={item.url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
      className="object-cover transition-transform duration-[2s] group-hover:scale-105"
    />
  );
}

interface MediaItem {
  url: string;
  type: "image" | "video";
  caption?: string;
}

interface PropertyGalleryProps {
  media: MediaItem[];
  title: string;
}

export default function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const prevLightbox = useCallback(() => {
    setLightboxIdx(i => (i > 0 ? i - 1 : media.length - 1));
  }, [media.length]);

  const nextLightbox = useCallback(() => {
    setLightboxIdx(i => (i < media.length - 1 ? i + 1 : 0));
  }, [media.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLightboxOpen, prevLightbox, nextLightbox]);

  if (!media || media.length === 0) return null;

  const primary = media[0];
  const secondary = media.slice(1, 5);

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative">
        {/* Main + Grid Layout */}
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[60vh] lg:h-[80vh]">
          {/* Primary large image */}
          <div
            className="col-span-4 lg:col-span-2 row-span-2 relative cursor-pointer group overflow-hidden bg-gray-100"
            onClick={() => openLightbox(0)}
          >
            <MediaThumb item={primary} alt={`${title} - main`} sizes="(max-width: 768px) 100vw, 50vw" priority big />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
          </div>

          {/* Secondary images */}
          {[0, 1, 2, 3].map(i => {
            const item = secondary[i];
            if (!item) {
              return (
                <div
                  key={`empty-${i}`}
                  className="hidden lg:block relative bg-gray-50"
                />
              );
            }
            return (
              <div
                key={i}
                className={cn(
                  "hidden lg:block relative cursor-pointer group overflow-hidden bg-gray-100",
                  i === 3 && media.length > 5 && "after:absolute after:inset-0 after:bg-black/40 after:flex after:items-center after:justify-center"
                )}
                onClick={() => openLightbox(i + 1)}
              >
                <MediaThumb item={item} alt={`${title} - ${i + 2}`} sizes="25vw" />
                {i === 3 && media.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <span className="text-white font-serif text-2xl">+{media.length - 5}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[9px] font-bold tracking-[0.3em] uppercase text-[#0A0A0F] shadow-lg hover:bg-[#0A0A0F] hover:text-white transition-all"
          >
            <Grid3X3 size={14} />
            All {media.length} Photos
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-1 mt-1 overflow-x-auto pb-1 lg:hidden">
          {media.slice(0, 8).map((item, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className={cn(
                "relative shrink-0 w-16 h-16 cursor-pointer overflow-hidden",
                activeIdx === i && "ring-2 ring-[#82000D]"
              )}
            >
              <MediaThumb item={item} alt="" sizes="64px" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9000] bg-black/95 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <p className="text-white font-serif text-sm uppercase tracking-widest">{title}</p>
              <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mt-1">{lightboxIdx + 1} / {media.length}</p>
            </div>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Image */}
          <div className="flex-1 relative flex items-center justify-center px-4 py-4">
            <button
              onClick={prevLightbox}
              className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative w-full h-full max-w-6xl">
              {media[lightboxIdx]?.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <a
                    href={media[lightboxIdx].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 border border-white text-white text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                  >
                    PLAY VIDEO
                  </a>
                </div>
              ) : (
                <Image
                  src={media[lightboxIdx]?.url || ""}
                  alt={`${title} ${lightboxIdx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </div>

            <button
              onClick={nextLightbox}
              className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-1.5 px-6 pb-4 overflow-x-auto">
            {media.map((item, i) => (
              <div
                key={i}
                onClick={() => setLightboxIdx(i)}
                className={cn(
                  "relative shrink-0 w-14 h-14 cursor-pointer overflow-hidden border-2 transition-all",
                  lightboxIdx === i ? "border-[#82000D] opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                )}
              >
                <MediaThumb item={item} alt="" sizes="56px" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
