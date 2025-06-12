
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, User, Users, Calendar, FileText } from 'lucide-react';

const PatientManagement = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    gender: ''
  });

  // Mock data - seria substituído por dados reais
  const mockPatients = [
    {
      id: '1',
      name: 'João Silva',
      cpf: '123.456.789-00',
      birth_date: '1990-05-15',
      gender: 'masculino',
      age: 33
    },
    {
      id: '2',
      name: 'Maria Silva',
      cpf: '987.654.321-00',
      birth_date: '2015-08-20',
      gender: 'feminino',
      age: 8
    }
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aqui seria feita a chamada para a API
      console.log('Cadastrando paciente:', formData);
      
      toast({
        title: "Paciente cadastrado com sucesso!",
        description: "O paciente foi adicionado à sua conta.",
      });
      
      setShowAddForm(false);
      setFormData({ name: '', cpf: '', birth_date: '', gender: '' });
    } catch (error) {
      toast({
        title: "Erro ao cadastrar paciente",
        description: "Ocorreu um erro ao cadastrar o paciente.",
        variant: "destructive",
      });
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Gerenciar Pacientes
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os pacientes vinculados à sua conta
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Botão para adicionar paciente */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Novo Paciente
          </Button>
        </div>

        {/* Formulário de cadastro */}
        {showAddForm && (
          <Card className="mb-6 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Cadastrar Novo Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Digite o nome completo"
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      required
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
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="birth_date" className="text-foreground">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      className="bg-background border-input text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-foreground">Gênero</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="bg-background border-input text-foreground">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Cadastrar Paciente</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de pacientes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Pacientes Cadastrados
          </h2>
          {mockPatients.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum paciente cadastrado</p>
                <p className="text-sm text-muted-foreground">
                  Adicione pacientes para poder agendar serviços
                </p>
              </CardContent>
            </Card>
          ) : (
            mockPatients.map((patient) => (
              <Card key={patient.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-card-foreground flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {patient.name}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground mt-2">
                        <p className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          CPF: {formatCPF(patient.cpf)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data de Nascimento: {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p>Gênero: {patient.gender}</p>
                        <p>Idade: {patient.age} anos</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
