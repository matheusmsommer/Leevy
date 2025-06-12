
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { Checkup } from '@/types/business';

interface ComboSettingsProps {
  companyId: string;
}

const ComboSettings: React.FC<ComboSettingsProps> = ({ companyId }) => {
  const [combos, setCombos] = useState<Checkup[]>([]);

  const handleAddCombo = () => {
    console.log('Criar novo combo');
    // TODO: Implementar modal para criar combo
  };

  const handleImportCombo = () => {
    console.log('Importar combo sugerido pela Leevy');
    // TODO: Implementar modal de importação
  };

  const handleEditCombo = (comboId: string) => {
    console.log('Editar combo:', comboId);
    // TODO: Implementar modal de edição
  };

  const handleDeleteCombo = (comboId: string) => {
    console.log('Excluir combo:', comboId);
    // TODO: Implementar confirmação e exclusão
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Combos / Checkups
        </CardTitle>
        <CardDescription>
          Crie pacotes promocionais combinando múltiplos exames
        </CardDescription>
      </CardHeader>
      <CardContent>
        {combos.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum combo cadastrado ainda
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleAddCombo}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Combo
              </Button>
              <Button variant="outline" onClick={handleImportCombo}>
                <Download className="h-4 w-4 mr-2" />
                Importar Sugerido
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {combos.length} combos cadastrados
              </p>
              <div className="flex gap-2">
                <Button onClick={handleAddCombo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Combo
                </Button>
                <Button variant="outline" onClick={handleImportCombo}>
                  <Download className="h-4 w-4 mr-2" />
                  Importar
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Exames</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combos.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell className="font-medium">{combo.name}</TableCell>
                    <TableCell>R$ {combo.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {combo.discount_percentage ? `${combo.discount_percentage}%` : '-'}
                    </TableCell>
                    <TableCell>{combo.service_ids.length} exames</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        combo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {combo.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCombo(combo.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCombo(combo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComboSettings;
