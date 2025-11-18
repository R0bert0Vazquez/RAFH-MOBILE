import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/src/models/types';

import { Resg_MainResguardante } from '@/src/ui/ui_resguardante/Resg_MainResguardante';
import { Resg_ScannerQR } from '@/src/ui/ui_resguardante/Resg_ScannerQR';
import { Resg_Account } from '@/src/ui/ui_resguardante/Resg_Account';

const Tab = createBottomTabNavigator();

type Resg_MainTabNavigatorRouteProp = RouteProp<
  RootStackParamList,
  'Resg_MainTabNavigator'
>;

export function Resg_MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const route = useRoute<Resg_MainTabNavigatorRouteProp>();
  const { loginRespuesta } = route.params;
  const { access_token, user } = loginRespuesta;
  console.log('Resg_MainTabNavigator route.params', access_token, user);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#14161A',
          borderTopColor: 'gray',
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        tabBarActiveTintColor: '#25A4D6',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => (
          <Resg_MainResguardante access_token={access_token} user={user} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Escanear QR"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => <Resg_ScannerQR access_token={access_token} />}
      </Tab.Screen>

      <Tab.Screen
        name="Mi Perfil"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => <Resg_Account access_token={access_token} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
