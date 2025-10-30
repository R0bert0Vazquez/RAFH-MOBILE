import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import React, { useState, memo, useEffect } from 'react';

import { StyleGlobal } from '../components/styleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import { getDashboard } from '@/src/controllers/workPlace.controller';
import {
  Access_token,
  DashboardWorkPlace,
  UltimosMovimientos,
  Stats,
} from '@/src/models/types';

interface MovimientoItem extends UltimosMovimientos {
  id: number;
}

const Icon_itch = require('@/assets/icon_itch.png');

const itemStyles: {
  [key: string]: { iconName: string; color?: string; shadowClass?: string };
} = {
  transferencia: {
    iconName: 'file-document-arrow-right-outline',
    color: '#D7D756',
    shadowClass: 'shadow-yellow-500 dark:shadow-yellow-500',
  },
  registro: {
    iconName: 'text-box-edit-outline',
    color: '#198A43',
    shadowClass: 'shadow-green-400 dark:shadow-green-500',
  },
  mantenimiento: {
    iconName: 'archive-cog-outline',
    color: '#FFA500',
    shadowClass: 'shadow-orange-400 dark:shadow-orange-500',
  },
  default: {
    iconName: 'information-outline',
    color: 'gray',
    shadowClass: 'shadow-gray-600 dark:shadow-cyan-400',
  },
};

const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
  bienesRegistrados: '5,642',
  gestoresAsignados: 15,
  areasAsociadas: 12,
  resguardantesRegistrados: 545,
};

