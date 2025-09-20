export interface City {
  id: number;
  name: string;
  uf: string;
}

export interface CityManager {
  id: number;
  name: string;
  email: string;
  cpf: string;
  status: 'ativo' | 'inativo';
  cities: City[];
  created_at?: string;
  updated_at?: string;
}

export interface CityManagersApiResponse {
  success: boolean;
  message?: string;
  data: {
    data: CityManager[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}
