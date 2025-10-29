import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  FlatList,
} from 'react-native';
import React, { useState, memo } from 'react';

import { StyleGlobal } from '../components/styleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
const Icon_itch = require('@/assets/icon_itch.png');

interface Resguardante {
  res_nombre: string;
  res_apellido1: string;
  res_apellido2: string;
  res_puesto: string;
  res_correo: string;
  res_departamento: string;
  res_telefono: string;
  re_id_usuario: string;
}

interface DataBien {
  bien_codigo: string;
  bien_nombre: string;
  bien_categoria: string;
  bien_ubicacion_actual: string;
  bien_estado: string;
  bien_modelo: string;
  bien_marca: string;
  bien_fecha_adquisision: string;
  bien_valor_monetario: string;
  bien_id_dep: string;
}

const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

const DATABIEN: DataBien[] = [
  {
    bien_codigo: 'ITCH-B-001',
    bien_nombre: 'Computadora de Escritorio',
    bien_categoria: 'Equipo de Cómputo',
    bien_ubicacion_actual: 'Edificio A - Laboratorio de Sistemas',
    bien_estado: 'Activo',
    bien_modelo: 'OptiPlex 5070',
    bien_marca: 'Dell',
    bien_fecha_adquisision: '2023-08-10',
    bien_valor_monetario: '18500.00',
    bien_id_dep: 'DEP-SISTEMAS',
  },
  {
    bien_codigo: 'ITCH-B-002',
    bien_nombre: 'Proyector Multimedia',
    bien_categoria: 'Equipo Audiovisual',
    bien_ubicacion_actual: 'Aula 201 - Edificio Principal',
    bien_estado: 'Mantenimiento',
    bien_modelo: 'PowerLite 1781W',
    bien_marca: 'Epson',
    bien_fecha_adquisision: '2022-03-15',
    bien_valor_monetario: '12500.00',
    bien_id_dep: 'DEP-AUDIOVISUAL',
  },
  {
    bien_codigo: 'ITCH-B-003',
    bien_nombre: 'Aire Acondicionado',
    bien_categoria: 'Climatización',
    bien_ubicacion_actual: 'Biblioteca - Sala de Estudio',
    bien_estado: 'Inactivo',
    bien_modelo: 'Split Inverter 2T',
    bien_marca: 'Mabe',
    bien_fecha_adquisision: '2021-11-20',
    bien_valor_monetario: '8200.00',
    bien_id_dep: 'DEP-MANTENIMIENTO',
  },
  {
    bien_codigo: 'ITCH-B-004',
    bien_nombre: 'Impresora Láser',
    bien_categoria: 'Equipo de Oficina',
    bien_ubicacion_actual: 'Coordinación Académica',
    bien_estado: 'Activo',
    bien_modelo: 'LaserJet Pro M404n',
    bien_marca: 'HP',
    bien_fecha_adquisision: '2023-01-30',
    bien_valor_monetario: '6500.00',
    bien_id_dep: 'DEP-ADMINISTRATIVO',
  },
  {
    bien_codigo: 'ITCH-B-005',
    bien_nombre: 'Microscopio Binocular',
    bien_categoria: 'Equipo de Laboratorio',
    bien_ubicacion_actual: 'Laboratorio de Química - Edificio C',
    bien_estado: 'Activo',
    bien_modelo: 'CX23',
    bien_marca: 'Olympus',
    bien_fecha_adquisision: '2022-09-05',
    bien_valor_monetario: '15400.00',
    bien_id_dep: 'DEP-QUIMICA',
  },
  {
    bien_codigo: 'ITCH-B-006',
    bien_nombre: 'Pizarra Interactiva',
    bien_categoria: 'Equipo Didáctico',
    bien_ubicacion_actual: 'Aula 105 - Posgrado',
    bien_estado: 'Mantenimiento',
    bien_modelo: 'SMART Board 6052',
    bien_marca: 'Smart Technologies',
    bien_fecha_adquisision: '2021-07-12',
    bien_valor_monetario: '32000.00',
    bien_id_dep: 'DEP-POSGRADO',
  },
];

const DATARESGUARDANTES: Resguardante[] = [
  {
    res_nombre: 'Juan',
    res_apellido1: 'Perez',
    res_apellido2: 'Gonzalez',
    res_puesto: 'Gestor',
    res_correo: 'juan.perez@empresa.com',
    res_departamento: 'Sistemas',
    res_telefono: '+52 123 456 7890',
    re_id_usuario: '1',
  },
];

const itemStyles: {
  [key: string]: { iconName: string };
} = {
  activo: {
    iconName: 'account-check-outline',
  },
  inactivo: {
    iconName: 'account-off-outline',
  },
  default: {
    iconName: 'account-question-outline',
  },
};

