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

interface PrivacyPolicyProps {
  children?: React.ReactNode;
  asLink?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ children, asLink = false, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && (
        <DialogTrigger asChild>
          {children || (
            asLink ? (
              <button className="text-primary hover:underline text-sm">
                Política de privacidad
              </button>
            ) : (
              <Button variant="link" className="p-0 h-auto">
                Política de privacidad
              </Button>
            )
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Política de Privacidad - TalentMatch</DialogTitle>
          <DialogDescription>
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Información que recopilamos</h3>
              <p className="text-muted-foreground mb-2">
                En TalentMatch, recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Información de cuenta:</strong> nombre, correo electrónico, teléfono</li>
                <li><strong>Información profesional:</strong> currículos, experiencia laboral, habilidades</li>
                <li><strong>Información de uso:</strong> cómo interactúas con nuestra plataforma</li>
                <li><strong>Información técnica:</strong> dirección IP, tipo de navegador, dispositivo</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Cómo usamos tu información</h3>
              <p className="text-muted-foreground mb-2">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Mejorar la experiencia del usuario</li>
                <li>Realizar análisis de compatibilidad entre candidatos y vacantes</li>
                <li>Comunicarnos contigo sobre tu cuenta y nuestros servicios</li>
                <li>Detectar y prevenir fraudes o abusos</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Compartir información</h3>
              <p className="text-muted-foreground">
                No vendemos tu información personal. Podemos compartir tu información únicamente en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Con reclutadores cuando postulas a una vacante</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Cuando sea requerido por ley</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Seguridad de los datos</h3>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Autenticación segura y gestión de contraseñas</li>
                <li>Controles de acceso estrictos</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Bloqueo temporal tras intentos fallidos de acceso</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Tus derechos</h3>
              <p className="text-muted-foreground mb-2">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Acceder a tu información personal</li>
                <li>Rectificar datos inexactos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Solicitar la portabilidad de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Cookies y tecnologías similares</h3>
              <p className="text-muted-foreground">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la plataforma y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu navegador.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Retención de datos</h3>
              <p className="text-muted-foreground">
                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera un período de retención más largo.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Menores de edad</h3>
              <p className="text-muted-foreground">
                Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos conscientemente información personal de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Cambios a esta política</h3>
              <p className="text-muted-foreground">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página y actualizando la fecha de "última actualización".
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Contacto</h3>
              <p className="text-muted-foreground">
                Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tu información, contáctanos a través de nuestro sistema de soporte o escríbenos a privacy@talentmatch.com
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
