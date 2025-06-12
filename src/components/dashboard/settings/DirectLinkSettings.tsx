
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, Copy, Plus, Eye } from 'lucide-react';

interface DirectLinkSettingsProps {
  companyId: string;
}

interface DirectLink {
  id: string;
  name: string;
  url: string;
  exams: string[];
  patient: string;
  location: string;
  createdAt: string;
}

const DirectLinkSettings: React.FC<DirectLinkSettingsProps> = ({ companyId }) => {
  const [links, setLinks] = useState<DirectLink[]>([]);
  const [newLink, setNewLink] = useState({
    name: '',
    exams: [],
    patient: '',
    location: ''
  });

  const handleCreateLink = () => {
    console.log('Criando link direto:', newLink);
    // TODO: Implementar criação de link
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    console.log('Link copiado:', url);
    // TODO: Adicionar toast de confirmação
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Links de Venda Direta
        </CardTitle>
        <CardDescription>
          Crie links personalizados para envio direto aos clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Criar Novo Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-name">Nome do Link</Label>
              <Input
                id="link-name"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                placeholder="Ex: Hemograma para João Silva"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-select">Exames</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os exames" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hemograma">Hemograma Completo</SelectItem>
                    <SelectItem value="colesterol">Colesterol Total</SelectItem>
                    <SelectItem value="glicemia">Glicemia de Jejum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-select">Local de Atendimento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centro">Unidade Centro</SelectItem>
                    <SelectItem value="vila-madalena">Vila Madalena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-name">Nome do Paciente (opcional)</Label>
              <Input
                id="patient-name"
                value={newLink.patient}
                onChange={(e) => setNewLink({ ...newLink, patient: e.target.value })}
                placeholder="João Silva"
              />
            </div>

            <Button onClick={handleCreateLink} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Gerar Link de Pagamento
            </Button>
          </CardContent>
        </Card>

        {links.length === 0 ? (
          <div className="text-center py-8">
            <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum link criado ainda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Criados</h3>
            {links.map((link) => (
              <Card key={link.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{link.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Criado em {link.createdAt}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {link.exams.length} exame(s) • {link.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectLinkSettings;
