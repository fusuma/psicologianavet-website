'use client';

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Dra. Daniela Rosa',
    role: 'Médica Veterinária',
    testimonial:
      'Ter um recurso psicológico para indicar aos meus clientes fez toda a diferença. Muitos agradecem o cuidado além do consultório.',
    image: '/images/testimonial-1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Victor Goulart Pires',
    role: 'Médico Veterinário',
    testimonial:
      'Este material me ajudou a oferecer um suporte mais completo nos momentos mais difíceis. Meus clientes se sentem mais acolhidos e compreendidos.',
    image: '/images/testimonial-2.jpg',
  },
  {
    id: 3,
    name: 'Dra. Mariana Santos Pereira',
    role: 'Médica Veterinária',
    testimonial:
      'Finalmente um recurso profissional que aborda o luto pet com a seriedade e delicadeza que merece. Recomendo a todos os tutores que atendo.',
    image: '/images/testimonial-3.jpg',
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
        <div className="hidden lg:block relative shrink-0 aspect-3/4 max-w-[18rem] w-full h-[24rem] rounded-xl overflow-hidden">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 0px, 288px"
          />
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
              <StarIcon className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
              <StarIcon className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
              <StarIcon className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
              <StarIcon className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
              <StarIcon className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
            </div>
          </div>
          <p className="mt-6 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed font-sans font-normal tracking-tight text-white">
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
            O que dizem nossos parceiros
          </h6>
          <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground text-center">
            <strong>Veterinários que Recomendam</strong>
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
            <CarouselPrevious className="bg-[#191723] text-[#269A9B] hover:bg-[#191723] hover:text-[#ffffff] border-[#191723]" />
            <CarouselNext className="bg-[#191723] text-[#269A9B] hover:bg-[#191723]  hover:text-[#ffffff] border-[#191723]" />
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
