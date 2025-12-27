/**
 * Home.tsx - Home Page Component
 * 
 * This is the main landing page for the CSE 140 course website.
 * Features:
 * - Interactive 3D hero section with Spline animation
 * - Spotlight hover effect
 * - Comprehensive course information sections
 * - Important links, communication channels, grading, policies, etc.
 * - Responsive design for mobile and desktop
 */

import React, { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react'
// Framer Motion imports - for animations and interactive effects
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion'
import { Card } from '@/components/ui/card'
// Icon imports from lucide-react
import { BookOpen, Link as LinkIcon, MessageSquare, GraduationCap, FileText, AlertCircle, ExternalLink, Users, Target, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useIframePreloader } from '@/hooks/use-iframe-preloader'
// Import Canvas course data (fetched at build time)
import canvasStaffData from '@/data/canvas-staff.json'
// Import course content data
import courseContentData from '@/data/course-content.json'
// Table component imports for grading tables
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Lazy load Spline 3D library - improves initial page load performance
const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Utility function for combining class names
 * Filters out falsy values and joins remaining classes with spaces
 */
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Spotlight Component Props
 * Creates an interactive spotlight effect that follows mouse movement
 */
type SpotlightProps = {
  className?: string; // Additional CSS classes
  size?: number; // Size of the spotlight in pixels
  springOptions?: SpringOptions; // Framer Motion spring animation options
};

/**
 * Spotlight Component
 * 
 * Creates an animated spotlight effect that follows the mouse cursor.
 * Uses Framer Motion springs for smooth animation.
 * Only visible when hovering over the parent element.
 */
export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightProps) {
  // Refs and state for tracking element and hover state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  // Spring animations for smooth mouse tracking
  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  // Transform mouse coordinates to CSS position values (centered on cursor)
  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', () => setIsHovered(true));
    parentElement.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true));
      parentElement.removeEventListener('mouseleave', () =>
        setIsHovered(false)
      );
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-zinc-50 via-zinc-100 to-zinc-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}

/**
 * SplineScene Component Props
 */
interface SplineSceneProps {
  scene: string; // URL to the Spline 3D scene file
  className?: string; // Additional CSS classes
}

/**
 * SplineScene Component
 * 
 * Wraps the Spline 3D component with Suspense for lazy loading.
 * Shows a loading spinner while the 3D scene loads.
 */
function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      // Loading fallback - spinner shown while 3D scene loads
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      {/* Spline 3D scene - interactive 3D animation */}
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}

/**
 * Interactive3D Component Props
 */
interface Interactive3DProps {
  className?: string; // Additional CSS classes
}

/**
 * Interactive3D Component
 * 
 * Main hero section with 3D Spline animation.
 * Features:
 * - Different layouts for mobile and desktop
 * - Welcome message and course description
 * - Interactive 3D scene
 * - Spotlight hover effect
 * - Smooth entrance animations
 */
function Interactive3D({ className }: Interactive3DProps) {
  return (
    <div className={cn("w-full bg-white dark:bg-black relative overflow-hidden", className)}>
      
      {/* Mobile Hero Section - Stacked layout (text on top, 3D scene below) */}
      <div className="md:hidden relative z-10 max-w-[1600px] mx-auto px-4 pt-8 pb-0">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Card className="w-full h-auto bg-black/[0.96] relative overflow-hidden border-gray-200 dark:border-gray-700 mb-0">
            <Spotlight />
            <div className="flex flex-col h-full">
              {/* Text content - Top on mobile */}
              <div className="flex-1 p-6 relative z-10 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-3">
                  {canvasStaffData.course_name}
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                  Dive into the cutting-edge world of Artificial Intelligence! Explore machine learning, neural networks, 
                  intelligent search algorithms, and game-playing systems. Master both symbolic and modern AI techniques 
                  through hands-on projects—from perception and reasoning to optimization and problem-solving. Whether you're 
                  fascinated by how machines learn, how AI systems make decisions, or how to build intelligent agents, 
                  this course will equip you with the foundational concepts and practical skills to shape the future of AI.
                </p>
              </div>

              {/* 3D content - Bottom on mobile */}
              <div className="relative w-full h-[300px]">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Desktop Hero Section - Side-by-side layout (text on left, 3D scene on right) */}
      {/* Full viewport height minus navbar height */}
      <div className="hidden md:block h-[calc(100vh-6rem)] relative px-8 pt-8">
        <motion.div 
          className="h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Card className="w-full h-full bg-black/[0.96] relative overflow-hidden border-gray-200 dark:border-gray-700">
            <Spotlight />
            <div className="flex h-full">
              {/* Text content - Left on desktop */}
              <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4">
                  {canvasStaffData.course_name}
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                  Dive into the cutting-edge world of Artificial Intelligence! Explore machine learning, neural networks, 
                  intelligent search algorithms, and game-playing systems. Master both symbolic and modern AI techniques 
                  through hands-on projects—from perception and reasoning to optimization and problem-solving. Whether you're 
                  fascinated by how machines learn, how AI systems make decisions, or how to build intelligent agents, 
                  this course will equip you with the foundational concepts and practical skills to shape the future of AI.
                </p>
              </div>

              {/* 3D content - Right on desktop */}
              <div className="flex-1 relative">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

/**
 * Helper function to get icon component based on icon name
 */
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    BookOpen,
    MessageSquare,
    AlertCircle,
    GraduationCap,
    FileText,
    Users,
    Target,
    Shield,
  }
  return iconMap[iconName] || BookOpen
}

