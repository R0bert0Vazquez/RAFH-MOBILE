import { Access_token } from '@/src/models/types';

import {
  ResguardanteInfo,
  BienesResguardanteResponseVerResguardos,
} from '@/src/models/types_InfoResguardante';

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
      let mensajeError = `Error ${respuesta.status}: ${respuesta.statusText}`;

      try {
        const errorJson = JSON.parse(errorData);
        console.error('Detalle del error del servidor:', errorJson);
        mensajeError =
          errorJson.message ||
          errorJson.error ||
          `Error ${respuesta.status} en el servidor`;
      } catch (e) {
        console.error('Respuesta de error (texto):', errorData);
        if (errorData) mensajeError = errorData;
      }

      throw new Error(mensajeError);
    }
    const resultado: ResguardanteInfo = await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en el compararBienes:', error);
    throw error;
  }
}

/**
 * Obtiene los bienes asignados a un resguardante con paginación.
 */
export async function getResguardos_Resguardante(
  credenciales: Access_token,
  id_resguardante: number,
  page: number = 1,
): Promise<BienesResguardanteResponseVerResguardos> {
  try {
    // Concatenamos el parámetro page a la URL
    const url =
      process.env.EXPO_PUBLIC_API_URL +
      `/resguardantes/${id_resguardante}/bienes?page=${page}`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.text();
      let mensajeError = `Error ${respuesta.status}: ${respuesta.statusText}`;

      try {
        const errorJson = JSON.parse(errorData);
        console.error('Detalle del error del servidor:', errorJson);
        mensajeError =
          errorJson.message ||
          errorJson.error ||
          `Error ${respuesta.status} en el servidor`;
      } catch (e) {
        console.error('Respuesta de error (texto):', errorData);
        if (errorData) mensajeError = errorData;
      }

      throw new Error(mensajeError);
    }
    const resultado: BienesResguardanteResponseVerResguardos =
      await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en getResguardos_Resguardante:', error);
    throw error;
  }
}
