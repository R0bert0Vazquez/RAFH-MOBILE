import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Modal,
  LayoutAnimation,
  UIManager,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';

import { LogoutCredenciales, User } from '@/src/models/types'; // Ya no importamos Resguardante
import { logoutUsuario } from '@/src/controllers/login.controller';
import { useNavigation } from '@react-navigation/native';

// --- Habilitar animación en Android ---
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Interface Local ---
// Definimos una interface COMPLETA para el perfil
interface ProfileData {
  res_nombre: string;
  res_apellidos: string;
  res_puesto: string;
  res_correo: string;
  res_telefono: string;
  res_departamento: string;
  res_id_usuario: string;
  res_rfc: string;
  res_curp: string;
  id_oficina: string;
  rol_id: number; // Añadimos el rol
}

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

// Data de ejemplo (solo para rellenar campos que 'user' no tiene)
const dataResguardanteDefault: Omit<
  ProfileData,
  'res_nombre' | 'res_correo' | 'rol_id' | 'res_id_usuario'
> = {
  res_apellidos: 'Perez Gonzalez',
  res_puesto: 'Gestor',
  res_telefono: '+52 123 456 7890',
  res_departamento: 'Sistemas',
  res_rfc: 'PEGJ800101ABC',
  res_curp: 'PEGJ800101HDFRRC01',
  id_oficina: 'Oficina Central',
};

// --- Componente Avatar "Chingón" ---
const AvatarIniciales = ({
  nombre,
  apellidos,
}: {
  nombre: string;
  apellidos: string;
}) => {
  const colorScheme = useColorScheme();
  const [bgColor, textColor] =
    colorScheme === 'dark'
      ? ['bg-blue-900/50', 'text-blue-300']
      : ['bg-blue-100', 'text-blue-700'];

  const iniciales =
    `${nombre[0] || ''}${apellidos.split(' ')[0][0] || ''}`.toUpperCase();

  return (
    <View
      className={`w-24 h-24 rounded-full items-center justify-center ${bgColor} border-4 ${
        colorScheme === 'dark' ? 'border-gray-600' : 'border-white'
      } shadow-md`}
    >
      <Text className={`text-4xl font-bold ${textColor}`}>{iniciales}</Text>
    </View>
  );
};

