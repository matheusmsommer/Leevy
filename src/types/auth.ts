
export type UserRole = 'superadmin' | 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
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
