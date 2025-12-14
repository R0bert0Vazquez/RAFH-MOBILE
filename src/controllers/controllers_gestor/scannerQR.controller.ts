// import { Access_token } from '@/src/models/types';

// import {
//   CompararBienes,
//   CompararBienesRespuesta,
// } from '@/src/models/types_BienesResponse';

// /**
//  * Envía la lista de códigos QR escaneados a la API.
//  * @param qrCodes - Un arreglo de strings (los datos de los QR)
//  * @returns - La respuesta JSON del servidor
//  */
// export const SubmitInventory = async (
//   credenciales: Access_token,
//   qrCodes: string[],
// ) => {
//   console.log('Enviando inventario por lotes:', qrCodes);

//   // Preparamos el body en el formato JSON que tu API espera
//   const body = JSON.stringify({
//     // El nombre de la llave "codes" es un ejemplo,
//     // ajústalo a lo que tu backend espere
//     codes: qrCodes,
//   });

//   try {
//     const response = await fetch(
//       process.env.EXPO_PUBLIC_API_URL + '/inventario',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           Authorization: `Bearer ${credenciales.access_token}`,
//         },
//         body: body,
//       },
//     );

//     if (!response.ok) {
//       // Si la respuesta no es 2xx (ej. 404, 500), lanza un error
//       const errorText = await response.text();
//       throw new Error(`Error de API (${response.status}): ${errorText}`);
//     }

//     // Parsea y devuelve la respuesta JSON
//     const data = await response.json();
//     console.log('Respuesta de la API recibida:', data);
//     return data;
//   } catch (error) {
//     console.error('Error en submitInventory:', error);
//     // Re-lanza el error para que el componente (QR.tsx) lo pueda atrapar en su 'catch'
//     throw error;
//   }
// };

// /**
//  * @param credenciales - El token del usuario para solicitar la informacion del dashboard
//  * @returns Una promesa que se resuelve con el token, regresa la informacion
//  * @throws Lanza un error si las credenciales son incorrectas o hay un error
//  */
// export async function compararBienes(
//   credenciales: Access_token,
//   compararBienes: CompararBienes,
// ): Promise<CompararBienesRespuesta> {
//   try {
//     const respuesta = await fetch(
//       process.env.EXPO_PUBLIC_API_URL + '/inventario/comparar',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           Authorization: `Bearer ${credenciales.access_token}`,
//         },
//         body: JSON.stringify(compararBienes),
//       },
//     );

//     if (!respuesta.ok) {
//       throw new Error('Error en el servidor, Itenta de nuevo más tarde');
//     }

//     const CompararBienesRespuesta: CompararBienesRespuesta =
//       await respuesta.json();
//     return CompararBienesRespuesta;
//   } catch (error) {
//     console.error('Error en el compararBienes:', error);
//     throw error;
//   }
// }

import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import {
  CompararBienes,
  CompararBienesRespuesta,
} from '@/src/models/types_BienesResponse';
import { useApi } from '@/src/hooks/useApi';

export const useScannerQRController = () => {
  const { authenticatedFetch } = useApi();

  /**
   * Envía la lista de códigos QR escaneados a la API.
   * @param credenciales - Token de acceso
   * @param qrCodes - Arreglo de strings con los códigos
   */
  const SubmitInventory = useCallback(
    async (credenciales: Access_token, qrCodes: string[]) => {
      console.log('Enviando inventario por lotes:', qrCodes);

      const body = JSON.stringify({
        codes: qrCodes,
      });

      try {
        const response = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL + '/inventario',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
            body: body,
          },
        );

        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta de la API recibida:', data);
        return data;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error(error.message || 'No se pudo enviar el inventario.');
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  /**
   * Compara los bienes escaneados con lo esperado.
   */
  const compararBienes = useCallback(
    async (
      credenciales: Access_token,
      compararBienesData: CompararBienes,
    ): Promise<CompararBienesRespuesta> => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL + '/inventario/comparar',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
            body: JSON.stringify(compararBienesData),
          },
        );

        if (!respuesta.ok) {
          throw new Error('Error en el servidor, intenta de nuevo más tarde');
        }

        const resultado: CompararBienesRespuesta = await respuesta.json();
        return resultado;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en compararBienes:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  return {
    SubmitInventory,
    compararBienes,
  };
};
