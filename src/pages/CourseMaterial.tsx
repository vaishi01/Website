/**
 * CourseMaterial.tsx - Course Material Page Component
 * 
 * This page displays a table of all lecture slides available for download.
 * Features:
 * - Module numbers and topics
 * - View and download links for each lecture
 * - Responsive table design
 */

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { BookOpen, Download, Eye } from 'lucide-react';

type SlideEntry = {
  number: number;
  topic: string;
  pdf: string;
};

type SlideSection = {
  title: string;
  description: string;
  data: SlideEntry[];
  columnLabel?: string;
  isCheatSheet?: boolean;
};

/**
 * Converts a Google Docs presentation URL or Google Drive file URL to a PDF export URL
 * @param url - The Google Docs presentation URL or Google Drive file URL
 * @returns The PDF export URL or the original URL if it's not a Google Docs/Drive URL
 */
const getDownloadUrl = (url: string): string => {
  if (url === '#' || (!url.includes('docs.google.com') && !url.includes('drive.google.com'))) {
    return url;
  }
  
  // Handle Google Docs presentations
  if (url.includes('docs.google.com/presentation')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://docs.google.com/presentation/d/${fileId}/export?format=pdf`;
    }
  }
  
  // Handle Google Drive files
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  
  // Handle Google Drive folders - return original URL (can't download folders directly)
  if (url.includes('drive.google.com/drive/folders/')) {
    return url;
  }
  
  return url;
};

/**
 * CourseMaterial Component
 * 
 * Displays a table of lecture slides with:
 * - Module numbers
 * - Lecture topics
 * - View and download links
 */
