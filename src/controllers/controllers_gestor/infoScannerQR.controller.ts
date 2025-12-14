import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import {
  CompararBienes,
  CompararBienesRespuesta,
  LevantamientoRequest,
  ReubicarBienResponse,
  BienDetallado,
} from '@/src/models/types_BienesResponse';
import { useApi } from '@/src/hooks/useApi';

export const useInfoScannerQRController = () => {
  const { authenticatedFetch } = useApi();

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
          const errorData = await respuesta.text();
          let mensajeError = `Error ${respuesta.status}: ${respuesta.statusText}`;
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

  const moverBien = useCallback(
    async (
      credenciales: Access_token,
      payloadMovimiento: {
        id_bien: number;
        nuevo_id_oficina: number;
      },
    ): Promise<ReubicarBienResponse> => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL +
            `/bienes/${payloadMovimiento.id_bien}`,
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
          console.error('Error en moverBien:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  const editarBien = useCallback(
    async (
      credenciales: Access_token,
      updatedBien: BienDetallado,
    ): Promise<ReubicarBienResponse> => {
      try {
        const respuesta = await authenticatedFetch(
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
              bien_descripcion:
                updatedBien.bien_descripcion || 'SIN DESCRIPCION',
              bien_caracteristicas:
                updatedBien.bien_caracteristicas || 'SIN CARACTERISTICAS',
              bien_tipo_adquisicion: updatedBien.bien_tipo_adquisicion,
              bien_valor_monetario: updatedBien.bien_valor_monetario,
            }),
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
          console.error('Error en editarBien:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  const subirLevantamiento = useCallback(
    async (credenciales: Access_token, payloadUpload: LevantamientoRequest) => {
      try {
        const respuesta = await authenticatedFetch(
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
          console.error('Error en subirLevantamiento:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  return {
    compararBienes,
    moverBien,
    editarBien,
    subirLevantamiento,
  };
};
