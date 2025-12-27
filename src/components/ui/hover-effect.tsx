import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Ghost } from "lucide-react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    dueDate?: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // Check if there's an odd number of items - last card should be centered
  const isOdd = items.length % 2 !== 0;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => {
        const isLastItem = idx === items.length - 1;
        // Center the last card if there's an odd number of items (on desktop)
        const shouldCenter = isOdd && isLastItem;
        // Classic Pac-Man ghost colors
        const ghostColors = ["#ef4444", "#ec4899", "#06b6d4", "#f97316", "#8b5cf6"]; // red, pink, cyan, orange, purple
        const ghostColor = ghostColors[idx % ghostColors.length];

        return (
          <Link
            to={item?.link}
            key={item?.link}
            className={cn(
              "relative group block p-2 h-full w-full",
              // On desktop (md+), if this is the last item and there's an odd number:
              // span 2 columns and center it, but keep same width as other cards
              shouldCenter && "md:col-span-2 md:mx-auto lg:col-span-2 md:max-w-[calc(50%-0.5rem)]"
            )}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <Ghost className="absolute top-4 right-4 z-10 h-6 w-6 md:h-8 md:w-8" style={{ color: ghostColor }} />
              <CardTitle>{item.title}</CardTitle>
              {/* <div className="mt-1">
                <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  Due Date: {item.dueDate || 'TBD'}
                </span>
              </div> */}
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white border border-gray-200 group-hover:border-blue-400 relative z-20 shadow-sm",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-gray-900 font-bold tracking-wide mt-4 pr-10 md:pr-12", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-gray-600 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
