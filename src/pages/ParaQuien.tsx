import { Building2, UserCircle, CheckCircle2, ArrowLeft, Star, Users, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const testimonials = [
  {
    name: "María González",
    role: "Directora de RRHH",
    company: "TechCorp Ecuador",
    content: "TalentMatch ha revolucionado nuestro proceso de reclutamiento. Ahora encontramos candidatos ideales en la mitad del tiempo.",
    rating: 5
  },
  {
    name: "Carlos Mendoza",
    role: "Desarrollador Senior",
    content: "La plataforma me ayudó a encontrar oportunidades que realmente se ajustan a mi perfil. El matching es increíblemente preciso.",
    rating: 5
  },
  {
    name: "Ana Rodríguez",
    role: "CEO",
    company: "StartupEcuador",
    content: "La calidad de los candidatos que recibimos ha mejorado significativamente. Definitivamente recomendamos TalentMatch.",
    rating: 5
  }
];

const ParaQuien = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-5 md:py-13">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Users className="h-4 w-4" />
              Para todos
            </div>
            
            <h1 className="mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Una plataforma diseñada para todos
            </h1>
            
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/">
                <Button variant="hero" size="lg" className="group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient blobs */}
        <div className="absolute -top-1 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Main Content */}
      <section className="py-1 md:py-1">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Para Empresas */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg transition-all hover:border-primary/40 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-primary p-3 text-primary-foreground">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold">Para Empresas</h3>
                </div>

                <p className="mb-6 text-muted-foreground">
                  Encuentra el talento ideal más rápido con análisis inteligente y recomendaciones precisas. 
                  Ahorra tiempo y recursos mientras mejoras la calidad de tus contrataciones.
                </p>

                <div className="mb-8 space-y-4">
                  {[
                    "Crea perfiles de vacante en minutos",
                    "Recibe candidatos preseleccionados automáticamente",
                    "Visualiza métricas de compatibilidad claras",
                    "Filtros avanzados para refinar búsquedas",
                    "Ahorra hasta 85% del tiempo de reclutamiento",
                    "Integración con tus herramientas existentes",
                    "Reportes detallados de rendimiento",
                    "Soporte dedicado para empresas"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button variant="default" size="lg" className="w-full">
                    Comenzar como empresa
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Plan empresarial desde $99/mes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Para Candidatos */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent shadow-lg transition-all hover:border-accent/40 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-accent p-3 text-accent-foreground">
                    <UserCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold">Para Candidatos</h3>
                </div>

                <p className="mb-6 text-muted-foreground">
                  Mejora tu perfil profesional y conecta con oportunidades que realmente se ajustan a ti. 
                  Descubre tu potencial y accede a ofertas de trabajo relevantes.
                </p>

                <div className="mb-8 space-y-4">
                  {[
                    "Sube tu CV y recibe análisis instantáneo",
                    "Descubre tu compatibilidad con ofertas",
                    "Recibe sugerencias para mejorar tu perfil",
                    "Accede a oportunidades relevantes",
                    "Proceso simple y transparente",
                    "Notificaciones de nuevas oportunidades",
                    "Análisis de mercado laboral personalizado",
                    "Conecta directamente con reclutadores"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button variant="hero" size="lg" className="w-full">
                    Comenzar como candidato
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Completamente gratuito para candidatos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 py-1">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-lg text-muted-foreground">
              Miles de profesionales y empresas ya confían en TalentMatch
            </p>
          </div>

          <div className="grid gap-1 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="mb-4 text-muted-foreground">"{testimonial.content}"</p>
                  
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && ` en ${testimonial.company}`}
                    </div>
                  </div>
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

export default ParaQuien;
