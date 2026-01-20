// src/components/Hero.tsx (ACTUALIZADO CON REDIRECCIÓN INTELIGENTE)

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from '@/contexts/AuthContext'; // <-- Importar useAuth

const Hero = () => {
  const { hero } = useI18n();
  const { user } = useAuth(); // Obtener el usuario autenticado

  // Lógica de Redirección Condicional:
  const primaryCtaDest = !user // Si no hay usuario
    ? '/login' // --> Ir a Login
    : user.user_metadata.rol === 'reclutador' 
        ? '/dashboard' // Si es Reclutador (Administrador) --> Ir a Dashboard Reclutador
        : user.user_metadata.rol === 'candidato'
            ? '/candidato-dashboard' // Si es Candidato --> Ir a Dashboard Candidato
            : '/profile'; // Ruta de reserva para otros roles

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-10 md:py-18">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            {hero.badge}
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {hero.heading}
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            {hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to={primaryCtaDest}> {/* <-- USANDO RUTA CONDICIONAL */}
              <Button variant="default" size="lg" className="group">
                {hero.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/caracteristicas">
              <Button variant="outline" size="lg" className="group">
                {hero.ctaSecondary}
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;