/**
 * Helper function to get icon color classes
 */
function getIconColorClasses(color: string) {
  const colorMap: Record<string, string> = {
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    teal: 'text-teal-600 dark:text-teal-400',
    pink: 'text-pink-600 dark:text-pink-400',
    red: 'text-red-600 dark:text-red-400',
    blue: 'text-blue-600 dark:text-blue-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  }
  return colorMap[color] || 'text-gray-600 dark:text-gray-400'
}

/**
 * CourseInfo Component
 * 
 * Displays comprehensive course information organized into sections:
 * - Important Links (GitHub, Ed Discussion, forms)
 * - Communication Channels
 * - QA Etiquette
 * - Course Description
 * - Grading information
 * - Learning Outcomes
 * - Assignments and Assessment
 * - Important Policies
 */
function CourseInfo() {
  const data = courseContentData

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 pt-8 md:pt-12 pb-4">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section header */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 pt-0">
            Course Information
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-2 max-w-3xl mx-auto">
            Everything you need to know about CSE 140: Artificial Intelligence
          </p>
        </div>

        {/* Course information cards - organized in vertical stack */}
        <div className="w-full space-y-6">
            {/* Important Links Section - GitHub repos, Ed Discussion, forms */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Important Links</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      GitHub Repositories
                    </h4>
                    <ul className="space-y-3 ml-6">
                      <li>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900 dark:text-white">PacMan Codebase</span>
                          <a href="https://github.com/edulinq/pacai" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
                            https://github.com/edulinq/pacai <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900 dark:text-white">CSE 140 Assignments</span>
                          <a href="https://github.com/ucsc-cse-140/cse140-assignments-public" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
                            https://github.com/ucsc-cse-140/cse140-assignments-public <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Discussion & Forms
                    </h4>
                    <ul className="space-y-3 ml-6">
                      <li>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900 dark:text-white">Ed Discussion Page</span>
                          <a href={import.meta.env.VITE_ED_DISCUSSION_URL || 'https://edstem.org/us/courses/87555/discussion'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
                            {import.meta.env.VITE_ED_DISCUSSION_URL || 'https://edstem.org/us/courses/87555/discussion'} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900 dark:text-white">Programming Assignment Feedback</span>
                          <a href={import.meta.env.VITE_PROGRAMMING_ASSIGNMENT_FEEDBACK_URL || 'https://docs.google.com/document/d/1dv4JcX2gDdzDs0zQih538W2e7_9PWSjfHXkOX-XPbpQ/edit?tab=t.0'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
                            {import.meta.env.VITE_PROGRAMMING_ASSIGNMENT_FEEDBACK_URL || 'https://docs.google.com/document/d/1dv4JcX2gDdzDs0zQih538W2e7_9PWSjfHXkOX-XPbpQ/edit?tab=t.0'} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </li>
                      <li>
                        <span className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Mid Quarter Feedback:</span> TBD</span>
                      </li>
                      <li>
                        {import.meta.env.VITE_TOURNAMENT_URL ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-900 dark:text-white">Tournament</span>
                            <a href={import.meta.env.VITE_TOURNAMENT_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
                              {import.meta.env.VITE_TOURNAMENT_URL} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-white">Tournament:</span> TBD</span>
                        )}
                      </li>
                      <li>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900 dark:text-white">STUDY GROUP FORM</span>
                          <a href={import.meta.env.VITE_STUDY_GROUP_FORM_URL || 'https://docs.google.com/spreadsheets/d/1Zp8oONdAD9V-KqNKsvSe4CbqrF9v43dFGaby9vJ1k0U/edit?gid=1671569792#gid=1671569792'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
                            {import.meta.env.VITE_STUDY_GROUP_FORM_URL || 'https://docs.google.com/spreadsheets/d/1Zp8oONdAD9V-KqNKsvSe4CbqrF9v43dFGaby9vJ1k0U/edit?gid=1671569792#gid=1671569792'} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Course Description Section - Topics, textbook, prerequisites */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.courseDescription.icon), { className: `w-6 h-6 ${getIconColorClasses(data.courseDescription.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.courseDescription.title}</h3>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>{data.courseDescription.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{data.courseDescription.topicsCovered.title}</h4>
                    <p>{data.courseDescription.topicsCovered.content}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{data.courseDescription.textbook.title}</h4>
                    <p dangerouslySetInnerHTML={{ __html: data.courseDescription.textbook.content }} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{data.courseDescription.prerequisites.title}</h4>
                    <p className="mb-2">{data.courseDescription.prerequisites.description}</p>
                    <ul className="space-y-1 ml-6 list-disc">
                      {data.courseDescription.prerequisites.items.map((item, index) => (
                        <li key={index}>
                          {item.text}
                          <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            {item.link.text}
                          </a>
                          {item.note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Communication Channels Section - Canvas, Ed Discussion, office hours */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.communicationChannels.icon), { className: `w-6 h-6 ${getIconColorClasses(data.communicationChannels.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.communicationChannels.title}</h3>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{data.communicationChannels.announcementBox.title}</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{data.communicationChannels.announcementBox.description}</p>
                  </div>
                  
                  <p>{data.communicationChannels.description}</p>
                  
                  <div className="mt-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-3">{data.communicationChannels.guidelines.title}</p>
                    <ul className="space-y-2 ml-6 list-disc">
                      {data.communicationChannels.guidelines.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item.text }} />
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* QA Etiquette Section - Guidelines for Ed Discussion usage */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.qaEtiquette.icon), { className: `w-6 h-6 ${getIconColorClasses(data.qaEtiquette.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.qaEtiquette.title}</h3>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>{data.qaEtiquette.description}</p>
                  <ul className="space-y-2 ml-6 list-disc">
                    {data.qaEtiquette.items.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            {/* Grading Section - Grade components, grade scale, policies */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.grading.icon), { className: `w-6 h-6 ${getIconColorClasses(data.grading.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.grading.title}</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{data.grading.gradeComponents.title}</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Weight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.grading.gradeComponents.items.map((row, index) => (
                            <TableRow key={index} className={row.isTotal ? 'font-semibold border-t-2' : ''}>
                              <TableCell>{row.item}</TableCell>
                              <TableCell className="text-right">{row.weight}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{data.grading.gradeScale.title}</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Grade</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.grading.gradeScale.items.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.grade}</TableCell>
                              <TableCell className="text-right">{row.percentage}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-100" dangerouslySetInnerHTML={{ __html: data.grading.note.text }} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Learning Outcomes Section - What students will learn */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.learningOutcomes.icon), { className: `w-6 h-6 ${getIconColorClasses(data.learningOutcomes.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.learningOutcomes.title}</h3>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="mb-3">{data.learningOutcomes.description}</p>
                  <ul className="space-y-2 ml-6 list-disc">
                    {data.learningOutcomes.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            {/* Class and Discussion Participation + Excused Absences Section */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.classParticipationAndAbsences.icon), { className: `w-6 h-6 ${getIconColorClasses(data.classParticipationAndAbsences.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.classParticipationAndAbsences.title}</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  {data.classParticipationAndAbsences.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{section.title}</h4>
                      {Array.isArray(section.content) && (
                        <>
                          {section.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className={pIndex < section.content.length - 1 ? 'mb-2' : ''} dangerouslySetInnerHTML={{ __html: paragraph }} />
                          ))}
                        </>
                      )}
                      {typeof section.content === 'string' && (
                        <p dangerouslySetInnerHTML={{ __html: section.content }} />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Assignments and Assessment Section - Worksheets, quizzes, programming assignments */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.assignmentsAndAssessment.icon), { className: `w-6 h-6 ${getIconColorClasses(data.assignmentsAndAssessment.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.assignmentsAndAssessment.title}</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  {data.assignmentsAndAssessment.description && (
                    <p className="mb-4">{data.assignmentsAndAssessment.description}</p>
                  )}
                  {data.assignmentsAndAssessment.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{section.title}</h4>
                      {Array.isArray(section.content) && (
                        <>
                          {section.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className={pIndex < section.content.length - 1 ? 'mb-2' : ''} dangerouslySetInnerHTML={{ __html: paragraph }} />
                          ))}
                        </>
                      )}
                      {typeof section.content === 'string' && (
                        <p dangerouslySetInnerHTML={{ __html: section.content }} />
                      )}
                      {section.gradingCriteria && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 my-3">
                          <p className="font-semibold text-green-900 dark:text-green-100 mb-2">{section.gradingCriteria.title}</p>
                          {section.gradingCriteria.description && (
                            <p className="text-sm text-green-800 dark:text-green-200 mb-2">{section.gradingCriteria.description}</p>
                          )}
                          <ul className="space-y-1 ml-4 list-disc text-sm text-green-800 dark:text-green-200">
                            {section.gradingCriteria.items.map((item, itemIndex) => (
                              <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                          </ul>
                        </div>
                      )}
                      {section.latePolicy && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{section.latePolicy.title}</p>
                          {Array.isArray(section.latePolicy.content) && (
                            <>
                              {section.latePolicy.content.map((paragraph, pIndex) => (
                                <p key={pIndex} className={`text-sm text-blue-800 dark:text-blue-200 ${pIndex < section.latePolicy.content.length - 1 ? 'mb-2' : ''}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Important Policies Section - Re-grading, academic integrity, absences, support */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  {React.createElement(getIconComponent(data.importantPolicies.icon), { className: `w-6 h-6 ${getIconColorClasses(data.importantPolicies.iconColor)}` })}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.importantPolicies.title}</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  {data.importantPolicies.sections.map((section, sectionIndex) => {
                    const sectionLink = section.link;
                    return (
                      <div key={sectionIndex}>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{section.title}</h4>
                        {typeof section.content === 'string' && (
                          <p dangerouslySetInnerHTML={{ __html: section.content }} />
                        )}
                        {Array.isArray(section.content) && (
                          <>
                            {section.content.map((paragraph, pIndex) => (
                              <p key={pIndex} className={pIndex < section.content.length - 1 ? 'mb-2' : ''} dangerouslySetInnerHTML={{ __html: paragraph }} />
                            ))}
                            {sectionLink && (
                              <p className="mt-2">
                                <a 
                                  href={sectionLink.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                >
                                  {sectionLink.text} <ExternalLink className="w-3 h-3" />
                                </a>
                              </p>
                            )}
                          </>
                        )}
                        {sectionLink && typeof section.content === 'string' && (
                          <a 
                            href={sectionLink.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-2"
                          >
                            {sectionLink.text} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {section.items && (
                          <ul className="space-y-1 ml-6 list-disc">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                  {item.text}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Home Component (Main Page Component)
 * 
 * This is the main component exported as the home page.
 * It combines:
 * - Navigation bar
 * - Interactive 3D hero section
 * - Course information sections
 * - Footer
 * - Preloads Google Docs calendars in the background
 */
const Home = () => {
  // Preload Google Docs iframes when home page loads
  useIframePreloader();

  return (
    <>
      {/* Navigation bar - sticky at top */}
      <Navbar />
      
      {/* Interactive 3D hero section with welcome message */}
      <Interactive3D />
      
      {/* Course information - all course details and policies */}
      <CourseInfo />
      
      {/* Footer */}
      <Footer />
    </>
  )
}

export default Home;