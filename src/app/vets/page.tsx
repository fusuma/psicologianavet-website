import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/composite/Layout';
import { SignupForm } from '@/components/composite/SignupForm';
import { FloatingImages } from '@/components/composite/FloatingImages';
import { TiltingBookCover } from '@/components/composite/TiltingBookCover';
import { TestimonialsCarousel } from '@/components/composite/TestimonialsCarousel';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Parceiros Veterinários | Quando um amor se vai',
  description: 'Apoie seus clientes nos momentos mais delicados com recursos psicológicos especializados.',
};

export default function VetsPage(): ReactElement {
  return (
    <Layout theme="green">
      <div className="relative overflow-hidden">
        <FloatingImages />
        <main id="main-content" className="relative z-10">
          <section className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="w-full text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-foreground">
              Apoie seus Clientes nos Momentos Mais Delicados
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
          <div className="w-full space-y-8 text-lg md:text-xl leading-relaxed mb-16 md:mb-20">
              <p className="text-white mb-12 md:mb-16">
                Como veterinário, você testemunha diariamente o poder do vínculo humano-animal.
                E quando chega o momento da despedida, seus clientes não precisam apenas de
                cuidados médicos — eles precisam de <strong className="text-foreground">apoio emocional especializado</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <TiltingBookCover />
                <div className="space-y-6 text-left">
                  <p className="text-white">
                    <strong>"Quando um amor se vai"</strong> é uma ferramenta psicológica criada para:
                  </p>

                  <ul className="list-none space-y-4 pl-0">
                    <li className="flex items-start">
                      <span className="text-foreground mr-3 flex-shrink-0">•</span>
                      <span className="text-white">Ajudar tutores a processar o luto de forma saudável</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-foreground mr-3 flex-shrink-0">•</span>
                      <span className="text-white">Oferecer palavras e recursos quando você não sabe exatamente o que dizer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-foreground mr-3 flex-shrink-0">•</span>
                      <span className="text-white">Posicionar sua clínica como um espaço de cuidado integral (físico e emocional)</span>
                    </li>
                  </ul>

                  <p className="text-white">
                    Escrito por <strong className="text-foreground">Gisele Schneider</strong>, psicóloga
                    especialista em luto e vínculo humano-animal, este ebook pode se tornar um recurso
                    valioso para sua prática.
                  </p>
                </div>
              </div>
          </div>

          {/* Lead Magnet Section */}
          <div className="w-full mt-16 md:mt-20 p-8 md:p-12 bg-white/10 rounded-lg border border-foreground/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h6 className="text-base md:text-lg mb-2 text-foreground/80">
                  Material Gratuito para sua Clínica
                </h6>
                <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground">
                  <strong>Apoio para Momentos Difíceis</strong>
                </h3>
                <p className="text-lg md:text-xl text-white">
                  Um handout profissional e delicado que você pode entregar (físico ou digital) aos
                  tutores que enfrentam a perda de um pet. Discretamente assinado, este material
                  posiciona você como um parceiro empático.
                </p>
              </div>

              <div>
                <SignupForm theme="green" />
              </div>
            </div>
          </div>

          

          {/* Social Proof Section */}
          <TestimonialsCarousel />

          {/* Secondary CTA Section */}
          <div className="w-full mt-16 md:mt-20 text-center">
            <h3 className="text-xl md:text-2xl lg:text-3xl mb-4 text-foreground font-bold">
              Quer recomendar o ebook aos seus clientes?
            </h3>
            <p className="text-lg md:text-xl text-white mb-6">
              Temos condições especiais para parceiros veterinários.
            </p>
            <Button
              size="sm"
              className="bg-foreground hover:bg-foreground/90 text-background font-semibold"
              asChild
            >
              <Link href="https://wa.me/351925630104?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20Programa%20de%20Afiliados">
                Programa de Afiliados
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <footer className="w-full mt-16 md:mt-20 text-center text-foreground text-sm">
            <p>Parceria entre psicologia e medicina veterinária para cuidar de quem cuida.</p>            
          </footer>
        </section>
      </main>
      </div>
    </Layout>
  );
}
