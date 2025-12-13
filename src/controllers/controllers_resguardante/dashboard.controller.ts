import { useState, useCallback, useEffect } from 'react';
import { Access_token, User } from '@/src/models/types';
import { DashboardResponse } from '@/src/models/types_Resg_Dashboard';

// --- Servicio API ---
export async function getDashboard(
  credenciales: Access_token,
): Promise<DashboardResponse> {
  try {
    // Nota: Asegúrate de que process.env.EXPO_PUBLIC_API_URL esté definido en tu env
    const url = `${process.env.EXPO_PUBLIC_API_URL}/resguardante/dashboard`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    // Detectar 401 Unauthorized explícitamente
    if (respuesta.status === 401) {
      const errorData = await respuesta.json();
      // Lanzamos un error específico con el mensaje que devuelve la API o uno por defecto
      throw new Error(errorData.message || 'Unauthenticated.');
    }

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    const dashboardData: DashboardResponse = await respuesta.json();
    return dashboardData;
  } catch (error) {
    console.error('Error en getDashboard:', error);
    throw error;
  }
}

// --- Hook Controlador (Lógica de Estado) ---
export const useResgDashboard = (access_token: string, user: User) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nuevo estado para controlar la expiración de sesión
  const [isSessionExpired, setIsSessionExpired] = useState(false);

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
    // Reiniciamos el estado de sesión expirada al intentar cargar
    setIsSessionExpired(false);

    try {
      const credenciales: Access_token = { access_token };
      const data = await getDashboard(credenciales);
      setDashboardData(data);
    } catch (err: any) {
      // Verificamos si el error es de autenticación
      if (
        err.message === 'Unauthenticated.' ||
        err.message === 'Token is invalid' ||
        err.message === 'Token has expired'
      ) {
        setIsSessionExpired(true);
        // No seteamos 'error' para que no salga la tarjeta roja de error, sino el modal
      } else {
        setError(err.message || 'No se pudo cargar la información.');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [access_token]);

  // Carga inicial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    isSessionExpired, // Exportamos el nuevo estado
    dashboardData,
    onRefresh,
    getUserName,
    formatDate,
    getMovementTypeConfig,
  };
};
