import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Clock, DollarSign, MapPin } from 'lucide-react';
import { Vacancy } from '@/contexts/DataContext';

interface VacancyCardProps {
    vacancy: Vacancy;
    isCandidateView: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, isCandidateView }) => {
    // Simulamos un Match IA para la vista de candidato
    const compatibility = vacancy.compatibilidad_ia || Math.floor(Math.random() * (98 - 75 + 1)) + 75;

    return (
        <Card className="overflow-hidden border-muted shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-foreground">
                        {vacancy.titulo}
                    </CardTitle>
                    {isCandidateView && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full text-accent text-sm font-bold border border-accent/20">
                            <Zap className="h-4 w-4 fill-accent" />
                            {compatibility}% Match
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                    <CardDescription className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" /> {vacancy.tipo_contrato}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1 text-xs font-medium text-primary">
                        <DollarSign className="h-3 w-3" /> {vacancy.salario || 'A convenir'}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {vacancy.descripcion}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
                <Button variant={isCandidateView ? "hero" : "outline"} size="sm">
                    {isCandidateView ? "Ver Detalles y Postular" : "Administrar Vacante"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default VacancyCard;