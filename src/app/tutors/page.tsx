import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import { Layout } from '@/components/composite/Layout';

export const metadata: Metadata = {
  title: 'Para Tutores - Quando um amor se vai',
  description: 'Honre o amor que vocês compartilharam. Um guia psicológico para tutores que buscam apoio gentil no processo de luto pela perda de um pet.',
};

export default function TutorsPage(): ReactElement {
  return (
    <Layout theme="dark">
      <section className="flex flex-col items-center justify-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="w-full text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-foreground">
            Honre o Amor que Vocês Compartilharam
          </h1>
        </div>

        {/* Main Content */}
        <div className="w-full space-y-8 text-lg md:text-xl leading-relaxed">
          <p className="text-white">
            Todo animal que passa pela nossa vida deixa marcas de amor incondicional, alegria e aprendizado. Quando um amor se vai, a dor que sentimos é a medida exata do amor que vivemos.
          </p>

          <div className="space-y-6">
            <p className="text-white">Este espaço foi criado para você que:</p>

            <ul className="list-none space-y-4 pl-0">
              <li className="flex items-start">
                <span className="text-foreground mr-3 flex-shrink-0">•</span>
                <span className="text-white">Deseja honrar a memória de um companheiro especial</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-3 flex-shrink-0">•</span>
                <span className="text-white">Busca apoio gentil para processar a perda</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-3 flex-shrink-0">•</span>
                <span className="text-white">Quer celebrar o vínculo único que compartilhou com seu pet</span>
              </li>
            </ul>
          </div>

          <p className="text-white">
            "Quando um amor se vai" é um guia psicológico escrito por{' '}
            <strong className="text-foreground">Gisele Schneider</strong>, psicóloga especialista no vínculo humano-animal, para acompanhar você nessa jornada de recordação, gratidão e cura.
          </p>
        </div>
      </section>
    </Layout>
  );
}
