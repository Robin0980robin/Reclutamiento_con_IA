import { Brain, Target, Zap, Shield, LineChart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "Análisis Inteligente de CVs",
    description: "La IA analiza automáticamente cada currículum, extrayendo habilidades, experiencia y calificaciones relevantes."
  },
  {
    icon: Target,
    title: "Preselección Automatizada",
    description: "Filtra y clasifica candidatos según tus criterios específicos, ahorrándote horas de revisión manual."
  },
  {
    icon: Zap,
    title: "Recomendaciones Instantáneas",
    description: "Recibe sugerencias de candidatos ideales en tiempo real basadas en tus requisitos de vacante."
  },
  {
    icon: Shield,
    title: "Proceso Transparente",
    description: "Comprende exactamente por qué cada candidato fue recomendado con análisis detallados."
  },
  {
    icon: LineChart,
    title: "Métricas de Compatibilidad",
    description: "Visualiza el porcentaje de coincidencia de cada candidato con tu oferta laboral."
  },
  {
    icon: Users,
    title: "Experiencia Optimizada",
    description: "Interfaz intuitiva y accesible tanto para reclutadores como para candidatos."
  }
];

const Features = () => {
  return (
    <section className="bg-secondary/30 py-1 md:py-7">
      <div className="container mx-auto px-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-4">Características que transforman tu proceso de reclutamiento</h2>
          <p className="text-lg text-muted-foreground">
            Herramientas potentes diseñadas para hacer tu trabajo más fácil y efectivo
          </p>
        </div>

        <div className="grid gap-3 mb-6 md:grid-cols- lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