// --- Helper para Info ---
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) => {
  const colorScheme = useColorScheme();
  if (!value) return null; // No mostrar si no hay dato
  return (
    <View className="flex-row w-full mt-4">
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={colorScheme === 'dark' ? '#94a3b8' : '#6b7280'} // slate-400 / gray-500
      />
      <View className="ml-4 flex-1">
        <Text className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </Text>
        <Text
          className="text-base text-gray-800 dark:text-slate-200 font-medium"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

// --- Helper para Inputs del Modal ---
const FormInput = ({
  label,
  icon,
  value,
  onChangeText,
  disabled = false,
  keyboardType = 'default',
  theme,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  keyboardType?: any;
  theme: any;
}) => (
  <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
    <TextInput
      mode="flat"
      theme={theme}
      label={label}
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      keyboardType={keyboardType}
      left={
        <TextInput.Icon
          icon={() => (
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={disabled ? '#9ca3af' : '#25A4D6'}
            />
          )}
        />
      }
      style={{ backgroundColor: 'transparent' }}
    />
  </View>
);

// --- EL NUEVO MODAL "MAESTRO" ---
const EditProfileModal = ({
  visible,
  onClose,
  onSave,
  profileData,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (newData: ProfileData) => void;
  profileData: ProfileData;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Estado *interno* del formulario
  const [formData, setFormData] = useState(profileData);

  // Cargar datos al formulario cuando el modal se abre
  useEffect(() => {
    if (visible) {
      setFormData(profileData);
    }
  }, [visible, profileData]);

  // Helper para actualizar el formulario
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    // Aquí podrías añadir validaciones
    onSave(formData);
  };

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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-black/60 px-5 py-10"
          keyboardShouldPersistTaps="handled"
        >
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

            {/* --- Formulario de Edición --- */}
            <FormInput
              label="Nombre(s)"
              icon="account-outline"
              value={formData.res_nombre}
              onChangeText={(val) => handleInputChange('res_nombre', val)}
              theme={customTheme}
            />
            <FormInput
              label="Apellidos"
              icon="account-outline"
              value={formData.res_apellidos}
              onChangeText={(val) => handleInputChange('res_apellidos', val)}
              theme={customTheme}
            />
            <FormInput
              label="Correo Electrónico"
              icon="email-outline"
              value={formData.res_correo}
              onChangeText={(val) => handleInputChange('res_correo', val)}
              keyboardType="email-address"
              theme={customTheme}
            />
            <FormInput
              label="Teléfono"
              icon="phone-outline"
              value={formData.res_telefono}
              onChangeText={(val) => handleInputChange('res_telefono', val)}
              keyboardType="phone-pad"
              theme={customTheme}
            />
            <FormInput
              label="RFC"
              icon="card-account-details-outline"
              value={formData.res_rfc}
              onChangeText={(val) => handleInputChange('res_rfc', val)}
              theme={customTheme}
            />
            <FormInput
              label="CURP"
              icon="card-account-details-outline"
              value={formData.res_curp}
              onChangeText={(val) => handleInputChange('res_curp', val)}
              theme={customTheme}
            />

            {/* --- Fila de Botones --- */}
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
                onPress={handleSaveClick}
                className="flex-1 bg-green-600 rounded-lg p-4 ml-2 active:bg-green-700"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Guardar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ===============================================
// --- COMPONENTE PRINCIPAL (Gest_Account) ---
// ===============================================

export function Gest_Account({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  // --- ¡EL ESTADO ÚNICO Y CHINGÓN! ---
  // Combinamos el 'user' (que viene del login) con la data 'default'
  const [profileData, setProfileData] = useState<ProfileData>({
    ...dataResguardanteDefault, // Carga la base (tel, rfc, curp, etc.)
    res_nombre: user.usuario_nombre, // Sobrescribe con la data real
    res_correo: user.usuario_correo, // Sobrescribe con la data real
    res_id_usuario: '', // Deberías pasar el ID del usuario aquí
    rol_id: user.usuario_id_rol,
  });

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Gestor';
      case 3:
        return 'Resguardante';
      default:
        return 'Usuario';
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const credenciales: LogoutCredenciales = { access_token };
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
      console.log('Logout error:', err.message);
    }
  };

  // --- Funciones del Modal ---
  const handleOpenEditModal = () => setEditModalVisible(true);
  const handleCloseEditModal = () => setEditModalVisible(false);
  const handleSaveProfile = (newData: ProfileData) => {
    // ¡Aquí es donde llamarías a tu API para guardar!
    // await updateProfileAPI(newData);
    console.log('Guardando perfil...', newData);
    setProfileData(newData); // Actualiza la UI al instante
    handleCloseEditModal();
  };

  // --- Función de Expansión ---
  const toggleInfoExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsInfoExpanded(!isInfoExpanded);
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
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Header dataWorkPlace={dataWorkPlace} />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center px-4 pt-5">
            {/* --- 1. Tarjeta de Perfil --- */}
            <View className="w-full md:w-10/12 lg:w-10/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 items-center">
              {/* Avatar */}
              <AvatarIniciales
                nombre={profileData.res_nombre}
                apellidos={profileData.res_apellidos}
              />

              {/* Nombre y Puesto */}
              <Text className="text-gray-800 dark:text-slate-200 text-2xl font-bold mt-4 text-center">
                {profileData.res_nombre} {profileData.res_apellidos}
              </Text>
              <Text className="text-blue-600 dark:text-blue-400 text-base font-medium mt-1">
                {getRoleName(profileData.rol_id)}
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

            {/* --- 2. Tarjeta de Información (COLAPSABLE) --- */}
            <View className="w-full md:w-10/12 lg:w-10/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-5 overflow-hidden">
              <Pressable
                onPress={toggleInfoExpand}
                className="p-5 flex-row justify-between items-center"
                android_ripple={{ color: 'gray' }}
              >
                <Text className="text-gray-800 dark:text-slate-200 text-lg font-bold">
                  Información Personal
                </Text>
                <MaterialCommunityIcons
                  name={isInfoExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colorScheme === 'dark' ? '#94a3b8' : '#6b7280'}
                />
              </Pressable>

              {/* Contenido visible (Contacto) */}
              <View className="px-5 pb-5">
                <InfoRow
                  icon="email-outline"
                  label="Correo Electrónico"
                  value={profileData.res_correo}
                />
                <InfoRow
                  icon="phone-outline"
                  label="Teléfono"
                  value={profileData.res_telefono}
                />

                {/* Contenido Colapsado (Datos Fiscales) */}
                {isInfoExpanded && (
                  <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <InfoRow
                      icon="card-account-details-outline"
                      label="RFC"
                      value={profileData.res_rfc}
                    />
                    <InfoRow
                      icon="card-account-details-outline"
                      label="CURP"
                      value={profileData.res_curp}
                    />
                    <InfoRow
                      icon="office-building-outline"
                      label="Departamento"
                      value={profileData.res_departamento}
                    />
                    <InfoRow
                      icon="domain"
                      label="Oficina"
                      value={profileData.id_oficina}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* --- 3. Tarjeta de Acciones (Cerrar Sesión) --- */}
            <View className="w-full md:w-10/12 lg:w-10/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-5 mt-5">
              <Text className="text-gray-800 dark:text-slate-200 text-lg font-bold mb-4">
                Acciones
              </Text>
              <Pressable
                onPress={handleLogout}
                className="flex-row items-center bg-red-100 dark:bg-red-900/40 p-4 rounded-lg active:bg-red-200 dark:active:bg-red-900/60"
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color="#ef4444" // red-500
                />
                <Text className="text-red-600 dark:text-red-400 font-bold text-base ml-3">
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
        profileData={profileData}
      />
    </StyleGlobal>
  );
}
