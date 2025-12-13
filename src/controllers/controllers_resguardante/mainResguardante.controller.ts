import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import { ResguardanteInfo } from '@/src/models/types_InfoResguardante';
import {
  MisBienesResponse,
  AreaItem,
  DepartamentoItem,
} from '@/src/models/types_MainResguardante';
import { ReubicarBienResponse } from '@/src/models/types_BienesResponse';
import { ResguardanteBusquedaResponse } from '@/src/models/types_BuscarResguardanteResponse';
import { useApi } from '@/src/hooks/useApi'; // <--- 1. Importamos el hook global

// 2. Convertimos el archivo en un Hook que exporta las funciones
export const useMainResguardanteControllers = () => {
  const { authenticatedFetch } = useApi(); // <--- 3. Obtenemos el fetch con interceptor

  // --- GET: Obtener Info del Resguardante ---
  const getResguardante = useCallback(
    async (
      credenciales: Access_token,
      id_resguardante: number,
    ): Promise<ResguardanteInfo> => {
      try {
        const respuesta = await authenticatedFetch(
          `${process.env.EXPO_PUBLIC_API_URL}/resguardantes/${id_resguardante}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
          },
        );

        // authenticatedFetch ya maneja el 401, validamos el resto
        if (!respuesta.ok) {
          throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        return await respuesta.json();
      } catch (err: any) {
        // 5. Filtramos el error de autenticación para que no salga doble alerta
        if (err.message !== 'Unauthenticated.') {
          console.error(
            err.message || 'No se pudo cargar la información del resguardante.',
          );
        }
        throw err;
      }
    },
    [authenticatedFetch],
  );

  // --- GET: Obtener Bienes (Paginado y con Filtros) ---
  const getResguardos_Resguardante = useCallback(
    async (
      credenciales: Access_token,
      page: number = 1,
      search: string = '',
      estado: string = '',
      categoria: string = '',
    ): Promise<MisBienesResponse> => {
      try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        if (search) params.append('search', search);
        if (estado && estado !== 'sin-filtro') params.append('estado', estado);
        if (categoria) params.append('categoria', categoria);

        const url = `${process.env.EXPO_PUBLIC_API_URL}/mis-bienes?${params.toString()}`;

        const respuesta = await authenticatedFetch(url, {
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
      } catch (err: any) {
        if (err.message !== 'Unauthenticated.') {
          console.error(err.message || 'No se pudo cargar la información.');
        }
        throw err;
      }
    },
    [authenticatedFetch],
  );

  // --- GET: Buscar Resguardantes por Nombre ---
  const buscarResguardantes = useCallback(
    async (
      credenciales: Access_token,
      query: string,
    ): Promise<ResguardanteBusquedaResponse> => {
      try {
        const encodedQuery = encodeURIComponent(query);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/resguardantes/search?query=${encodedQuery}`;

        console.log('🔍 Buscando resguardantes:', url);

        const respuesta = await authenticatedFetch(url, {
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
    },
    [authenticatedFetch],
  );

  // --- PUT: Mover Bien (Cambio de Oficina) ---
  const moverBien = useCallback(
    async (
      credenciales: Access_token,
      payloadMovimiento: { id_bien: number; nuevo_id_oficina: number },
    ): Promise<ReubicarBienResponse> => {
      try {
        const respuesta = await authenticatedFetch(
          `${process.env.EXPO_PUBLIC_API_URL}/bienes/${payloadMovimiento.id_bien}`,
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
    },
    [authenticatedFetch],
  );

  // --- POST: Solicitar Traspaso ---
  const solicitarTraspaso = useCallback(
    async (
      credenciales: Access_token,
      payloadTraspaso: {
        traspaso_id_bien: number;
        traspaso_id_usuario_destino: number;
        traspaso_observaciones: string;
      },
    ): Promise<any> => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/traspasos`;
        console.log('📤 Creando Solicitud de Traspaso (POST):', url);

        const respuesta = await authenticatedFetch(url, {
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
            throw new Error(
              errorJson.message || 'Error al solicitar el traspaso.',
            );
          } catch (e) {
            console.error('Error al Solicitar Traspaso:', e);
            throw new Error('Error al solicitar el traspaso del bien.');
          }
        }

        return await respuesta.json();
      } catch (error) {
        console.error('Error en solicitarTraspaso:', error);
        throw error;
      }
    },
    [authenticatedFetch],
  );

  // --- PUT: Regresar Bien (Cancelar tránsito) ---
  const regresarBien = useCallback(
    async (credenciales: Access_token, id_bien: number): Promise<boolean> => {
      try {
        const respuesta = await authenticatedFetch(
          `${process.env.EXPO_PUBLIC_API_URL}/bienes/${id_bien}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${credenciales.access_token}`,
            },
            body: JSON.stringify({ accion: 'regresar' }),
          },
        );

        if (!respuesta.ok) throw new Error('Error al regresar el bien.');
        return true;
      } catch (error) {
        console.error('Error en regresarBien:', error);
        // Aquí retornamos false en lugar de throw, tal como estaba tu lógica original
        return false;
      }
    },
    [authenticatedFetch],
  );

  // --- GET: Obtener Areas ---
  const getAreas = useCallback(
    async (credenciales: Access_token): Promise<AreaItem[]> => {
      const response = await authenticatedFetch(
        `${process.env.EXPO_PUBLIC_API_URL}/areas`,
        {
          headers: { Authorization: `Bearer ${credenciales.access_token}` },
        },
      );
      if (!response.ok) throw new Error('Error al cargar áreas');
      const data = await response.json();
      return Array.isArray(data) ? data : data.data;
    },
    [authenticatedFetch],
  );

  // --- GET: Obtener Estructura de un Área ---
  const getEstructuraArea = useCallback(
    async (
      credenciales: Access_token,
      areaId: number,
    ): Promise<DepartamentoItem[]> => {
      const response = await authenticatedFetch(
        `${process.env.EXPO_PUBLIC_API_URL}/areas/${areaId}/structure`,
        {
          headers: { Authorization: `Bearer ${credenciales.access_token}` },
        },
      );
      if (!response.ok) throw new Error('Error al cargar estructura del área');
      const data = await response.json();
      return Array.isArray(data) ? data : data.data;
    },
    [authenticatedFetch],
  );

  // Retornamos todas las funciones
  return {
    getResguardante,
    getResguardos_Resguardante,
    buscarResguardantes,
    moverBien,
    solicitarTraspaso,
    regresarBien,
    getAreas,
    getEstructuraArea,
  };
};
