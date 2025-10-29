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

// interface DataItem {
//   res_nombre: string;
//   res_apellido1: string;
//   res_apellido2: string;
//   res_puesto: string;
//   res_correo: string;
//   res_departamento: string;
//   res_telefono: string;
//   re_id_usuario: string;
// }

// const itemStyles: {
//   [key: string]: { iconName: string };
// } = {
//   activo: {
//     iconName: 'account-check-outline',
//   },
//   inactivo: {
//     iconName: 'account-off-outline',
//   },
//   default: {
//     iconName: 'account-question-outline',
//   },
// };

const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

// const DATA = [
//   {
//     id: 1,
//     name: 'Juan Perez',
//     area: 'Sistemas',
//     rol: 'Gestor',
//     estado: 'Activo',
//     numero: '+52 123 456 7890',
//     correo: 'juan.perez@empresa.com',
//   },
//   {
//     id: 2,
//     name: 'Ana Pech',
//     area: 'Recursos Humanos',
//     rol: 'Resguardante',
//     estado: 'Inactivo',
//     numero: '+52 234 567 8901',
//     correo: 'ana.pech@empresa.com',
//   },
//   {
//     id: 3,
//     name: 'Carlos Lopez',
//     area: 'Contabilidad',
//     rol: 'Resguardante',
//     estado: 'Activo',
//     numero: '+52 345 678 9012',
//     correo: 'carlos.lopez@empresa.com',
//   },
//   {
//     id: 4,
//     name: 'Maria Garcia',
//     area: 'Contabilidad',
//     rol: 'Resguardante',
//     estado: 'Activo',
//     numero: '+52 456 789 0123',
//     correo: 'maria.garcia@empresa.com',
//   },
//   {
//     id: 5,
//     name: 'Farid Djamel',
//     area: 'Ingles',
//     rol: 'Resguardante',
//     estado: 'Activo',
//     numero: '+52 567 890 1234',
//     correo: 'farid.djamel@empresa.com',
//   },
//   {
//     id: 6,
//     name: 'Hector Cruz',
//     area: 'Inovacion',
//     rol: 'Resguardante',
//     estado: 'Activo',
//     numero: '+52 678 901 2345',
//     correo: 'hector.cruz@empresa.com',
//   },
//   {
//     id: 7,
//     name: 'Alejandro Poot',
//     area: 'Inovacion',
//     rol: 'Resguardante',
//     estado: 'Activo',
//     numero: '+52 789 012 3456',
//     correo: 'alejandro.poot@empresa.com',
//   },
//   {
//     id: 8,
//     name: 'Alejandro Pech',
//     area: 'Ingles',
//     rol: 'Resguardante',
//     estado: 'Activo',
//     numero: '+52 890 123 4567',
//     correo: 'alejandro.pech@empresa.com',
//   },
//   {
//     id: 9,
//     name: 'Ana Pech',
//     area: 'Recursos Humanos',
//     rol: 'Resguardante',
//     estado: 'Inactivo',
//     numero: '+52 901 234 5678',
//     correo: 'ana.pech2@empresa.com',
//   },
// ];

