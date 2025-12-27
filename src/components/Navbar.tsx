/**
 * Navbar.tsx - Navigation Bar Component
 * 
 * This component provides the main navigation for the CSE 140 website.
 * It includes:
 * - Desktop navigation with horizontal menu
 * - Mobile navigation with hamburger menu and slide-out drawer
 * - Sticky positioning (stays at top when scrolling)
 * - Responsive design that adapts to screen size
 */

import React from 'react';
// Icon imports from lucide-react
import { Book, Menu, Calendar, FileText, Users, Mail, Home } from "lucide-react";
import { Link } from 'react-router-dom';

// UI Component imports - Accordion for mobile menu
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// UI Component imports - Navigation menu for desktop
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// UI Component imports - Sheet (slide-out drawer) for mobile menu
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ucscLogo from '../../ucsc.png';

/**
 * MenuItem Interface
 * Defines the structure for navigation menu items
 */
interface MenuItem {
  title: string; // Display text for the menu item
  url: string; // URL path or external link
  description?: string; // Optional description (for submenu items)
  icon?: JSX.Element; // Optional icon component
  items?: MenuItem[]; // Optional nested menu items (for dropdowns)
  external?: boolean; // Whether the link opens in a new tab
}

/**
 * Navbar Component
 * 
 * Main navigation component that renders differently on desktop vs mobile:
 * - Desktop: Horizontal navigation menu with logo
 * - Mobile: Hamburger menu that opens a slide-out drawer
 */
const Navbar = () => {
  // Logo configuration - displayed in navbar
  const logo = {
    url: "/",
    src: ucscLogo,
    alt: "UCSC CSE 140",
    title: "CSE 140",
  };

  // Main navigation menu items - displayed in desktop and mobile views
  const menu: MenuItem[] = [
    { title: "Home", url: "/" },
    { title: "Course Calendar", url: "/course-calendar" },
    { title: "Teaching Staff", url: "/teaching-staff" },
    { title: "Course Material", url: "/course-material" },
    { title: "Projects", url: "/projects" },
    { title: "Yuja", url: "https://www.yuja.com/", external: true },
    { title: "Gradescope", url: "https://www.gradescope.com/", external: true },
    { title: "Ed Discussion", url: "https://edstem.org/", external: true },
  ];

  // Additional links shown only in mobile menu (not in desktop)
  const mobileExtraLinks = [
    { name: "Syllabus", url: "/syllabus" },
    { name: "Office Hours", url: "/office-hours" },
    { name: "Resources", url: "/resources" },
    { name: "Help", url: "/help" },
  ];

  return (
    // Main navbar container - sticky positioning keeps it at top when scrolling
    // z-50 ensures it stays above other content, backdrop-blur adds visual effect
    <section className="sticky top-0 z-50 py-4 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="container">
        {/* Desktop Navigation - Hidden on mobile, visible on large screens (lg:flex) */}
        <nav className="hidden justify-between lg:flex">
          {/* Logo and navigation menu container */}
          <div className="flex items-center gap-6">
            {/* Logo link - clickable, navigates to home */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="w-14 h-12" alt={logo.alt} />
              <span className="text-xl font-bold">{logo.title}</span>
            </Link>
            
            {/* Desktop navigation menu - horizontal list of menu items */}
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {/* Render each menu item using helper function */}
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation - Visible on mobile, hidden on large screens (block lg:hidden) */}
        <div className="block lg:hidden">
          {/* Mobile header - logo and hamburger menu button */}
          <div className="flex items-center justify-between">
            {/* Mobile logo - smaller size than desktop */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="w-12 h-10" alt={logo.alt} />
              <span className="text-lg font-bold">{logo.title}</span>
            </Link>
            
            {/* Mobile menu - Sheet component creates slide-out drawer */}
            <Sheet>
              {/* Hamburger menu button - triggers drawer to open */}
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              
              {/* Slide-out drawer content - appears from right side on mobile */}
              <SheetContent className="overflow-y-auto">
                {/* Drawer header - shows logo */}
                <SheetHeader>
                  <SheetTitle>
                    <Link to={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="w-10 h-8" alt={logo.alt} />
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                {/* Mobile menu content - accordion for main menu, grid for extra links */}
                <div className="my-6 flex flex-col gap-6">
                  {/* Accordion menu - allows expanding/collapsing menu sections */}
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {/* Render each menu item using mobile-specific helper function */}
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  
                  {/* Additional mobile-only links - displayed in 2-column grid */}
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          to={link.url}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * renderMenuItem - Helper function for desktop navigation
 * 
 * Renders a single menu item for desktop navigation.
 * Handles three cases:
 * 1. Menu item with nested submenu items (dropdown)
 * 2. External link (opens in new tab)
 * 3. Internal link (React Router navigation)
 */
const renderMenuItem = (item: MenuItem) => {
  // Case 1: Menu item with nested submenu (dropdown menu)
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  {subItem.external ? (
                    <a
                      className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                      href={subItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {subItem.icon}
                      <div>
                        <div className="text-sm font-semibold">
                          {subItem.title}
                        </div>
                        {subItem.description && (
                          <p className="text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </a>
                  ) : (
                    <Link
                      className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                      to={subItem.url}
                    >
                      {subItem.icon}
                      <div>
                        <div className="text-sm font-semibold">
                          {subItem.title}
                        </div>
                        {subItem.description && (
                          <p className="text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  if (item.external) {
    return (
      <a
        key={item.title}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      key={item.title}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      to={item.url}
    >
      {item.title}
    </Link>
  );
};

/**
 * renderMobileMenuItem - Helper function for mobile navigation
 * 
 * Renders a single menu item for mobile navigation using Accordion.
 * Handles three cases (similar to desktop):
 * 1. Menu item with nested submenu items (accordion)
 * 2. External link
 * 3. Internal link
 */
const renderMobileMenuItem = (item: MenuItem) => {
  // Case 1: Menu item with nested submenu (accordion item)
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            subItem.external ? (
              <a
                key={subItem.title}
                className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                href={subItem.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {subItem.icon}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                  {subItem.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                      {subItem.description}
                    </p>
                  )}
                </div>
              </a>
            ) : (
              <Link
                key={subItem.title}
                className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                to={subItem.url}
              >
                {subItem.icon}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                  {subItem.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                      {subItem.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  if (item.external) {
    return (
      <a 
        key={item.title} 
        href={item.url} 
        className="font-semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link key={item.title} to={item.url} className="font-semibold">
      {item.title}
    </Link>
  );
};

export default Navbar;