export interface AreaStructure {
  id: number;
  area_codigo: string;
  area_nombre: string;
  id_edificio: number | null;
  id_resguardante_responsable: number | null;
  created_at: string | null;
  updated_at: string | null;
  departamentos: [];
  edificio: string | null;
  responsable: string | null;
}

// 3. Tipo de respuesta de la API (es un Arreglo)
export type AreaResponse = AreaStructure[];
