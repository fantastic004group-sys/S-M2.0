import { useState, useEffect, useRef, useCallback } from "react";

interface ZoomScrollContainerProps {
  children: React.ReactNode[];
  showIndicators?: boolean;
}

export default function ZoomScrollContainer({ children, showIndicators = true }: ZoomScrollContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"down" | "up" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const totalSections = children.length;

  const goToSection = useCallback(
    (newIndex: number, dir: "down" | "up") => {
      if (isTransitioning || newIndex < 0 || newIndex >= totalSections) return;

      // If scrolling down and current section has more content to scroll, let it scroll naturally
      if (dir === "down" && sectionRef.current) {
        const el = sectionRef.current;
        const isAtBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 5;
        if (!isAtBottom && el.scrollHeight > el.clientHeight + 5) return;
      }

      // If scrolling up and current section isn't at the top, let it scroll naturally
      if (dir === "up" && sectionRef.current) {
        const el = sectionRef.current;
        if (el.scrollTop > 5 && el.scrollHeight > el.clientHeight + 5) return;
      }

      setIsTransitioning(true);
      setDirection(dir);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setDirection(null);
        // Reset scroll position of new section
        if (sectionRef.current) {
          sectionRef.current.scrollTop = dir === "up" ? sectionRef.current.scrollHeight : 0;
        }
        setTimeout(() => {
          setIsTransitioning(false);
        }, 600);
      }, 500);
    },
    [isTransitioning, totalSections]
  );

  // Reset to first section when children change (page navigation)
  useEffect(() => {
    setCurrentIndex(0);
    setDirection(null);
    setIsTransitioning(false);
  }, [totalSections]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if the section has internal scroll
      const section = sectionRef.current;
      if (section && section.scrollHeight > section.clientHeight + 5) {
        const isAtBottom = Math.abs(section.scrollHeight - section.scrollTop - section.clientHeight) < 5;
        const isAtTop = section.scrollTop < 5;

        if (e.deltaY > 0 && !isAtBottom) return; // Let it scroll down naturally
        if (e.deltaY < 0 && !isAtTop) return; // Let it scroll up naturally
      }

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

      // Check internal scroll state
      const section = sectionRef.current;
      if (section && section.scrollHeight > section.clientHeight + 5) {
        const isAtBottom = Math.abs(section.scrollHeight - section.scrollTop - section.clientHeight) < 5;
        const isAtTop = section.scrollTop < 5;

        if (deltaY > 0 && !isAtBottom) return;
        if (deltaY < 0 && !isAtTop) return;
      }

      if (deltaY > 50) {
        goToSection(currentIndex + 1, "down");
      } else if (deltaY < -50) {
        goToSection(currentIndex - 1, "up");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        const section = sectionRef.current;
        if (section && section.scrollHeight > section.clientHeight + 5) {
          const isAtBottom = Math.abs(section.scrollHeight - section.scrollTop - section.clientHeight) < 5;
          if (!isAtBottom) return;
        }
        e.preventDefault();
        goToSection(currentIndex + 1, "down");
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const section = sectionRef.current;
        if (section && section.scrollHeight > section.clientHeight + 5) {
          if (section.scrollTop > 5) return;
        }
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

  const getAnimationStyle = (): React.CSSProperties => {
    if (!direction) {
      return {
        transform: "scale(1)",
        opacity: 1,
        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
      };
    }

    if (direction === "down") {
      return {
        transform: "scale(1.8)",
        opacity: 0,
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
      };
    }

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
        ref={sectionRef}
        className="absolute inset-0 overflow-y-auto"
        style={getAnimationStyle()}
      >
        {children[currentIndex]}
      </div>

      {/* Section Indicators */}
      {showIndicators && totalSections > 1 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {children.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== currentIndex && !isTransitioning) {
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
      )}

      {/* Scroll hint at bottom of first section */}
      {currentIndex === 0 && !isTransitioning && totalSections > 1 && (
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
