
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Building2, 
  TestTube, 
  ShoppingCart, 
  Users, 
  Settings, 
  FileText,
  Shield,
  Cog
} from 'lucide-react';

interface SuperAdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SuperAdminSidebar = ({ activeTab, onTabChange }: SuperAdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'companies', label: 'Empresas', icon: Building2 },
    { id: 'exams', label: 'Catálogo de Exames', icon: TestTube },
    { id: 'configurations', label: 'Configurações', icon: Cog },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'settings', label: 'Plataforma', icon: Settings },
    { id: 'logs', label: 'Auditoria', icon: FileText }
  ];

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="border-b border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Super Admin</h2>
            <p className="text-xs text-muted-foreground">Painel Administrativo</p>
          </div>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onTabChange(item.id)}
                isActive={activeTab === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
