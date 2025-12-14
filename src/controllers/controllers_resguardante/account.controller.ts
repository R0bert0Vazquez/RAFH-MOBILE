import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
// import { ResguardanteInfo } from '@/src/models/types_InfoResguardante';
import { DashboardResponse } from '@/src/models/types_Resg_Dashboard';
import { useApi } from '@/src/hooks/useApi';

export const useAccountControllers = () => {
  const { authenticatedFetch } = useApi();

  // --- GET: Obtener Info del Resguardante ---
  // const getResguardante = useCallback(
  //   async (
  //     credenciales: Access_token,
  //     id_resguardante: number,
  //   ): Promise<ResguardanteInfo> => {
  //     try {
  //       const respuesta = await authenticatedFetch(
  //         `${process.env.EXPO_PUBLIC_API_URL}/resguardantes/${id_resguardante}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Accept: 'application/json',
  //             Authorization: `Bearer ${credenciales.access_token}`,
  //           },
  //         },
  //       );

  //       // El authenticatedFetch ya maneja el 401.
  //       // Aquí manejamos otros errores específicos de tu lógica original.
  //       if (!respuesta.ok) {
  //         const errorData = await respuesta.text();
  //         let mensajeError = `Error ${respuesta.status}`;
  //         try {
  //           const errorJson = JSON.parse(errorData);
  //           mensajeError = errorJson.message || errorJson.error || mensajeError;
  //         } catch (e) {
  //           console.error('Error al obtener al info del resguardante', e);
  //           if (errorData) mensajeError = errorData;
  //         }
  //         throw new Error(mensajeError);
  //       }
  //       return await respuesta.json();
  //     } catch (err: any) {
  //       // Filtramos el error de autenticación para que no salga doble alerta
  //       if (err.message !== 'Unauthenticated.') {
  //         console.error(err.message || 'No se pudo cargar el historial.');
  //       }
  //       throw err;
  //     }
  //   },
  //   [authenticatedFetch],
  // );

  const getDashboard = useCallback(
    async (credenciales: Access_token): Promise<DashboardResponse> => {
      try {
        const respuesta = await authenticatedFetch(
          `${process.env.EXPO_PUBLIC_API_URL}/resguardante/dashboard`,
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
            console.error('Error al obtener dashboard', e);
            if (errorData) mensajeError = errorData;
          }
          throw new Error(mensajeError);
        }

        return await respuesta.json();
      } catch (err: any) {
        if (err.message !== 'Unauthenticated.') {
          console.error(
            err.message || 'No se pudo cargar la información de cuenta.',
          );
        }
        throw err;
      }
    },
    [authenticatedFetch],
  );

  return {
    getDashboard,
  };
};
