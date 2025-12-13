import { Access_token } from '@/src/models/types';

import {
  BienDetallado,
  CompararBienes,
  CompararBienesRespuesta,
  LevantamientoRequest,
  ReubicarBienResponse,
} from '@/src/models/types_BienesResponse';

/**
 * @param credenciales - El token del usuario para solicitar la informacion del dashboard
 * @returns Una promesa que se resuelve con el token, regresa la informacion
 * @throws Lanza un error si las credenciales son incorrectas o hay un error
 */
export async function compararBienes(
  credenciales: Access_token,
  compararBienes: CompararBienes,
): Promise<CompararBienesRespuesta> {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + '/inventario/comparar',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
        body: JSON.stringify(compararBienes),
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

    const resultado: CompararBienesRespuesta = await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en el compararBienes:', error);
    throw error;
  }
}

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

    const resultado: ReubicarBienResponse = await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en el moverBien:', error);
    throw error;
  }
}

export async function editarBien(
  credenciales: Access_token,
  updatedBien: BienDetallado,
): Promise<ReubicarBienResponse> {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + `/bienes/${updatedBien.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
        body: JSON.stringify({
          accion: 'editar_info',
          bien_marca: updatedBien.bien_marca || 'SIN MARCA',
          bien_modelo: updatedBien.bien_modelo || 'SIN MODELO',
          bien_serie: updatedBien.bien_serie || 'SIN SERIE',
          bien_descripcion: updatedBien.bien_descripcion || 'SIN DESCRIPCION',
          bien_caracteristicas:
            updatedBien.bien_caracteristicas || 'SIN CARACTERISTICAS',
          bien_tipo_adquisicion: updatedBien.bien_tipo_adquisicion,
          bien_valor_monetario: updatedBien.bien_valor_monetario,
        }),
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

    const resultado: ReubicarBienResponse = await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en el editarBien:', error);
    throw error;
  }
}

export async function subirLevantamiento(
  credenciales: Access_token,
  payloadUpload: LevantamientoRequest,
) {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + '/inventario/levantamiento',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
        body: JSON.stringify(payloadUpload),
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

    const resultado = await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en el editarBien:', error);
    throw error;
  }
}
