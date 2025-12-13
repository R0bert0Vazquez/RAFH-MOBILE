// 1. Interfaz para la Oficina dentro de la estructura
export interface StructureOficina {
  id: number;
  nombre: string;
  ofi_codigo: string;
  id_departamento: number;
}

// 2. Interfaz para el Departamento que contiene las oficinas
export interface StructureDepartamento {
  id: number;
  dep_nombre: string;
  dep_codigo: string;
  id_area: number;
  oficinas: StructureOficina[]; // Array de oficinas, puede estar vacío
}

// 3. La respuesta de la API es un arreglo de Departamentos
export type StructureResponse = StructureDepartamento[];
