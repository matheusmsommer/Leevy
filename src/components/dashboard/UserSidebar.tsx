
import React from 'react';
import { 
  Search, 
  Calendar, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Heart,
  FileText,
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

interface UserSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const UserSidebar = ({ activeSection, onSectionChange }: UserSidebarProps) => {
  const { logout } = useAuth();

  const menuItems = [
    {
      id: 'search',
      title: 'Buscar Serviços',
      icon: Search,
    },
    {
      id: 'bookings',
      title: 'Meus Agendamentos',
      icon: Calendar,
    },
    {
      id: 'orders',
      title: 'Histórico de Pedidos',
      icon: ShoppingCart,
    },
    {
      id: 'patients',
      title: 'Pacientes',
      icon: Users,
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      icon: Heart,
    },
    {
      id: 'reports',
      title: 'Relatórios',
      icon: FileText,
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
            <p className="text-sm text-primary font-medium">Portal do Cliente</p>
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
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full justify-start h-11 rounded-xl transition-all duration-200 ${
                      activeSection === item.id 
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

export default UserSidebar;
