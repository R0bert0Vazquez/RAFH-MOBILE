import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import React, { useState, memo, useEffect } from 'react';

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getDashboard } from '@/src/controllers/controllers_gestor/workPlace.controller';
import {
  DataWorkPlace,
  Access_token,
  DashboardWorkPlace,
  UltimosMovimientos,
  Stats,
  Notification,
} from '@/src/models/types';

interface MovimientoItem extends UltimosMovimientos {
  id: number;
}

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace: DataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

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

const WorkPlaceHeader = ({
  stats,
  notificaciones,
}: {
  stats: Stats | undefined;
  notificaciones: Notification[] | undefined;
}) => {
  return (
    <>
      <View className="items-center mt-1 landscape:flex-1 landscape:mt-1">
        <View className="w-11/12 md:w-10/12 lg:w-10/12 mb-3">
          <View className="bg-white dark:bg-[#14161A] p-1 border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
            <Text className="text-center text-gray-700 dark:text-slate-300 text-xl md:text-2xl lg:text-2xl font-semibold mb-1">
              {dataWorkPlace.title}
            </Text>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                className="ml-2"
                name="archive-outline"
                size={30}
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
                size={30}
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
                size={30}
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
                size={30}
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
        <Text className="text-gray-700 dark:text-slate-300 text-3xl md:text-3xl lg:text-3xl font-bold">
          Notificaciones
        </Text>
      </View>

      <View className="w-full">
        <NotificationCarousel notificaciones={notificaciones} />
      </View>

      <View className="items-center mt-1 mb-2">
        <Text className="text-gray-700 dark:text-slate-300 text-3xl md:text-3xl lg:text-3xl font-bold">
          Ultimos movimientos:
        </Text>
      </View>
    </>
  );
};

const ItemComponent = ({
  item,
  isExpanded,
  onPress,
}: {
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
              <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-lg lg:text-lg">
                <Text className="font-bold">{item.tipo}</Text>
                <Text className="font-normal mx-1"> de </Text>
                <Text className="font-bold">{item.bien_involucrado}</Text>
              </Text>
            </View>
            {/* Mostrar info desplegable */}
            {isExpanded && (
              <View className="w-11/12 mx-auto mt-3 pt-1 border-t-2 border-gray-200 dark:border-[#25A4D6]">
                <View className="flex-row p-1">
                  <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl">
                    <Text className="font-bold">Gestor: </Text>
                    <Text>{item.gestor_encargado}</Text>
                  </Text>
                </View>
                <View className="flex-row p-1">
                  <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl">
                    <Text className="font-bold">Resguardante: </Text>
                    <Text>{item.resguardante_responsable}</Text>
                  </Text>
                </View>
                <View className="flex-row p-1">
                  <Text className="flex-1 text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl">
                    <Text className="font-bold">Área: </Text>
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

const NotificationCard = ({ item }: { item: Notification }) => {
  const handleAuthorize = () => {
    console.log('Autorizar traspaso:', item.id_traspaso);
    // Aquí puedes poner tu lógica para llamar a la API de autorización
  };

  const handleDeny = () => {
    console.log('Denegar traspaso:', item.id_traspaso);
    // Aquí puedes poner tu lógica para llamar a la API de denegación
  };

  return (
    <View className="items-center">
      <View className="w-11/12 md:w-10/12 lg:w-10/12 p-3 bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-inner">
        <Text className="text-center text-gray-700 dark:text-slate-300 text-xl md:text-2xl lg:text-2xl font-semibold mb-3 italic">
          Solicitud de Transferencia
        </Text>

        <Text
          className="text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl mb-1"
          numberOfLines={1}
        >
          <Text className="font-bold">Transferencia de bien: </Text>
          <Text>{item.bien_nombre}</Text>
        </Text>
        <Text
          className="text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl mb-1"
          numberOfLines={1}
        >
          <Text className="font-bold">Emisor:</Text>
          <Text> {item.emisor} </Text>
        </Text>
        <Text
          className="text-gray-700 dark:text-slate-400 text-base md:text-xl lg:text-xl mb-1"
          numberOfLines={1}
        >
          <Text className="font-bold">Receptor:</Text>
          <Text> {item.receptor} </Text>
        </Text>

        <View className="flex-row justify-around mt-2">
          <Pressable
            onPress={handleDeny}
            className="flex-1 bg-red-600 active:bg-red-700 rounded-lg py-3 px-4 mr-2"
          >
            <Text className="text-white font-bold text-center">Denegar</Text>
          </Pressable>
          <Pressable
            onPress={handleAuthorize}
            className="flex-1 bg-green-600 active:bg-green-700 rounded-lg py-3 px-4 ml-2"
          >
            <Text className="text-white font-bold text-center">Autorizar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const NotificationCarousel = ({
  notificaciones,
}: {
  notificaciones: Notification[] | undefined;
}) => {
  const { width } = useWindowDimensions();

  if (!notificaciones || notificaciones.length === 0) {
    return (
      <View className="items-center mb-3 px-5">
        <Text className="text-base text-gray-500 dark:text-slate-500 italic text-center">
          No tienes notificaciones pendientes.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ height: 220 }} className="mb-1">
      <FlatList
        data={notificaciones}
        renderItem={({ item }) => (
          <View style={{ width: width }}>
            <NotificationCard item={item} />
          </View>
        )}
        keyExtractor={(item) => item.id_traspaso.toString()}
        // horizontal
        // pagingEnabled // <-- Esta es la magia para el efecto carrusel
        // showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export function Gest_WorkPlace({
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

  // console.log('\nToken de Acceso:', access_token);
  // console.log('ID del Centro de Trabajo:', workCenterId);

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
            color={colorScheme === 'light' ? 'gray' : 'white'}
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
              <>
                <Header dataWorkPlace={dataWorkPlace} />
                <WorkPlaceHeader
                  stats={dashboardData?.stats}
                  notificaciones={dashboardData?.notificaciones}
                />
              </>
            }
            ListEmptyComponent={
              <View className="items-center mb-3 px-5">
                <Text className="text-base text-gray-500 dark:text-slate-500 italic text-center">
                  No tienes ultimos movimientos registrados.
                </Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </StyleGlobal>
  );
}
