export interface Contadores {
  bienes: number;
  movimientos: number;
  transferencias: number;
}

export interface Info {
  oficina: string;
  departamento: string;
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

export interface DashboardResponse {
  contadores: Contadores;
  info: Info;
  ultimos_movimientos: Movimiento[];
}