const CourseMaterial = () => {
  // Lecture data - array of all lectures with module numbers and topics
  const lectureSlides: SlideEntry[] = [
    { number: 0, topic: 'Intro', pdf: 'https://docs.google.com/presentation/d/1xg75dcL-5KgRWYzGxmpx0hImig96jpn3/edit?slide=id.p1#slide=id.p1' },
    { number: 0, topic: 'Intelligent Agents', pdf: 'https://docs.google.com/presentation/d/1qRtP2rHlSGd0FKnfj47qzEYoJqdMF91r/edit?slide=id.p1#slide=id.p1' },
    { number: 1, topic: 'Blind Search', pdf: 'https://docs.google.com/presentation/d/1HEE-4Pz_RyfBS0I7DXb2X4xkiYZT3-aY/edit?slide=id.p1#slide=id.p1' },
    { number: 1, topic: 'Heuristic Search', pdf: 'https://docs.google.com/presentation/d/1-J_i5QTX0ZM7ijk4xMFYoRxUwZYzr4SF/edit' },
    { number: 2, topic: 'Constraint Satisfaction Problems', pdf: 'https://docs.google.com/presentation/d/1-jBJAdLTZ2WQbSncpggrF03uQz6Ya1di/edit?slide=id.p1#slide=id.p1' },
    { number: 3, topic: 'Adversarial Search', pdf: 'https://docs.google.com/presentation/d/100uCNLiaC7ahkAcUohnaBNNzDMipOldC/edit?slide=id.p150#slide=id.p150' },
    { number: 4, topic: 'MDP-Value/Policy Iteration', pdf: 'https://docs.google.com/presentation/d/11Ya6OYStnPrwYdP7uWEPxVokpVDOS2Nz/edit?slide=id.p1#slide=id.p1' },
    { number: 4, topic: 'Reinforcement Learning', pdf: 'https://docs.google.com/presentation/d/1ABvQ4eYPvV-Su-XhIEgC0J1ZjkHYDmQE/edit?slide=id.p1#slide=id.p1' },
    { number: 5, topic: 'Logic Slides I', pdf: 'https://docs.google.com/presentation/d/19H856SQAsDOB3-fuSQDuxmpYlUI_stx4/edit?slide=id.p1#slide=id.p1' },
    { number: 5, topic: 'Logic Slides II', pdf: 'https://docs.google.com/presentation/d/19H5yU_oBkZJ2aLwoLF-EMiLpB64FSISv/edit?slide=id.p1#slide=id.p1' },
    { number: 6, topic: 'Probability', pdf: 'https://docs.google.com/presentation/d/17ie0eNqR13R_SzuVZD_1xUZBpIsbTzGW/edit?slide=id.p1#slide=id.p1' },
    { number: 6, topic: 'Bayes Nets', pdf: 'https://docs.google.com/presentation/d/19TSyxyu_2gqViXWBI3wihYqMXHA6DxOH/edit?slide=id.p1#slide=id.p1' }
  ];

  const discussionSlides: SlideEntry[] = [
    { number: 1, topic: 'Search Algorithms', pdf: 'https://docs.google.com/presentation/d/1AhwHJ-ccVDxTGO91TgBzYq-_uHKDYjpy/edit?slide=id.p1#slide=id.p1' },
    { number: 2, topic: 'Search Agents', pdf: 'https://docs.google.com/presentation/d/1AicEysq1IteG-G209D6mVXPpmtn9q2wO/edit?slide=id.p1#slide=id.p1' },
    { number: 3, topic: 'MultiAgent Pacman', pdf: 'https://docs.google.com/presentation/d/1AmkbXarTjOHG-oj9SvBUtHeyV-yV2LEI/edit?slide=id.p1#slide=id.p1' },
    { number: 4, topic: 'MultiAgent Pacman', pdf: 'https://docs.google.com/presentation/d/1AmYiWvaKzq8Nuy3Sn0a7to-phbE_7dkP/edit?slide=id.p1#slide=id.p1' },
    { number: 5, topic: 'Value Iteration and Q Learning - 1', pdf: 'https://docs.google.com/presentation/d/1AkcgAGVypJpIr8V_a9nn5UB-8E-QEPD8/edit?slide=id.p1#slide=id.p1' },
    { number: 6, topic: 'Value Iteration and Q Learning - 2', pdf: 'https://docs.google.com/presentation/d/1Ak4Tf14ETmtNHgGAs15XQ0asyNGxAjig/edit?slide=id.p1#slide=id.p1' },
  ];

  const supplementaryNotes: SlideEntry[] = [
    { number: 3, topic: 'Practice Alpha-Beta Pruning', pdf: 'https://schaerli.org/info2/abTreePractice/' },
    { number: 4, topic: 'Approximate Q-Learning', pdf: 'https://forns.lmu.build/classes/spring-2020/cmsi-432/lecture-11-2.html' },
    { number: 4, topic: 'MDP and Reinforcement Learning Summary', pdf: 'https://drive.google.com/file/d/1ijmxlJx8lgV1w6dcY3WryVpjnDxEhteh/view?usp=sharing' },
    { number: 4, topic: 'P3 Compendium', pdf: 'https://drive.google.com/file/d/1BBSdOWoqxRYa0ubK9-ZrXNlKvNC4Uzij/view?usp=sharing' },
    { number: 5, topic: 'Knowledge Representation and Logical Agents Summary', pdf: 'https://drive.google.com/file/d/1Z6Udn5BYycUaQj1lt44YP_eM1upo4fwh/view?usp=sharing' },
    { number: 6, topic: 'Bayes and Probabilistic Reasoning Summary', pdf: 'https://drive.google.com/file/d/1laz6KdIQniVLZRKfLYqVpYKWylHJkVXB/view?usp=sharing' },
    { number: 6, topic: 'D-Seperation Notes', pdf: 'https://drive.google.com/file/d/1hFJe8MuSniX5r2P2Wi2i2qSoWeX8rK3D/view?usp=sharing' },
  ];

  const cheatSheets: SlideEntry[] = [
    { number: 0, topic: 'Quiz 12', pdf: '#' },
    { number: 0, topic: 'Quiz 34', pdf: '#' },
    { number: 0, topic: 'Quiz 56', pdf: '#' },
    { number: 0, topic: 'Final Exam', pdf: '#' },
  ];

  const slideSections: SlideSection[] = [
    {
      title: 'Lecture Slides',
      description: 'Download the latest lecture decks presented in class.',
      data: lectureSlides,
    },
    {
      title: 'Discussion Slides',
      description: 'Supplemental discussion content with guided practice problems.',
      data: discussionSlides,
      columnLabel: 'Discussion',
    },
    {
      title: 'Supplementary Material',
      description: 'Reference material to reinforce core concepts and refresh prerequisites.',
      data: supplementaryNotes,
    },
    {
      title: 'Cheat Sheet',
      description: 'Reference sheets for quizzes and exams.',
      data: cheatSheets,
      isCheatSheet: true,
    },
  ];

  return (
    <>
      {/* Navigation bar */}
      <Navbar />
      
      {/* Hero section with book icon */}
      <HeroSection
        title="Course Material"
        subtitle="Download lecture slides, discussion slides and supplementary materials"
        icon={<BookOpen className="h-12 w-12 text-blue-600" />}
      />
      
      {/* Main content area */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 pb-16 space-y-12">
          {slideSections.map((section) => (
            <section key={section.title}>
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-gray-600 mt-2">{section.description}</p>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-200">
                      <tr>
                        {!section.isCheatSheet && (
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32 whitespace-nowrap bg-gray-100">
                            {section.columnLabel ?? 'Module'}
                          </th>
                        )}
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-100">
                          {section.isCheatSheet ? 'Cheat Sheet' : 'Topic'}
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-32 bg-gray-100">
                          PDF
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {section.data.map((entry, index) => (
                        <tr key={`${section.title}-${index}`} className="hover:bg-gray-50 transition-colors">
                          {!section.isCheatSheet && (
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {`${section.columnLabel ?? 'Module'} ${entry.number}`}
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {entry.topic}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-4">
                              <a
                                href={entry.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </a>
                              {!(section.title === 'Supplementary Material' && (index === 0 || index === 1)) && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <a
                                    href={getDownloadUrl(entry.pdf)}
                                    download
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download
                                  </a>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default CourseMaterial;