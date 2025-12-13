import { useState, useCallback, useEffect } from 'react';
import { User } from '@/src/models/types';
import { DashboardResponse } from '@/src/models/types_Resg_Dashboard';
import { useApi } from '@/src/hooks/useApi'; // <--- Importamos el hook nuevo

// --- Hook Controlador (Lógica de Estado) ---
export const useResgDashboard = (access_token: string, user: User) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtenemos nuestro fetch mejorado
  const { authenticatedFetch } = useApi();

  const [dashboardData, setDashboardData] = useState<DashboardResponse>({
    contadores: {
      bienes: 0,
      movimientos: 0,
      transferencias: 0,
    },
    info: {
      oficina: 'Cargando...',
      departamento: 'Cargando...',
    },
    ultimos_movimientos: [],
  });

  const fetchData = useCallback(async () => {
    setError(null);

    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/resguardante/dashboard`;

      // Usamos authenticatedFetch en lugar de fetch normal
      const respuesta = await authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }

      const data: DashboardResponse = await respuesta.json();
      console.log('Dashboard data fetchData:', JSON.stringify(data, null, 2));
      setDashboardData(data);
    } catch (err: any) {
      // Si es 401, el hook authenticatedFetch ya activó el modal global.
      // Aquí solo manejamos otros errores para mostrar en la UI si es necesario.
      if (err.message !== 'Unauthenticated.') {
        setError(err.message || 'No se pudo cargar la información.');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [access_token, authenticatedFetch]);

  // --- Carga inicial (AQUÍ ESTÁ EL CAMBIO) ---
  useEffect(() => {
    let isActive = true; // Buena práctica para evitar setState en componente desmontado

    fetchData();

    return () => {
      isActive = false;
    };

    // ANTES: [fetchData] <-- Esto causaba el bucle
    // AHORA: Solo depende del token.
  }, [access_token]);

  // Función para Pull-to-Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Formateadores de datos para la vista
  const getUserName = () => {
    if (!user.usuario_nombre) return 'Usuario';
    return user.usuario_nombre.split(' ')[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMovementTypeConfig = (type: string) => {
    const cleanType = type ? type.replace(/_/g, ' ').toUpperCase() : 'N/A';

    switch (cleanType) {
      case 'TRASLADO FISICO':
      case 'TRASLADO':
        return { label: 'Traslado', color: '#10B981', icon: 'truck-delivery' };
      case 'BAJA':
        return {
          label: 'Baja',
          color: '#EF4444',
          icon: 'arrow-down-bold-circle',
        };
      case 'ASIGNACION':
      case 'ALTA':
        return {
          label: 'Asignación',
          color: '#3B82F6',
          icon: 'clipboard-check',
        };
      default:
        return {
          label: cleanType,
          color: '#6B7280',
          icon: 'file-document-outline',
        };
    }
  };

  return {
    isLoading,
    refreshing,
    error,
    dashboardData,
    onRefresh,
    getUserName,
    formatDate,
    getMovementTypeConfig,
  };
};
