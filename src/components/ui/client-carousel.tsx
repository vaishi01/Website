"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel-about";

interface Client {
  name: string;
  logo?: string;
}

interface ClientCarouselProps {
  clients?: Client[];
  autoPlayInterval?: number;
  showClientNames?: boolean;
}

function ClientCarousel({ 
  clients = [], 
  autoPlayInterval = 3000, 
  showClientNames = true 
}: ClientCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Default clients matching your image
  const defaultClients: Client[] = [
    { name: "Aspire Systems" },
    { name: "Hinduja Tech" },
    { name: "Community Brands" },
    { name: "FHPL" },
    { name: "APTARA" },
    { name: "Ajanta Pharma" },
    { name: "Parlé Agro" },
    { name: "Envoy" },
    { name: "360° LOUD" },
    { name: "Awign" },
    { name: "Murugappa" },
    { name: "Tanla" },
    { name: "Techmatrix" }
  ];

  const clientList = clients.length > 0 ? clients : defaultClients;

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, autoPlayInterval);

    return () => clearTimeout(timer);
  }, [api, current, autoPlayInterval]);

  return (
    <div className="w-full">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {clientList.map((client, index) => (
            <CarouselItem 
              key={index} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="group cursor-pointer">
                <div className="relative h-40 bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-blue-800/95 dark:from-black dark:via-blue-950 dark:to-blue-900 rounded-xl border border-cyan-400/50 dark:border-cyan-400/50 p-6 hover:border-cyan-300 dark:hover:border-cyan-300 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/25">
                  {/* Neon Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 via-blue-500/8 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-xl border border-cyan-400/20 group-hover:border-cyan-300/40 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-4">
                    {/* Icon Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Client Name */}
                    {showClientNames && (
                      <h3 className="font-semibold text-lg text-white group-hover:text-cyan-200 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        {client.name}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export { ClientCarousel };