
export type CompanyType = 'laboratorio' | 'clinica' | 'consultorio' | 'telemedicina';
export type CompanyStatus = 'ativa' | 'inativa' | 'em_analise';
export type ServiceType = 'exame' | 'consulta' | 'checkup';

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  cnpj: string;
  created_by: string; // admin user id
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  company_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  phone: string;
  available_days: string[]; // ['monday', 'tuesday', etc]
  available_hours: string[]; // ['08:00', '09:00', etc]
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  company_id: string;
  type: ServiceType;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  delivery_time: string;
  instructions: string;
  location_ids: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Checkup {
  id: string;
  company_id: string;
  name: string;
  description: string;
  price: number;
  service_ids: string[]; // services included in this checkup
  discount_percentage?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}
