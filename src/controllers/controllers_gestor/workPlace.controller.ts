import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import { DashboardResponse } from '@/src/models/types_DashboardGestor';
import { useApi } from '@/src/hooks/useApi';

export const useWorkPlaceController = () => {
  const { authenticatedFetch } = useApi();

  const getDashboard = useCallback(
    async (credenciales: Access_token): Promise<DashboardResponse> => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL + '/dashboard',
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
          throw new Error('Error en el servidor, Intenta de nuevo más tarde');
        }

        const dashboardWorkPlace: DashboardResponse = await respuesta.json();
        return dashboardWorkPlace;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error del getDashboard:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  const handleDecision = useCallback(
    async (
      credenciales: Access_token,
      id_traspaso: number,
      nuevoEstado: string,
    ) => {
      try {
        console.log('Credenciales:', credenciales);
        console.log('ID del traspaso:', id_traspaso);
        console.log('Estado:', nuevoEstado);

        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL + `/traspasos/${id_traspaso}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
            body: JSON.stringify({ estado: nuevoEstado }),
          },
        );

        if (!respuesta.ok) {
          const errorData = await respuesta.text();
          let mensajeError = `Error ${respuesta.status}`;
          try {
            const errorJson = JSON.parse(errorData);
            mensajeError =
              errorJson.message ||
              errorJson.error ||
              `Error ${respuesta.status} en el servidor`;
          } catch (e) {
            if (errorData) mensajeError = errorData;
          }
          throw new Error(mensajeError);
        }

        return await respuesta.json();
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en handleDecision:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  return {
    getDashboard,
    handleDecision,
  };
};