const ResguardanteHeader = ({
  itemResguardante,
}: {
  itemResguardante: Resguardante;
}) => {
  const colorScheme = useColorScheme();

  return (
    <>
      <View className="items-center mt-4 mb-5">
        <View className="flex-row items-center">
          <Image
            className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full mr-2"
            source={dataWorkPlace.image}
          />
          <Text className="text-gray-700 dark:text-slate-400 text-xl sm:text-xl md:text-4xl lg:text-5xl font-extrabold">
            {dataWorkPlace.title}
          </Text>
        </View>
      </View>

      <View className="items-center px-4">
        <View className="w-full md:w-11/12 lg:w-10/12 mb-3">
          <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
            {/* Avatar Principal */}
            <View className="flex-row items-center p-4">
              <View className="relative">
                <View className="w-12 h-12 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="account-check-outline"
                    size={40}
                    color={colorScheme === 'light' ? '#25A4D6' : 'white'}
                  />
                </View>
                <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white bg-green-400" />
              </View>

              <View className="flex-1 ml-4">
                <Text
                  className="text-gray-800 dark:text-slate-400 text-base font-bold"
                  numberOfLines={1}
                >
                  {itemResguardante.res_nombre} {itemResguardante.res_apellido1}
                  {itemResguardante.res_apellido2}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="office-building-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_departamento}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_telefono}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_correo}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <View className="px-2 py-1 rounded-lg bg-green-500/10">
                  <Text className="text-xs font-bold text-green-600">
                    Activo
                  </Text>
                </View>
                <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {itemResguardante.res_puesto}
                </Text>
              </View>
            </View>

            {/* Separador sutil */}
            <View className="h-px bg-gray-300 dark:bg-gray-700 mx-4" />

            {/* Titulo para la lista de bienes */}
            <View className="p-4">
              <Text className="text-lg font-bold text-gray-700 dark:text-slate-400">
                Bienes Asignados:
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

// Mapeo de iconos para categorías (¡puedes añadir más!)
const bienIconos: { [key: string]: string } = {
  'equipo de cómputo': 'laptop',
  'equipo audiovisual': 'projector',
  climatización: 'air-conditioner',
  'equipo de oficina': 'printer',
  'equipo de laboratorio': 'microscope',
  'equipo didáctico': 'presentation',
  default: 'cube-outline',
};

// Mapeo de colores para el FONDO (con opacidad /10)
const bienEstadosBg: { [key: string]: string } = {
  activo: 'bg-green-500/20',
  mantenimiento: 'bg-yellow-500/20',
  inactivo: 'bg-red-500/20',
  default: 'bg-gray-500/20',
};

// Mapeo de colores para el TEXTO
const bienEstadosTexto: { [key: string]: string } = {
  activo: 'text-green-600',
  mantenimiento: 'text-yellow-600',
  inactivo: 'text-red-600',
  default: 'text-gray-600',
};

const BienItem = ({ item }: { item: DataBien }) => {
  const colorScheme = useColorScheme();
  // Obtenemos el icono y el color dinámicamente
  const iconName = (bienIconos[item.bien_categoria.toLowerCase()] ||
    bienIconos.default) as any;

  // ✅ 1. Obtenemos el estilo de FONDO
  const estadoStyleBg =
    bienEstadosBg[item.bien_estado.toLowerCase()] || bienEstadosBg.default;

  // ✅ 2. Obtenemos el estilo de TEXTO
  const estadoStyleText =
    bienEstadosTexto[item.bien_estado.toLowerCase()] ||
    bienEstadosTexto.default;

  return (
    <Pressable className="items-center px-4">
      <View className="w-full md:w-11/12 lg:w-10/12 mb-3">
        <View className="bg-white bg-gren dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ">
          <View className="flex-row items-center p-4">
            {/* Icono del Bien */}
            <View className="w-10 h-10 rounded-lg items-center justify-center bg-cyan-500/10 mr-4">
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={colorScheme === 'light' ? '#22d3ee' : 'white'}
                // style={{ marginRight: 10 }}
              />
            </View>

            {/* Info del Bien */}
            <View className="flex-1">
              <Text
                className="text-gray-700 bg-red dark:text-slate-400 text-base font-semibold"
                numberOfLines={1}
              >
                {item.bien_nombre}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {item.bien_codigo}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {item.bien_ubicacion_actual}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {item.bien_modelo}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {item.bien_marca}
              </Text>
            </View>

            {/* Estado del Bien */}
            <View className="items-end">
              <View className={`px-2 py-1 rounded-lg ${estadoStyleBg}`}>
                <Text className={`text-xs font-bold ${estadoStyleText}`}>
                  {item.bien_estado}
                </Text>
              </View>
              {/* <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                {item.bien_marca}
              </Text> */}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export function InfoResguardante() {
  const insets = useSafeAreaInsets();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const miResguardante = DATARESGUARDANTES[0];

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
            data={DATABIEN}
            ListHeaderComponent={
              <ResguardanteHeader itemResguardante={miResguardante} />
            }
            renderItem={({ item }) => <BienItem item={item} />}
            keyExtractor={(item) => item.bien_codigo}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </StyleGlobal>
  );
}
