/**
 * use-iframe-preloader.tsx - Custom Hook for Preloading Google Docs Iframes
 * 
 * This hook preloads Google Docs iframes in the background to improve
 * perceived performance when users navigate to pages with embedded calendars.
 * 
 * Features:
 * - Preloads iframes when component mounts
 * - Tracks loading state globally
 * - Manages hidden iframe containers for preloading
 * - Exposes global state to check if iframes are already loaded
 */

import { useEffect, useState, useRef } from 'react';

/**
 * Google Docs URLs to preload
 * These can be overridden via environment variables in .env.local
 */
export const CALENDAR_URL = import.meta.env.VITE_CALENDAR_URL || 'https://docs.google.com/document/d/1L1iCRayCBm1d1k2B9QrTdymtCrEicXc2li1hXPdKYL0/edit?tab=t.0';
export const OFFICE_HOURS_URL = import.meta.env.VITE_OFFICE_HOURS_URL || 'https://docs.google.com/document/d/1qlxvJ-XVo97HnBuxywVqQFlHlZlN4aj01F6ecovUPvM/edit?tab=t.0';

/**
 * Global state to track iframe load status
 * This allows components to check if iframes are already loaded from preloading
 */
interface IframeLoadState {
  calendarLoaded: boolean;
  officeHoursLoaded: boolean;
}

// Global state object
const iframeLoadState: IframeLoadState = {
  calendarLoaded: false,
  officeHoursLoaded: false,
};

// Listeners for when iframes finish loading
const loadListeners: Array<() => void> = [];

/**
 * Subscribe to iframe load state changes
 */
export const subscribeToIframeLoad = (callback: () => void) => {
  loadListeners.push(callback);
  return () => {
    const index = loadListeners.indexOf(callback);
    if (index > -1) {
      loadListeners.splice(index, 1);
    }
  };
};

/**
 * Notify all listeners of load state changes
 */
const notifyListeners = () => {
  loadListeners.forEach(callback => callback());
};

/**
 * Check if a specific iframe URL is already loaded
 */
export const isIframeLoaded = (url: string): boolean => {
  if (url === CALENDAR_URL) {
    return iframeLoadState.calendarLoaded;
  }
  if (url === OFFICE_HOURS_URL) {
    return iframeLoadState.officeHoursLoaded;
  }
  return false;
};

/**
 * Preloads Google Docs iframes in hidden containers
 * This allows the browser to cache the content before the user navigates to the page
 */
export const useIframePreloader = () => {
  const [preloaded, setPreloaded] = useState(false);
  const preloadContainerRef = useRef<HTMLDivElement | null>(null);
  const calendarIframeRef = useRef<HTMLIFrameElement | null>(null);
  const officeHoursIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Create a hidden container for preloading iframes
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.overflow = 'hidden';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
    preloadContainerRef.current = container;

    // Create and preload calendar iframe
    const calendarIframe = document.createElement('iframe');
    calendarIframe.src = CALENDAR_URL;
    calendarIframe.style.width = '1200px';
    calendarIframe.style.height = '1200px';
    calendarIframe.style.border = 'none';
    calendarIframe.loading = 'eager';
    calendarIframe.setAttribute('aria-hidden', 'true');
    
    // Track when calendar iframe loads
    calendarIframe.onload = () => {
      iframeLoadState.calendarLoaded = true;
      notifyListeners();
    };
    
    calendarIframeRef.current = calendarIframe;
    
    // Create and preload office hours iframe
    const officeHoursIframe = document.createElement('iframe');
    officeHoursIframe.src = OFFICE_HOURS_URL;
    officeHoursIframe.style.width = '1200px';
    officeHoursIframe.style.height = '1200px';
    officeHoursIframe.style.border = 'none';
    officeHoursIframe.loading = 'eager';
    officeHoursIframe.setAttribute('aria-hidden', 'true');
    
    // Track when office hours iframe loads
    officeHoursIframe.onload = () => {
      iframeLoadState.officeHoursLoaded = true;
      notifyListeners();
    };
    
    officeHoursIframeRef.current = officeHoursIframe;

    // Add iframes to container
    container.appendChild(calendarIframe);
    container.appendChild(officeHoursIframe);

    // Mark as preloaded after a short delay to allow browser to start loading
    const timer = setTimeout(() => {
      setPreloaded(true);
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  return { preloaded, calendarIframe: calendarIframeRef.current, officeHoursIframe: officeHoursIframeRef.current };
};

/**
 * Preloads a specific Google Docs URL
 * Can be used for individual iframe preloading
 */
export const preloadIframe = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '1200px';
    iframe.style.height = '1200px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.loading = 'eager';
    iframe.setAttribute('aria-hidden', 'true');
    
    iframe.onload = () => {
      if (url === CALENDAR_URL) {
        iframeLoadState.calendarLoaded = true;
      } else if (url === OFFICE_HOURS_URL) {
        iframeLoadState.officeHoursLoaded = true;
      }
      notifyListeners();
      resolve();
    };
    iframe.onerror = () => resolve(); // Resolve even on error to not block
    
    document.body.appendChild(iframe);
    
    // Cleanup after a delay
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 30000); // Keep for 30 seconds to allow caching
  });
};

