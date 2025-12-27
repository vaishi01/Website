/**
 * CourseCalendar.tsx - Course Calendar Page Component
 * 
 * This page displays the course calendar using an embedded Google Docs iframe.
 * Shows important dates, deadlines, and schedule information.
 * 
 * Optimizations:
 * - Loading skeleton only shown when actually loading
 * - Immediate loading (no lazy loading)
 * - Preloading support from home page - iframes start loading on home screen
 * - Smart loading state - skeleton hidden if iframe already loaded from preloader
 */

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { Calendar as CalendarIcon } from 'lucide-react';
import { IframeSkeleton } from '@/components/ui/iframe-skeleton';
import { CALENDAR_URL, isIframeLoaded, subscribeToIframeLoad } from '@/hooks/use-iframe-preloader';

/**
 * CourseCalendar Component
 * 
 * Displays the course calendar in an embedded iframe with optimized loading.
 * Loads immediately and checks if already preloaded to avoid showing skeleton unnecessarily.
 */
const CourseCalendar = () => {
  // Check if iframe is already loaded from preloader
  const [isLoading, setIsLoading] = useState(() => !isIframeLoaded(CALENDAR_URL));
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // If already loaded, don't show loading state
    if (isIframeLoaded(CALENDAR_URL)) {
      setIsLoading(false);
      return;
    }

    // Subscribe to load state changes in case preloader finishes while on this page
    const unsubscribe = subscribeToIframeLoad(() => {
      if (isIframeLoaded(CALENDAR_URL)) {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Navigation bar */}
      <Navbar />
      
      {/* Hero section with calendar icon */}
      <HeroSection
        title="Course Calendar"
        subtitle="CSE 140 - Artificial Intelligence"
        icon={<CalendarIcon className="h-12 w-12 text-blue-600" />}
      />
      
      {/* Calendar content - embedded Google Docs iframe */}
      <div className="bg-white pb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Iframe container - fixed height for proper display */}
          <div className="w-full relative" style={{ height: '1200px' }}>
            {/* Loading skeleton - only shown if iframe is actually loading */}
            {isLoading && (
              <div className="absolute inset-0 z-10">
                <IframeSkeleton height="1200px" />
              </div>
            )}
            
            {/* Embedded Google Docs calendar - loads immediately, shows course schedule and important dates */}
            <iframe
              ref={iframeRef}
              src={CALENDAR_URL}
              className="w-full h-full border-0 rounded-lg shadow-lg"
              title="CSE 140 Calendar"
              loading="eager"
              onLoad={handleIframeLoad}
              style={{ 
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default CourseCalendar;