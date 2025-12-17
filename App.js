import '@/global.css';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import { Login } from '@/src/ui/login';
import { Gest_WorkCenters } from '@/src/ui/ui_gestores/Gest_WorkCenters';
import { Gest_MainTabNavigator } from '@/src/navigation/nav_gestores/Gest_MainTabNavigator';
import { Resg_MainTabNavigator } from '@/src/navigation/nav_resguardante/Resg_MainTabNavigator';
import { Gest_InfoResguardante } from '@/src/ui/ui_gestores/Gest_InfoResguardante';
import { Gest_InfoScannerQR } from '@/src/ui/ui_gestores/Gest_InfoScannerQR';
import { Resg_InfoScannerQR } from '@/src/ui/ui_resguardante/Resg_InfoScannerQR';

import {
  AuthProvider,
  useAuth,
  navigationRef,
} from '@/src/context/AuthContext';
import { SessionExpiredModal } from '@/src/components/SessionExpiredModal';

const Stack = createStackNavigator();

const GlobalSessionModal = () => {
  const { isSessionExpired, handleLogout } = useAuth();
  return (
    <SessionExpiredModal visible={isSessionExpired} onConfirm={handleLogout} />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />

        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <Login {...props} />}
            </Stack.Screen>

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
          <GlobalSessionModal />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
