export interface Oficina {
  id: number;
  id_edificio: number;
  id_departamento: number;
  ofi_codigo: string;
  nombre: string;
  referencia: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bien {
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
  oficina: Oficina; // Nueva relación anidada
}

export interface Departamento {
  id: number;
  dep_nombre: string;
  dep_codigo: string;
  dep_resposable: string | null;
  dep_correo_institucional: string | null;
  id_area: number;
  created_at: string;
  updated_at: string;
}

export interface Movimiento {
  id: number;
  movimiento_id_bien: number;
  movimiento_id_dep: number;
  movimiento_fecha: string;
  movimiento_tipo: string;
  movimiento_cantidad: number;
  movimiento_id_usuario_origen: number;
  movimiento_id_usuario_destino: number;
  movimiento_id_usuario_autorizado: number;
  movimiento_observaciones: string;
  created_at: string;
  updated_at: string;
  bien: Bien;
  departamento: Departamento;
}

// Interfaces para la Paginación de Laravel
export interface PaginationLink {
  url: string | null;
  label: string;
  page?: number | null; // A veces viene, a veces no, útil para lógica frontend
  active: boolean;
}

export interface MisMovimientosResponse {
  current_page: number;
  data: Movimiento[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
