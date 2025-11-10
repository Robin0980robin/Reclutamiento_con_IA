import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface TermsOfServiceProps {
  children?: React.ReactNode;
  asLink?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ children, asLink = false, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && (
        <DialogTrigger asChild>
          {children || (
            asLink ? (
              <button className="text-primary hover:underline text-sm">
                Términos de uso
              </button>
            ) : (
              <Button variant="link" className="p-0 h-auto">
                Términos de uso
              </Button>
            )
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Términos de Uso - TalentMatch</DialogTitle>
          <DialogDescription>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Aceptación de los términos</h3>
              <p className="text-muted-foreground">
                Al acceder y usar TalentMatch, aceptas estar sujeto a estos Términos de Uso y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, no debes usar nuestra plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Uso de la plataforma</h3>
              <p className="text-muted-foreground mb-2">
                TalentMatch es una plataforma de emparejamiento entre candidatos y reclutadores. Al usar nuestros servicios, te comprometes a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Proporcionar información veraz y actualizada</li>
                <li>Mantener la confidencialidad de tus credenciales</li>
                <li>No usar la plataforma para fines ilegales o no autorizados</li>
                <li>Respetar los derechos de propiedad intelectual</li>
                <li>No acosar, abusar o dañar a otros usuarios</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Cuentas de usuario</h3>
              <p className="text-muted-foreground">
                Eres responsable de mantener la seguridad de tu cuenta y contraseña. TalentMatch no será responsable de ninguna pérdida o daño derivado de tu incumplimiento de esta obligación de seguridad.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Contenido del usuario</h3>
              <p className="text-muted-foreground">
                Eres propietario del contenido que publicas en TalentMatch (currículos, descripciones de vacantes, etc.). Al publicar contenido, nos otorgas una licencia limitada para almacenar, mostrar y procesar dicho contenido con el fin de proporcionar nuestros servicios.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Privacidad y protección de datos</h3>
              <p className="text-muted-foreground">
                El uso de tu información personal se rige por nuestra Política de Privacidad. Al usar TalentMatch, aceptas la recopilación y uso de información de acuerdo con esa política.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Suspensión y terminación</h3>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de suspender o terminar tu acceso a TalentMatch en cualquier momento, sin previo aviso, por conducta que consideremos viola estos Términos de Uso o es perjudicial para otros usuarios, nosotros o terceros.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Limitación de responsabilidad</h3>
              <p className="text-muted-foreground">
                TalentMatch se proporciona "tal cual" sin garantías de ningún tipo. No seremos responsables de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar nuestros servicios.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Modificaciones</h3>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación. Es tu responsabilidad revisar periódicamente estos términos.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Contacto</h3>
              <p className="text-muted-foreground">
                Si tienes preguntas sobre estos Términos de Uso, por favor contáctanos a través de nuestro sistema de soporte.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfService;
