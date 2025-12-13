/**
 * Estadísticas generales mostradas en la parte superior del dashboard.
 */
export interface DashboardStats {
  bienes_registrados: number;
  gestores_asignados: number;
  areas_asociadas: number;
  resguardantes_registrados: number;
  departamentos_totales: number;
  oficinas_totales: number;
}

/**
 * Información del último bien dado de alta.
 */
export interface UltimoBienRegistrado {
  nombre: string;
  cantidad: number;
}

/**
 * Detalles de una notificación (ej. traspasos pendientes o recientes).
 * Nota: En tu JSON aparece como un objeto único, no un array.
 */
export interface NotificacionDashboard {
  id_traspaso: number;
  bien_nombre: string;
  emisor: string;
  receptor: string;
}

/**
 * Detalle de los movimientos recientes (Altas, Movimientos, Bajas, etc.).
 */
export interface MovimientoReciente {
  tipo: string; // Ej: "MOVIMIENTO", "ALTA"
  bien_involucrado: string;
  gestor_encargado: string;
  resguardante_responsable: string;
  area: string;
}

/**
 * Resumen de bienes agrupados por su estado.
 */
export interface EstadoBienResumen {
  bien_estado: string; // Ej: "Activo", "En tránsito"
  total: number;
  foto_url: string | null;
}

/**
 * Respuesta principal del endpoint del Dashboard.
 */
export interface DashboardResponse {
  stats: DashboardStats;
  ultimo_bien_registrado: UltimoBienRegistrado | null; // Puede ser null si no hay registros
  ultima_transferencia: any | null; // Viene null en el ejemplo, tipado como any | null por seguridad
  notificaciones: NotificacionDashboard | null; // Puede ser null si no hay notificaciones
  ultimos_movimientos: MovimientoReciente[];
  estados_bienes: EstadoBienResumen[];
}
