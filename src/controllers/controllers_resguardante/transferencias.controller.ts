import { useState, useCallback, useEffect } from 'react';
import { Access_token, User } from '@/src/models/types';
import {
  MisTransferenciasResponse,
  Traspaso,
} from '@/src/models/types_Resg_Transferencias';

// --- Servicio API ---
export async function getTransferencias(
  credenciales: Access_token,
  page: number = 1,
): Promise<MisTransferenciasResponse> {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/mis-transferencias?page=${page}`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (respuesta.status === 401) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Sesión expirada');
    }

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    const data: MisTransferenciasResponse = await respuesta.json();
    return data;
  } catch (error) {
    console.error('Error en getTransferencias:', error);
    throw error;
  }
}

// --- Hook Controlador ---
export const useResgTransferencias = (access_token: string, user: User) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de los datos y paginación
  const [transferencias, setTransferencias] = useState<Traspaso[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = useCallback(
    async (page: number) => {
      if (!refreshing) setIsLoading(true);
      setError(null);

      try {
        const credenciales: Access_token = { access_token };
        const response = await getTransferencias(credenciales, page);

        setTransferencias(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotalRecords(response.total);
      } catch (err: any) {
        setError(err.message || 'No se pudo cargar el historial.');
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [access_token, refreshing],
  );

  // Carga inicial
  useEffect(() => {
    fetchData(1);
  }, []);

  // Acciones
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1);
  }, [fetchData]);

  const goToNextPage = () => {
    if (currentPage < lastPage) {
      fetchData(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1);
    }
  };

  // --- Helpers de Lógica de Negocio (Adaptados de Vue) ---

  // Obtener ID de resguardante de forma segura
  const getMyResguardanteId = () => {
    // Asumimos que el objeto user tiene la relación resguardante cargada o disponible
    // Si la estructura de User es diferente, ajusta aquí.
    return (user as any).resguardante?.id || 0;
  };

  const myId = getMyResguardanteId();

  // Determinar el rol en la transferencia
  const getTransferRole = (trans: Traspaso) => {
    if (trans.traspaso_id_usuario_origen === myId) {
      return 'SENDER'; // Yo envié/solicité el traspaso
    }
    return 'RECEIVER'; // Me están enviando un bien
  };

  // Configuración visual según estado
  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'Aprobada':
      case 'Aceptado':
        return {
          color: '#10B981',
          icon: 'check-circle-outline',
          label: 'Aprobada',
        }; // Green
      case 'Rechazada':
      case 'Cancelado':
        return {
          color: '#EF4444',
          icon: 'close-circle-outline',
          label: 'Rechazada',
        }; // Red
      case 'Pendiente':
      default:
        return { color: '#F59E0B', icon: 'clock-outline', label: 'Pendiente' }; // Orange/Yellow
    }
  };

  // Formato de fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return {
    isLoading,
    refreshing,
    error,
    transferencias,
    currentPage,
    lastPage,
    totalRecords,
    onRefresh,
    goToNextPage,
    goToPrevPage,
    formatDate,
    getStatusConfig,
    getTransferRole,
  };
};
