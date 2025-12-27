"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { renderCanvas } from "@/components/ui/canvas";

// A utility function for class names
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export function CanvasHero() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    renderCanvas();
  }, []);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as const,
      },
    }),
  };

  return (
    <section className="relative h-[50vh] w-full overflow-hidden">
      {/* Canvas Background */}
      <canvas
        className={cn(
          "pointer-events-none absolute inset-0 mx-auto",
          isDarkMode ? "bg-black" : "bg-white"
        )}
        id="canvas"
      ></canvas>

      {/* Content Overlay */}
      <div className="animation-delay-8 animate-fadeIn relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="z-10 mb-4 sm:justify-center"
        >
          <div className={cn(
            "relative flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs leading-6",
            isDarkMode 
              ? "bg-gray-900/80 border-gray-700 text-gray-300 backdrop-blur-sm"
              : "bg-white/80 border-gray-300 text-gray-700 backdrop-blur-sm"
          )}>
            <Sparkles className="mr-1 h-4 w-4" />
            Innovation in Action
            <span className="mx-2 text-gray-400">•</span>
            <span className="font-semibold">
              Projects Showcase
            </span>
          </div>
        </motion.div>

        {/* Main Heading Box */}
        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 mt-4"
        >
          <div className="px-2">
            <div className={cn(
              "relative mx-auto border p-4 md:p-8 rounded-lg backdrop-blur-sm",
              "w-[90vw] max-w-4xl h-[120px] md:h-[160px] flex items-center justify-center",
              "[mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]",
              isDarkMode 
                ? "border-gray-700 bg-gray-900/50"
                : "border-gray-300 bg-white/50"
            )}>
              <Plus
                strokeWidth={3}
                className={cn(
                  "absolute -left-3 -top-3 h-6 w-6 md:h-8 md:w-8",
                  isDarkMode ? "text-blue-500" : "text-blue-600"
                )}
              />
              <Plus
                strokeWidth={3}
                className={cn(
                  "absolute -bottom-3 -left-3 h-6 w-6 md:h-8 md:w-8",
                  isDarkMode ? "text-blue-500" : "text-blue-600"
                )}
              />
              <Plus
                strokeWidth={3}
                className={cn(
                  "absolute -right-3 -top-3 h-6 w-6 md:h-8 md:w-8",
                  isDarkMode ? "text-blue-500" : "text-blue-600"
                )}
              />
              <Plus
                strokeWidth={3}
                className={cn(
                  "absolute -bottom-3 -right-3 h-6 w-6 md:h-8 md:w-8",
                  isDarkMode ? "text-blue-500" : "text-blue-600"
                )}
              />
              
              <h1 className={cn(
                "select-none px-2 py-1 text-center text-3xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Project Showcase
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "mx-auto max-w-2xl px-4 text-sm md:text-base",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          Explore my portfolio of cutting-edge web applications, innovative designs,
          and transformative digital solutions.
        </motion.p>
      </div>
    </section>
  );
}
