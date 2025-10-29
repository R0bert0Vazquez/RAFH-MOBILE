import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/src/models/types';

import { WorkPlace } from '@/src/ui/workPlace';
import { QR } from '@/src/ui/qr';
import { Resguardantes } from '@/src/ui/resguardantes';

const Tab = createBottomTabNavigator();

type MainTabNavigatorProps = {
  route: RouteProp<RootStackParamList, 'MainApp'>;
};

export function MainTabNavigator({ route }: MainTabNavigatorProps) {
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
          <WorkPlace
            access_token={route?.params?.access_token}
            workCenterId={route?.params?.workCenterId}
          />
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
        {() => <QR />}
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
        {() => <Resguardantes />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
