
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter
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
  Cog,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SuperAdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SuperAdminSidebar = ({ activeTab, onTabChange }: SuperAdminSidebarProps) => {
  const { logout } = useAuth();

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
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Leevy</h2>
            <p className="text-sm text-blue-600 font-medium">Super Admin</p>
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
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
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
