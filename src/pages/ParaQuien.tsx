// src/pages/ParaQuien.tsx (COMPLETO Y TRADUCIDO)

import { Building2, UserCircle, CheckCircle2, ArrowLeft, Star, Users, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LayoutPublic from "@/components/LayoutPublic"; // Ahora encuentra este componente
import { useI18n } from "@/hooks/use-i18n";

const ParaQuien = () => {
  // Desestructuramos las categorías necesarias: common, header, forWho
  const { common, header, forWho } = useI18n(); 

  // Mapeamos los testimonios usando las claves del diccionario
  const testimonials = [
    {
      name: forWho.testimonial1Name,
      role: forWho.testimonial1Role,
      company: forWho.testimonial1Company,
      content: forWho.testimonial1Content,
      rating: 5
    },
    {
      name: forWho.testimonial2Name,
      role: forWho.testimonial2Role,
      content: forWho.testimonial2Content,
      rating: 5
    },
    {
      name: forWho.testimonial3Name,
      role: forWho.testimonial3Role,
      company: forWho.testimonial3Company,
      content: forWho.testimonial3Content,
      rating: 5
    }
  ];
  
  const companyBenefits = forWho.companyBenefits;
  const candidateBenefits = forWho.candidateBenefits;

  return (
    <LayoutPublic>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-5 md:py-13">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Users className="h-4 w-4" />
              {forWho.tag} 
            </div>
            
            <h1 className="mb-5 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {forWho.heading} 
            </h1>
            
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/">
                <Button variant="hero" size="lg" className="group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {common.backToHome} 
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-1 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Para Empresas */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg transition-all hover:border-primary/40 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-primary p-3 text-primary-foreground">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold">{forWho.companyTitle}</h3>
                </div>

                <p className="mb-6 text-muted-foreground">
                  {forWho.companyDescription}
                </p>

                <div className="mb-8 space-y-4">
                  {companyBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button variant="default" size="lg" className="w-full">
                    {forWho.companyCTA} 
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {forWho.companyPrice}
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
                  <h3 className="text-2xl font-semibold">{forWho.candidateTitle}</h3>
                </div>

                <p className="mb-6 text-muted-foreground">
                  {forWho.candidateDescription}
                </p>

                <div className="mb-8 space-y-4">
                  {candidateBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button variant="hero" size="lg" className="w-full">
                    {forWho.candidateCTA}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {forWho.candidatePrice}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="mb-4">{forWho.testimonialsTitle}</h2>
            <p className="text-lg text-muted-foreground">
              {forWho.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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
      
    </LayoutPublic>
  );
};

export default ParaQuien;