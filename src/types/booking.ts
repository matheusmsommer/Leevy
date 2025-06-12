
export interface Booking {
  id: string;
  user_id: string;
  patient_id: string;
  service_id: string;
  location_id?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  status: 'pendente_pagamento' | 'confirmado' | 'realizado' | 'resultado_disponivel';
  payment_status: 'pendente' | 'aprovado' | 'rejeitado';
  stripe_session_id?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  patient_id: string;
  service_id: string;
  location_id?: string;
  scheduled_date?: string;
  scheduled_time?: string;
}
