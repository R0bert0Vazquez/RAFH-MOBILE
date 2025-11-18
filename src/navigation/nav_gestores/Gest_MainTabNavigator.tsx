import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/src/models/types';

import { Gest_WorkPlace } from '@/src/ui/ui_gestores/Gest_WorkPlace';
import { Gest_ScannerQR } from '@/src/ui/ui_gestores/Gest_ScannerQR';
import { Gest_Resguardantes } from '@/src/ui/ui_gestores/Gest_Resguardantes';
import { Gest_Account } from '@/src/ui/ui_gestores/Gest_Account';

const Tab = createBottomTabNavigator();

type MainTabNavigatorProps = {
  route: RouteProp<RootStackParamList, 'Gest_MainTabNavigator'>;
};

export function Gest_MainTabNavigator({ route }: MainTabNavigatorProps) {
  console.log('MainTabNavigator route.params:', route?.params);
  const insets = useSafeAreaInsets();

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
        // tabBarActiveTintColor: '#25A4D6',
        // tabBarActiveTintColor: '#3B82F6',
        // tabBarInactiveTintColor: 'gray',
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
          <Gest_WorkPlace
            access_token={route?.params?.access_token}
            workCenterId={route?.params?.workCenterId}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Empezar Levantamiento"
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
        {() => <Gest_ScannerQR access_token={route?.params?.access_token} />}
      </Tab.Screen>

      <Tab.Screen
        name="Resguardantes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              color={color}
              size={size}
            />
          ),
        }}
      >
        {() => (
          <Gest_Resguardantes access_token={route?.params?.access_token} />
        )}
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
        {() => (
          <Gest_Account
            access_token={route?.params?.access_token}
            user={route?.params?.user}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
