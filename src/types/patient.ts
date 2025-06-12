
export interface Patient {
  id: string;
  user_id: string;
  name: string;
  cpf: string;
  birth_date: string;
  gender: 'masculino' | 'feminino' | 'outro';
  created_at: string;
  updated_at: string;
}

export interface CreatePatientData {
  name: string;
  cpf: string;
  birth_date: string;
  gender: 'masculino' | 'feminino' | 'outro';
}
