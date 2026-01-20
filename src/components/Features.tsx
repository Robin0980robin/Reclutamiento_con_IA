// src/components/Features.tsx

import { Brain, Target, Zap, Shield, LineChart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";

// Mapeo estático de íconos (ya que la lista de features está en i18n)
const iconMap = [Brain, Target, Zap, Shield, LineChart, Users];

const Features = () => {
  const { features } = useI18n();

  return (
    <section className="bg-secondary/30 py-1 md:py-7">
      <div className="container mx-auto px-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-4">{features.title}</h2>
          <p className="text-lg text-muted-foreground">
            {features.subtitle}
          </p>
        </div>

        <div className="grid gap-3 mb-6 md:grid-cols-2 lg:grid-cols-3">
          {features.list.map((feature, index) => {
            const Icon = iconMap[index % iconMap.length]; // Usar el mapeo de íconos
            return (
              <Card 
                key={index} 
                className="group border-2 transition-all duration-300 hover:border-primary hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" /> {/* Usar el ícono dinámico */}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;