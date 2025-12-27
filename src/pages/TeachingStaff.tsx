/**
 * TeachingStaff.tsx - Teaching Staff Page Component
 * 
 * This page displays information about the course teaching staff including:
 * - Course instructor with bio and contact information
 * - Teaching assistants (TAs) with their lab sections
 * - Tutors with contact information
 * - Office hours calendar embedded from Google Docs
 */

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { Users, Mail } from 'lucide-react';
import { IframeSkeleton } from '@/components/ui/iframe-skeleton';
import { OFFICE_HOURS_URL, isIframeLoaded, subscribeToIframeLoad } from '@/hooks/use-iframe-preloader';

// Import Canvas staff data (fetched at build time)
import canvasStaffData from '@/data/canvas-staff.json';
// Import instructor bios (manually maintained)
import instructorBiosData from '@/data/instructor-bio.json';

/**
 * TeachingStaff Component
 * 
 * Displays all teaching staff information organized into sections:
 * 1. Instructor section - detailed card with bio
 * 2. Teaching Assistants section - grid of TA cards
 * 3. Tutors section - grid of tutor cards
 * 4. Office Hours section - embedded calendar iframe
 */
// Fallback data in case Canvas data is not available
const fallbackInstructor = {
  name: 'Niloofar Montazeri',
  title: 'Assistant Teaching Professor',
  email: 'nimontaz@ucsc.edu',
  bio: 'My name is Niloofar Montazeri, and I am your instructor for CSE 140. I am an Assistant Teaching Professor at UC Santa Cruz, with previous experience teaching for seven years at UC Riverside. I hold a PhD in Computer Science from the University of Southern California, specializing in Human Language Technologies.',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
};


