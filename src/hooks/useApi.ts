import { useAuth } from '@/src/context/AuthContext';

export const useApi = () => {
  const { triggerSessionExpired } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, options);

      // INTERCEPTOR GLOBAL DE 401
      if (response.status === 401) {
        triggerSessionExpired(); // ¡Esto activa el modal en App.js!
        throw new Error('Unauthenticated.');
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return { authenticatedFetch };
};
