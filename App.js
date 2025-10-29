import '@/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { Login } from '@/src/ui/login';
import { WorkCenters } from '@/src/ui/workCenters';
import { MainTabNavigator } from '@/src/navigation/mainTabNavigator';
import { InfoResguardante } from '@/src/ui/infoResguardante';

const Stack = createStackNavigator();

export default function App() {
  const [orientation, setOrientation] = useState(0);

  useEffect(() => {
    const getInitialOrientation = async () => {
      const orientationInfo = await ScreenOrientation.getOrientationAsync();
      setOrientation(orientationInfo);
    };

    getInitialOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      },
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
            }}
          >
            {(props) => <Login {...props} orientation={orientation} />}
          </Stack.Screen>

          <Stack.Screen
            name="WorkCenters"
            options={{
              headerShown: false,
            }}
          >
            {(props) => <WorkCenters {...props} orientation={orientation} />}
          </Stack.Screen>

          <Stack.Screen name="MainApp" options={{ headerShown: false }}>
            {(props) => (
              <MainTabNavigator {...props} orientation={orientation} />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="InfoResguardante"
            component={InfoResguardante}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
