
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, User, Users, Calendar, FileText, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const PatientManagement = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    gender: '',
    phone: ''
  });

  // Mock data - incluindo o próprio usuário
  const mockPatients = [
    {
      id: 'self',
      name: user?.name || 'Eu mesmo',
      cpf: '123.456.789-00',
      birth_date: '1990-05-15',
      gender: 'masculino',
      phone: '(11) 99999-9999',
      age: 33
    },
    {
      id: '2',
      name: 'Maria Silva (Filha)',
      cpf: '987.654.321-00',
      birth_date: '2015-08-20',
      gender: 'feminino',
      phone: '',
      age: 8
    },
    {
      id: '3',
      name: 'José Silva (Pai)',
      cpf: '111.222.333-44',
      birth_date: '1965-12-10',
      gender: 'masculino',
      phone: '(11) 88888-8888',
      age: 58
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
      console.log('Cadastrando paciente:', formData);
      
      toast({
        title: "Paciente cadastrado com sucesso!",
        description: "O paciente foi adicionado à sua conta.",
      });
      
      setShowAddForm(false);
      setFormData({ name: '', cpf: '', birth_date: '', gender: '', phone: '' });
    } catch (error) {
      toast({
        title: "Erro ao cadastrar paciente",
        description: "Ocorreu um erro ao cadastrar o paciente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      setFormData({
        name: patient.name,
        cpf: patient.cpf,
        birth_date: patient.birth_date,
        gender: patient.gender,
        phone: patient.phone || ''
      });
      setEditingPatient(patientId);
      setShowAddForm(true);
    }
  };

  const handleDelete = (patientId: string) => {
    if (patientId === 'self') {
      toast({
        title: "Não é possível excluir",
        description: "Você não pode excluir seu próprio perfil.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Paciente removido",
      description: "O paciente foi removido da sua conta.",
    });
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
              Meus Pacientes
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os pacientes vinculados à sua conta
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Botão para adicionar paciente */}
          <div className="mb-6">
            <Button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingPatient(null);
                setFormData({ name: '', cpf: '', birth_date: '', gender: '', phone: '' });
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Novo Paciente
            </Button>
          </div>

          {/* Formulário de cadastro/edição */}
          {showAddForm && (
            <Card className="mb-6 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {editingPatient ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Nome Completo *</Label>
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
                        disabled={editingPatient === 'self'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birth_date" className="text-foreground">Data de Nascimento *</Label>
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
                      <Label htmlFor="gender" className="text-foreground">Gênero *</Label>
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
                    <div className="md:col-span-2">
                      <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                    </Button>
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
              Pacientes Cadastrados ({mockPatients.length})
            </h2>
            
            <div className="grid gap-4">
              {mockPatients.map((patient) => (
                <Card key={patient.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-card-foreground flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          {patient.name}
                          {patient.id === 'self' && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mt-3">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              CPF: {formatCPF(patient.cpf)}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Nascimento: {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p>Gênero: <span className="capitalize">{patient.gender}</span></p>
                            <p>Idade: {patient.age} anos</p>
                            {patient.phone && (
                              <p>Telefone: {patient.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(patient.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        {patient.id !== 'self' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
