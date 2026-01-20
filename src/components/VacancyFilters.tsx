// src/components/VacancyFilters.tsx (COMPLETO Y CORREGIDO)

import React from 'react';
import { Search, Briefcase, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Enums } from '@/integrations/supabase/types';
import { useI18n } from '@/hooks/use-i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VacancyFiltersProps {
  filters: {
    search: string;
    status: Enums<'vacancy_status'> | 'all';
    contract: Enums<'contract_type'> | 'all';
  };
  onFilterChange: (key: string, value: string) => void;
}

const VacancyFilters: React.FC<VacancyFiltersProps> = ({ filters, onFilterChange }) => {
  const { dashboard } = useI18n();

  // Definimos las opciones con IDs únicos para las keys
  const statusOptions = [
    { id: 'st-all', label: dashboard.allStatuses, value: 'all' },
    { id: 'st-open', label: dashboard.open, value: 'abierta' },
    { id: 'st-closed', label: dashboard.closed, value: 'cerrada' },
  ];

  const contractOptions = [
    { id: 'ct-all', label: dashboard.allStatuses, value: 'all' },
    { id: 'ct-ft', label: dashboard.fullTime, value: 'tiempo_completo' },
    { id: 'ct-pt', label: dashboard.partTime, value: 'medio_tiempo' },
    { id: 'ct-rm', label: dashboard.remote, value: 'remoto' },
    { id: 'ct-hb', label: dashboard.hybrid, value: 'hibrido' },
  ];

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
        <Filter className="h-5 w-5" />
        {dashboard.searchTitle}
      </h3>
      <Separator />

      {/* 1. Búsqueda */}
      <div className="space-y-2">
        <Label htmlFor="search" className="flex items-center gap-2">
          <Search className="h-4 w-4" /> Búsqueda
        </Label>
        <Input
          id="search"
          placeholder={dashboard.searchPlaceholder}
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <Separator />

      {/* 2. Estado - CORREGIDO: Keys únicas con prefijo */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-md font-semibold">
          <Briefcase className="h-4 w-4" />
          {dashboard.statusFilter}
        </Label>
        <RadioGroup
          value={filters.status}
          onValueChange={(value) => onFilterChange('status', value)}
          className="grid grid-cols-1 gap-2"
        >
          {statusOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 border rounded-md p-2 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value={option.value} id={option.id} />
              <Label htmlFor={option.id} className="cursor-pointer flex-grow">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* 3. Contrato */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-md font-semibold">
          <TrendingUp className="h-4 w-4" />
          {dashboard.contractFilter}
        </Label>
        <Select
          value={filters.contract}
          onValueChange={(value) => onFilterChange('contract', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={dashboard.allStatuses} />
          </SelectTrigger>
          <SelectContent>
            {contractOptions.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VacancyFilters;