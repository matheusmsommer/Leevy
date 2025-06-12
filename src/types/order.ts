
export interface Order {
  id: string;
  order_number: string;
  patient_name: string;
  patient_id: string;
  customer_name: string;
  customer_id: string;
  services: string[];
  service_names: string[];
  location_id: string;
  location_name: string;
  scheduled_date?: string;
  scheduled_time?: string;
  attendance_type: 'presencial' | 'domiciliar' | 'livre';
  status: 'aguardando_atendimento' | 'em_atendimento' | 'aguardando_pagamento' | 'concluido' | 'cancelado';
  payment_status: 'pendente' | 'aprovado' | 'rejeitado';
  total_amount: number;
  observations?: string;
  result_files?: Array<{
    id: string;
    filename: string;
    url: string;
    uploaded_at: string;
  }>;
  result_link?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderFilter {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  patientName?: string;
}
