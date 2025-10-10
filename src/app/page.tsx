import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Layout } from '@/components/composite/Layout';
import { FloatingImages } from '@/components/composite/FloatingImages';

export const metadata: Metadata = {
  title: 'Quando um amor se vai | Um espaço de acolhimento e memória',
  description: 'Um espaço de acolhimento e memória para honrar o vínculo que nunca se perde. Para tutores e profissionais veterinários que cuidam de animais.',
};

export default function Home(): ReactElement {
  return (
    <Layout theme="dark" logoAsLink={false}>
      <div className="relative overflow-hidden">
        <FloatingImages />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-4xl px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-foreground">
            há laços que nem a ausência desfaz
          </h1>
          <div className="flex justify-center py-2">
            <Image
              src="/images/rope.png"
              alt=""
              width={80}
              height={80}
              className="h-4 w-auto opacity-100"
            />
          </div>
          <p className="text-lg md:text-xl text-white">
            Um espaço de acolhimento e memória para honrar o vínculo que nunca se perde.
          </p>
        </section>

        {/* Portal Navigation Options */}
        <nav className="w-full max-w-5xl px-4 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Tutors Path */}
            <Link
              href="/tutores"
              className="group flex flex-col items-center justify-center p-8 md:p-12 w-full bg-black/20 hover:bg-black/30 transition-all duration-300 rounded-xl focus:outline-none [transform-style:preserve-3d] [backface-visibility:hidden] [-webkit-font-smoothing:antialiased]"
            >
              <h2 className="text-2xl md:text-3xl font-heading mb-3 transition-colors group-hover:[color:hsl(var(--foreground-hover))] [transform:translateZ(0)]">
                Sou Tutor
              </h2>
              <p className="text-sm md:text-base text-white text-center font-normal [transform:translateZ(0)]">
                Para quem compartilha a vida com um animal de estimação
              </p>
            </Link>

            {/* Veterinary Partners Path */}
            <Link
              href="/vets"
              className="group flex flex-col items-center justify-center p-8 md:p-12 w-full bg-black/20 hover:bg-black/30 transition-all duration-300 rounded-xl focus:outline-none [transform-style:preserve-3d] [backface-visibility:hidden] [-webkit-font-smoothing:antialiased]"
            >
              <h2 className="text-2xl md:text-3xl font-heading mb-3 transition-colors group-hover:[color:hsl(var(--foreground-hover))] [transform:translateZ(0)]">
                Sou Parceiro Veterinário
              </h2>
              <p className="text-sm md:text-base text-white text-center font-normal [transform:translateZ(0)]">
                Para profissionais que cuidam de animais e seus tutores
              </p>
            </Link>
          </div>
        </nav>
        </div>
      </div>
    </Layout>
  );
}
