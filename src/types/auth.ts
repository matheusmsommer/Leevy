
export type UserRole = 'superadmin' | 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  role: UserRole;
  cpf?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  service_type: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  userRole: string | null;
  companyId: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  cpf: string;
  role: UserRole;
  companyData?: {
    name: string;
    cnpj: string;
    service_type: string;
  };
}
