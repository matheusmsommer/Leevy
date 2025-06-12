
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Lock, Trash2, ArrowLeft } from 'lucide-react';

const AccountSettings = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || user?.full_name || '',
    email: user?.email || '',
    phone: '',
    cpf: ''
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aqui seria feita a chamada para a API
      console.log('Salvando dados:', formData);
      
      toast({
        title: "Dados atualizados com sucesso!",
        description: "Suas informações foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = () => {
    // Implementar mudança de senha
    toast({
      title: "Recurso em desenvolvimento",
      description: "A alteração de senha estará disponível em breve.",
    });
  };

  const handleDeleteAccount = () => {
    // Implementar exclusão de conta
    toast({
      title: "Recurso em desenvolvimento",
      description: "A exclusão de conta estará disponível em breve.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configurações da Conta</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus dados pessoais e configurações
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Dados Pessoais */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted border-input text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      O e-mail não pode ser alterado
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf" className="text-foreground">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <Button type="submit">Salvar Alterações</Button>
              </form>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Alterar Senha</h4>
                  <p className="text-sm text-muted-foreground">
                    Atualize sua senha para manter sua conta segura
                  </p>
                </div>
                <Button variant="outline" onClick={handleChangePassword}>
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="bg-card border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h4 className="font-medium text-foreground">Excluir Conta</h4>
                  <p className="text-sm text-muted-foreground">
                    Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
