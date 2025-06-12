
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Plus, UserCheck } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  birth_date: string;
  gender: string;
}

interface PatientSelectionProps {
  selectedPatientId: string;
  onPatientChange: (patientId: string) => void;
}

const PatientSelection = ({ selectedPatientId, onPatientChange }: PatientSelectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    gender: ''
  });

  // Mock data - incluindo o próprio usuário
  const mockPatients: Patient[] = [
    {
      id: 'self',
      name: user?.name || 'Eu mesmo',
      cpf: '123.456.789-00',
      birth_date: '1990-05-15',
      gender: 'masculino'
    },
    {
      id: '2',
      name: 'Maria Silva (Filha)',
      cpf: '987.654.321-00',
      birth_date: '2015-08-20',
      gender: 'feminino'
    },
    {
      id: '3',
      name: 'José Silva (Pai)',
      cpf: '111.222.333-44',
      birth_date: '1965-12-10',
      gender: 'masculino'
    }
  ];

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
        description: "O paciente foi adicionado e selecionado para este agendamento.",
      });
      
      // Simular novo paciente criado
      const newPatientId = `new-${Date.now()}`;
      onPatientChange(newPatientId);
      
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Para quem é o atendimento?</h3>
        <p className="text-muted-foreground">
          Selecione o paciente que receberá os serviços agendados
        </p>
      </div>

      {/* Lista de pacientes */}
      <div className="space-y-3">
        {mockPatients.map((patient) => (
          <Card
            key={patient.id}
            className={`cursor-pointer transition-all ${
              selectedPatientId === patient.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:shadow-md'
            }`}
            onClick={() => onPatientChange(patient.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    patient.id === 'self' ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {patient.id === 'self' ? (
                      <UserCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{patient.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      <span>CPF: {patient.cpf}</span>
                      <span className="ml-4">
                        {calculateAge(patient.birth_date)} anos
                      </span>
                      <span className="ml-4 capitalize">{patient.gender}</span>
                    </div>
                  </div>
                </div>
                {selectedPatientId === patient.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão para adicionar novo paciente */}
      <Button
        onClick={() => setShowAddForm(!showAddForm)}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Novo Paciente
      </Button>

      {/* Formulário de cadastro */}
      {showAddForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Cadastrar Novo Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠️ CPF é obrigatório para evitar duplicidades
                  </p>
                </div>
                <div>
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gênero *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Cadastrar e Selecionar</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Aviso importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-1">Importante:</h4>
        <p className="text-sm text-blue-700">
          O CPF é obrigatório para todos os pacientes para garantir a identificação única 
          e evitar duplicidades no sistema. Os dados são mantidos em segurança.
        </p>
      </div>
    </div>
  );
};

export default PatientSelection;
