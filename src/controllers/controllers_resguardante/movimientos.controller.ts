import { useState, useCallback, useEffect } from 'react';
import {
  MisMovimientosResponse,
  Movimiento,
} from '@/src/models/types_Resg_Movimientos';
import { useApi } from '@/src/hooks/useApi'; // <--- 1. Importamos el hook

// --- Hook Controlador ---
export const useResgMovimientos = (access_token: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Obtenemos la función de fetch autenticado
  const { authenticatedFetch } = useApi();

  // Estado de los datos y paginación
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = useCallback(
    async (page: number) => {
      // Si es refresh, no mostramos el loading completo, si es cambio de página sí (opcional)
      if (!refreshing) setIsLoading(true);
      setError(null);

      try {
        // const credenciales: Access_token = { access_token };
        // const response = await getMovimientos(credenciales, page);

        // 3. Usamos authenticatedFetch en lugar de fetch normal
        const url = `${process.env.EXPO_PUBLIC_API_URL}/mis-movimientos?page=${page}`;

        const respuesta = await authenticatedFetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        });

        // authenticatedFetch ya verifica el 401, así que solo revisamos si !ok
        if (!respuesta.ok) {
          throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        const response: MisMovimientosResponse = await respuesta.json();
        console.log('Movimientos data:', JSON.stringify(response, null, 2));

        setMovimientos(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotalRecords(response.total);
      } catch (err: any) {
        // 4. Filtramos el error 'Unauthenticated.' para no mostrar la alerta roja
        //    (ya que el modal estará visible)
        if (err.message !== 'Unauthenticated.') {
          setError(err.message || 'No se pudo cargar el historial.');
        }
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [access_token, refreshing, authenticatedFetch],
  );

  // // Carga inicial
  // useEffect(() => {
  //   fetchData(1);
  // }, []); // Se ejecuta solo al montar

  // Acciones
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Al refrescar, volvemos a la página 1
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

  // Helpers de formato
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Formato: 12 oct 2024, 14:30
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    isLoading,
    refreshing,
    error,
    movimientos,
    currentPage,
    lastPage,
    totalRecords,
    fetchData, // 🚀 Exponemos la función
    onRefresh,
    goToNextPage,
    goToPrevPage,
    formatDate,
  };
};
