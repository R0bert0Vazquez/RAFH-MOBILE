import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  FlatList,
  LayoutAnimation,
  UIManager,
  Linking,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {
  useState,
  memo,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // 🚀 useFocusEffect

import { StyleGlobal } from '../../components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';

import { customTheme } from '@/src/components/customThemeTextInput-R.Paper';

import { RootStackParamList, Access_token } from '@/src/models/types';
import {
  ResguardanteResponse,
  Resguardante,
  ResguardanteCreado,
  ResguardanteSimple,
} from '@/src/models/types_ResguardanteResponse';

// 🚀 Importamos el hook
import { useResguardantesController } from '@/src/controllers/controllers_gestor/resguardantes.controller';

import { StackNavigationProp } from '@react-navigation/stack';

import { Select_Oficina_DropDown } from '@/src/components/Select_Oficina_DropDownPicker';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ResguardantesHeader = ({
  searchValue,
  onSearchChange,
  onAddPress,
  onFilterOfficePress,
  onClearFilter, // <--- NUEVA PROP RECIBIDA
  selectedFilterOfficeName,
}: {
  searchValue: string;
  onSearchChange: (text: string) => void;
  onAddPress: () => void;
  onFilterOfficePress: () => void;
  onClearFilter: () => void; // <--- TIPO DEFINIDO
  selectedFilterOfficeName: string | null;
}) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <View className="mb-3 px-4">
      {/* --- 1. APARTADO DE SELECCIÓN DE OFICINA (FILTRO) --- */}
      <View className="mb-3">
        <Pressable
          onPress={onFilterOfficePress}
          className={`flex-row items-center justify-between p-3 rounded-xl border-2 ${
            selectedFilterOfficeName
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
          } shadow-sm`}
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View
              className={`p-2 rounded-full mr-3 ${
                selectedFilterOfficeName ? 'bg-blue-500' : 'bg-orange-500'
              }`}
            >
              <MaterialCommunityIcons
                name={selectedFilterOfficeName ? 'office-building' : 'alert'}
                size={22}
                color={
                  selectedFilterOfficeName
                    ? 'white'
                    : isDark
                      ? 'white'
                      : 'white'
                }
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-base font-bold uppercase ${
                  selectedFilterOfficeName
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-800 dark:text-white'
                }`}
              >
                {selectedFilterOfficeName
                  ? 'Oficina Seleccionada'
                  : 'Seleccionar Oficina'}
              </Text>
              <Text
                className={`text-xs font-semibold ${
                  selectedFilterOfficeName
                    ? 'text-gray-900 dark:text-white'
                    : 'text-orange-600 dark:text-orange-400'
                }`}
                numberOfLines={1}
              >
                {selectedFilterOfficeName ||
                  'Para filtrar reguardantes por oficina...'}
              </Text>
            </View>
          </View>

          {/* --- LÓGICA DEL BOTÓN: SI HAY FILTRO, MUESTRA EL DE LIMPIAR --- */}
          {selectedFilterOfficeName ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation(); // Evita que se abra el modal de selección al limpiar
                onClearFilter();
              }}
              className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full"
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={isDark ? '#f87171' : '#dc2626'}
              />
            </Pressable>
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={'gray'}
            />
          )}
        </Pressable>
      </View>

      {/* --- 2. BUSCADOR Y BOTÓN AGREGAR (Validamos que seleccione una oficna) --- */}

      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3 bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-sm">
          <TextInput
            mode="flat"
            returnKeyType="search"
            theme={customTheme}
            value={searchValue}
            onChangeText={onSearchChange}
            label="Buscar Resguardante..."
            left={
              <TextInput.Icon
                icon={() => (
                  <MaterialCommunityIcons
                    name="account-search-outline"
                    size={24}
                    color={'#25A4D6'}
                  />
                )}
              />
            }
            style={{ backgroundColor: 'transparent', height: 50 }}
          />
        </View>

        <Pressable
          onPress={onAddPress}
          className="bg-blue-600 dark:bg-blue-700 h-[50px] w-[50px] rounded-lg justify-center items-center shadow-md active:bg-blue-800"
        >
          <MaterialCommunityIcons name="account-plus" size={28} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

// --- NUEVO COMPONENTE: MODAL PARA CREAR USUARIO ---
const CreateUserModal = ({
  visible,
  onClose,
  onSave,
  userData,
  setUserData,
  resguardanteName,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  userData: any;
  setUserData: (data: any) => void;
  resguardanteName: string;
}) => {
  const isDark = useColorScheme() === 'dark';
  const [showPassword, setShowPassword] = useState(false);

  // Opciones de Roles
  const roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Gestor', value: 2 },
    { label: 'Resguardante', value: 3 },
    { label: 'Jefe Departamento', value: 4 },
  ];

  const handleInputChange = (field: string, value: any) => {
    setUserData((prev: any) => ({ ...prev, [field]: value }));
  };

  const modalInputTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2563eb',
      onSurface: isDark ? '#e2e8f0' : '#1e293b',
      onSurfaceVariant: isDark ? '#94a3b8' : '#1e293b',
      background: 'transparent',
      placeholder: isDark ? '#94a3b8' : '#64748b',
    },
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-[#14161A] w-full rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 h-[80%]">
            {/* Header */}
            <View className="flex-row justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <View className="flex-1 mr-4">
                <Text className="text-xl font-bold text-gray-800 dark:text-white">
                  Crear Usuario
                </Text>
                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Para: {resguardanteName}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={isDark ? '#fff' : '#333'}
                />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
              {/* Campos de Texto */}
              <View className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl mb-6 border border-gray-100 dark:border-gray-800">
                <TextInput
                  label="Correo Electrónico *"
                  value={userData.email}
                  onChangeText={(t) => handleInputChange('email', t)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent', marginBottom: 10 }}
                  left={<TextInput.Icon icon="email-outline" color="#2563eb" />}
                />
                <TextInput
                  label="Contraseña *"
                  value={userData.password}
                  onChangeText={(t) => handleInputChange('password', t)}
                  secureTextEntry={!showPassword}
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent' }}
                  left={<TextInput.Icon icon="lock-outline" color="#2563eb" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      color={isDark ? '#94a3b8' : '#64748b'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </View>

              {/* Selector de Rol (Estilo DropDown/Radio) */}
              <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-2 ml-1">
                Rol de Usuario *
              </Text>
              <View className="bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                {roles.map((rol, index) => {
                  const isSelected = userData.id_rol === rol.value;
                  return (
                    <Pressable
                      key={rol.value}
                      onPress={() => handleInputChange('id_rol', rol.value)}
                      className={`flex-row items-center justify-between p-4 ${
                        index !== roles.length - 1
                          ? 'border-b border-gray-200 dark:border-gray-700'
                          : ''
                      } ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <Text
                        className={`text-base ${
                          isSelected
                            ? 'font-bold text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {rol.label}
                      </Text>
                      {isSelected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#2563eb"
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#14161A] absolute bottom-0 w-full rounded-b-xl">
              <Pressable
                onPress={onSave}
                className="bg-blue-600 dark:bg-blue-700 p-4 rounded-xl items-center shadow-lg active:bg-blue-800"
              >
                <Text className="text-white font-bold text-lg">
                  Crear Usuario
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const AddResguardanteModal = ({
  visible,
  onClose,
  onSave,
  onSelectOffice,
  formData,
  setFormData,
  selectedOfficeName,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  onSelectOffice: () => void;
  formData: any;
  setFormData: (data: any) => void;
  selectedOfficeName: string | null;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Tema local para inputs del modal
  const modalInputTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2563eb', // Blue-600
      onSurface: isDark ? '#e2e8f0' : '#1e293b',
      onSurfaceVariant: isDark ? '#94a3b8' : '#1e293b',
      background: 'transparent',
      placeholder: isDark ? '#94a3b8' : '#64748b',
    },
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-[#14161A] w-full rounded-t-3xl h-[90%] shadow-2xl border-t border-gray-200 dark:border-gray-700">
            {/* Header del Modal */}
            <View className="flex-row justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                Nuevo Resguardante
              </Text>
              <Pressable
                onPress={onClose}
                className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={isDark ? '#fff' : '#333'}
                />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Sección: Datos Personales */}
              <Text className="text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase text-xs">
                Datos Personales
              </Text>

              <View className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl mb-4 border border-gray-100 dark:border-gray-800">
                <TextInput
                  label="Nombre(s) *"
                  value={formData.res_nombre}
                  onChangeText={(t) => handleInputChange('res_nombre', t)}
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent', marginBottom: 10 }}
                />
                <TextInput
                  label="Apellidos *"
                  value={formData.res_apellidos}
                  onChangeText={(t) => handleInputChange('res_apellidos', t)}
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent' }}
                />
              </View>

              {/* Sección: Identificación y Contacto */}
              <Text className="text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase text-xs">
                Identificación y Contacto
              </Text>

              <View className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl mb-4 border border-gray-100 dark:border-gray-800">
                <View className="flex-row">
                  <View className="flex-1 mr-2">
                    <TextInput
                      label="RFC (Opcional)"
                      value={formData.res_rfc}
                      onChangeText={(t) => handleInputChange('res_rfc', t)}
                      mode="flat"
                      theme={modalInputTheme}
                      style={{
                        backgroundColor: 'transparent',
                        marginBottom: 10,
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <TextInput
                      label="CURP (Opcional)"
                      value={formData.res_curp}
                      onChangeText={(t) => handleInputChange('res_curp', t)}
                      mode="flat"
                      theme={modalInputTheme}
                      style={{
                        backgroundColor: 'transparent',
                        marginBottom: 10,
                      }}
                    />
                  </View>
                </View>

                <TextInput
                  label="Correo Electrónico (Opcional)"
                  value={formData.res_correo}
                  onChangeText={(t) => handleInputChange('res_correo', t)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent', marginBottom: 10 }}
                  right={
                    <TextInput.Icon icon="email-outline" color="#2563eb" />
                  }
                />

                <TextInput
                  label="Teléfono (Ej. 983...) (Opcional)"
                  value={formData.res_telefono}
                  onChangeText={(t) => handleInputChange('res_telefono', t)}
                  keyboardType="phone-pad"
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent' }}
                  right={
                    <TextInput.Icon icon="phone-outline" color="#2563eb" />
                  }
                />
              </View>

              {/* Sección: Ubicación y Puesto */}
              <Text className="text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase text-xs">
                Ubicación y Puesto
              </Text>

              <View className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl mb-4 border border-gray-100 dark:border-gray-800">
                <TextInput
                  label="Puesto (Ej. Jefe de Depto.)"
                  value={formData.res_puesto}
                  onChangeText={(t) => handleInputChange('res_puesto', t)}
                  mode="flat"
                  theme={modalInputTheme}
                  style={{ backgroundColor: 'transparent', marginBottom: 15 }}
                />

                {/* --- Selector de Oficina --- */}
                <Text className="text-gray-500 text-xs ml-3 mb-1">
                  Oficina Asignada *
                </Text>
                <Pressable
                  onPress={onSelectOffice}
                  className={`flex-row items-center justify-between p-4 rounded-lg border ${
                    selectedOfficeName
                      ? 'bg-blue-100 dark:bg-gray-800 border-blue-500'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <MaterialCommunityIcons
                      name="office-building-marker"
                      size={24}
                      color={selectedOfficeName ? '#2563eb' : '#9ca3af'}
                    />
                    <Text
                      className={`ml-3 text-base font-medium ${
                        selectedOfficeName
                          ? 'text-gray-800 dark:text-white'
                          : 'text-gray-400'
                      }`}
                      numberOfLines={2}
                    >
                      {selectedOfficeName || 'Seleccionar Oficina'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#14161A] absolute bottom-0 w-full rounded-b-xl">
              <Pressable
                onPress={onSave}
                className="bg-blue-600 dark:bg-blue-700 p-4 rounded-xl items-center shadow-lg active:bg-blue-800"
              >
                <Text className="text-white font-bold text-lg">
                  Guardar Resguardante
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const AvatarIniciales = ({
  nombre,
  apellidos,
}: {
  nombre: string;
  apellidos: string;
}) => {
  const [colorScheme] =
    useColorScheme() === 'dark'
      ? ['#0f172a', '#1e3a8a']
      : ['#e0f2fe', '#2563eb'];

  const iniciales =
    `${nombre[0] || ''}${apellidos.split(' ')[0][0] || ''}`.toUpperCase();

  return (
    <View
      className={`w-14 h-14 rounded-2xl items-center justify-center ${
        colorScheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
      } mr-4`}
    >
      <Text
        className={`text-2xl font-bold ${
          colorScheme === 'dark' ? 'text-blue-300' : 'text-blue-700'
        }`}
      >
        {iniciales}
      </Text>
    </View>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => {
  if (!value) return null;

  return (
    <View className="flex-row items-center mb-1.5 mx-1">
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color="#6b7280" // text-gray-500
        style={{ width: 20 }}
      />
      <Text
        className="text-sm text-gray-700 dark:text-slate-300 ml-2"
        numberOfLines={2}
      >
        <Text className="font-bold">{label}: </Text>
        <Text className="flex-1 font-light">{value}</Text>
      </Text>
    </View>
  );
};

const InfoAlertModal = ({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) => {
  const getIcon = () => {
    if (
      title.includes('Error') ||
      title.includes('Faltan Datos') ||
      title.includes('Seleccionar Oficina')
    ) {
      return { name: 'alert-circle-outline', color: '#E53E3E' };
    }
    if (
      title.includes('Enviado') ||
      title.includes('Éxito') ||
      title.includes('Usuario creado')
    ) {
      return { name: 'check-circle-outline', color: '#38A169' };
    }
    if (title.includes('Seleccionar') || title.includes('Requerida')) {
      return { name: 'home-search-outline', color: '#E53E3E' };
    }
    return { name: 'information-outline', color: '#25A4D6' };
  };
  const icon = getIcon();

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
          <View className="items-center mb-4">
            <MaterialCommunityIcons
              name={icon.name as any}
              size={50}
              color={icon.color}
            />
          </View>

          <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
            {title}
          </Text>

          <Text className="text-gray-600 dark:text-slate-400 text-base md:text-lg text-center mb-6">
            {message}
          </Text>

          <Pressable
            onPress={onClose}
            className="bg-blue-500 dark:bg-blue-600 rounded-lg p-4 w-full shadow-md active:bg-blue-700"
          >
            <Text className="text-white text-center font-bold text-lg">
              Aceptar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const ItemComponent = ({
  item,
  onPressUserKey, // RECIBIMOS LA FUNCIÓN AQUÍ
  access_token,
}: {
  item: Resguardante | ResguardanteSimple;
  onPressUserKey: (item: Resguardante | ResguardanteSimple) => void;
  access_token: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, 'Gest_InfoResguardante'>
    >();
  const isDark = useColorScheme() === 'dark';

  const departamentoNombre =
    (item as Resguardante).departamento?.dep_nombre ||
    (item as ResguardanteSimple).res_departamento ||
    '';
  const oficinaNombre =
    (item as Resguardante).oficina?.nombre ||
    (item as ResguardanteSimple).id_oficina ||
    '';

  // --- Funciones de Acción ---
  const handleCall = () => {
    Linking.openURL(`tel:${item.res_telefono}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${item.res_correo}`);
  };

  const handleDetails = () => {
    console.log('Ver detalles de: ', item.id);
    console.log('Token: ', access_token);
    navigation.navigate('Gest_InfoResguardante', {
      id_resguardante: item.id,
      access_token: access_token,
    });
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="px-4 mb-3">
      <View className="w-full bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/5 overflow-hidden">
        {/* === SECCIÓN SUPERIOR (HEADER) === */}
        <Pressable
          onPress={toggleExpand}
          className="p-4"
          android_ripple={{ color: isDark ? '#333' : '#eee' }}
        >
          <View className="flex-row items-center">
            {/* Avatar */}
            <AvatarIniciales
              nombre={item.res_nombre}
              apellidos={item.res_apellidos}
            />

            {/* Info Principal */}
            <View className="flex-1 mr-2">
              <Text
                className="text-lg font-bold text-gray-800 dark:text-slate-200"
                numberOfLines={2}
              >
                {item.res_nombre} {item.res_apellidos}
              </Text>
              <Text
                className="text-sm font-medium text-blue-600 dark:text-blue-400"
                numberOfLines={1}
              >
                {item.res_puesto}
              </Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons
                  name="office-building-outline"
                  size={14}
                  color={isDark ? '#94a3b8' : '#64748b'}
                />
                <Text className="text-sm text-gray-500 dark:text-slate-400 ml-1.5">
                  {/* {item.departamento.dep_nombre} */}
                  {departamentoNombre}
                </Text>
              </View>
            </View>

            {/* Boton que muestra que ya tiene es un usuario */}
            {item!.res_id_usuario && (
              <>
                <View className="flex-row items-center self-start rounded-full px-2.5 py-1 bg-green-100 dark:bg-green-500">
                  <MaterialCommunityIcons
                    name="account-badge-outline"
                    size={24}
                    color={isDark ? 'white' : '#22c55e'}
                  />
                </View>
              </>
            )}
            {/* Boton, para pedir correo, contrasena y rol */}
            {!item.res_id_usuario && (
              <>
                <Pressable
                  onPress={() => onPressUserKey(item)}
                  className="flex-row items-center self-start rounded-full px-2.5 py-1 bg-slate-500/10 active:bg-slate-500/20 dark:bg-sky-500/30 dark:active:bg-sky-500/40"
                >
                  <MaterialCommunityIcons
                    name="account-key-outline"
                    size={24}
                    color={isDark ? 'white' : '#2563eb'}
                  />
                </Pressable>
              </>
            )}
          </View>
        </Pressable>

        {/* === SECCIÓN EXPANDIBLE (DETALLES) === */}
        {isExpanded && (
          <View className="px-4 pb-4">
            <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
            <DetailRow
              icon="phone-outline"
              label="Teléfono"
              value={item?.res_telefono || ''}
            />
            <DetailRow
              icon="email-outline"
              label="Correo"
              value={item?.res_correo || ''}
            />
            <DetailRow
              icon="domain"
              label="Oficina"
              // value={item.oficina?.nombre || ''}
              value={String(oficinaNombre)}
            />
            <DetailRow
              icon="card-account-details-outline"
              label="RFC"
              value={item?.res_rfc || ''}
            />
            <DetailRow
              icon="card-account-details-outline"
              label="CURP"
              value={item?.res_curp || ''}
            />
          </View>
        )}

        {/* === SECCIÓN DE BOTONES (PIE DE PÁGINA) === */}
        <View className="flex-row border-t border-gray-200 dark:border-gray-700">
          {item.res_telefono && (
            <>
              {/* Botón de Llamar */}
              <Pressable
                onPress={handleCall}
                className="flex-1 flex-row items-center justify-center p-3 active:bg-blue-100 dark:active:bg-blue-700/20 border-r border-gray-200 dark:border-gray-700"
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={18}
                  color="#3B82F6"
                />
                <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm ml-2">
                  Llamar
                </Text>
              </Pressable>
            </>
          )}

          {item.res_correo && (
            <>
              {/* Botón de Correo */}
              <Pressable
                onPress={handleEmail}
                className="flex-1 flex-row items-center justify-center p-3 active:bg-green-100 dark:active:bg-green-700/20 border-r border-gray-200 dark:border-gray-700"
              >
                <MaterialCommunityIcons
                  name="email"
                  size={18}
                  color="#10b981"
                />
                <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-sm ml-2">
                  Correo
                </Text>
              </Pressable>
            </>
          )}

          {/* Botón de Detalles */}
          <Pressable
            onPress={handleDetails}
            className="flex-1 flex-row items-center justify-center p-3 active:bg-gray-100 dark:active:bg-gray-700"
          >
            <MaterialCommunityIcons
              name="archive-eye-outline"
              size={18}
              color={isDark ? '#cbd5e1' : '#475569'}
            />
            <Text className="text-slate-600 dark:text-slate-300 font-bold text-sm ml-2">
              Bienes
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const Item = memo(ItemComponent);

export function Gest_Resguardantes({ access_token }: { access_token: string }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  // 🚀 Instanciamos el Hook
  const {
    getResguardantes,
    getResguardantesPorOficina,
    crearResguardante,
    crearUsuarioResguardante,
  } = useResguardantesController();

  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [resguardantesList, setResguardantesList] = useState<
    Resguardante[] | ResguardanteSimple[]
  >([]);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isOfficeSelectorVisible, setOfficeSelectorVisible] = useState(false);

  // --- NUEVOS ESTADOS PARA CREAR USUARIO ---
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [selectedResguardanteForUser, setSelectedResguardanteForUser] =
    useState<Resguardante | ResguardanteSimple | null>(null);

  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    id_rol: 3, // Default: Resguardante (3)
  });
  // ----------------------------------------

  const [filterOffice, setFilterOffice] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const [isFilterOfficeSelectorVisible, setFilterOfficeSelectorVisible] =
    useState(false);

  const initialFormState = {
    res_nombre: '',
    res_apellidos: '',
    res_puesto: '',
    res_rfc: '',
    res_curp: '',
    res_correo: '',
    res_telefono: '',
    id_oficina: null as number | null,
    res_departamento: null as number | null,
    nombre_oficina: null as string | null,
  };
  const [addFormData, setAddFormData] = useState(initialFormState);

  // 1. Definimos loadData con useCallback (igual que antes)
  const loadData = useCallback(
    async (
      officeIdToFilter?: number,
      page: number = 1,
      isActive: boolean = true,
    ) => {
      const credenciales: Access_token = { access_token };

      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      try {
        if (officeIdToFilter) {
          console.log('Cargando por oficina:', officeIdToFilter);
          const respuesta: ResguardanteSimple[] =
            await getResguardantesPorOficina(credenciales, officeIdToFilter);

          if (isActive) {
            setResguardantesList(respuesta);
            setCurrentPage(1);
            setLastPage(1);
          }
        } else {
          console.log(`Cargando todos los resguardantes (Página ${page})...`);
          const respuesta: ResguardanteResponse = await getResguardantes(
            credenciales,
            page,
          );

          if (isActive) {
            if (page === 1) {
              setResguardantesList(respuesta.data);
            } else {
              setResguardantesList((prevList) => [
                ...(prevList as Resguardante[]),
                ...respuesta.data,
              ]);
            }
            setCurrentPage(respuesta.current_page);
            setLastPage(respuesta.last_page);
          }
        }
      } catch (error: any) {
        // FILTRO CLAVE: Si es 401, NO hacemos nada (ni logs, ni setState de error)
        // Esto evita el bucle cuando el modal global se activa.
        if (error.message !== 'Unauthenticated.') {
          console.error(error);
          setAlertInfo({
            visible: true,
            title: 'Error',
            message:
              'No se pudo conectar con el servidor para actualizar la lista.',
          });
        } else {
          // Si es 401, paramos el loading silenciosamente para no dejar el spinner pegado
          // pero NO mostramos alerta local.
        }
      } finally {
        if (isActive) {
          if (page === 1) setIsLoading(false);
          else setIsFetchingMore(false);
        }
      }
    },
    [access_token, getResguardantes, getResguardantesPorOficina],
  );

  // 2. 🚀 TRUCO ANTI-BUCLE: Usamos useRef para tener siempre la última versión de loadData
  // sin tener que ponerla en las dependencias de useFocusEffect.
  const loadDataRef = useRef(loadData);

  // Mantenemos la ref actualizada
  useEffect(() => {
    loadDataRef.current = loadData;
  }, [loadData]);

  // 3. useFocusEffect limpio
  // Solo se ejecuta si cambia el ID del filtro. NO depende de loadData ni access_token directamente.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const initLoad = async () => {
        // Usamos la ref para llamar a la función
        setCurrentPage(1);
        await loadDataRef.current(filterOffice?.id, 1, isActive);
      };

      initLoad();

      return () => {
        isActive = false;
      };
    }, [filterOffice?.id]), // ÚNICA DEPENDENCIA REAL
  );

  // --- LÓGICA PARA SCROLL INFINITO ---
  const handleLoadMore = () => {
    // Condiciones para cargar más:
    // 1. No se está filtrando por oficina (filterOffice === null)
    // 2. No se está buscando texto localmente (searchValue vacio) -> Opcional, pero recomendado
    // 3. No hay una carga en curso
    // 4. Hay más páginas disponibles
    if (
      !filterOffice &&
      !isLoading &&
      !isFetchingMore &&
      currentPage < lastPage &&
      searchValue.trim() === ''
    ) {
      loadData(undefined, currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator
          size="small"
          color={colorScheme === 'light' ? 'gray' : 'white'}
        />
        <Text className="text-xs text-gray-500 mt-1">Cargando más...</Text>
      </View>
    );
  };

  const handleOpenAddModal = () => {
    setAddFormData(initialFormState);
    setAddModalVisible(true);
  };
  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };
  const handleOpenOfficeSelectorForAdd = () => {
    setAddModalVisible(false);
    setOfficeSelectorVisible(true);
  };
  const handleOfficeSelectedForAdd = (oficina: {
    id: number;
    nombre: string;
    codigo: string;
    id_dep: number;
  }) => {
    setAddFormData((prev) => ({
      ...prev,
      id_oficina: oficina.id,
      nombre_oficina: oficina.nombre,
      res_departamento: oficina.id_dep,
    }));
    setAddModalVisible(true);
  };

  const handleOpenFilterOfficeSelector = () => {
    setFilterOfficeSelectorVisible(true);
  };
  const handleFilterOfficeSelected = (oficina: {
    id: number;
    nombre: string;
    codigo: string;
  }) => {
    setFilterOffice({ id: oficina.id, nombre: oficina.nombre });
    setFilterOfficeSelectorVisible(false);
    // Al filtrar, forzamos página 1
    // loadData(oficina.id, 1);

    // useFocusEffect se encargará de recargar porque cambió filterOffice.id en dependencias
  };

  // --- FUNCIÓN PARA LIMPIAR EL FILTRO DE OFICINA ---
  const handleClearFilter = () => {
    setFilterOffice(null);
    // Recargamos todo, empezando por la página 1 (sin pasar ID de oficina)
    // loadData(undefined, 1);

    // useFocusEffect se encargará de recargar
  };

  const handleSaveResguardante = async () => {
    setAddModalVisible(false);

    if (!addFormData.res_nombre.trim() || !addFormData.res_apellidos.trim()) {
      setAlertInfo({
        visible: true,
        title: 'Faltan Datos',
        message: 'El nombre y apellidos son obligatorios.',
      });
      return;
    }

    if (!addFormData.id_oficina) {
      setAlertInfo({
        visible: true,
        title: 'Seleccionar Oficina',
        message: 'Debes seleccionar una oficina para el resguardante.',
      });
      return;
    }

    try {
      const credenciales: Access_token = { access_token };
      const payloadNuevoResguardante = {
        ...addFormData,
      };

      console.log('🚀 Enviando Nuevo Resguardante:', payloadNuevoResguardante);

      const respuesta: ResguardanteCreado = await crearResguardante(
        credenciales,
        payloadNuevoResguardante,
      );

      setAddModalVisible(false);
      setAlertInfo({
        visible: true,
        title: 'Éxito',
        message: 'Guadado correctamente ' + respuesta.res_nombre,
      });
      // Recargar lista: Mantenemos el filtro actual si existe
      await loadData(filterOffice?.id, 1);
    } catch (error) {
      console.error('Error al crear resguardante:', error);

      setAlertInfo({
        visible: true,
        title: 'Error',
        message: 'No se pudo crear el resguardante.',
      });

      setAddModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NUEVOS HANDLERS PARA CREAR USUARIO ---
  const handleOpenUserModal = (item: Resguardante | ResguardanteSimple) => {
    console.log('Abriendo modal usuario para:', item.res_nombre);
    setSelectedResguardanteForUser(item);
    // Reseteamos form
    setUserFormData({
      email: item.res_correo || '', // Si ya tiene correo, lo pre-llenamos
      password: '',
      id_rol: 3, // Default Resguardante
    });
    setUserModalVisible(true);
  };

  const handleCloseUserModal = () => {
    setUserModalVisible(false);
    setSelectedResguardanteForUser(null);
  };

  const handleCreateUser = async () => {
    setUserModalVisible(false);
    // 1. Validar
    if (!userFormData.email.trim() || !userFormData.password.trim()) {
      setAlertInfo({
        visible: true,
        title: 'Faltan Datos',
        message: 'El correo y la contraseña son obligatorios.',
      });
      return;
    }
    setIsLoading(true);

    try {
      // 2. Preparar Petición
      const credenciales: Access_token = { access_token };
      const payloadUsuario = {
        id_persona: selectedResguardanteForUser!.id, // ID del resguardante
        usuario_correo: userFormData.email,
        usuario_pass: userFormData.password,
        usuario_id_rol: userFormData.id_rol,
      };

      console.log('🚀 Creando Usuario (Simulado):', payloadUsuario);

      const respuesta = await crearUsuarioResguardante(
        credenciales,
        payloadUsuario,
      );

      setAlertInfo({
        visible: true,
        title: 'Usuario Creado',
        message: `Se ha creado el usuario para ${respuesta?.usuario?.usuario_nombre} con el correo: ${respuesta?.usuario?.usuario_correo}`,
      });

      await loadData(filterOffice?.id, currentPage);
    } catch (error) {
      setUserModalVisible(false);
      console.error('Error creando usuario:', error);
      setAlertInfo({
        visible: true,
        title: 'Error',
        message: 'No se pudo crear el usuario.',
      });
      // Si falla, volvemos a mostrar el modal para que corrija
      setUserModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  // ------------------------------------------

  const displayedData = useMemo(() => {
    if (!resguardantesList) return [];

    const searchTerm = searchValue.toLowerCase().trim();
    if (searchTerm === '') return resguardantesList;

    return resguardantesList.filter((res) => {
      const nombre = res.res_nombre || '';
      const apellidos = res.res_apellidos || '';
      const nombreCompleto = `${nombre} ${apellidos}`.toLowerCase();

      const correo = res.res_correo || '';

      return (
        nombreCompleto.includes(searchTerm) ||
        correo.toLowerCase().includes(searchTerm)
      );
    });
  }, [searchValue, resguardantesList]);

  const EmptyListComponent = () => (
    <>
      {isLoading && (
        <View className="items-center pt-5">
          <ActivityIndicator
            size="large"
            color={colorScheme === 'light' ? 'gray' : 'white'}
          />
          <Text className="text-gray-500 mt-4">Cargando datos...</Text>
        </View>
      )}

      <View className="items-center pt-20">
        <View className="w-10/12 items-center p-4 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <MaterialCommunityIcons
            name="account-search-outline"
            size={50}
            color="gray"
          />
          <Text className="text-gray-500 dark:text-slate-400 text-lg text-center mt-2">
            No se encontraron resguardantes en la oficina seleccionada
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <StyleGlobal>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingBehavior}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          }}
        >
          <Header dataWorkPlace={dataWorkPlace} />

          <FlatList
            data={displayedData}
            renderItem={({ item }) => (
              <Item
                item={item as Resguardante}
                onPressUserKey={handleOpenUserModal}
                access_token={access_token}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            // --- CONFIGURACIÓN DE SCROLL INFINITO ---
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5} // Ejecutar cuando falte 50% de la pantalla para llegar al final
            ListFooterComponent={renderFooter}
            // ----------------------------------------
            ListHeaderComponent={
              <>
                <ResguardantesHeader
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  onAddPress={handleOpenAddModal}
                  onFilterOfficePress={handleOpenFilterOfficeSelector}
                  onClearFilter={handleClearFilter} // <--- PASAMOS LA FUNCIÓN
                  selectedFilterOfficeName={filterOffice?.nombre || null}
                />
              </>
            }
            ListEmptyComponent={EmptyListComponent}
          />
        </View>
      </KeyboardAvoidingView>

      {/* --- Modales --- */}
      <AddResguardanteModal
        visible={isAddModalVisible}
        onClose={handleCloseAddModal}
        onSave={handleSaveResguardante}
        formData={addFormData}
        setFormData={setAddFormData}
        onSelectOffice={handleOpenOfficeSelectorForAdd}
        selectedOfficeName={addFormData.nombre_oficina}
      />

      <CreateUserModal
        visible={isUserModalVisible}
        onClose={handleCloseUserModal}
        onSave={handleCreateUser}
        userData={userFormData}
        setUserData={setUserFormData}
        resguardanteName={
          selectedResguardanteForUser
            ? `${selectedResguardanteForUser.res_nombre} ${selectedResguardanteForUser.res_apellidos}`
            : ''
        }
      />

      <Select_Oficina_DropDown
        visible={isOfficeSelectorVisible}
        onClose={() => setOfficeSelectorVisible(false)}
        onSelect={handleOfficeSelectedForAdd}
        access_token={access_token}
      />

      {/* --- SELECTOR 2: PARA FILTRAR (El nuevo independiente) --- */}
      <Select_Oficina_DropDown
        visible={isFilterOfficeSelectorVisible}
        onClose={() => setFilterOfficeSelectorVisible(false)}
        onSelect={handleFilterOfficeSelected} // Usa el handler específico para FILTRAR
        access_token={access_token}
      />

      <InfoAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
      />
    </StyleGlobal>
  );
}
