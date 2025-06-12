
import React from 'react';
import { 
  Search, 
  Calendar, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Heart,
  FileText
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
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Leevy</h2>
            <p className="text-sm text-muted-foreground">Paciente</p>
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
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
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

export default UserSidebar;
