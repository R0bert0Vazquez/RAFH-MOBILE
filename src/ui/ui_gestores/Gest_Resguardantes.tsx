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
} from 'react-native';
import React, { useState, memo, useMemo } from 'react';

import { StyleGlobal } from '../../components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

import { customTheme } from '@/src/components/customThemeTextInput-R.Paper';
import { dataResguardantes } from '@/src/components/dataResguardantes';

import { RootStackParamList, Resguardante } from '@/src/models/types';
import { StackNavigationProp } from '@react-navigation/stack';

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
}: {
  searchValue: string;
  onSearchChange: (text: string) => void;
}) => {
  return (
    <>
      <View className="landscape:items-center mb-3 landscape:mt-1 md:items-center">
        <View className="flex-col landscape:flex-row md:flex-row lg:flex-row items-center">
          <View className="relative w-11/12 landscape:w-5/12 md:w-5/12">
            <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 landscape:mr-2">
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
                style={{
                  backgroundColor: 'transparent',
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

// --- Componente Avatar "Chingón" ---
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

// --- Helper para filas de detalle ---
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center mb-1.5">
    <MaterialCommunityIcons
      name={icon as any}
      size={16}
      color="#6b7280" // text-gray-500
      style={{ width: 20 }}
    />
    <Text
      className="text-sm text-gray-700 dark:text-slate-300 ml-2"
      numberOfLines={1}
    >
      <Text className="font-bold">{label}: </Text>
      <Text className="font-light">{value}</Text>
    </Text>
  </View>
);

// --- EL NUEVO ITEM COMPONENT "EL PATRÓN" ---
const ItemComponent = ({ item }: { item: Resguardante }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, 'Gest_InfoResguardante'>
    >();
  const isDark = useColorScheme() === 'dark';

  // --- Funciones de Acción ---
  const handleCall = () => {
    Linking.openURL(`tel:${item.res_telefono}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${item.res_correo}`);
  };

  const handleDetails = () => {
    console.log('Ver detalles de: ', item.res_id_usuario);
    navigation.navigate('Gest_InfoResguardante', {
      res_id_usuario: item.res_id_usuario,
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
                numberOfLines={1}
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
                  {item.res_departamento}
                </Text>
              </View>
            </View>

            {/* Píldora de Estado */}
            <View className="flex-row items-center self-start rounded-full px-2.5 py-1 bg-green-100 dark:bg-green-900/40">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              <Text className="text-xs font-bold uppercase text-green-700 dark:text-green-300">
                Activo
              </Text>
            </View>
          </View>
        </Pressable>

        {/* === SECCIÓN EXPANDIBLE (DETALLES) === */}
        {isExpanded && (
          <View className="px-4 pb-4">
            <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
            <DetailRow
              icon="phone-outline"
              label="Teléfono"
              value={item.res_telefono}
            />
            <DetailRow
              icon="email-outline"
              label="Correo"
              value={item.res_correo}
            />
            <DetailRow icon="domain" label="Oficina" value={item.id_oficina} />
            <DetailRow
              icon="card-account-details-outline"
              label="RFC"
              value={item.res_rfc}
            />
            <DetailRow
              icon="card-account-details-outline"
              label="CURP"
              value={item.res_curp}
            />
          </View>
        )}

        {/* === SECCIÓN DE BOTONES (PIE DE PÁGINA) === */}
        <View className="flex-row border-t border-gray-200 dark:border-gray-700">
          {/* Botón de Llamar */}
          <Pressable
            onPress={handleCall}
            className="flex-1 flex-row items-center justify-center p-3 active:bg-gray-100 dark:active:bg-gray-700 border-r border-gray-200 dark:border-gray-700"
          >
            <MaterialCommunityIcons name="phone" size={18} color="#3B82F6" />
            <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm ml-2">
              Llamar
            </Text>
          </Pressable>

          {/* Botón de Correo */}
          <Pressable
            onPress={handleEmail}
            className="flex-1 flex-row items-center justify-center p-3 active:bg-gray-100 dark:active:bg-gray-700 border-r border-gray-200 dark:border-gray-700"
          >
            <MaterialCommunityIcons name="email" size={18} color="#10b981" />
            <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-sm ml-2">
              Correo
            </Text>
          </Pressable>

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
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const [searchValue, setSearchValue] = useState('');

  const displayedData = useMemo(() => {
    const searchTerm = searchValue.toLowerCase().trim();
    if (searchTerm === '') {
      return dataResguardantes; // Sin búsqueda, muestra todo
    }

    return dataResguardantes.filter((res) => {
      const nombreCompleto =
        `${res.res_nombre} ${res.res_apellidos}`.toLowerCase();
      return (
        nombreCompleto.includes(searchTerm) ||
        res.res_correo.toLowerCase().includes(searchTerm) ||
        res.res_departamento.toLowerCase().includes(searchTerm) ||
        res.res_puesto.toLowerCase().includes(searchTerm) ||
        res.res_rfc.toLowerCase().includes(searchTerm) ||
        res.res_curp.toLowerCase().includes(searchTerm)
      );
    });
  }, [searchValue]); // Se vuelve a calcular SOLO si 'searchValue' cambia

  const EmptyListComponent = () => (
    <View className="items-center pt-20">
      <View className="w-10/12 items-center p-4 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <MaterialCommunityIcons
          name="account-search-outline"
          size={50}
          color="gray"
        />
        <Text className="text-gray-500 dark:text-slate-400 text-lg text-center mt-2">
          No se encontraron resguardantes con {searchValue}.
        </Text>
      </View>
    </View>
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
          <FlatList
            data={displayedData}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.res_id_usuario.toString()}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <>
                <Header dataWorkPlace={dataWorkPlace} />
                <ResguardantesHeader
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                />
              </>
            }
            ListEmptyComponent={EmptyListComponent}
          />
        </View>
      </KeyboardAvoidingView>
    </StyleGlobal>
  );
}
