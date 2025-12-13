import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

// 1. Referencia de navegación global para poder navegar desde fuera de las pantallas
export const navigationRef = createNavigationContainerRef<any>();

interface AuthContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Esta función se llamará cuando la API detecte un 401
  const triggerSessionExpired = () => {
    setIsSessionExpired(true);
  };

  // Esta función se ejecuta cuando el usuario presiona "Volver a iniciar sesión" en el modal
  const handleLogout = () => {
    setIsSessionExpired(false);
    // Aquí podrías limpiar AsyncStorage o estados de usuario si lo usas

    // Navegar al Login reseteando el historial para que no puedan volver atrás
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isSessionExpired, triggerSessionExpired, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
