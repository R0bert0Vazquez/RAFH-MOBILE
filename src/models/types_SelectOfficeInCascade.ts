// --- TIPOS NUEVOS PARA EL MODAL DE SELECCIONAR UNA OFICINA ---

export interface AreaItem {
  id: number;
  area_nombre: string;
  // Agrega otros campos si vienen de la API
}

export interface OficinaSimple {
  id: number;
  nombre: string;
  ofi_codigo: string;
}

export interface DepartamentoItem {
  id: number;
  dep_nombre: string;
  oficinas: OficinaSimple[];
}
