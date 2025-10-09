import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Layout } from '@/components/composite/Layout';
import { SignupForm } from '@/components/composite/SignupForm';
import { FloatingImages } from '@/components/composite/FloatingImages';
import { TiltingBookCover } from '@/components/composite/TiltingBookCover';
import { HotmartButton } from '@/components/composite/HotmartButton';

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
            <p className="text-white">Este espaço é para você que:</p>

            <ul className="list-none space-y-4 pl-0">
              <li className="flex items-start">
                <span className="text-foreground mr-3 flex-shrink-0">•</span>
                <span className="text-white">Sente que ninguém compreende a profundidade da sua dor</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-3 flex-shrink-0">•</span>
                <span className="text-white">Quer honrar as memórias sem se sentir culpado por seguir em frente</span>
              </li>
              <li className="flex items-start">
                <span className="text-foreground mr-3 flex-shrink-0">•</span>
                <span className="text-white">Busca um caminho gentil para transformar a dor em gratidão</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center gap-6">
              <TiltingBookCover />
              <HotmartButton href="https://hotmart.com" />
            </div>
            <div className="space-y-4">
              <p className="text-white">
                <strong className="text-foreground">Quando um amor se vai</strong> é um ebook desenvolvido
                por <strong className="text-foreground">Gisele Schneider</strong>, psicóloga especialista
                em luto e vínculo humano-animal.
              </p>
              <p className="text-white">
                Este material oferece ferramentas gentis e práticas para navegar o luto, honrar memórias preciosas,
                e encontrar paz em meio à saudade — respeitando seu tempo e sua dor.
              </p>
            </div>
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
                <strong>Mini Caderno de Memórias & Emoções</strong>
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
