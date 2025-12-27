/**
 * ScrollToTop.tsx - Scroll to Top Component
 * 
 * This component automatically scrolls to the top of the page whenever
 * the route changes. It listens to location changes and scrolls the
 * window to the top smoothly.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to top of page when route changes.
 * Uses React Router's useLocation hook to detect route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Smooth scroll animation
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;