// Helper function to generate avatar image URL from name/email
const getAvatarUrl = (name: string, email: string): string => {
  // Use a placeholder avatar service or default image
  // You can customize this to use a specific avatar service
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=400`;
};

// Helper function to find instructor info (bio and title) by name (case-insensitive matching)
const getInstructorInfo = (name: string): { bio: string; title: string } | null => {
  const bios = (instructorBiosData as any).instructor_bios || [];
  const matchedInfo = bios.find((bioEntry: any) => 
    bioEntry.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  return matchedInfo ? { bio: matchedInfo.bio || '', title: matchedInfo.title || '' } : null;
};

const TeachingStaff = () => {
  // Use Canvas data if available, otherwise use fallback
  // Handle both old format (single instructor object) and new format (instructors array)
  // Also handle instructor as array (for backwards compatibility)
  const canvasInstructors = (canvasStaffData as any).instructors 
    ? (canvasStaffData as any).instructors 
    : Array.isArray((canvasStaffData as any).instructor)
    ? (canvasStaffData as any).instructor
    : ((canvasStaffData as any).instructor ? [(canvasStaffData as any).instructor] : []);
  const canvasTas = canvasStaffData.tas || [];
  const canvasTutors = canvasStaffData.tutors || [];

  // Instructors - use Canvas data or fallback, match bios and titles by name
  const instructors = canvasInstructors.length > 0
    ? canvasInstructors.map((instructor: any) => {
        const instructorInfo = getInstructorInfo(instructor.name);
        return {
          name: instructor.name,
          title: instructorInfo?.title || undefined,
          email: instructor.email,
          bio: instructorInfo?.bio || 'Bio not available for this instructor.',
          image: getAvatarUrl(instructor.name, instructor.email),
        };
      })
    : [fallbackInstructor];

  // Teaching Assistants - only use Canvas data
  const tas = canvasTas.map((ta) => ({
    name: ta.name,
    email: ta.email,
    sections: ta.sections || '',
    image: getAvatarUrl(ta.name, ta.email),
  }));

  // Tutors - only use Canvas data
  const tutors = canvasTutors.map((tutor) => ({
    name: tutor.name,
    email: tutor.email,
    image: getAvatarUrl(tutor.name, tutor.email),
  }));

  /**
   * OfficeHoursCalendar Component
   * 
   * Displays the office hours calendar in an embedded iframe with optimized loading.
   * Loads immediately and checks if already preloaded to avoid showing skeleton unnecessarily.
   */
  const OfficeHoursCalendar = () => {
    // Check if iframe is already loaded from preloader
    const [isLoading, setIsLoading] = useState(() => !isIframeLoaded(OFFICE_HOURS_URL));
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // If already loaded, don't show loading state
      if (isIframeLoaded(OFFICE_HOURS_URL)) {
        setIsLoading(false);
        return;
      }

      // Subscribe to load state changes in case preloader finishes while on this page
      const unsubscribe = subscribeToIframeLoad(() => {
        if (isIframeLoaded(OFFICE_HOURS_URL)) {
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
      <div className="w-full relative" style={{ height: '1200px' }}>
        {/* Loading skeleton - only shown if iframe is actually loading */}
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <IframeSkeleton height="1200px" />
          </div>
        )}
        
        {/* Embedded Google Docs calendar - loads immediately, shows all office hours schedule */}
        <iframe
          ref={iframeRef}
          src={OFFICE_HOURS_URL}
          className="w-full h-full border-0 rounded-lg shadow-lg"
          title="CSE 140 Office Hours Calendar"
          loading="eager"
          onLoad={handleIframeLoad}
          style={{ 
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Navigation bar */}
      <Navbar />
      
      {/* Hero section with users icon */}
      <HeroSection
        title="Teaching Staff"
        subtitle="Meet your instructor, teaching assistants and tutors for CSE 140"
        icon={<Users className="h-12 w-12 text-blue-600" />}
      />
      
      {/* Main content area */}
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">

          {/* Instructors Section - displays course instructor(s) information */}
          {instructors.length > 0 && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                {instructors.length === 1 ? 'Instructor' : 'Instructors'}
              </h2>
              
              {/* First instructor - original large card format */}
              <Card className="p-8 mb-6">
                {/* Instructor card - responsive layout (column on mobile, row on desktop) */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Instructor photo - centered on mobile */}
                  <div className="flex justify-center md:justify-start">
                    <img
                      src={instructors[0].image}
                      alt={instructors[0].name}
                      className="w-52 h-52 rounded-lg object-cover"
                    />
                  </div>
                  {/* Instructor details - centered on mobile, left-aligned on desktop */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {instructors[0].name}
                    </h3>
                    <p className="text-lg text-blue-600 mb-4">
                      {instructors[0].title || '\u00A0'}
                    </p>
                    <p className="text-gray-600 mb-6">{instructors[0].bio}</p>
                    {/* Contact information */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center md:justify-start gap-3 text-gray-700">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <a href={`mailto:${instructors[0].email}`} className="hover:text-blue-600">
                          {instructors[0].email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Additional instructors - shown below the first instructor, same design */}
              {instructors.length > 1 && (
                <>
                  {instructors.slice(1).map((instructor, index) => (
                    <Card key={index + 1} className="p-8 mb-6">
                      {/* Instructor card - responsive layout (column on mobile, row on desktop) */}
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Instructor photo - centered on mobile */}
                        <div className="flex justify-center md:justify-start">
                          <img
                            src={instructor.image}
                            alt={instructor.name}
                            className="w-52 h-52 rounded-lg object-cover"
                          />
                        </div>
                        {/* Instructor details - centered on mobile, left-aligned on desktop */}
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {instructor.name}
                          </h3>
                          <p className="text-lg text-blue-600 mb-4">
                            {instructor.title || '\u00A0'}
                          </p>
                          <p className="text-gray-600 mb-6">{instructor.bio}</p>
                          {/* Contact information */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-gray-700">
                              <Mail className="h-5 w-5 text-blue-600" />
                              <a href={`mailto:${instructor.email}`} className="hover:text-blue-600">
                                {instructor.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Teaching Assistants Section - grid of TA cards (only shown if TAs exist) */}
          {tas.length > 0 && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Teaching Assistants</h2>
              {/* Responsive grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
              <div className="flex flex-wrap justify-center gap-6">
                {tas.map((ta, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                    {/* TA photo */}
                    <img
                      src={ta.image}
                      alt={ta.name}
                      className="w-full h-48 rounded-lg object-cover mb-4"
                    />
                    {/* TA name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{ta.name}</h3>
                    {/* Contact information */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                        <a href={`mailto:${ta.email}`} className="hover:text-blue-600">
                          {ta.email}
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tutors Section - grid of tutor cards (only shown if tutors exist) */}
          {tutors.length > 0 && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Tutors</h2>
              {/* Responsive grid - 1 column on mobile, 2 on tablet, 3 on desktop, 4 on xl screens */}
              <div className="flex flex-wrap justify-center gap-6 max-w-[1608px] mx-auto">
                {tutors.map((tutor, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm">
                    {/* Tutor photo */}
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-full h-48 rounded-lg object-cover mb-4"
                    />
                    {/* Tutor name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tutor.name}</h3>
                    {/* Contact information */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                        <a href={`mailto:${tutor.email}`} className="hover:text-blue-600">
                          {tutor.email}
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Office Hours Calendar Section - embedded Google Docs iframe */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">All Office Hours (Subject to change-please check regularly)</h2>
            {/* Iframe container - fixed height for proper display */}
            <OfficeHoursCalendar />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default TeachingStaff;