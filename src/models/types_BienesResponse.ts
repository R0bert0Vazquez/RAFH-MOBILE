export interface DataBien {
  id: number;
  bien_codigo: string;
  bien_estado: string;
  bien_ubicacion_actual: string;
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
}

/*
export interface CompararBienesRespuesta {
  resumen: {
    total_esperados: number;
    total_escaneados: number;
    conteo_encontrados: number;
    conteo_faltantes: number;
    conteo_sobrantes: number;
  };
  encontrados: {
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
    created_at: string | null;
    updated_at: string | null;
    oficina: {
      id: number;
      id_edificio: number;
      id_departamento: number;
      ofi_codigo: string;
      nombre: string;
      referencia: string | null;
      created_at: string;
      updated_at: string;
      departamento: {
        id: number;
        dep_nombre: string;
      };
    };
  }[];

  faltantes: {
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
    created_at: string | null;
    updated_at: string | null;
    oficina: {
      id: number;
      id_edificio: number;
      id_departamento: number;
      ofi_codigo: string;
      nombre: string;
      referencia: string | null;
      created_at: string;
      updated_at: string;
      departamento: {
        id: number;
        dep_nombre: string;
      };
    };
  }[];
  sobrantes: {
    id: number;
    codigo: string;
    descripcion: string;
    resguardante: string;
    departamento_resguardante: string;
    oficina_pertenencia: string;
    ubicacion_actual: string;
  }[];
}
*/

//--------------------------------------------------
/** Response ---> /inventario/comparar */
//--------------------------------------------------
export interface CompararBienes {
  id_oficina: number;
  claves_escaneadas: string[];
}

export interface UbicacionActualInfo {
  id: number;
  nombre: string;
}

export interface DepartamentoInfo {
  id: number;
  dep_nombre: string;
}

export interface OficinaInfo {
  id: number;
  id_edificio: number;
  id_departamento: number;
  ofi_codigo: string;
  nombre: string;
  referencia: string | null;
  created_at: string;
  updated_at: string;
  departamento: DepartamentoInfo;
}

export interface BienDetallado {
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
  created_at: string | null;
  updated_at: string | null;
  oficina: OficinaInfo;
  ubicacion_actual: UbicacionActualInfo;
}

export interface SobranteDetallado {
  id: number;
  codigo: string;
  descripcion: string;
  resguardante: string;
  departamento_resguardante: string;
  oficina_pertenencia: string;
  ubicacion_actual: string;
}

export interface ResumenComparacion {
  total_esperados: number;
  total_escaneados: number;
  conteo_encontrados: number;
  conteo_faltantes: number;
  conteo_sobrantes: number;
}

export interface CompararBienesRespuesta {
  resumen: ResumenComparacion;
  encontrados: BienDetallado[];
  faltantes: BienDetallado[];
  sobrantes: SobranteDetallado[];
}

//--------------------------------------------------
/** Response ---> /bienes/${id}
 * Accion --> Mover
 */
//--------------------------------------------------
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
  created_at: string | null;
  updated_at: string | null;
}

export interface ReubicarBienResponse {
  message: string;
  data: Bien;
}

//--------------------------------------------------
// Response ---> /inventario/levantamiento
//--------------------------------------------------
export interface BienEditadoRequest {
  id: number;
  bien_marca?: string;
  bien_modelo?: string;
  bien_serie?: string;
  bien_descripcion?: string;
  bien_caracteristicas?: string;
}

export interface BienMovidoRequest {
  id: number;
  accion: 'EN_TRANSITO';
  id_oficina_destino: number;
}

export interface BienSinCambiosRequest {
  id: number;
}

// Unión de tipos para el array de encontrados
export type EncontradoItemRequest =
  | BienEditadoRequest
  | BienMovidoRequest
  | BienSinCambiosRequest;

export interface BienFaltanteRequest {
  id: number;
  accion: 'EXTRAVIADO' | 'EN_TRANSITO' | 'ACTIVO'; // Agregamos ACTIVO por si acaso
  id_oficina_destino?: number; // Solo si accion es EN_TRANSITO
}

export type AccionSobrante = 'ACTUALIZAR_AQUI' | 'REGRESAR_ORIGEN';

export interface BienSobranteRequest {
  id: number;
  accion: AccionSobrante;
}

export interface LevantamientoRequest {
  id_oficina_levantamiento: number;
  encontrados: EncontradoItemRequest[];
  faltantes: BienFaltanteRequest[];
  sobrantes: BienSobranteRequest[];
}
