/**
 * Projects.tsx - Projects Page Component
 * 
 * This page displays all course programming assignments and projects.
 * Features:
 * - Interactive project cards with hover effects
 * - Links to GitHub repositories for each project
 * - Additional resources section with Pacman codebase and documentation links
 */

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { HoverEffect } from '@/components/ui/hover-effect';
import { Ghost } from 'lucide-react';

/**
 * Projects Component
 * 
 * Displays a list of course projects with:
 * - Project titles and descriptions
 * - Links to GitHub repositories
 * - Hover effect cards for better UX
 */
const Projects = () => {
  // Helper function to get due date from environment variables or return "TBD"
  const getDueDate = (projectNumber: number): string => {
    const envKey = `VITE_PROJECT_${projectNumber}_DUE_DATE`;
    const dueDate = import.meta.env[envKey];
    return dueDate || 'TBD';
  };

  // Project data - array of all course projects with their details and due dates
  const projects = [
    {
      title: 'Project 0: Unix/Python Tutorial',
      description: 'This project will cover the basics of working in a Unix environment, a small introduction to Python, and the basics of working with the autograding tools you will be using all quarter. In this course, we will only be using Python 3 (>= 3.10).',
      link: 'https://github.com/ucsc-cse-140/cse140-assignments-public/tree/main/p0',
      dueDate: getDueDate(0),
    },
    {
      title: 'Project 1: Search in Pac-Man',
      description: 'In this project, your Pac-Man agent will find paths through their maze world, both to reach a particular location and to collect food efficiently. You will build general search algorithms and apply them to different Pac-Man scenarios.',
      link: 'https://github.com/ucsc-cse-140/cse140-assignments-public/tree/main/p1',
      dueDate: getDueDate(1),
    },
    {
      title: 'Project 2: Multi-Agent Pac-Man',
      description: 'In this project, you will design agents for the classic version of Pac-Man, including ghosts. Along the way, you will implement both minimax and expectimax search and try your hand at evaluation function design.',
      link: 'https://github.com/ucsc-cse-140/cse140-assignments-public/tree/main/p2',
      dueDate: getDueDate(2),
    },
    {
      title: 'Project 3: Reinforcement Learning',
      description: 'In this project, you will implement value iteration and Q-learning. You will test your agents first on Gridworld (from class), then apply them to Pac-Man.',
      link: 'https://github.com/ucsc-cse-140/cse140-assignments-public/tree/main/p3',
      dueDate: getDueDate(3),
    },
    {
      title: 'Project 4: Pac-Man Capture the Flag',
      description: 'The final project involves a multi-player capture-the-flag variant of Pac-Man, where agents control both Pac-Man and ghosts in coordinated team-based strategies. Your team will try to eat the food on the far side of the map, while defending the food on your home side.',
      link: 'https://github.com/ucsc-cse-140/cse140-assignments-public/tree/main/p4',
      dueDate: getDueDate(4),
    },
  ];

  return (
    <>
      {/* Navigation bar - sticky at top */}
      <Navbar />
      
      {/* Hero section - page title and subtitle with icon */}
      <HeroSection
        title="Projects"
        subtitle="Course projects and programming assignments"
        icon={<Ghost className="h-12 w-12 text-blue-600" />}
      />
      
      {/* Main content area */}
      <div className="bg-white">
        <div className="container mx-auto px-4 pb-6">
          {/* Note about due dates on Canvas */}
          <div className="max-w-4xl mx-auto mt-4 -mb-6 p-2 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-semibold text-center text-sm">
              Note: The due dates may not be updated on the website. Please refer to Canvas for the most accurate and up-to-date deadlines.
            </p>
          </div>
          
          {/* Project cards with hover effects - displays all projects */}
          <HoverEffect items={projects} />
          
          {/* Additional Resources Section - links to Pacman codebase and documentation */}
          <div className="max-w-4xl mx-auto mt-2 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Additional Resources</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Pacman Codebase:</span>{' '}
                <a 
                  href="https://github.com/edulinq/pacai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://github.com/edulinq/pacai
                </a>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Pacman Documentation:</span>{' '}
                <a 
                  href="https://ucsc-cse-140.github.io/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://ucsc-cse-140.github.io/
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Projects;