const DATA: Resguardante[] = [
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
  {
    res_nombre: 'Ana',
    res_apellido1: 'Pech',
    res_apellido2: 'Hernandez',
    res_puesto: 'Resguardante',
    res_correo: 'ana.pech@empresa.com',
    res_departamento: 'Recursos Humanos',
    res_telefono: '+52 234 567 8901',
    re_id_usuario: '2',
  },
  {
    res_nombre: 'Carlos',
    res_apellido1: 'Lopez',
    res_apellido2: 'Martinez',
    res_puesto: 'Resguardante',
    res_correo: 'carlos.lopez@empresa.com',
    res_departamento: 'Contabilidad',
    res_telefono: '+52 345 678 9012',
    re_id_usuario: '3',
  },
  {
    res_nombre: 'Maria',
    res_apellido1: 'Garcia',
    res_apellido2: 'Rodriguez',
    res_puesto: 'Resguardante',
    res_correo: 'maria.garcia@empresa.com',
    res_departamento: 'Contabilidad',
    res_telefono: '+52 456 789 0123',
    re_id_usuario: '4',
  },
  {
    res_nombre: 'Farid',
    res_apellido1: 'Djamel',
    res_apellido2: 'Alvarez',
    res_puesto: 'Resguardante',
    res_correo: 'farid.djamel@empresa.com',
    res_departamento: 'Ingles',
    res_telefono: '+52 567 890 1234',
    re_id_usuario: '5',
  },
  {
    res_nombre: 'Hector',
    res_apellido1: 'Cruz',
    res_apellido2: 'Santos',
    res_puesto: 'Resguardante',
    res_correo: 'hector.cruz@empresa.com',
    res_departamento: 'Inovacion',
    res_telefono: '+52 678 901 2345',
    re_id_usuario: '6',
  },
  {
    res_nombre: 'Alejandro',
    res_apellido1: 'Poot',
    res_apellido2: 'Castro',
    res_puesto: 'Resguardante',
    res_correo: 'alejandro.poot@empresa.com',
    res_departamento: 'Inovacion',
    res_telefono: '+52 789 012 3456',
    re_id_usuario: '7',
  },
  {
    res_nombre: 'Alejandro',
    res_apellido1: 'Pech',
    res_apellido2: 'Vargas',
    res_puesto: 'Resguardante',
    res_correo: 'alejandro.pech@empresa.com',
    res_departamento: 'Ingles',
    res_telefono: '+52 890 123 4567',
    re_id_usuario: '8',
  },
  {
    res_nombre: 'Ana',
    res_apellido1: 'Pech',
    res_apellido2: 'Morales',
    res_puesto: 'Resguardante',
    res_correo: 'ana.pech2@empresa.com',
    res_departamento: 'Recursos Humanos',
    res_telefono: '+52 901 234 5678',
    re_id_usuario: '9',
  },
];

