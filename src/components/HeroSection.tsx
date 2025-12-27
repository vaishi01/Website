/**
 * HeroSection.tsx - Hero Section Component
 * 
 * Reusable hero/banner component used at the top of each page.
 * Displays a title, optional subtitle, and optional icon with a decorative grid pattern background.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { GridPattern } from '@/components/ui/grid-pattern';

/**
 * Props interface for HeroSection component
 */
interface HeroSectionProps {
  title: string; // Main heading text
  subtitle?: string; // Optional subtitle text
  icon?: React.ReactNode; // Optional icon component
  className?: string; // Additional CSS classes
}

/**
 * HeroSection Component
 * 
 * Renders a hero section with:
 * - Centered title and subtitle
 * - Optional icon above the title
 * - Decorative grid pattern background
 * - Responsive design (mobile and desktop)
 */
const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, icon, className }) => {
  return (
    // Main container - fixed height, centered content, with border
    <div className={cn("relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden bg-background border-b", className)}>
      {/* Content container - z-index ensures text is above background pattern */}
      <div className="z-10 text-center px-4">
        {/* Optional icon - displayed above title if provided */}
        {icon && (
          <div className="flex justify-center mb-4">
            {icon}
          </div>
        )}
        
        {/* Main title - responsive font size (smaller on mobile, larger on desktop) */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        
        {/* Optional subtitle - responsive font size, max width for readability */}
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Decorative grid pattern background - positioned behind content */}
      {/* Grid pattern configuration - array of [x, y] coordinates for squares */}
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        // Styling - radial gradient mask and positioning for visual effect
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
  );
};

export default HeroSection;

