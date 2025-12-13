/**
 * Detalles de la ubicación física actual del bien (Oficina).
 */
export interface UbicacionActual {
  id: number;
  id_edificio: number;
  id_departamento: number;
  ofi_codigo: string;
  nombre: string;
  referencia: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Información del traspaso si existe uno en proceso.
 */
export interface TraspasoPendiente {
  id: number;
  traspaso_id_bien: number;
  traspaso_id_usuario_origen: number;
  traspaso_id_usuario_destino: number;
  traspaso_fecha_solicitud: string;
  traspaso_estado: string; // Ej: "Pendiente"
  traspaso_observaciones: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Representa un bien asignado al usuario actual.
 */
export interface BienResguardado {
  id: number;
  bien_codigo: string;
  id_oficina: number;
  bien_estado: string;
  bien_marca: string;
  bien_modelo: string;
  bien_serie: string;
  bien_descripcion: string;
  bien_caracteristicas: string;
  bien_tipo_adquisicion: string;
  bien_fecha_alta: string;
  bien_valor_monetario: string;
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

  // Objetos anidados
  ubicacion_actual: UbicacionActual;

  // Puede ser null si no hay traspaso, o el objeto con info si lo hay
  traspaso_pendiente: TraspasoPendiente | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

/**
 * Respuesta principal del endpoint /api/mis-bienes
 */
export interface MisBienesResponse {
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

// --- TIPOS NUEVOS PARA EL MODAL DE MOVER ---

export interface AreaItem {
  id: number;
  area_nombre: string;
  // Agrega otros campos si vienen de la API
}

export interface OficinaSimple {
  id: number;
  nombre: string;
}

export interface DepartamentoItem {
  id: number;
  dep_nombre: string;
  oficinas: OficinaSimple[];
}
