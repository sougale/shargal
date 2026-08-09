import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { SmartImage } from "./SmartImage";
import { useArtworkContext } from "@/lib/useMetArtworksStore";

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 36 });
  const [index, setIndex] = useState(0);
  const { artworks, loadingAws } = useArtworkContext();

  // Fresh pick every time the artwork set arrives / changes.
  const slides = useMemo(() => {
    const withImages = artworks.filter(
      (a) => typeof a.image === "string" && a.image.trim() !== "",
    );
    return shuffle(withImages)
      .slice(0, 4)
      .map((a) => ({
        id: a.slug,
        image: a.image,
        title: a.title,
        name: a.artist || "Unknown",
        medium: a.medium || a.categoryLabel || "Artwork",
        width: a.width || 1600,
        height: a.height || 1067,
      }));
  }, [artworks]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 6500);
    return () => {
      clearInterval(id);
      embla.off("select", onSelect);
    };
  }, [embla, slides.length]);

  useEffect(() => {
    embla?.reInit();
    setIndex(0);
  }, [embla, slides]);

  if (loadingAws && slides.length === 0) {
    return (
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-ink" />
    );
  }

  if (slides.length === 0) return null;

  const current = slides[index] ?? slides[0];

  return (
    <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-ink">
      <div ref={emblaRef} className="absolute inset-0 h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((a) => (
            <div key={a.id} className="relative h-full min-w-0 flex-[0_0_100%]">
              <SmartImage
                src={a.image}
                alt={a.title}
                width={a.width}
                height={a.height}
                priority
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 md:pb-28">
          <p className="text-[11px] uppercase tracking-[0.3em] text-canvas/75 transition-opacity duration-700">
            {current.medium}
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl italic leading-[0.95] text-canvas md:text-7xl lg:text-8xl line-clamp-2">
            {current.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/85 md:text-lg">
            {current.name}
          </p>

          <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/gallery"
              className="border border-canvas bg-canvas px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-clay hover:border-clay hover:text-canvas"
            >
              Enter the exhibition
            </Link>
            <Link
              to="/about"
              className="border border-canvas/60 px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:border-canvas"
            >
              About the gallery
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={`h-[2px] transition-all ${
              index === i ? "w-10 bg-canvas" : "w-5 bg-canvas/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
