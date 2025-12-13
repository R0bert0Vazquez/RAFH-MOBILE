// --- Interfaces para Respuesta de Resguardos ---
export interface BienResguardado {
  id: number;
  bien_codigo: string;
  id_oficina: number;
  bien_estado: string; // Ej: "Activo"
  bien_marca: string;
  bien_modelo: string;
  bien_serie: string;
  bien_descripcion: string;
  bien_caracteristicas: string;
  bien_tipo_adquisicion: string; // Viene como string en el JSON ("1", "3")
  bien_fecha_alta: string;
  bien_valor_monetario: string; // Viene como string decimal ("4000.00")
  bien_clave: string;
  bien_y: string;
  bien_secuencia: string;
  bien_provedor: string;
  bien_numero_factura: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id_resguardante: number;
  bien_ubicacion_actual: number;
  bien_foto: string | null;
  foto_url: string | null;
  traspaso_pendiente: null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

export interface BienesResguardanteResponseVerResguardos {
  current_page: number;
  data: BienResguardado[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// --- Interfaces para ResguardanteInfo ---

export interface EdificioInfo {
  id: number;
  nombre: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AreaInfo {
  id: number;
  area_codigo: string;
  area_nombre: string;
  id_edificio: number | null;
  id_resguardante_responsable: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DepartamentoInfo {
  id: number;
  dep_nombre: string;
  dep_codigo: string;
  dep_resposable: string | null;
  dep_correo_institucional: string | null;
  id_area: number | null;
  created_at: string | null;
  updated_at: string | null;
  area: AreaInfo;
}

export interface OficinaInfo {
  id: number;
  id_edificio: number;
  id_departamento: number;
  ofi_codigo: string;
  nombre: string;
  referencia: string | null;
  created_at: string | null;
  updated_at: string | null;
  edificio: EdificioInfo;
}

export interface ResguardanteInfo {
  id: number;
  res_nombre: string;
  res_apellidos: string;
  res_puesto: string;
  res_rfc: string;
  res_curp: string | null;
  res_correo: string;
  res_telefono: string;
  res_id_usuario: number | null;
  res_departamento: number;
  id_oficina: number;
  created_at: string | null;
  updated_at: string | null;
  departamento: DepartamentoInfo;
  usuario: any | null; // null en el ejemplo, puede ser definido si se conoce la estructura
  oficina: OficinaInfo;
}