const WorkPlaceHeader = ({ stats }: { stats: Stats | undefined }) => {
  const colorScheme = useColorScheme();

  const [valueTextInp, setValueTextInp] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [itemsTipo, setTipo] = useState([
    {
      label: 'Sin filtro',
      value: 'sin-filtro',
      iconName: 'filter-variant-remove',
    },
    {
      label: 'Transferencia',
      value: 'transferencia',
      iconName: 'file-document-arrow-right-outline',
    },
    { label: 'Registro', value: 'registro', iconName: 'text-box-edit-outline' },
    {
      label: 'Mantenimiento',
      value: 'mantenimiento',
      iconName: 'archive-cog-outline',
    },
  ]);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6', // Color principal (reemplaza el morado)
      background: 'transparent', // Fondo del input
      onSurface: 'gray', // Color del texto que se escribe
      onSurfaceVariant: 'gray', // Color del borde o línea cuando no está activo
    },
  };

  return (
    <>
      {/* <View className="landscape:flex-row landscape:items-start landscape:mx-2">
        <View className="portrait:items-center mt-1 mb-2">
          <View className="flex-row portrait:items-center">
            <Image
              className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full portrait:mr-2"
              source={dataWorkPlace.image}
            />
            {!isLandscape && (
              <Text className="text-gray-700 dark:text-slate-400 text-xl sm:text-xl md:text-4xl lg:text-5xl font-extrabold">
                {dataWorkPlace.title}
              </Text>
            )}
          </View>
        </View>

        <View className="items-center mt-1 landscape:flex-1 landscape:mt-1">
          <View className="w-11/12 md:w-10/12 lg:w-10/12 mb-3">
            <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
              <Text className="text-center text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-semibold mb-1">
                {dataWorkPlace.title}
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  className="ml-2"
                  name="archive-outline"
                  size={35}
                  color="#25A4D6"
                />
                <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                  Bienes registrados: {stats?.bienes_registrados}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  className="ml-2"
                  name="account-group-outline"
                  size={35}
                  color="#25A4D6"
                />
                <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                  Gestores asignados: {stats?.gestores_asignados}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  className="ml-2"
                  name="floor-plan"
                  size={35}
                  color="#25A4D6"
                />
                <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                  Áreas asociadas: {stats?.areas_asociadas}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  className="ml-2"
                  name="account-supervisor-outline"
                  size={35}
                  color="#25A4D6"
                />
                <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                  Resguardantes registrados: {stats?.resguardantes_registrados}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View> */}

      <View className="items-center mt-1 mb-1">
        <View className="flex-row items-center">
          <Image
            className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full mr-2"
            source={dataWorkPlace.image}
          />
          <Text className="text-gray-700 dark:text-slate-400 text-xl sm:text-xl md:text-4xl lg:text-5xl font-extrabold">
            {dataWorkPlace.title}
          </Text>
        </View>
      </View>

      <View className="items-center mt-1 landscape:flex-1 landscape:mt-1">
        <View className="w-11/12 md:w-10/12 lg:w-10/12 mb-3">
          <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
            <Text className="text-center text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-semibold mb-1">
              {dataWorkPlace.title}
            </Text>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                className="ml-2"
                name="archive-outline"
                size={35}
                color="#25A4D6"
              />
              <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                Bienes registrados: {stats?.bienes_registrados}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                className="ml-2"
                name="account-group-outline"
                size={35}
                color="#25A4D6"
              />
              <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                Gestores asignados: {stats?.gestores_asignados}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                className="ml-2"
                name="floor-plan"
                size={35}
                color="#25A4D6"
              />
              <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                Áreas asociadas: {stats?.areas_asociadas}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                className="ml-2"
                name="account-supervisor-outline"
                size={35}
                color="#25A4D6"
              />
              <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-normal ml-2">
                Resguardantes registrados: {stats?.resguardantes_registrados}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="items-center mt-1 mb-2">
        <Text className="text-gray-700 dark:text-slate-400 text-2xl md:text-2xl lg:text-2xl font-bold">
          Ultimos movimientos:
        </Text>
      </View>

      <View className="mt-1 landscape:flex-1 landscape:mt-1 mb-3">
        <View className="landscape:items-center md:items-center">
          <View className="flex-col landscape:flex-row md:flex-row lg:flex-row items-center">
            <View className="w-11/12 landscape:w-5/12 md:w-5/12 bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 landscape:mr-2 md:mr-2 ">
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
                  backgroundColor: 'transparent',
                }}
              />
            </View>

            <View className="w-11/12 landscape:w-5/12 md:w-5/12 mt-1 md:mt-0 lg:mt-0 bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
              <DropDownPicker
                theme="DARK"
                open={open}
                value={value}
                items={itemsTipo}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setTipo}
                placeholder="Filtrar Movimiento"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
                containerStyle={{
                  justifyContent: 'flex-end',
                  marginLeft: 2,
                }}
                textStyle={{
                  color: 'gray',
                }}
                dropDownContainerStyle={{
                  marginTop: '-300%',
                  backgroundColor:
                    colorScheme === 'light' ? 'white' : '#14161A',
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
                        props.item.value === 'transferencia'
                          ? '#D7D756'
                          : props.item.value === 'registro'
                            ? '#198A43'
                            : props.item.value === 'mantenimiento'
                              ? '#FFA500'
                              : 'gray'
                      }
                    />
                  </Pressable>
                )}
              ></DropDownPicker>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const ItemComponent = ({
  item,
  isExpanded,
  onPress,
}: {
  // item: DataItem;
  item: MovimientoItem;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const styleInfo = itemStyles[item.tipo.toLowerCase()] || itemStyles.default;
  const iconName = styleInfo.iconName as any;
  const iconColor = styleInfo.color;

  return (
    <Pressable onPress={onPress}>
      <View className="items-center">
        <View className="w-11/12 md:w-10/12 lg:w-10/12 mb-2">
          <View
            className={`bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 `}
          >
            <View className="flex-row items-center p-4">
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color={iconColor}
                style={{ marginRight: 5 }}
              />
              <Text className="flex-1 text-gray-700 dark:text-slate-400 text-sm md:text-lg lg:text-lg">
                <Text className="font-semibold">{item.tipo}</Text>
                <Text className="font-normal mx-1"> de </Text>
                <Text className="font-semibold">{item.bien_involucrado}</Text>
              </Text>
            </View>
            {/* Mostrar info desplegable */}
            {isExpanded && (
              <View className="w-11/12 mx-auto mt-3 pt-1 border-t-2 border-gray-200 dark:border-[#25A4D6]">
                <View className="flex-row p-1">
                  <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl">
                    <Text className="font-semibold">Gestor: </Text>
                    <Text>{item.gestor_encargado}</Text>
                  </Text>
                </View>
                <View className="flex-row p-1">
                  <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl">
                    <Text className="font-semibold">Resguardante: </Text>
                    <Text>{item.resguardante_responsable}</Text>
                  </Text>
                </View>
                <View className="flex-row p-1">
                  <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl">
                    <Text className="font-semibold">Área: </Text>
                    <Text>{item.area}</Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const Item = memo(ItemComponent);

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function WorkPlace({
  access_token,
  workCenterId,
}: {
  access_token: string;
  workCenterId: number;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardWorkPlace | null>(
    null,
  );
  const [movimientosData, setMovimientosData] = useState<MovimientoItem[]>([]);

  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const [expandedId, setExpandedId] = useState<number | null>(null);

  console.log('\nToken de Acceso:', access_token);
  console.log('ID del Centro de Trabajo:', workCenterId);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const credenciales: Access_token = {
          access_token: access_token,
        };

        const getDashboardRespuesta = await getDashboard(credenciales);
        setDashboardData(getDashboardRespuesta);

        const movimientosProcesados: MovimientoItem[] =
          getDashboardRespuesta.ultimos_movimientos.map((item, index) => {
            return {
              id: index,
              tipo: item.tipo,
              bien_involucrado: item.bien_involucrado,
              gestor_encargado: item.gestor_encargado,
              resguardante_responsable: item.resguardante_responsable,
              area: item.area,
            };
          });
        setMovimientosData(movimientosProcesados);

        console.log(
          '\nRespuesta completa del Dashboard:',
          JSON.stringify(getDashboardRespuesta),
        );
        console.log(
          '\nRespuesta filtrada por ultimos movimientos del Dashboard:',
          JSON.stringify(getDashboardRespuesta.ultimos_movimientos),
        );
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        if (error.message) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [access_token, workCenterId]);

  const handleSelectItem = (item: MovimientoItem) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpandedId(expandedId === item.id ? null : item.id);
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

  if (error) {
    return (
      <StyleGlobal>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: 'red', padding: 20, textAlign: 'center' }}>
            Error: {error}
          </Text>
        </View>
      </StyleGlobal>
    );
  }

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
            data={movimientosData}
            renderItem={({ item }) => (
              <Item
                item={item}
                isExpanded={expandedId === item.id}
                onPress={() => handleSelectItem(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedId}
            ListHeaderComponent={
              <WorkPlaceHeader stats={dashboardData?.stats} />
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </StyleGlobal>
  );
}
