'use client';

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Dr. Roberto Silva',
    role: 'Médico Veterinário',
    testimonial:
      'Ter um recurso psicológico para indicar aos meus clientes fez toda a diferença. Muitos agradecem o cuidado além do consultório.',
  },
  {
    id: 2,
    name: 'Dra. Ana Paula Costa',
    role: 'Médica Veterinária',
    testimonial:
      'Este material me ajudou a oferecer um suporte mais completo nos momentos mais difíceis. Meus clientes se sentem mais acolhidos e compreendidos.',
  },
  {
    id: 3,
    name: 'Dr. Carlos Mendes',
    role: 'Médico Veterinário',
    testimonial:
      'Finalmente um recurso profissional que aborda o luto pet com a seriedade e delicadeza que merece. Recomendo a todos os tutores que atendo.',
  },
  {
    id: 4,
    name: 'Dra. Mariana Oliveira',
    role: 'Médica Veterinária',
    testimonial:
      'O guia se tornou parte essencial do meu protocolo de cuidado compassivo. Os tutores sempre comentam o quanto se sentiram apoiados.',
  },
];

function getInitials(name: string): string {
  const names = name.replace(/^(Dr\.|Dra\.)\s+/, '').split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}): ReactElement {
  return (
    <div className="mb-8 bg-white/10 border border-foreground/20 rounded-xl py-8 px-6 sm:py-6">
      <div className="flex items-center justify-between gap-20">
        <div className="hidden lg:block relative shrink-0 aspect-3/4 max-w-[18rem] w-full bg-foreground/10 rounded-xl">
          <div className="absolute top-1/4 right-0 translate-x-1/2 h-12 w-12 bg-foreground rounded-full flex items-center justify-center">
            <svg
              width="102"
              height="102"
              viewBox="0 0 102 102"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                d="M26.0063 19.8917C30.0826 19.8625 33.7081 20.9066 36.8826 23.024C40.057 25.1414 42.5746 28.0279 44.4353 31.6835C46.2959 35.339 47.2423 39.4088 47.2744 43.8927C47.327 51.2301 44.9837 58.4318 40.2444 65.4978C35.4039 72.6664 28.5671 78.5755 19.734 83.2249L2.54766 74.1759C8.33598 71.2808 13.2548 67.9334 17.3041 64.1335C21.2515 60.3344 23.9203 55.8821 25.3105 50.7765C20.5179 50.4031 16.6348 48.9532 13.6612 46.4267C10.5864 44.0028 9.03329 40.5999 9.00188 36.2178C8.97047 31.8358 10.5227 28.0029 13.6584 24.7192C16.693 21.5381 20.809 19.9289 26.0063 19.8917ZM77.0623 19.5257C81.1387 19.4965 84.7641 20.5406 87.9386 22.6581C91.1131 24.7755 93.6306 27.662 95.4913 31.3175C97.3519 34.9731 98.2983 39.0428 98.3304 43.5268C98.383 50.8642 96.0397 58.0659 91.3004 65.1319C86.4599 72.3005 79.6231 78.2095 70.79 82.859L53.6037 73.8099C59.392 70.9149 64.3108 67.5674 68.3601 63.7676C72.3075 59.9685 74.9763 55.5161 76.3665 50.4105C71.5739 50.0372 67.6908 48.5873 64.7172 46.0608C61.6424 43.6369 60.0893 40.2339 60.0579 35.8519C60.0265 31.4698 61.5787 27.6369 64.7145 24.3532C67.7491 21.1722 71.865 19.563 77.0623 19.5257Z"
                className="fill-background"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-1">
            <div className="hidden sm:flex md:hidden items-center gap-4">
              <Avatar className="w-8 h-8 md:w-10 md:h-10">
                <AvatarFallback className="text-xl font-medium bg-foreground text-background">
                  {getInitials(testimonial.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-white/70">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-5 h-5 fill-foreground stroke-foreground" />
              <StarIcon className="w-5 h-5 fill-foreground stroke-foreground" />
              <StarIcon className="w-5 h-5 fill-foreground stroke-foreground" />
              <StarIcon className="w-5 h-5 fill-foreground stroke-foreground" />
              <StarIcon className="w-5 h-5 fill-foreground stroke-foreground" />
            </div>
          </div>
          <p className="mt-6 text-lg sm:text-2xl lg:text-[1.75rem] xl:text-3xl leading-normal lg:leading-normal font-semibold tracking-tight text-white">
            &ldquo;{testimonial.testimonial}&rdquo;
          </p>
          <div className="flex sm:hidden md:flex mt-6 items-center gap-4">
            <Avatar>
              <AvatarFallback className="text-xl font-medium bg-foreground text-background">
                {getInitials(testimonial.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-white">
                {testimonial.name}
              </p>
              <p className="text-sm text-white/70">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsCarousel(): ReactElement {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full mt-16 md:mt-20">
      <div className="w-full">
        <div className="mb-8">
          <h6 className="text-base md:text-lg mb-2 text-foreground/80 text-center">
            Material Gratuito para sua Clínica
          </h6>
          <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground text-center">
            <strong>Apoio para Momentos Difíceis</strong>
          </h3>
        </div>
        <div className="w-full mx-auto px-0 md:px-12">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-foreground hover:text-foreground/80" />
            <CarouselNext className="text-foreground hover:text-foreground/80" />
          </Carousel>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn('h-3.5 w-3.5 rounded-full border-2', {
                  'bg-foreground border-foreground': current === index + 1,
                  'bg-transparent border-white/30': current !== index + 1,
                })}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
