import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExamAdded: () => void;
}

const AddExamModal = ({ open, onOpenChange, onExamAdded }: AddExamModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [synonymInput, setSynonymInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    synonyms: [] as string[],
    preparation: '',
    description: '',
    fastingHours: '',
    medicationRestrictions: false,
    hydrationNeeded: false,
    physicalActivityRestriction: false,
    collectionTime: '',
    resultDeliveryDays: '',
    specialInstructions: ''
  });

  const categories = [
    'sangue',
    'urina',
    'fezes',
    'imagem',
    'cardiologia',
    'neurologia',
    'endocrinologia',
    'ginecologia',
    'urologia',
    'dermatologia',
    'oftalmologia',
    'otorrinolaringologia',
    'outros'
  ];

  const fastingOptions = [
    { value: '0', label: 'Sem jejum' },
    { value: '4', label: '4 horas' },
    { value: '8', label: '8 horas' },
    { value: '12', label: '12 horas' },
    { value: '24', label: '24 horas' }
  ];

  const collectionTimes = [
    { value: 'any', label: 'Qualquer horário' },
    { value: 'morning', label: 'Manhã (7h às 10h)' },
    { value: 'first_urine', label: 'Primeira urina da manhã' },
    { value: 'specific', label: 'Horário específico' }
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSynonym = () => {
    if (synonymInput.trim() && !formData.synonyms.includes(synonymInput.trim())) {
      setFormData(prev => ({
        ...prev,
        synonyms: [...prev.synonyms, synonymInput.trim()]
      }));
      setSynonymInput('');
    }
  };

  const handleRemoveSynonym = (synonymToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      synonyms: prev.synonyms.filter(synonym => synonym !== synonymToRemove)
    }));
  };

  const handleSynonymKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSynonym();
    }
  };

  const generatePreparation = () => {
    const preparations = [];
    
    if (formData.fastingHours && formData.fastingHours !== '0') {
      preparations.push(`Jejum de ${formData.fastingHours} horas`);
    }
    
    if (formData.medicationRestrictions) {
      preparations.push('Suspender medicamentos conforme orientação médica');
    }
    
    if (formData.hydrationNeeded) {
      preparations.push('Manter boa hidratação');
    }
    
    if (formData.physicalActivityRestriction) {
      preparations.push('Evitar exercícios físicos intensos 24h antes');
    }
    
    if (formData.collectionTime === 'morning') {
      preparations.push('Coleta preferencialmente pela manhã');
    } else if (formData.collectionTime === 'first_urine') {
      preparations.push('Primeira urina da manhã');
    }
    
    if (formData.specialInstructions) {
      preparations.push(formData.specialInstructions);
    }
    
    return preparations.join('; ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, código e categoria.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Adding new exam:', formData);

      const finalPreparation = generatePreparation();

      const { data, error } = await supabase
        .from('exams')
        .insert([
          {
            name: formData.name,
            code: formData.code.toUpperCase(),
            category: formData.category,
            synonyms: formData.synonyms.length > 0 ? formData.synonyms.join(',') : null,
            preparation: finalPreparation || null,
            description: formData.description || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding exam:', error);
        toast({
          title: "Erro ao adicionar exame",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Exam added successfully:', data);
      toast({
        title: "Exame adicionado",
        description: "O exame foi adicionado com sucesso ao catálogo global.",
      });

      // Reset form
      setFormData({
        name: '',
        code: '',
        category: '',
        synonyms: [],
        preparation: '',
        description: '',
        fastingHours: '',
        medicationRestrictions: false,
        hydrationNeeded: false,
        physicalActivityRestriction: false,
        collectionTime: '',
        resultDeliveryDays: '',
        specialInstructions: ''
      });
      setSynonymInput('');

      onExamAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao adicionar o exame.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Exame</DialogTitle>
          <DialogDescription>
            Adicione um novo exame ao catálogo global. Este exame ficará disponível para todas as empresas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Exame *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Hemograma Completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ex: HEM001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="synonyms">Sinônimos / Nomes Alternativos</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="synonyms"
                  value={synonymInput}
                  onChange={(e) => setSynonymInput(e.target.value)}
                  onKeyPress={handleSynonymKeyPress}
                  placeholder="Ex: CBC, Hemograma simples"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSynonym}
                  disabled={!synonymInput.trim()}
                >
                  Adicionar
                </Button>
              </div>
              {formData.synonyms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.synonyms.map((synonym, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {synonym}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveSynonym(synonym)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Adicione nomes alternativos para facilitar a busca (ex: CBC para Hemograma Completo)
              </p>
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <Label className="text-sm font-semibold">Preparações Padronizadas</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fastingHours">Jejum</Label>
                <Select value={formData.fastingHours} onValueChange={(value) => handleInputChange('fastingHours', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o jejum" />
                  </SelectTrigger>
                  <SelectContent>
                    {fastingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collectionTime">Horário de Coleta</Label>
                <Select value={formData.collectionTime} onValueChange={(value) => handleInputChange('collectionTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionTimes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medicationRestrictions"
                  checked={formData.medicationRestrictions}
                  onCheckedChange={(checked) => handleInputChange('medicationRestrictions', checked as boolean)}
                />
                <Label htmlFor="medicationRestrictions" className="text-sm">
                  Restrições de medicamentos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hydrationNeeded"
                  checked={formData.hydrationNeeded}
                  onCheckedChange={(checked) => handleInputChange('hydrationNeeded', checked as boolean)}
                />
                <Label htmlFor="hydrationNeeded" className="text-sm">
                  Manter boa hidratação
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="physicalActivityRestriction"
                  checked={formData.physicalActivityRestriction}
                  onCheckedChange={(checked) => handleInputChange('physicalActivityRestriction', checked as boolean)}
                />
                <Label htmlFor="physicalActivityRestriction" className="text-sm">
                  Evitar exercícios físicos intensos
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Instruções Especiais</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                placeholder="Ex: Bexiga cheia, evitar álcool 48h antes"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Exame</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição detalhada do que o exame avalia"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Exame'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExamModal;
