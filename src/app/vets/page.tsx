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
import { RainbowButton } from '@/components/ui/rainbow-button';

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
            <h4 className="text-xl md:text-2xl mb-2 text-foreground/80">
              Apoie seus Clientes
            </h4>
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-foreground">
              nos Momentos Mais Delicados
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
                <div className="flex flex-col items-center gap-6">
                  <TiltingBookCover />
                  <RainbowButton size="lg" asChild>
                    <Link href="https://hotmart.com/pt-br/marketplace/produtos/quando-um-amor-se-vai-compreendendo-e-acolhendo-o-luto-pela-perda-do-animal-de-estimacao/U102325292F" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Image
                        src="/images/hotmart-flame-icon.svg"
                        alt="Hotmart"
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                      <span>Comprar no Hotmart</span>
                    </Link>
                  </RainbowButton>
                </div>
                <div className="space-y-6 text-left">
                  <p className="text-white">
                    <strong className="text-foreground">Quando um amor se vai</strong> é um recurso especializado que fortalece
                    o vínculo entre você e seus clientes:
                  </p>

                  <ul className="list-none space-y-4 pl-0">
                    <li className="flex items-start">
                      <span className="text-foreground mr-3 flex-shrink-0">•</span>
                      <span className="text-white">Oferece suporte psicológico estruturado para o processo de luto dos tutores</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-foreground mr-3 flex-shrink-0">•</span>
                      <span className="text-white">Fornece as palavras certas para os momentos mais delicados da sua profissão</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-foreground mr-3 flex-shrink-0">•</span>
                      <span className="text-white">Diferencia sua clínica como referência em cuidado compassivo e humanizado</span>
                    </li>
                  </ul>

                  <p className="text-white">
                    Desenvolvido por <strong className="text-foreground">Gisele Schneider</strong>, psicóloga
                    especialista em luto, este ebook oferece as palavras certas
                    nos momentos em que mais importam — complementando o cuidado clínico que você já presta.
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
                  Um material de apoio profissional e sensível para entregar (impresso ou digital) aos
                  tutores nos momentos mais difíceis. Com sua assinatura discreta, este guia demonstra
                  o cuidado integral que sua clínica oferece — muito além da medicina veterinária.
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
