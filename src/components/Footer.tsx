/**
 * Footer.tsx - Footer Component
 * 
 * This component renders the site footer with course information,
 * navigation links, and contact details.
 * Uses the Footer7 UI component for styling and layout.
 */

import React from 'react';
import { Footer7 } from '@/components/ui/footer-7';
import { FaGithub, FaYoutube } from 'react-icons/fa';
import ucscLogo from '../../ucsc.png';

/**
 * Footer Component
 * 
 * Displays footer information including:
 * - Course logo and title
 * - Navigation links (Course, Tools, UCSC resources)
 * - Course description and instructor information
 * - Copyright information
 */
const Footer = () => {
  // Footer data configuration - contains all footer content
  const footerData = {
    // Logo configuration - displayed at top of footer
    logo: {
      url: "/",
      src: ucscLogo,
      alt: "UCSC CSE 140",
      title: "CSE 140",
    },
    
    // Footer link sections - organized into categories
    sections: [
      {
        // Course navigation links
        title: "Course",
        links: [
          { name: "Home", href: "/" },
          { name: "Course Calendar", href: "/course-calendar" },
          { name: "Teaching Staff", href: "/teaching-staff" },
          { name: "Course Material", href: "/course-material" },
          { name: "Projects", href: "/projects" },
          { name: "Pacman Documentation", href: "https://ucsc-cse-140.github.io/", external: true },
        ],
      },
      {
        // External tools and platforms used in the course
        title: "Tools",
        links: [
          { name: "Yuja", href: "https://www.yuja.com/", external: true },
          { name: "Gradescope", href: "https://www.gradescope.com/", external: true },
          { name: "Ed Discussion", href: "https://edstem.org/", external: true },
          { name: "Github", href: "https://github.com/ucsc-cse-140", external: true },
          { name: "Canvas", href: "https://canvas.ucsc.edu", external: true },
        ],
      },
      {
        // UCSC and university-related resources
        title: "UCSC",
        links: [
          { name: "UCSC Website", href: "https://www.ucsc.edu", external: true },
          { name: "Baskin Engineering", href: "https://engineering.ucsc.edu", external: true },
          { name: "Academic Integrity", href: "https://docs.google.com/document/d/1NICSzZWFTFWxLsFHdVf8oA4PT8EwJZg0tH4u_SvG-Sk/edit?tab=t.0#heading=h.7idsdhgowpen", external: true },
          { name: "Accessibility", href: "https://docs.google.com/document/d/1NICSzZWFTFWxLsFHdVf8oA4PT8EwJZg0tH4u_SvG-Sk/edit?tab=t.0#heading=h.7idsdhgowpen", external: true },
          { name: "Student Support Services", href: "https://docs.google.com/document/d/1NICSzZWFTFWxLsFHdVf8oA4PT8EwJZg0tH4u_SvG-Sk/edit?tab=t.0#heading=h.7idsdhgowpen", external: true },
        ],
      },
    ],
    
    // Course description section - displays course and instructor info
    description: (
      <div className="space-y-2">
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">CSE 140: Artificial Intelligence</div>
          <div className="text-sm">UCSC Computer Science Department</div>
          <div className="text-sm">Baskin School of Engineering</div>
          <div className="text-sm">University of California, Santa Cruz</div>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Dr. Niloofar Montazeri</div>
          <div className="text-sm">Assistant Teaching Professor</div>
          <a 
            href="mailto:nimontaz@ucsc.edu" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            nimontaz@ucsc.edu
          </a>
        </div>
      </div>
    ),
    
    // Social media links (currently empty)
    socialLinks: [],
    
    // Copyright text - dynamically shows current year
    copyright: `© ${new Date().getFullYear()} University of California, Santa Cruz. All rights reserved.`,
    
    // Legal/policy links
    legalLinks: [],
  };

  // Render the Footer7 UI component with all footer data
  return <Footer7 {...footerData} />;
};

export default Footer;
