
import React from 'react';
import { 
  BarChart3, 
  Building2, 
  TestTube, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Activity,
  Sparkles
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SuperAdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SuperAdminSidebar = ({ activeTab, onTabChange }: SuperAdminSidebarProps) => {
  const { signOut } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: BarChart3,
    },
    {
      id: 'companies',
      title: 'Empresas',
      icon: Building2,
    },
    {
      id: 'exams',
      title: 'Exames Globais',
      icon: TestTube,
    },
    {
      id: 'orders',
      title: 'Vendas',
      icon: ShoppingCart,
    },
    {
      id: 'users',
      title: 'Usuários',
      icon: Users,
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: Settings,
    },
    {
      id: 'logs',
      title: 'Logs de Auditoria',
      icon: Activity,
    },
  ];

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Leevy</h2>
            <p className="text-sm text-primary font-medium">Super Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold mb-3">
            Gestão da Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full justify-start h-11 rounded-lg transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={signOut} 
          className="w-full justify-start h-11 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
