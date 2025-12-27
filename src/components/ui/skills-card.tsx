"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number;
}

interface SkillCardProps {
  category: string;
  items: Skill[];
  icon?: React.ReactElement;
  color?: "blue" | "purple" | "green" | "orange" | "red" | "indigo";
}

const colorVariants = {
  blue: {
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-600 dark:text-blue-400",
    progress: "bg-blue-600 dark:bg-blue-500",
    progressBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  purple: {
    icon: "text-purple-600 dark:text-purple-400",
    title: "text-purple-600 dark:text-purple-400",
    progress: "bg-purple-600 dark:bg-purple-500",
    progressBg: "bg-purple-100 dark:bg-purple-900/30",
  },
  green: {
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-600 dark:text-green-400",
    progress: "bg-green-600 dark:bg-green-500",
    progressBg: "bg-green-100 dark:bg-green-900/30",
  },
  orange: {
    icon: "text-orange-600 dark:text-orange-400",
    title: "text-orange-600 dark:text-orange-400",
    progress: "bg-orange-600 dark:bg-orange-500",
    progressBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  red: {
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-600 dark:text-red-400",
    progress: "bg-red-600 dark:bg-red-500",
    progressBg: "bg-red-100 dark:bg-red-900/30",
  },
  indigo: {
    icon: "text-indigo-600 dark:text-indigo-400",
    title: "text-indigo-600 dark:text-indigo-400",
    progress: "bg-indigo-600 dark:bg-indigo-500",
    progressBg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
};

export function SkillCard({
  category,
  items,
  icon,
  color = "blue",
}: SkillCardProps) {
  const colors = colorVariants[color];

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn("flex items-center justify-center", colors.icon)}>
              {React.cloneElement(icon, { size: 28 })}
            </div>
          )}
          <h3 className={cn("text-xl font-bold", colors.title)}>{category}</h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                {skill.name}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {skill.level}%
              </span>
            </div>
            <div className={cn("relative h-2 w-full overflow-hidden rounded-full", colors.progressBg)}>
              <div
                className={cn("h-full transition-all duration-500 ease-out rounded-full", colors.progress)}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

