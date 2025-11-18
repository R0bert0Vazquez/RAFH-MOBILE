import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';

import React, { useState } from 'react';
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';

import { LogoutCredenciales, Resguardante, User } from '@/src/models/types';
import { logoutUsuario } from '@/src/controllers/login.controller';
import { useNavigation } from '@react-navigation/native';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

const DATARESGUARDANTES: Resguardante[] = [
  {
    res_nombre: 'Juan',
    res_apellido1: 'Perez',
    res_apellido2: 'Gonzalez',
    res_puesto: 'Gestor',
    res_correo: 'juan.perez@empresa.com',
    res_departamento: 'Sistemas',
    res_telefono: '+52 123 456 7890',
    res_id_usuario: '1',
  },
];

const Header = () => (
  <View className="items-center mt-1 mb-1">
    <View className="flex-row items-center">
      <Image
        className="w-12 h-12 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-full mr-2"
        source={dataWorkPlace.image}
      />
      <Text className="text-gray-700 dark:text-slate-100 text-xl sm:text-xl md:text-4xl lg:text-4xl font-extrabold">
        {dataWorkPlace.title}
      </Text>
    </View>
  </View>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center w-full mt-5">
    <MaterialCommunityIcons
      name={icon}
      size={22}
      color={useColorScheme() === 'dark' ? '#94a3b8' : '#6b7280'} // slate-400 / gray-500
    />
    <View className="ml-4 flex-1">
      <Text className="text-sm text-gray-500 dark:text-slate-400">{label}</Text>
      <Text
        className="text-base text-gray-800 dark:text-slate-200 font-medium"
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  </View>
);

const EditProfileModal = ({
  visible,
  onClose,
  onSave,
  resguardante,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  resguardante: Resguardante;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [phone, setPhone] = useState(resguardante.res_telefono);
  const [email, setEmail] = useState(resguardante.res_correo);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6',
      background: isDarkMode ? '#2d2d2d' : '#f0f0f0',
      onSurface: 'gray',
      onSurfaceVariant: 'gray',
    },
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-5">
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={50}
                color="#25A4D6"
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-5">
              Modificar Perfil
            </Text>

            <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-4">
              <TextInput
                mode="flat"
                theme={customTheme}
                value={phone}
                onChangeText={setPhone}
                label="Teléfono"
                keyboardType="phone-pad"
                left={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name="phone-outline"
                        size={24}
                        color={'#25A4D6'}
                      />
                    )}
                  />
                }
                style={{ backgroundColor: 'transparent' }}
              />
            </View>

            <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-4">
              <TextInput
                disabled={true}
                mode="flat"
                theme={customTheme}
                value={email}
                onChangeText={setEmail}
                label="Correo Electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                left={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={24}
                        color={'#25A4D6'}
                      />
                    )}
                  />
                }
                style={{ backgroundColor: 'transparent' }}
              />
            </View>

            <InfoRow
              icon="account-tie-outline"
              label="Puesto"
              value={resguardante.res_puesto}
            />
            <InfoRow
              icon="office-building-outline"
              label="Departamento"
              value={resguardante.res_departamento}
            />

            <View className="flex-row justify-between mt-8">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={onSave}
                className="flex-1 bg-green-600 rounded-lg p-4 ml-2 active:bg-green-700"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Guardar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export function Resg_Account({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const miResguardante = DATARESGUARDANTES[0];

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const credenciales: LogoutCredenciales = {
        access_token: access_token,
      };
      const logoutRespuesta = await logoutUsuario(credenciales);
      setTimeout(() => {
        console.log('Logout exitoso:', JSON.stringify(logoutRespuesta));
        setIsLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        });
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      if (err.message) {
        console.log('Logout error:', err.message);
      }
    }
  };

  const handleOpenEditModal = () => {
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
  };

  const handleSaveProfile = () => {
    // Aquí iría tu lógica para guardar en la API
    console.log('Guardando perfil...');
    handleCloseEditModal();
  };

  if (isLoading) {
    return (
      <StyleGlobal>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === 'light' ? '#25A4D6' : 'white'}
          />
        </View>
      </StyleGlobal>
    );
  }

  return (
    <StyleGlobal>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
        }}
      >
        <Header />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center px-4 pt-5">
            {/* --- 1. Tarjeta de Perfil --- */}
            <View className="w-full md:w-10/12 lg:w-10/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 items-center">
              {/* Avatar */}
              <View className="w-28 h-28 rounded-full bg-blue-500/10 dark:bg-blue-500/20 items-center justify-center border-4 border-white dark:border-gray-600 shadow-sm">
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={80}
                  color="#25A4D6"
                />
              </View>

              {/* Nombre y Puesto */}
              <Text className="text-gray-800 dark:text-slate-200 text-2xl font-bold mt-4">
                {/* {miResguardante.res_nombre} {miResguardante.res_apellido1} */}
                {user.usuario_nombre}
              </Text>
              <Text className="text-gray-500 dark:text-slate-400 text-base mt-1">
                {/* {miResguardante.res_puesto} */}
                {user.usuario_id_rol === 1
                  ? 'Administrador'
                  : user.usuario_id_rol === 2
                    ? 'Gestor'
                    : 'Resguardante'}
              </Text>

              {/* Botón de Modificar */}
              <Pressable
                onPress={handleOpenEditModal}
                className="flex-row items-center bg-blue-500 dark:bg-blue-600 rounded-lg py-3 px-6 mt-5 shadow-md active:bg-blue-700"
              >
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-bold text-base ml-2">
                  Modificar Perfil
                </Text>
              </Pressable>
            </View>

            {/* --- 2. Tarjeta de Información de Contacto --- */}
            <View className="w-full md:w-10/12 lg:w-10/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mt-5">
              <Text className="text-gray-800 dark:text-slate-200 text-lg font-bold mb-2">
                Información de Contacto
              </Text>
              <InfoRow
                icon="email-outline"
                label="Correo Electrónico"
                // value={miResguardante.res_correo}
                value={user.usuario_correo}
              />
              <InfoRow
                icon="phone-outline"
                label="Teléfono"
                value={miResguardante.res_telefono}
              />
              <InfoRow
                icon="office-building-outline"
                label="Departamento"
                value={miResguardante.res_departamento}
              />
            </View>

            {/* --- 3. Tarjeta de Acciones (Cerrar Sesión) --- */}
            <View className="w-full md:w-10/12 lg:w-10/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mt-5">
              <Text className="text-gray-800 dark:text-slate-200 text-lg font-bold mb-4">
                Acciones
              </Text>
              <Pressable
                onPress={handleLogout}
                className="flex-row items-center bg-red-500/10 dark:bg-red-500/20 p-4 rounded-lg active:bg-red-500/30"
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color="#ef4444"
                />
                <Text className="text-red-500 font-bold text-base ml-3">
                  Cerrar Sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* --- Renderizar el Modal --- */}
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        resguardante={miResguardante}
      />
    </StyleGlobal>
  );
}
