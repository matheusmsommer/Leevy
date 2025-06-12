
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';

const ComboManagement = () => {
  const combos = [
    {
      id: '1',
      name: 'Check-up Básico',
      description: 'Hemograma + Glicemia + Colesterol',
      price: 85.00,
      originalPrice: 100.00,
      active: true,
      services: ['Hemograma Completo', 'Glicemia de Jejum', 'Colesterol Total']
    },
    {
      id: '2',
      name: 'Perfil Lipídico Completo',
      description: 'Análise completa dos lipídeos',
      price: 75.00,
      originalPrice: 90.00,
      active: true,
      services: ['Colesterol Total', 'HDL', 'LDL', 'Triglicérides']
    },
    {
      id: '3',
      name: 'Avaliação Cardíaca',
      description: 'Exames para saúde do coração',
      price: 180.00,
      originalPrice: 220.00,
      active: false,
      services: ['ECG', 'Ecocardiograma', 'Teste Ergométrico']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Combos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie pacotes de exames com preços especiais
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Criar Combo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <Card key={combo.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{combo.name}</CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {combo.active ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-muted text-muted-foreground">
                      Inativo
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="text-muted-foreground mt-2">
                {combo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Exames inclusos:</p>
                <div className="space-y-1">
                  {combo.services.map((service, index) => (
                    <div key={index} className="text-sm text-foreground bg-muted/30 rounded px-3 py-2">
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        R$ {combo.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {combo.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-primary font-medium">
                      Economia: R$ {(combo.originalPrice - combo.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-accent">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-accent">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {combos.length === 0 && (
        <Card className="border-border shadow-sm">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum combo cadastrado ainda</p>
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Combo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComboManagement;
