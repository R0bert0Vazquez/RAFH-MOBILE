// --- Entidades Base ---

export interface Usuario {
  id: number;
  usuario_nombre: string;
  usuario_correo: string;
  usuario_id_rol: number;
  created_at: string;
  updated_at: string;
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
  res_id_usuario: number;
  res_departamento: number;
  id_oficina: number;
  created_at: string | null;
  updated_at: string;
  usuario: Usuario;
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
}

// --- Entidad Principal (Traspaso) ---

export interface Traspaso {
  id: number;
  traspaso_id_bien: number;
  traspaso_id_usuario_origen: number;
  traspaso_id_usuario_destino: number;
  traspaso_fecha_solicitud: string;
  traspaso_estado: string; // Ej: "Aprobada", "Rechazada", "Pendiente"
  traspaso_observaciones: string;
  created_at: string;
  updated_at: string;
  bien: Bien;
  resguardante_origen: Resguardante;
  resguardante_destino: Resguardante;
}

// --- Paginación ---

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
  page?: number | null; // Opcional, útil para lógica frontend
}

export interface MisTransferenciasResponse {
  current_page: number;
  data: Traspaso[];
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
