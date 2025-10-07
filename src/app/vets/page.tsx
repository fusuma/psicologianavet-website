import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import { Layout } from '@/components/composite/Layout';
import { SignupForm } from '@/components/composite/SignupForm';

export const metadata: Metadata = {
  title: 'Parceiros Veterinários | Quando um amor se vai',
  description: 'Apoie seus clientes nos momentos mais delicados com recursos psicológicos especializados.',
};

export default function VetsPage(): ReactElement {
  return (
    <Layout theme="green">
      <main id="main-content">
        <section className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="w-full text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-foreground">
              Apoie seus Clientes nos Momentos Mais Delicados
            </h1>

            <div className="w-full space-y-8 text-lg md:text-xl leading-relaxed">
              <p className="text-white">
                Como veterinário, você testemunha diariamente o poder do vínculo humano-animal.
                E quando chega o momento da despedida, seus clientes não precisam apenas de
                cuidados médicos — eles precisam de <strong className="text-foreground">apoio emocional especializado</strong>.
              </p>

              <div className="space-y-6">
                <p className="text-white font-bold">
                  "Quando um amor se vai" é uma ferramenta psicológica criada para:
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
              </div>

              <p className="text-white">
                <strong className="text-foreground">Escrito por Gisele Schneider</strong>, psicóloga
                especialista em luto e vínculo humano-animal, este ebook pode se tornar um recurso
                valioso para sua prática.
              </p>
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
                  <strong>Guia de Apoio ao Cliente Enlutado</strong>
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

          {/* Future Teaser Section */}
          <div className="w-full mt-16 md:mt-20 text-center">
            <p className="text-lg md:text-xl text-white mb-4">
              <strong className="text-foreground">Em breve:</strong> Ebook exclusivo para veterinários
              sobre comunicação compassiva e autocuidado profissional.
            </p>
            <p className="text-white italic">[Quero ser avisado]</p>
          </div>

          {/* Social Proof Section */}
          <div className="w-full mt-16 md:mt-20 p-6 bg-white/10 rounded-lg">
            <blockquote className="text-lg md:text-xl text-white italic">
              "Ter um recurso psicológico para indicar aos meus clientes fez toda a diferença.
              Muitos agradecem o cuidado além do consultório."
            </blockquote>
            <p className="text-white mt-4">— Dr. Roberto Silva, Médico Veterinário</p>
          </div>

          {/* Secondary CTA Section */}
          <div className="w-full mt-16 md:mt-20 text-center">
            <h3 className="text-xl md:text-2xl lg:text-3xl mb-4 text-foreground font-bold">
              Quer recomendar o ebook aos seus clientes?
            </h3>
            <p className="text-lg md:text-xl text-white mb-6">
              Temos condições especiais para parceiros veterinários.
            </p>
            <p className="text-white italic">[Entre em Contato]</p>
          </div>

          {/* Footer */}
          <footer className="w-full mt-16 md:mt-20 text-center text-white/80 text-sm">
            <p>Parceria entre psicologia e medicina veterinária para cuidar de quem cuida.</p>
            <p className="mt-2">Gisele Schneider, Psicóloga CRP XX/XXXXX</p>
          </footer>
        </section>
      </main>
    </Layout>
  );
}
