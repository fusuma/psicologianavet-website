import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Layout } from '@/components/composite/Layout';
import { SignupForm } from '@/components/composite/SignupForm';
import { FloatingImages } from '@/components/composite/FloatingImages';
import { TiltingBookCover } from '@/components/composite/TiltingBookCover';

export const metadata: Metadata = {
  title: 'Para Tutores - Quando um amor se vai',
  description: 'Honre o amor que vocês compartilharam. Um guia psicológico para tutores que buscam apoio gentil no processo de luto pela perda de um pet.',
};

export default function TutorsPage(): ReactElement {
  return (
    <Layout theme="dark">
      <div className="relative overflow-hidden">
        <FloatingImages />
        <section className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="w-full text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-foreground">
            Honre o Amor que Vocês Compartilharam
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <TiltingBookCover />
            <p className="text-white">
              "Quando um amor se vai" é um guia psicológico escrito por{' '}
              <strong className="text-foreground">Gisele Schneider</strong>, psicóloga especialista no vínculo humano-animal, para acompanhar você nessa jornada de recordação, gratidão e cura.
            </p>
          </div>
        </div>

        {/* Lead Magnet Section */}
        <div className="w-full mt-16 md:mt-20 p-8 md:p-12 bg-black/20 rounded-lg border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h6 className="text-base md:text-lg mb-2 text-foreground/80">
                Receba Gratuitamente
              </h6>
              <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground">
                <strong>Diário de Reflexão sobre seu Pet</strong>
              </h2>
              <p className="text-lg md:text-xl text-white">
                Um presente especial para você começar a registrar as memórias, os momentos engraçados, e as lições que seu companheiro te ensinou.
              </p>
            </div>

            <div>
              <SignupForm theme="dark" />
            </div>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
