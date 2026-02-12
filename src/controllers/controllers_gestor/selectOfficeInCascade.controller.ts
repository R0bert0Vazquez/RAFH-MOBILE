import { useCallback } from 'react';
import { Access_token } from '@/src/models/types';
import {
  AreaItem,
  DepartamentoItem,
} from '@/src/models/types_SelectOfficeInCascade';

import { useApi } from '@/src/hooks/useApi'; // <--- 1. Importamos el hook global

// 2. Convertimos el archivo en un Hook que exporta las funciones
export const useSelectOfficeInCascadeControllers = () => {
  const { authenticatedFetch } = useApi(); // <--- 3. Obtenemos el fetch con interceptor

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
    getAreas,
    getEstructuraArea,
  };
};
