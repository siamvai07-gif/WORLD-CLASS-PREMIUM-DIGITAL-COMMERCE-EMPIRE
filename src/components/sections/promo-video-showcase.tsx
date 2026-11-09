"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, Tag, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromoVideo {
  id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  video_url?: string | null;
  duration?: string | null;
}

const MOCK_VIDEOS: PromoVideo[] = [
  {
    id: "1",
    title: "Free Fire Summer Festival",
    description: "Get up to 50% off on diamond top-ups this weekend.",
    thumbnail_url: "https://images.unsplash.com/photo-1627843488610-70113880438b?w=800&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "0:45",
  },
  {
    id: "2",
    title: "PUBG UC Grand Opening",
    description: "Exclusive UC bundles for new players.",
    thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05f?w=800&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "0:38",
  },
  {
    id: "3",
    title: "Dollar Exchange Special",
    description: "Best rates on USD buy/sell this week.",
    thumbnail_url: "https://images.unsplash.com/photo-1605172800719-7b6a1e60d499?w=800&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "0:52",
  },
  {
    id: "4",
    title: "Gift Card Bonanza",
    description: "Google Play, iTunes & Amazon cards at special prices.",
    thumbnail_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "0:41",
  },
  {
    id: "5",
    title: "Premium Courses Launch",
    description: "Learn digital commerce from industry experts.",
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "1:10",
  },
];

export function PromoVideoShowcase({ videos }: { videos?: PromoVideo[] }) {
  const items = (videos && videos.length > 0 ? videos : MOCK_VIDEOS) as PromoVideo[];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const canScrollPrev = scrollLeft > 10;

  const scrollBy = useCallback((delta: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) setScrollLeft(el.scrollLeft);
  }, []);

  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    containerRef.current.scrollLeft += diff * 0.5;
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const togglePlay = (index: number) => {
    const id = items[index].id;
    if (playingIndex === index) {
      setPlayingIndex(null);
      videoRefs.current.get(id)?.pause();
    } else {
      setPlayingIndex(index);
      videoRefs.current.forEach((vid) => vid.pause());
      const vid = videoRefs.current.get(id);
      vid?.play();
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    videoRefs.current.forEach((vid) => vid.pause());
  };
  const closeFullscreen = () => setFullscreenIndex(null);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Featured Videos
            </h2>
            <p className="text-muted-foreground text-sm">
              Promotional content, influencer campaigns &amp; brand ads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy(-300)}
              disabled={!canScrollPrev}
              className={cn(
                "p-2 rounded-lg border hover:bg-secondary transition-colors",
                !canScrollPrev ? "opacity-50 pointer-events-none" : ""
              )}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy(300)}
              className="p-2 rounded-lg border hover:bg-secondary transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          <div className="flex flex-nowrap gap-4 min-w-max">
            {items.map((video, i) => (
              <div key={video.id} className="relative min-w-[290px] flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden border border-white/60 bg-slate-900/50 backdrop-blur shadow-lg">
                  <div className="relative aspect-video bg-slate-800 overflow-hidden cursor-pointer group">
                    <img
                      src={
                        video.thumbnail_url ||
                        "https://placehold.co/800x450?text=Video"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(i);
                        }}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white transition-colors border border-white/30"
                        aria-label={
                          playingIndex === i ? "Pause video" : "Play video"
                        }
                      >
                        {playingIndex === i ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 ml-0.5" />
                        )}
                      </button>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[11px] text-white border border-white/20">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    {playingIndex === i && (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current.set(video.id, el);
                        }}
                        src={video.video_url || ""}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                        autoPlay
                        muted
                        playsInline
                        loop
                        onEnded={() => setPlayingIndex(null)}
                      />
                    )}
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-white border border-white/20">
                    <Tag size={12} className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-white border border-white/20">
                    <Clock size={12} className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground leading-tight">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border-t border-white/20 bg-slate-800/30">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(i);
                      }}
                    >
                      {playingIndex === i ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" /> Play
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFullscreen(i);
                      }}
                    >
                      Fullscreen
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {fullscreenIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
            onClick={closeFullscreen}
          >
            <div
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeFullscreen}
                className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors"
                aria-label="Close fullscreen"
              >
                Close
              </button>
              <video
                ref={(el) => {
                  if (el)
                    videoRefs.current.set(items[fullscreenIndex].id, el);
                }}
                src={items[fullscreenIndex].video_url || ""}
                className="w-full h-auto rounded-xl shadow-2xl"
                controls
                autoPlay
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white">
                  {items[fullscreenIndex].title}
                </h3>
                {items[fullscreenIndex].description && (
                  <p className="text-slate-300 text-sm mt-1">
                    {items[fullscreenIndex].description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
