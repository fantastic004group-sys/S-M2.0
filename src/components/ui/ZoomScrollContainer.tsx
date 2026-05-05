import { useState, useEffect, useRef, useCallback } from "react";

interface ZoomScrollContainerProps {
  children: React.ReactNode[];
}

export default function ZoomScrollContainer({ children }: ZoomScrollContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"down" | "up" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const totalSections = children.length;

  const goToSection = useCallback(
    (newIndex: number, dir: "down" | "up") => {
      if (isTransitioning || newIndex < 0 || newIndex >= totalSections) return;
      setIsTransitioning(true);
      setDirection(dir);

      // After the outgoing animation starts, switch to the new section
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setDirection(null);
        // Allow the incoming section to animate in, then unlock
        setTimeout(() => {
          setIsTransitioning(false);
        }, 600);
      }, 500);
    },
    [isTransitioning, totalSections]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;

      if (e.deltaY > 30) {
        goToSection(currentIndex + 1, "down");
      } else if (e.deltaY < -30) {
        goToSection(currentIndex - 1, "up");
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;

      if (deltaY > 50) {
        goToSection(currentIndex + 1, "down");
      } else if (deltaY < -50) {
        goToSection(currentIndex - 1, "up");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToSection(currentIndex + 1, "down");
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSection(currentIndex - 1, "up");
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, isTransitioning, goToSection]);

  // Determine animation classes for the current section
  const getAnimationStyle = (): React.CSSProperties => {
    if (!direction) {
      // Resting or just arrived
      return {
        transform: "scale(1)",
        opacity: 1,
        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
      };
    }

    if (direction === "down") {
      // Zooming into the current section (it scales up and fades out)
      return {
        transform: "scale(1.8)",
        opacity: 0,
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
      };
    }

    // direction === "up" -- zooming out (shrinks and fades)
    return {
      transform: "scale(0.6)",
      opacity: 0,
      transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
    };
  };

  return (
    <div ref={containerRef} className="relative h-[calc(100vh-5rem)] overflow-hidden">
      {/* Current Section */}
      <div
        key={currentIndex}
        className="absolute inset-0 overflow-y-auto"
        style={getAnimationStyle()}
      >
        {children[currentIndex]}
      </div>

      {/* Section Indicators */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {children.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (idx !== currentIndex) {
                goToSection(idx, idx > currentIndex ? "down" : "up");
              }
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-crimson scale-125"
                : "bg-gray-300 hover:bg-gray-500"
            }`}
            aria-label={`Go to section ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint at bottom of first section */}
      {currentIndex === 0 && !isTransitioning && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Scroll</span>
          <div className="w-5 h-8 border-2 border-gray-400 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
