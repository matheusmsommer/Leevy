
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Plus } from 'lucide-react';
import { Company, Location } from '@/types/business';

interface CompanyManagementProps {
  company: Company | null;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ company }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const handleAddLocation = () => {
    console.log('Adicionar nova unidade');
    // TODO: Implementar modal para adicionar unidade
  };

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configurar Empresa
          </CardTitle>
          <CardDescription>
            Configure os dados da sua empresa para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            Cadastrar Empresa
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {company.name}
          </CardTitle>
          <CardDescription>
            {company.type.charAt(0).toUpperCase() + company.type.slice(1)} • CNPJ: {company.cnpj}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              company.status === 'ativa' ? 'bg-green-100 text-green-800' :
              company.status === 'inativa' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {company.status === 'ativa' ? 'Ativa' : 
               company.status === 'inativa' ? 'Inativa' : 'Em análise'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Unidades de Atendimento
          </CardTitle>
          <CardDescription>
            Gerencie os locais onde sua empresa atende
          </CardDescription>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhuma unidade cadastrada ainda
              </p>
              <Button onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Unidade
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {location.address}, {location.city} - {location.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tel: {location.phone}
                  </p>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Unidade
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
