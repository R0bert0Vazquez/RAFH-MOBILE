import { Access_token } from '@/src/models/types';
import { ResguardanteInfo } from '@/src/models/types_InfoResguardante';

import {
  MisBienesResponse,
  AreaItem,
  DepartamentoItem,
} from '@/src/models/types_MainResguardante';
import { ReubicarBienResponse } from '@/src/models/types_BienesResponse';
import { ResguardanteBusquedaResponse } from '@/src/models/types_BuscarResguardanteResponse';

// --- GET: Obtener Info del Resguardante ---
export async function getResguardante(
  credenciales: Access_token,
  id_resguardante: number,
): Promise<ResguardanteInfo> {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + `/resguardantes/${id_resguardante}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
      },
    );

    if (!respuesta.ok) {
      const errorData = await respuesta.text();
      let mensajeError = `Error ${respuesta.status}`;
      try {
        const errorJson = JSON.parse(errorData);
        mensajeError = errorJson.message || errorJson.error || mensajeError;
      } catch (e) {
        console.error('Error al obtener al info del resguardante', e);
        if (errorData) mensajeError = errorData;
      }
      throw new Error(mensajeError);
    }
    return await respuesta.json();
  } catch (error) {
    console.error('Error en getResguardante:', error);
    throw error;
  }
}

// --- GET: Obtener Bienes (Paginado y con Filtros) ---
export async function getResguardos_Resguardante(
  credenciales: Access_token,
  page: number = 1,
  search: string = '',
  estado: string = '',
  categoria: string = '',
): Promise<MisBienesResponse> {
  try {
    // Construimos los params dinámicamente
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    if (estado && estado !== 'sin-filtro') params.append('estado', estado);
    if (categoria) params.append('categoria', categoria);

    const url = `${process.env.EXPO_PUBLIC_API_URL}/mis-bienes?${params.toString()}`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (!respuesta.ok) {
      throw new Error(
        `Error ${respuesta.status}: No se pudieron cargar los bienes.`,
      );
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en getResguardos_Resguardante:', error);
    throw error;
  }
}

// --- GET: Buscar Resguardantes por Nombre ---
export async function buscarResguardantes(
  credenciales: Access_token,
  query: string,
): Promise<ResguardanteBusquedaResponse> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url =
      process.env.EXPO_PUBLIC_API_URL +
      `/resguardantes/search?query=${encodedQuery}`;

    console.log('🔍 Buscando resguardantes:', url);

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (!respuesta.ok) {
      throw new Error('Error al buscar resguardantes.');
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en buscarResguardantes:', error);
    throw error;
  }
}

// --- PUT: Mover Bien (Cambio de Oficina) ---
export async function moverBien(
  credenciales: Access_token,
  payloadMovimiento: {
    id_bien: number;
    nuevo_id_oficina: number;
  },
): Promise<ReubicarBienResponse> {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + `/bienes/${payloadMovimiento.id_bien}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
        body: JSON.stringify({
          accion: 'mover',
          nuevo_id_oficina: payloadMovimiento.nuevo_id_oficina,
        }),
      },
    );

    if (!respuesta.ok) {
      const err = await respuesta.json().catch(() => ({}));
      throw new Error(
        err.message || 'Error al solicitar el movimiento del bien.',
      );
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error en moverBien:', error);
    throw error;
  }
}

// --- POST: Solicitar Traspaso
export async function solicitarTraspaso(
  credenciales: Access_token,
  payloadTraspaso: {
    traspaso_id_bien: number;
    traspaso_id_usuario_destino: number;
    traspaso_observaciones: string;
  },
): Promise<any> {
  try {
    const url = process.env.EXPO_PUBLIC_API_URL + `/traspasos`;

    console.log('📤 Creando Solicitud de Traspaso (POST):', url);

    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
      body: JSON.stringify(payloadTraspaso),
    });

    if (!respuesta.ok) {
      const errorText = await respuesta.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Error al solicitar el traspaso.');
      } catch (e) {
        console.error('Error al Solicitar Traspaso:', e);
        throw new Error('Error al solicitar el traspaso del bien.');
      }
    }

    const json = await respuesta.json();
    return json;
  } catch (error) {
    console.error('Error en solicitarTraspaso:', error);
    throw error;
  }
}

// --- PUT: Regresar Bien (Cancelar tránsito) ---
export async function regresarBien(
  credenciales: Access_token,
  id_bien: number,
): Promise<boolean> {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + `/bienes/${id_bien}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
        body: JSON.stringify({
          accion: 'regresar',
        }),
      },
    );

    if (!respuesta.ok) throw new Error('Error al regresar el bien.');

    return true;
  } catch (error) {
    console.error('Error en regresarBien:', error);
    return false;
  }
}

// --- GET: Obtener Areas ---
export async function getAreas(
  credenciales: Access_token,
): Promise<AreaItem[]> {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/areas`, {
    headers: { Authorization: `Bearer ${credenciales.access_token}` },
  });
  if (!response.ok) throw new Error('Error al cargar áreas');
  const data = await response.json();
  return Array.isArray(data) ? data : data.data; // Ajuste según tu respuesta API
}

// --- GET: Obtener Estructura de un Área (Departamentos y Oficinas) ---
export async function getEstructuraArea(
  credenciales: Access_token,
  areaId: number,
): Promise<DepartamentoItem[]> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/areas/${areaId}/structure`,
    {
      headers: { Authorization: `Bearer ${credenciales.access_token}` },
    },
  );
  if (!response.ok) throw new Error('Error al cargar estructura del área');
  const data = await response.json();
  return Array.isArray(data) ? data : data.data;
}
