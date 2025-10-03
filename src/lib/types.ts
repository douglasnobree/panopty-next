export interface Dashboard {
  id: number;
  name: string;
  dashboard_url: string;
}

export interface City {
  city_id: number;
  city_name: string;
  uf: string;
  dashboards: Dashboard[];
}

export interface CitysData {
  id: string;
  cod_mun: string;
  name: string;
  uf: string;
  bill_files_count: number;
  cip_active_files_count: number;
  diagnostico_count: number;
  analise_count: number;
  power_bi_dashboards_count: number;
}

export interface AllIpAssets {
  id: string;
  cities_id: string;
  name: string;
  status: string;
  year: string;
  month: string;
  filePath?: string;
}

export interface Bill {
  id: string;
  cities_id: string;
  name: string;
  status: string;
  ano: string;
  filePath?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface AllAnalyses {
  // Add properties as needed
  id: string;
  // etc.
}

export interface CountieInfo {
  name: string;
  // Add other properties
}

export interface AllBills {
  id: string;
  name: string;
  year: string;
  // etc.
}

export interface TariffModule {
  id: string;
  rate_value: string;
  rate_type: { type: string };
  month: string;
  year: string;
}
