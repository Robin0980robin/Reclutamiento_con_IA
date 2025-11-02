import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-10 md:py-18">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            Reclutamiento Inteligente con IA
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Encuentra el talento perfecto en minutos, no en semanas
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Nuestra plataforma impulsada por inteligencia artificial analiza currículums, 
            preselecciona candidatos ideales y te recomienda los mejores perfiles según 
            tus necesidades específicas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-center">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="group">
                Comenzar ahora
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/caracteristicas">
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
