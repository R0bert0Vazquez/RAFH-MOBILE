import '@/global.css';
import React from 'react'; // Asegúrate de importar React
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Importa tus componentes existentes...
import { Login } from '@/src/ui/login';
import { Gest_WorkCenters } from '@/src/ui/ui_gestores/Gest_WorkCenters';
import { Gest_MainTabNavigator } from '@/src/navigation/nav_gestores/Gest_MainTabNavigator';
import { Resg_MainTabNavigator } from '@/src/navigation/nav_resguardante/Resg_MainTabNavigator';
import { Gest_InfoResguardante } from '@/src/ui/ui_gestores/Gest_InfoResguardante';
import { Gest_InfoScannerQR } from '@/src/ui/ui_gestores/Gest_InfoScannerQR';
import { Resg_InfoScannerQR } from '@/src/ui/ui_resguardante/Resg_InfoScannerQR';

// IMPORTS NUEVOS
import {
  AuthProvider,
  useAuth,
  navigationRef,
} from '@/src/context/AuthContext'; // Ajusta la ruta
import { SessionExpiredModal } from '@/src/components/SessionExpiredModal';

const Stack = createStackNavigator();

// Componente auxiliar para conectar el Modal con el Contexto
const GlobalSessionModal = () => {
  const { isSessionExpired, handleLogout } = useAuth();
  return (
    <SessionExpiredModal visible={isSessionExpired} onConfirm={handleLogout} />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 1. Envolvemos todo con el AuthProvider */}
      <AuthProvider>
        <StatusBar style="auto" />

        {/* 2. Usamos la ref de navegación global */}
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <Login {...props} />}
            </Stack.Screen>

            {/* ... Tus otras pantallas (sin cambios) ... */}
            <Stack.Screen
              name="Gest_WorkCenters"
              options={{ headerShown: false }}
            >
              {(props) => <Gest_WorkCenters {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Gest_MainTabNavigator"
              options={{ headerShown: false }}
            >
              {(props) => <Gest_MainTabNavigator {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Gest_InfoResguardante"
              options={{ headerShown: false }}
            >
              {(props) => <Gest_InfoResguardante {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Gest_InfoScannerQR"
              options={{ headerShown: false }}
            >
              {(props) => <Gest_InfoScannerQR {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Resg_MainTabNavigator"
              options={{ headerShown: false }}
            >
              {(props) => <Resg_MainTabNavigator {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Resg_InfoScannerQR"
              options={{ headerShown: false }}
            >
              {(props) => <Resg_InfoScannerQR {...props} />}
            </Stack.Screen>
          </Stack.Navigator>

          {/* 3. Colocamos el Modal AQUÍ, dentro del NavigationContainer pero fuera del Stack
                 para que se superponga a todo */}
          <GlobalSessionModal />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
