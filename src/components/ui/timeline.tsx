// Updated Timeline component with responsive line positioning
// File: components/ui/timeline.tsx

"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import "./timeline.css";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState(0);
  const [linePosition, setLinePosition] = useState(0);

  // Memoized Timeline Item
  const TimelineItem = React.memo(
    ({
      item,
      index,
    }: {
      item: TimelineEntry;
      index: number;
    }) => (
      <div
        ref={el => (itemRefs.current[index] = el)}
        className="timeline-item flex justify-start pt-4 md:pt-20 md:gap-10"
      >
        <div className="flex flex-col md:flex-row z-40 items-center self-start max-w-xs lg:max-w-sm md:w-full">
          <div
            className={`timeline-circle h-10 absolute w-10 rounded-full bg-white dark:bg-black flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 left-3 md:left-3`}
          >
            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-600 to-red-600 dark:from-blue-400 dark:to-red-400 p-2" />
          </div>
          <h3 className="hidden md:block text-base md:pl-20 md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 dark:from-blue-400 dark:to-red-400 bg-clip-text text-transparent">
            {item.title}
          </h3>
        </div>
        <div className="relative pl-20 pr-4 md:pl-4 w-full">
          <h3 className="md:hidden block text-2xl mb-4 text-left font-bold bg-gradient-to-r from-blue-600 to-red-600 dark:from-blue-400 dark:to-red-400 bg-clip-text text-transparent">
            {item.title}
          </h3>
          {item.content}
        </div>
      </div>
    )
  );

  // Use ResizeObserver for height recalculation
  useEffect(() => {
    if (!ref.current) return;
    const updateHeight = () => {
      if (itemRefs.current.length > 0) {
        const lastItem = itemRefs.current[itemRefs.current.length - 1];
        if (lastItem && ref.current) {
          const lastItemRect = lastItem.getBoundingClientRect();
          const containerRect = ref.current.getBoundingClientRect();
          const calculatedHeight = lastItemRect.bottom - containerRect.top + 50;
          if (height !== calculatedHeight) setHeight(calculatedHeight);
        }
      }
    };
    updateHeight();
    const resizeObserver = new (window as any).ResizeObserver(updateHeight);
    resizeObserver.observe(ref.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [data, height]);

  // Calculate line position based on first circle
  useEffect(() => {
    if (!ref.current) return;
    const updateLinePosition = () => {
      const circleElement = ref.current.querySelector('.timeline-circle');
      if (circleElement && ref.current) {
        const rect = (circleElement as HTMLElement).getBoundingClientRect();
        const containerRect = ref.current.getBoundingClientRect();
        const relativeLeft = rect.left - containerRect.left + rect.width / 2 - 1;
        if (linePosition !== relativeLeft) setLinePosition(relativeLeft);
      }
    };
    updateLinePosition();
    window.addEventListener('resize', updateLinePosition);
    return () => {
      window.removeEventListener('resize', updateLinePosition);
    };
  }, [data, linePosition]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-black font-sans md:px-10 transition-colors duration-300"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 pt-2">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
        {/* Dynamic Timeline Line */}
        <div
          style={{
            height: `${height}px`,
            left: `${linePosition}px`,
          }}
          className="absolute top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-200 dark:via-gray-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-red-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};