const ResguardantesHeader = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  // --- AÑADE ESTAS VARIABLES DE ESTILO ---
  const modalBackgroundColor = isDarkMode ? '#14161A' : '#f1f5f9';
  const modalBorderColor = isDarkMode ? 'e5e7eb' : '#e5e7eb'; // Borde gris claro
  const modalTextColor = 'gray';
  const modalSearchBgColor = isDarkMode ? '#14161A' : '#ffffff'; // Un poco más oscuro/claro que el fondo
  const modalSearchBorderColor = isDarkMode ? '#334155' : '#e2e8f0';
  // --- FIN DE VARIABLES ---

  const [valueTextInp, setValueTextInp] = useState('');

  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  // const [itemsEstados, setItemsEstados] = useState([
  //   {
  //     label: 'Sin filtro',
  //     value: 'sin-filtro',
  //     iconName: 'filter-variant-remove',
  //   },
  //   { label: 'Activos', value: 'activos', iconName: 'check-circle' },
  //   { label: 'Inactivos', value: 'inactivos', iconName: 'close-circle' },
  // ]);

  const [openDepartamento, setOpenDepartamento] = useState(false);
  const [valueDepartamento, setValueDepartamento] = useState(null);
  const [itemsDepartamento, setItemsDepartamento] = useState([
    {
      label: 'Sin filtro',
      value: 'sin-filtro',
      iconName: 'filter-variant-remove',
    },
    {
      label: 'Sistemas',
      value: 'sistemas',
      iconName: 'office-building-outline',
    },
    {
      label: 'Recursos Humanos',
      value: 'recursos-humanos',
      iconName: 'office-building-outline',
    },
    {
      label: 'Contabilidad',
      value: 'contabilidad',
      iconName: 'office-building-outline',
    },
    {
      label: 'Ingles',
      value: 'ingles',
      iconName: 'office-building-outline',
    },
    {
      label: 'Inovacion',
      value: 'inovacion',
      iconName: 'office-building-outline',
    },
  ]);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6', // Color principal (reemplaza el morado)
      background: 'transparent', // Fondo del input
      onSurface: 'gray', // Color del texto que se escribe
      // placeholder: 'gray', // Color del texto del label cuando no está activo
      onSurfaceVariant: 'gray', // Color del borde o línea cuando no está activo
    },
  };

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

      <View className="items-center mb-5">
        <View className="flex-row">
          <View className="relative">
            <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 mr-2">
              <TextInput
                mode="flat"
                returnKeyType="search"
                theme={customTheme}
                value={valueTextInp}
                onChangeText={setValueTextInp}
                label="Buscar"
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
                  width: 150,
                  backgroundColor: 'transparent',
                  marginRight: 4,
                  borderBottomColor: 'transparent',
                }}
              />
            </View>
          </View>

          <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 mr-2">
            <DropDownPicker
              theme="DARK"
              open={openDepartamento}
              value={valueDepartamento}
              setOpen={setOpenDepartamento}
              items={itemsDepartamento}
              setValue={setValueDepartamento}
              setItems={setItemsDepartamento}
              placeholder="Filtrar Departamento"
              listMode="MODAL"
              modalAnimationType="fade"
              // onOpen={() => setOpen(false)} //Cerrar el otro al abrir este
              // Título y Búsqueda
              modalTitle="Selecciona un Departamento"
              searchable={true}
              searchPlaceholder="Buscar departamento..."
              // Estilo del Contenedor del Modal
              modalContentContainerStyle={{
                backgroundColor: modalBackgroundColor,
                borderWidth: 1,
                borderColor: modalBorderColor,
                borderRadius: 10,
              }}
              // Estilo del Título
              modalTitleStyle={{
                color: modalTextColor,
                fontWeight: 'bold',
              }}
              // Estilo del Contenedor de Búsqueda
              searchContainerStyle={{
                borderBottomColor: modalBorderColor,
              }}
              // Estilo del Input de Búsqueda
              searchTextInputStyle={{
                color: modalTextColor,
                backgroundColor: modalSearchBgColor,
                borderColor: modalSearchBorderColor,
                borderRadius: 8,
                borderWidth: 1,
              }}
              // Estilo del Item
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              containerStyle={{
                justifyContent: 'flex-end',
                width: 170,
              }}
              textStyle={{
                color: 'gray',
              }}
              dropDownContainerStyle={{
                backgroundColor:
                  colorScheme === 'light' ? '#f1f5f9' : '#14161A',
                borderColor: colorScheme === 'light' ? 'gray' : 'cyan',
                borderWidth: 0.5,
                borderRadius: 10,
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
              }}
              renderListItem={(props) => (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  onPress={() => {
                    // @ts-ignore
                    props.onPress(props.item);
                  }}
                >
                  <Text style={{ color: 'gray' }}>{props.item.label}</Text>
                  <MaterialCommunityIcons // @ts-ignore
                    name={props.item.iconName}
                    size={20}
                    color="gray"
                    style={{ marginLeft: 5 }}
                  />
                </Pressable>
              )}
            />
          </View>

          {/* <View className="flex-col md:flex-row lg:flex-row items-center">
             <View
              style={{ zIndex: open ? 5000 : 1 }}
              className="mr-0 md:mr-2 mb-2 md:mb-0"
            >
              <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 mr-2">
                <DropDownPicker
                  theme="DARK"
                  open={open}
                  value={value}
                  items={itemsEstados}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItemsEstados}
                  placeholder="Filtrar Estado"
                  listMode="SCROLLVIEW"
                  modalAnimationType="fade"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  containerStyle={{
                    justifyContent: 'flex-end',
                    width: 170,
                  }}
                  textStyle={{
                    color: 'gray',
                  }}
                  dropDownContainerStyle={{
                    marginTop: '-205%',
                    backgroundColor:
                      colorScheme === 'light' ? '#f1f5f9' : '#14161A',
                    borderColor: colorScheme === 'light' ? 'gray' : 'gray',
                    borderWidth: 0.5,
                    borderRadius: 10,
                    borderTopStartRadius: 10,
                    borderTopEndRadius: 10,
                  }}
                  renderListItem={(props) => (
                    <Pressable
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                      }}
                      onPress={() => {
                        // @ts-ignore
                        props.onPress(props.item);
                      }}
                    >
                      <Text style={{ color: 'gray', fontFamily: 'Audiowide' }}>
                        {props.item.label}
                      </Text>
                      <MaterialCommunityIcons // @ts-ignore
                        name={props.item.iconName}
                        size={20}
                        color={
                          props.item.value === 'activos'
                            ? '#4ade80'
                            : props.item.value === 'inactivos'
                              ? '#f87171'
                              : 'gray'
                        }
                      />
                    </Pressable>
                  )}
                />
              </View>
            </View>
          </View> */}
        </View>
      </View>
    </>
  );
};

