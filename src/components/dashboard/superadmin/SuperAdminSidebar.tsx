
import React from 'react';
import { 
  BarChart3, 
  Building2, 
  TestTube, 
  ShoppingCart, 
  Users, 
  Shield, 
  Settings,
  LogOut
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
  const { logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: BarChart3,
    },
    {
      id: 'exams',
      title: 'Exames',
      icon: TestTube,
    },
    {
      id: 'companies',
      title: 'Empresas',
      icon: Building2,
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
      id: 'audit',
      title: 'Auditoria',
      icon: Shield,
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Leevy</h2>
            <p className="text-sm text-muted-foreground">Superadmin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="outline" onClick={logout} className="w-full justify-start">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
