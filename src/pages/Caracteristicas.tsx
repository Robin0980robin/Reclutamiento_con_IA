import { Brain, Target, Zap, Shield, LineChart, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Brain,
    title: "Análisis Inteligente de CVs",
    description: "Nuestra IA avanzada analiza automáticamente cada currículum, extrayendo habilidades, experiencia y calificaciones relevantes con una precisión del 95%.",
    benefits: [
      "Extracción automática de habilidades técnicas",
      "Análisis de experiencia laboral relevante",
      "Identificación de competencias clave",
      "Evaluación de nivel de experiencia"
    ]
  },
  {
    icon: Target,
    title: "Preselección Automatizada",
    description: "Filtra y clasifica candidatos según tus criterios específicos, ahorrándote horas de revisión manual y garantizando que solo veas los perfiles más relevantes.",
    benefits: [
      "Filtrado por habilidades específicas",
      "Matching automático con requisitos",
      "Clasificación por nivel de experiencia",
      "Priorización de candidatos ideales"
    ]
  },
  {
    icon: Zap,
    title: "Recomendaciones Instantáneas",
    description: "Recibe sugerencias de candidatos ideales en tiempo real basadas en tus requisitos de vacante, con explicaciones detalladas del por qué cada candidato es perfecto.",
    benefits: [
      "Recomendaciones en tiempo real",
      "Explicaciones detalladas de compatibilidad",
      "Ranking automático de candidatos",
      "Alertas de nuevos perfiles relevantes"
    ]
  },
  {
    icon: Shield,
    title: "Proceso Transparente",
    description: "Comprende exactamente por qué cada candidato fue recomendado con análisis detallados y métricas de transparencia que te ayudan a tomar decisiones informadas.",
    benefits: [
      "Explicaciones claras de cada recomendación",
      "Métricas de transparencia",
      "Historial de decisiones de la IA",
      "Reportes detallados de compatibilidad"
    ]
  },
  {
    icon: LineChart,
    title: "Métricas de Compatibilidad",
    description: "Visualiza el porcentaje de coincidencia de cada candidato con tu oferta laboral a través de dashboards interactivos y reportes detallados.",
    benefits: [
      "Dashboards interactivos",
      "Métricas de compatibilidad en tiempo real",
      "Reportes de rendimiento",
      "Análisis de tendencias de contratación"
    ]
  },
  {
    icon: Users,
    title: "Experiencia Optimizada",
    description: "Interfaz intuitiva y accesible tanto para reclutadores como para candidatos, diseñada con las mejores prácticas de UX/UI.",
    benefits: [
      "Interfaz intuitiva y moderna",
      "Accesibilidad completa",
      "Experiencia móvil optimizada",
      "Navegación simplificada"
    ]
  }
];

const Caracteristicas = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-10 md:py-18">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Caracteristicas
            </h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link to="/">
                <Button variant="hero" size="lg" className="group">
                  <ArrowLeft className="mr-2 h-2 w-2 transition-transform group-hover:-translate-x-1" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient blobs */}
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Features Grid */}
      <section className="py-1 md:py-1">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-1 max-w-3xl text-center">
            <p className="text-lg text-muted-foreground">
              Cada funcionalidad está diseñada para optimizar tu proceso de reclutamiento
            </p>
          </div>

          <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="mb-1 text-xl font-semibold">{feature.title}</h3>
                  <p className="mb-1 text-muted-foreground">{feature.description}</p>
                  
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Caracteristicas;
