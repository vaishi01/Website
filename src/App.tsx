/**
 * App.tsx - Main Application Component
 * 
 * This is the root component of the CSE 140 website application.
 * It sets up all the necessary providers and routing configuration.
 */

// UI Component Imports - Toast notifications and tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Third-party Library Imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // For data fetching and caching
import { BrowserRouter, Routes, Route } from "react-router-dom"; // For client-side routing
import { ThemeProvider } from "next-themes"; // For theme management

// Page Component Imports
import Home from "./pages/Home";
import CourseCalendar from "./pages/CourseCalendar";
import TeachingStaff from "./pages/TeachingStaff";
import CourseMaterial from "./pages/CourseMaterial";
import Projects from "./pages/Projects";
import ScrollToTop from "./components/ScrollToTop";

// Initialize React Query client for data fetching
const queryClient = new QueryClient();

/**
 * App Component
 * 
 * Wraps the entire application with necessary providers:
 * - QueryClientProvider: Enables React Query for data fetching
 * - ThemeProvider: Manages theme (currently forced to light mode)
 * - TooltipProvider: Enables tooltip functionality across the app
 * - BrowserRouter: Enables client-side routing
 * 
 * Defines all application routes:
 * - "/" - Home page (Home)
 * - "/course-calendar" - Course calendar page
 * - "/teaching-staff" - Teaching staff information page
 * - "/course-material" - Lecture slides page
 * - "/projects" - Course projects page
 */
const App = () => {
  const routerBase = import.meta.env.BASE_URL ?? "/";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
        <TooltipProvider>
          {/* Toast notification components for user feedback */}
          <Toaster />
          <Sonner />
          
          {/* Router setup - handles all page navigation */}
          <BrowserRouter basename={routerBase}>
            {/* Scroll to top on route change */}
            <ScrollToTop />
            <Routes>
              {/* Home page - Course overview and information */}
              <Route path="/" element={<Home />} />
              
              {/* Calendar page - Course schedule and important dates */}
              <Route path="/course-calendar" element={<CourseCalendar />} />
              
              {/* Teaching staff page - Instructor, TAs, and tutors information */}
              <Route path="/teaching-staff" element={<TeachingStaff />} />
              
              {/* Lecture slides page - Downloadable lecture materials */}
              <Route path="/course-material" element={<CourseMaterial />} />
              
              {/* Projects page - Course programming assignments */}
              <Route path="/projects" element={<Projects />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;