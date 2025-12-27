"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Client {
  name: string;
  location?: string;
  logo: string;
  type: string;
}

interface ClientsCarouselProps {
  clients: Client[];
  autoScrollInterval?: number;
  className?: string;
}

function ClientsCarousel({ 
  clients, 
  autoScrollInterval = 2000, 
  className = "" 
}: ClientsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const scrollInterval = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, autoScrollInterval);

    return () => clearTimeout(scrollInterval);
  }, [api, current, autoScrollInterval]);

  return (
    <div className={`w-full ${className}`}>
      <Carousel 
        setApi={setApi} 
        className="w-full h-96" 
        orientation="vertical"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="h-96">
          {clients.map((client, index) => (
            <CarouselItem key={`${client.name}-${index}`} className="basis-1/4">
              <div className="flex flex-col items-center justify-center group cursor-pointer p-4">
                {/* Logo Container */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden mb-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-gray-50 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600 group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-300 shadow-md group-hover:shadow-lg p-2 flex items-center justify-center">
                  <img 
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=120&auto=format&fit=crop&ixlib=rb-4.0.3',
                        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=120&auto=format&fit=crop&ixlib=rb-4.0.3',
                        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=120&auto=format&fit=crop&ixlib=rb-4.0.3',
                        'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=120&auto=format&fit=crop&ixlib=rb-4.0.3'
                      ];
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = fallbackImages[index % fallbackImages.length];
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
                
                {/* Company Info */}
                <div className="text-center space-y-1">
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 text-center leading-tight">
                    {client.name}
                  </p>
                  {client.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                      {client.location}
                    </p>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export { ClientsCarousel };