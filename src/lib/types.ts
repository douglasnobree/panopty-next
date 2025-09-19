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
  ano: string;
  mes: string;
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
