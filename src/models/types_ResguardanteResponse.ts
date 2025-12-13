// 1. Interfaces base (Nivel más profundo)
export interface Edificio {
  id: number;
  nombre: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Area {
  id: number;
  area_codigo: string;
  area_nombre: string;
  id_edificio: number | null;
  id_resguardante_responsable: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// 2. Interfaces intermedias (Contienen referencias a las base)
export interface Oficina {
  id: number;
  id_edificio: number;
  id_departamento: number;
  ofi_codigo: string;
  nombre: string;
  referencia: string | null;
  created_at: string | null;
  updated_at: string | null;
  edificio: Edificio; // Ahora incluye el objeto Edificio
}

export interface Departamento {
  id: number;
  dep_nombre: string;
  dep_codigo: string;
  dep_resposable: string | null; // Puede venir null según tu JSON
  dep_correo_institucional: string | null; // Puede venir null
  id_area: number | null;
  created_at: string | null;
  updated_at: string | null;
  area: Area; // Ahora incluye el objeto Area
}

// 3. Interfaces principales

export interface PaginationLink {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

export interface Resguardante {
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
  id_oficina: number | null;
  created_at: string | null;
  updated_at: string | null;
  usuario_id_rol: number | null;
  departamento: Departamento; // Tipado fuerte
  oficina: Oficina; // Tipado fuerte (antes era any)
}

export interface ResguardanteResponse {
  current_page: number;
  data: Resguardante[];
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

// Interfaz para enviar a la API para insertar un Resguardante
export interface ResguardanteRequest {
  res_nombre: string;
  res_apellidos: string;
  res_puesto: string;
  res_rfc: string;
  res_curp: string | null;
  res_correo: string;
  res_telefono: string;
  res_departamento: number | null;
  id_oficina: number | null;
  nombre_oficina: string | null;
}

// Interfaz para la respuesta exitosa al crear un Resguardante
export interface ResguardanteCreado {
  res_nombre: string;
  res_apellidos: string;
  res_puesto: string;
  res_departamento: number;
  res_rfc: string;
  res_telefono: string;
  id_oficina: number; // En la creación parece venir siempre como número si se asignó
  res_correo: string;
  updated_at: string;
  created_at: string;
  departamento: Departamento;
  oficina: Oficina;
}

// Interfaz para la respuesta exitosa al consultar resguardantes por oficina
export interface ResguardanteSimple {
  id: number;
  res_nombre: string;
  res_apellidos: string;
  res_puesto: string;
  res_rfc: string | null;
  res_curp: string | null;
  res_correo: string | null;
  res_telefono: string;
  res_id_usuario: number | null;
  res_departamento: number;
  id_oficina: number;
  created_at: string;
  updated_at: string;
}

/**
 * Como la respuesta de la API es un array directo [],
 * definimos este tipo para usarlo en la llamada HTTP.
 */
export type ResguardanteListResponse = ResguardanteSimple[];
