
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Upload, Save } from 'lucide-react';
import { Company } from '@/types/business';

interface CompanyDataSettingsProps {
  company: Company;
}

const CompanyDataSettings: React.FC<CompanyDataSettingsProps> = ({ company }) => {
  const [formData, setFormData] = useState({
    name: company.name,
    cnpj: company.cnpj,
    email: '',
    phone: '',
    description: '',
    logo: null as File | null
  });

  const handleSave = () => {
    console.log('Salvando dados da empresa:', formData);
    // TODO: Implementar salvamento
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Dados da Empresa
        </CardTitle>
        <CardDescription>
          Informações básicas da sua empresa exibidas na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome Fantasia</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da empresa"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              placeholder="00.000.000/0000-00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail Principal</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contato@empresa.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone Principal</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição para Exibição Pública</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva sua empresa para os clientes..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo da Empresa</Label>
          <div className="flex items-center gap-4">
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          {formData.logo && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {formData.logo.name}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDataSettings;