const ItemComponent = ({ item }: { item: Resguardante }) => {
  // const styleInfo = itemStyles[item..toLowerCase()] || itemStyles.default;
  // const iconName = styleInfo.iconName as any;
  // const isActive = item.estado.toLowerCase() === 'activo';
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleSelectResguardante = () => {
    console.log('Resguardante seleccionado: ', item.re_id_usuario);
    navigation.navigate('InfoResguardante' as never);
  };

  return (
    <View>
      <View className="items-center px-4">
        <View className="w-full md:w-11/12 lg:w-10/12 mb-3">
          <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
            {/* Avatar y info principa; */}
            <View className="flex-row items-center p-4">
              <View className="relative">
                <View className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-cyan-500 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="account-check-outline"
                    size={24}
                    color={colorScheme === 'light' ? '#25A4D6' : 'white'}
                  />
                </View>
                <View
                  // className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white ${isActive ? 'bg-green-400' : 'bg-red-400'}`}
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white bg-green-400"
                />
              </View>

              <View className="flex-1 ml-4">
                <Text
                  className="text-gray-800 dark:text-slate-400 text-base font-bold"
                  numberOfLines={1}
                >
                  {item.res_nombre}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="office-building-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {item.res_departamento}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <View
                  // className={`px-2 py-1 rounded-lg ${isActive ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                  className="px-2 py-1 rounded-lg bg-green-500/10"
                >
                  <Text
                    // className={`text-xs font-bold ${isActive ? 'text-green-600' : 'text-red-600'}`}
                    className="text-xs font-bold text-green-600"
                  >
                    Activo
                  </Text>
                </View>
                <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {item.res_puesto}
                </Text>
              </View>
            </View>

            {/* Separador sutil */}
            <View className="h-px bg-gray-300 dark:bg-gray-700 mx-4" />

            {/* Info rapida */}
            <View className="flex-row justify-around py-3">
              <Pressable className="flex-1 items-center py-2">
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={18}
                  color="#25A4D6"
                />
                <Text className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                  {item.res_telefono}
                </Text>
              </Pressable>

              <View className="w-px bg-gray-300 dark:bg-gray-700" />

              <Pressable className="flex-1 items-center mx-2 py-2">
                <MaterialCommunityIcons
                  name="email-outline"
                  size={18}
                  color="#25A4D6"
                />
                <Text
                  className="text-blue-600 dark:text-blue-400 text-xs mt-1"
                  numberOfLines={1}
                >
                  {item.res_correo}
                </Text>
              </Pressable>

              <View className="w-px bg-gray-300 dark:bg-gray-700" />

              <Pressable
                onPress={handleSelectResguardante}
                className="flex-1 items-center py-2"
              >
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color="#25A4D6"
                />
                <Text className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                  Detalles
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const Item = memo(ItemComponent);

export function Resguardantes() {
  const insets = useSafeAreaInsets();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

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
          <ResguardantesHeader />
          <FlatList
            data={DATA}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.re_id_usuario.toString()}
            keyboardShouldPersistTaps="handled"
            // ListHeaderComponent={ResguardantesHeader}
          />
        </View>
      </KeyboardAvoidingView>
    </StyleGlobal>
  );
}
