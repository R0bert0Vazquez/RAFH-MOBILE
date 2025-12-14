import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import {
  CompararBienes,
  CompararBienesRespuesta,
} from '@/src/models/types_BienesResponse';
import { useApi } from '@/src/hooks/useApi';

export const useGenerateQRController = () => {
  const { authenticatedFetch } = useApi();

  /**
   * @param credenciales - El token del usuario para solicitar la informacion
   * @returns Una promesa que se resuelve con la respuesta de comparación
   * @throws Lanza un error si las credenciales son incorrectas o hay un error
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
          throw new Error('Error en el servidor, Intenta de nuevo más tarde');
        }

        const resultado: CompararBienesRespuesta = await respuesta.json();
        return resultado;
      } catch (error: any) {
        // Ignoramos el error de autenticación para no duplicar alertas
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en el compararBienes:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  return {
    compararBienes,
  };
};
