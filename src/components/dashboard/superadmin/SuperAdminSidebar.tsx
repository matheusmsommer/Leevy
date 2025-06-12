
import React from 'react';
import { 
  BarChart3, 
  Building2, 
  TestTube, 
  ShoppingCart, 
  Users, 
  Shield, 
  Settings,
  LogOut,
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
    <Sidebar className="border-r border-border/50 bg-gradient-to-b from-card to-card/80">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-leevy rounded-xl flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">Leevy</h2>
            <p className="text-sm text-primary font-medium">Super Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold mb-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full justify-start h-11 rounded-xl transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-gradient-leevy text-white shadow-soft' 
                        : 'hover:bg-muted/50 text-foreground hover:shadow-soft'
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

      <SidebarFooter className="p-4 border-t border-border/50">
        <Button 
          variant="outline" 
          onClick={logout} 
          className="w-full justify-start h-11 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SuperAdminSidebar;
