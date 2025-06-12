
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, MapPin, Users, DollarSign, File, Package, FileText, Bell, Link } from 'lucide-react';
import { Company } from '@/types/business';
import CompanyDataSettings from './settings/CompanyDataSettings';
import LocationSettings from './settings/LocationSettings';
import UsersSettings from './settings/UsersSettings';
import PaymentSettings from './settings/PaymentSettings';
import ExamCatalogSettings from './settings/ExamCatalogSettings';
import ComboSettings from './settings/ComboSettings';
import TermsSettings from './settings/TermsSettings';
import NotificationSettings from './settings/NotificationSettings';
import DirectLinkSettings from './settings/DirectLinkSettings';

interface CompanySettingsProps {
  company: Company | null;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ company }) => {
  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações não disponíveis</CardTitle>
          <CardDescription>
            Configure sua empresa primeiro para acessar as configurações
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configurações da Empresa
          </CardTitle>
          <CardDescription>
            Gerencie todos os aspectos da sua empresa na plataforma
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="locations">Locais</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="exams">Exames</TabsTrigger>
          <TabsTrigger value="combos">Combos</TabsTrigger>
          <TabsTrigger value="terms">Termos</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanyDataSettings company={company} />
        </TabsContent>

        <TabsContent value="locations">
          <LocationSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="users">
          <UsersSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="exams">
          <ExamCatalogSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="combos">
          <ComboSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="terms">
          <TermsSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings companyId={company.id} />
        </TabsContent>

        <TabsContent value="links">
          <DirectLinkSettings companyId={company.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanySettings;
