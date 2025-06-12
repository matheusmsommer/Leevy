
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Tag, List, FileText, Clock } from 'lucide-react';
import CategoryManagement from './CategoryManagement';
import SubcategoryManagement from './SubcategoryManagement';
import PreparationManagement from './PreparationManagement';
import ScheduleManagement from './ScheduleManagement';

const ConfigurationManagement = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Configurações do Sistema</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gerencie categorias, subcategorias, preparações e horários de coleta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="subcategories" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Subcategorias
            </TabsTrigger>
            <TabsTrigger value="preparations" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Preparações
            </TabsTrigger>
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
          
          <TabsContent value="subcategories">
            <SubcategoryManagement />
          </TabsContent>
          
          <TabsContent value="preparations">
            <PreparationManagement />
          </TabsContent>
          
          <TabsContent value="schedules">
            <ScheduleManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConfigurationManagement;
