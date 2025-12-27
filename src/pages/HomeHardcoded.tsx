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
                  <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Course Description</h3>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    This course provides an introduction to Artificial Intelligence (AI). Topics include knowledge representation, reasoning, and learning. 
                    Emphasis will be on algorithms for search, inference, constraint satisfaction, and optimization. The general format of the course will 
                    be in-person with asynchronous lecture recordings posted on Canvas.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Topics Covered</h4>
                    <p>
                      Agents, search, constraint satisfaction, game playing, utility theory, decision-making under uncertainty, reinforcement learning, 
                      probabilistic reasoning, machine learning, and other topics as time permits.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Textbook</h4>
                    <p dangerouslySetInnerHTML={{ __html: "<strong><a href=\"https://aima.cs.berkeley.edu/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 dark:text-blue-400 hover:underline\">Russell and Norvig, Artificial Intelligence: A Modern Approach</a></strong>, Prentice-Hall, Fourth Edition (Purple Book). ISBN 0-13-604259-7 is the recommended text. You may also use the third edition (Blue Book) or, at your own risk, the second edition (2E - aka the Green Book). The second edition has most of what you need; the third and fourth editions have improved pseudo-code and better sections on learning. The first edition (Red Book) is too different to use." }} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Prerequisites</h4>
                    <p className="mb-2">Students should have working knowledge of probability, linear algebra, and ability to (learn to) program in Python.</p>
                    <ul className="space-y-1 ml-6 list-disc">
                      <li>For a refresher on probability; I recommend the <a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">MIT OpenCourseware probability course</a>. There are lecture videos, notes, and online slides.</li>
                      <li>For a refresher on linear algebra; I recommend <a href="https://www.youtube.com/watch?v=ZK3O402wf1c&list=PL49CF3715CB9EF31D&index=1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Gil Strang's MIT Linear Algebra lectures</a>. They are all on Youtube, the first 1-3 lectures are sufficient background.</li>
                      <li>For learning python, one good resource is <a href="https://www.greenteapress.com/thinkpython/html/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Think Python</a> (the first few chapters).</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Communication Channels Section - Canvas, Ed Discussion, office hours */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Communication Channels</h3>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important announcements will be through Canvas Announcements</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">You are responsible for reading them as they can contain important logistics information.</p>
                  </div>
                  
                  <p>Ed Discussion will be used mainly for Q&A.</p>
                  
                  <div className="mt-4">
                    <p className="font-semibold text-gray-900 dark:text-white mb-3">This a very large class. In order to get a response in a reasonable time, please use the communication channels below based on the specific issue you need to resolve:</p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li dangerouslySetInnerHTML={{ __html: "<strong>Lecture slides/book questions</strong> → Ed Discussion, Instructor and TA office hours" }} />
                      <li dangerouslySetInnerHTML={{ __html: "<strong>Assignment questions</strong> → Ed Discussion, TA office hours" }} />
                      <li dangerouslySetInnerHTML={{ __html: "<strong>Personal concerns</strong> → Meet the instructor after class or in office hours" }} />
                      <li dangerouslySetInnerHTML={{ __html: "<strong>Urgent matters</strong> → Email with subject starting with \"URGENT:\" For non-personal urgent matters, please make sure you include TAs as well." }} />
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* QA Etiquette Section - Guidelines for Ed Discussion usage */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">QA Etiquette</h3>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>We will use Ed Discussion for QA (Link on top of this page as well as the navigation bar on the left). We will keep you posted if that changes. Irrespective of which platform we use for discussion, there are a few baselines for good Ed Discussion etiquette:</p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li dangerouslySetInnerHTML={{ __html: "Please be <strong>respectful</strong> and <strong>constructive</strong> in all communications, whether to students or to teaching staff." }} />
                    <li>Before asking a question, check to see if it has already been answered, and if so, remember to link to previously posted useful answers.</li>
                    <li dangerouslySetInnerHTML={{ __html: "Further, please be sure to <strong>take some time to think about your problem</strong> or issue before posting. Consider using the <strong>\"30 minute rule\"</strong>: spend at least 30 minutes trying to figure things out on your own before posting. We definitely want you to get the help you need, as soon as possible, but occasionally we see students who post as soon as they have some small issue or hiccup. The point of class assignments is for you to have to think, and sometimes that's hard (but most of all, it's fun too!" }} />
                    <li dangerouslySetInnerHTML={{ __html: "On the other hand, <strong>clarification questions</strong>, etc. are <strong>totally welcomed</strong>, and should be asked immediately." }} />
                    <li dangerouslySetInnerHTML={{ __html: "<strong class=\"text-red-600 dark:text-red-400\">UNDER NO CIRCUMSTANCES</strong> should <strong>code</strong> be posted on Ed Discussion. If you need help with code, you should attend office hours or the discussion sections." }} />
                    <li dangerouslySetInnerHTML={{ __html: "Also, remember that while you may post <strong>anonymously</strong> to the class, the <strong>instructors always see who is posting</strong>. Again, the goal is for Ed Discussion to be a useful, pleasant, positive environment for all!" }} />
                  </ul>
                </div>
              </Card>
            </div>

            {/* Grading Section - Grade components, grade scale, policies */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Grading</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Grade Components</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Weight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Class Participation + In-Class Exercise</TableCell>
                            <TableCell className="text-right">5%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Worksheets</TableCell>
                            <TableCell className="text-right">25%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Quizzes</TableCell>
                            <TableCell className="text-right">25%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Programming Assignments</TableCell>
                            <TableCell className="text-right">25%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Final</TableCell>
                            <TableCell className="text-right">20%</TableCell>
                          </TableRow>
                          <TableRow className="font-semibold border-t-2">
                            <TableCell>Total</TableCell>
                            <TableCell className="text-right">100%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Grade Scale</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Grade</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow><TableCell>A</TableCell><TableCell className="text-right">[90 - 100]%</TableCell></TableRow>
                          <TableRow><TableCell>A-</TableCell><TableCell className="text-right">[85 - 90)%</TableCell></TableRow>
                          <TableRow><TableCell>B+</TableCell><TableCell className="text-right">[80 - 85)%</TableCell></TableRow>
                          <TableRow><TableCell>B</TableCell><TableCell className="text-right">[75 - 80)%</TableCell></TableRow>
                          <TableRow><TableCell>B-</TableCell><TableCell className="text-right">[70 - 75)%</TableCell></TableRow>
                          <TableRow><TableCell>C+</TableCell><TableCell className="text-right">[65 - 70)%</TableCell></TableRow>
                          <TableRow><TableCell>C</TableCell><TableCell className="text-right">[60 - 65)%</TableCell></TableRow>
                          <TableRow><TableCell>C-</TableCell><TableCell className="text-right">[55 - 60)%</TableCell></TableRow>
                          <TableRow><TableCell>D+</TableCell><TableCell className="text-right">[50 - 55)%</TableCell></TableRow>
                          <TableRow><TableCell>D</TableCell><TableCell className="text-right">[45 - 50)%</TableCell></TableRow>
                          <TableRow><TableCell>D-</TableCell><TableCell className="text-right">[40 - 45)%</TableCell></TableRow>
                          <TableRow><TableCell>F</TableCell><TableCell className="text-right">[0 - 40)%</TableCell></TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-100" dangerouslySetInnerHTML={{ __html: "<strong>Note:</strong> These cutoffs represent grade minimums. We may adjust grades upward based on class participation, extra credit, etc. The grade of A+ will be awarded at the professor's discretion based on exceptional performance." }} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Learning Outcomes Section - What students will learn */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Learning Outcomes</h3>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="mb-3">In this course, students will learn theory and implementation behind artificial intelligence. As a result of the course work, students will be able to apply AI techniques to solve search problems. They will be able to compare and contrast different AI methods, and explain their reasoning. By the end of the class, students should be able to:</p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Recall the steps and parts of developing an AI system (Russell and Norvig chapter 1).</li>
                    <li>Explain the differences between different search methods. (Quiz Module 1)</li>
                    <li>Interpret questions about AI methodologies (Quizzes + Finals).</li>
                    <li>Compare and contrast between the public perception of AI and the realistic expectations of AI (class discussion and exercises).</li>
                    <li>Differentiate between single-agent and multi-agent behaviors (Programming assignment P2).</li>
                    <li>Interpret values and optimization for an AI agent (Programming assignment P3).</li>
                    <li>Implement components of AI programs in python. (Programming assignments)</li>
                    <li>Judge whether an AI system is behaving reasonably (or not). (Programming assignment P3)</li>
                    <li>Create AI systems that can learn from experience and in dynamic environments and perform better than a set of baseline agents (Programming assignment P4).</li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* Class and Discussion Participation + Excused Absences Section */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Class and Discussion Participation + Excused Absences</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Class and Discussion Participation</h4>
                    <p className="mb-2">In this class, your accountability to your education will earn you points: showing up and participating will account for 5% of the grade. Class participation will be evaluated via the completion of in-class exercises that will be collected immediately after class.</p>
                    <p className="mb-2">Participation in class discussions and online discussions is highly encouraged.</p>
                    <p className="mb-2">If you must miss a class due an excused absence (see below), please let us know so this will not affect your class participation evaluation.</p>
                    <p>Since this is an in-person class, students must arrive on time to class. Cell phone use during class is not permitted; it not only distracts the student, it also distracts students around you.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Excused Absences</h4>
                    <p className="mb-2" dangerouslySetInnerHTML={{ __html: "Any student who needs to be excused for a prolonged absence (2 or more consecutive class meetings), including the final exam must provide written documentation of the illness from the Health Center or from an outside health care provider. This documentation must verify dates of treatment and indicate the timeframe that the student was unable to meet academic responsibilities. No diagnostic information shall be given by Student Health Services to me. <strong>Excused absences do not extend your 7 late day budget.</strong>" }} />
                    <p>Any student who must miss a class due to religious holidays should also notify the instructor in office hours or by emailing the Instructor and TAs during the first two weeks of class.</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Assignments and Assessment Section - Worksheets, quizzes, programming assignments */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Assignments and Assessment</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <p className="mb-4">The course will be structured around a set of learning modules. Each module will have an associated worksheet, available on Canvas. There will be a low-stakes quiz covering 2 modules at a time, and programming assignments.</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Worksheets</h4>
                    <p className="mb-2">
                      Since much of AI is about problem solving, we will have worksheets to help you work through AI problems. The worksheets require not just reading and understanding the lecture, but will often require working out solutions to problems. It is highly suggested that you work these out on paper, this will be excellent practice and preparation for the quizzes and exam. Because of this, they will require a substantial amount of effort, so please plan accordingly.
                    </p>
                    <p dangerouslySetInnerHTML={{ __html: "<strong>No late worksheets will be accepted</strong>, however, your lowest worksheet score will be dropped." }} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quizzes</h4>
                    <p className="mb-2" dangerouslySetInnerHTML={{ __html: "The goal of this course is to prepare you for research or a professional career in Artificial Intelligence. With that in mind, the quizzes are excellent preparation for internship, grad school, and job interviews. There will be (approximately) biweekly quizzes, covering two modules at a time, and a final exam (no midterm). Quizzes will be in class, in the <strong>FIRST</strong> half of the lecture in person." }} />
                    <p className="mb-2">The quizzes are open notes (No phones or laptops, just 1 paper front and back), and you are encouraged to use pencil and paper for scratch paper. No communication or collaboration is allowed on quizzes or exams. If you have any questions about what is acceptable and what is not, please ask.</p>
                    <p>There will be no makeup quizzes, but your lowest quiz score will be dropped.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Programming Assignments</h4>
                    <p className="mb-2">
                      Programming assignments will be in Python. There will be an initial introductory programming assignment to familiarize you with Python (P0), three longer programming assignments to guide your AI brain (P1, P2, P3), and a final project that will put the knowledge you learned in the class to a test (P4). These programming assignments are challenging, and are not designed to be done in a single evening.
                    </p>
                    <p className="mb-3">
                      In the spirit of preparing you for a career in AI, there are reasons to start programming tasks early: many AI programs can take hours, days, or even months to run. We highly recommend starting the programming assignments as soon as possible.
                    </p>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 my-3">
                      <p className="font-semibold text-green-900 dark:text-green-100 mb-2">Grading criteria for programming assignments</p>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-2">For all programming assignments, we will grade you on both correctness and style. Here's a description of each category and the value that will be assigned:</p>
                      <ul className="space-y-1 ml-4 list-disc text-sm text-green-800 dark:text-green-200">
                        <li dangerouslySetInnerHTML={{ __html: "<strong>Correctness (20 points or 25 points):</strong> This is the portion of the grade we derive from the auto-grader. Note that the auto-grader assigns partial credit to solutions that are correct but do not perform as well (based on some specified criteria) as the best-proposed solution to date. This is the core of the assignment." }} />
                        <li dangerouslySetInnerHTML={{ __html: "<strong>Style (5 points):</strong> Additionally, we will assign 5 points based on good coding practices such as: use of subroutines where possible, efficient implementation, and documentation where necessary." }} />
                        <li>All work submitted must be original.</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Late Programming Assignments</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">Unless otherwise stated, programming assignments are due electronically at 11:59 pm PST on their respective due dates.</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">Recognizing that students may face unusual circumstances and require some flexibility in the course of the quarter, each student will have a total of seven free late (calendar) days to use as s/he/they sees fit; using a max of 4 late days per assignment. (So grading can be completed in a timely manner).</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">Once these late days are exhausted, any assignment turned in late will be penalized at the rate of 25% per late day. Under no circumstances will a project be accepted more than four days after its due date.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Important Policies Section - Re-grading, academic integrity, absences, support */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Important Policies</h3>
                </div>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Re-Grading Issues</h4>
                    <p dangerouslySetInnerHTML={{ __html: "The majority of the grading will be done by the TAs. If you think there has been a mistake in grading your homework or exam, please submit a regrade request explaining in writing, precisely and concisely, the grading error that has occurred, to the TA. Such request must be made <strong>no later than 1 week</strong> after the material in question was returned to the class. Any request to have an assignment regraded may result in the entire assignment in question being regraded, possibly resulting in a loss of points." }} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Academic Integrity</h4>
                    <p className="mb-2">
                      In this course you are responsible for both the University's Code of Academic Integrity and the UCSC policies for acceptable computing use. Any evidence of unacceptable use of computer accounts, web resources, or unauthorized cooperation on tests, quizzes, or projects will be submitted to the Student Affairs, which could result in an XF for the course, suspension, or expulsion from the University.
                    </p>
                    <p className="mb-2">For more details please see:</p>
                    <a href="https://docs.google.com/document/d/1NICSzZWFTFWxLsFHdVf8oA4PT8EwJZg0tH4u_SvG-Sk/edit#heading=h.72t90jlgoosk" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                      Academic Integrity Details <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Excused Absences</h4>
                    <p className="mb-2" dangerouslySetInnerHTML={{ __html: "Any student who needs to be excused for a prolonged absence (2 or more consecutive class meetings), the midterm or final exam must provide written documentation of the illness from the Health Center or from an outside health care provider. This documentation must verify dates of treatment and indicate the timeframe that the student was unable to meet academic responsibilities. No diagnostic information shall be given. <strong>Excused absences do not extend your 7 late day budget.</strong>" }} />
                    <p className="mb-2">
                      Any student eligible for and requesting reasonable academic accommodations due to a disability is requested to provide, to the instructor in office hours, a letter of accommodation from the Disability Resource Center (DRC) within the first two weeks of the quarter.
                    </p>
                    <p>
                      Any student who must miss a class due to religious holidays should also notify the instructor during the first two weeks of class.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Support Resources</h4>
                    <ul className="space-y-1 ml-6 list-disc">
                      <li><a href="https://docs.google.com/document/d/1NICSzZWFTFWxLsFHdVf8oA4PT8EwJZg0tH4u_SvG-Sk/edit#heading=h.72t90jlgoosk" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Accessibility</a></li>
                      <li><a href="https://docs.google.com/document/d/1NICSzZWFTFWxLsFHdVf8oA4PT8EwJZg0tH4u_SvG-Sk/edit#heading=h.72t90jlgoosk" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Student Support Services</a></li>
                    </ul>
                  </div>
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