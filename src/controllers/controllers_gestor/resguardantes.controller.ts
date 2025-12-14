import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import {
  ResguardanteCreado,
  ResguardanteRequest,
  ResguardanteResponse,
  ResguardanteListResponse,
} from '@/src/models/types_ResguardanteResponse';
import { useApi } from '@/src/hooks/useApi';

export const useResguardantesController = () => {
  const { authenticatedFetch } = useApi();

  const getResguardantes = useCallback(
    async (
      credenciales: Access_token,
      page: number = 1,
    ): Promise<ResguardanteResponse> => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL + `/resguardantes?page=${page}`,
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
            mensajeError =
              errorJson.message ||
              errorJson.error ||
              `Error ${respuesta.status} en el servidor`;
          } catch (e) {
            if (errorData) mensajeError = errorData;
          }
          throw new Error(mensajeError);
        }

        const resultado: ResguardanteResponse = await respuesta.json();
        return resultado;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en getResguardantes:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  const getResguardantesPorOficina = useCallback(
    async (
      credenciales: Access_token,
      id_oficina: number,
    ): Promise<ResguardanteListResponse> => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL +
            `/oficinas/${id_oficina}/resguardantes`,
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
            mensajeError =
              errorJson.message ||
              errorJson.error ||
              `Error ${respuesta.status} en el servidor`;
          } catch (e) {
            if (errorData) mensajeError = errorData;
          }
          throw new Error(mensajeError);
        }

        const resultado: ResguardanteListResponse = await respuesta.json();
        return resultado;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en getResguardantesPorOficina:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  const crearResguardante = useCallback(
    async (
      credenciales: Access_token,
      payloadNuevoResguardante: ResguardanteRequest,
    ): Promise<ResguardanteCreado> => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL + '/resguardantes',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
            body: JSON.stringify({
              res_nombre: payloadNuevoResguardante.res_nombre,
              res_apellidos: payloadNuevoResguardante.res_apellidos,
              res_puesto: payloadNuevoResguardante.res_puesto,
              res_rfc: payloadNuevoResguardante.res_rfc || '',
              res_curp: payloadNuevoResguardante.res_curp || '',
              res_telefono: payloadNuevoResguardante.res_telefono || '',
              res_correo: payloadNuevoResguardante.res_correo || '',
              id_oficina: payloadNuevoResguardante.id_oficina || '',
              res_departamento: payloadNuevoResguardante.res_departamento || '',
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

        const resultado: ResguardanteCreado = await respuesta.json();
        return resultado;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en crearResguardante:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  const crearUsuarioResguardante = useCallback(
    async (
      credenciales: Access_token,
      payloadUsuario: {
        id_persona: number;
        usuario_correo: string;
        usuario_pass: string;
        usuario_id_rol: number;
      },
    ) => {
      try {
        const respuesta = await authenticatedFetch(
          process.env.EXPO_PUBLIC_API_URL +
            `/resguardantes/${payloadUsuario.id_persona}/crear-usuario`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
            body: JSON.stringify({
              usuario_correo: payloadUsuario.usuario_correo,
              usuario_pass: payloadUsuario.usuario_pass,
              usuario_id_rol: payloadUsuario.usuario_id_rol,
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

        const resultado = await respuesta.json();
        return resultado;
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error en crearUsuarioResguardante:', error);
        }
        throw error;
      }
    },
    [authenticatedFetch],
  );

  return {
    getResguardantes,
    getResguardantesPorOficina,
    crearResguardante,
    crearUsuarioResguardante,
  };
};
