import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Layout } from '@/components/composite/Layout';

export const metadata: Metadata = {
  title: 'Quando um amor se vai | Um espaço de acolhimento e memória',
  description: 'Um espaço de acolhimento e memória para honrar o vínculo que nunca se perde. Para tutores e profissionais veterinários que cuidam de animais.',
};

export default function Home(): ReactElement {
  return (
    <Layout theme="dark">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading">
            Se hoje há dor, é porque ontem houve amor.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Um espaço de acolhimento e memória para honrar o vínculo que nunca se perde.
          </p>
        </section>

        {/* Portal Navigation Options */}
        <nav className="w-full max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Tutors Path */}
            <Link
              href="/tutors"
              className="group flex flex-col items-center justify-center p-8 md:p-12 rounded-lg border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <h2 className="text-2xl md:text-3xl font-heading mb-3">
                Sou Tutor
              </h2>
              <p className="text-sm md:text-base text-muted-foreground text-center">
                Para quem compartilha a vida com um animal de estimação
              </p>
            </Link>

            {/* Veterinary Partners Path */}
            <Link
              href="/vets"
              className="group flex flex-col items-center justify-center p-8 md:p-12 rounded-lg border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <h2 className="text-2xl md:text-3xl font-heading mb-3">
                Sou Parceiro Veterinário
              </h2>
              <p className="text-sm md:text-base text-muted-foreground text-center">
                Para profissionais que cuidam de animais e seus tutores
              </p>
            </Link>
          </div>
        </nav>
      </div>
    </Layout>
  );
}
