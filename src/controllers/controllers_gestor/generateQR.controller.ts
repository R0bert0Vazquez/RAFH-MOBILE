import { Access_token } from '@/src/models/types';

import {
  CompararBienes,
  CompararBienesRespuesta,
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
      throw new Error('Error en el servidor, Itenta de nuevo más tarde');
    }

    const CompararBienesRespuesta: CompararBienesRespuesta =
      await respuesta.json();
    return CompararBienesRespuesta;
  } catch (error) {
    console.error('Error en el compararBienes:', error);
    throw error;
  }
}
