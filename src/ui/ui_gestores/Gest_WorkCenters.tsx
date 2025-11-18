import {
  View,
  Text,
  Image,
  Pressable,
  useColorScheme,
  FlatList,
  Platform,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
} from 'react-native';

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogoutCredenciales, RootStackParamList } from '@/src/models/types';
import { useState } from 'react';
import { logoutUsuario } from '@/src/controllers/login.controller';

const Icon_rafh = require('@/assets/icon2_512x512_rafh.png');
const Image_itch = require('@/assets/itch.png');

type WorkCentersRouteProp = RouteProp<RootStackParamList, 'Gest_WorkCenters'>;
type WorkCentersNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gest_WorkCenters'
>;

type WorkCenterItem = {
  id: number;
  name: string;
  rol: string;
  image: any;
  direccion: string;
  descripcion: string;
  responsable: string;
};
type ItemProps = {
  item: WorkCenterItem;
};

const dataWorkCenters: WorkCenterItem[] = [
  {
    id: 1,
    name: 'Instituto Tecnológico de Chetumal',
    rol: 'Administrador',
    image: Image_itch,
    direccion: 'Av. Insurgentes No. 330, Col. David G. Gtz.',
    descripcion:
      'Institución pública de educación superior y posgrado perteneciente al Tecnológico Nacional de México.',
    responsable: 'Ing. Mario Vicente González Robles',
  },
];

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

export function Gest_WorkCenters() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<WorkCentersNavigationProp>();
  const route = useRoute<WorkCentersRouteProp>();
  const colorScheme = useColorScheme();

  const { loginRespuesta } = route.params;
  const { access_token, user } = loginRespuesta;
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleLogout = async () => {
    setIsLoadingLogout(true);

    try {
      const credenciales: LogoutCredenciales = {
        access_token: access_token,
      };

      const logoutRespuesta = await logoutUsuario(credenciales);

      setTimeout(() => {
        console.log('Logout exitoso:', JSON.stringify(logoutRespuesta));
        setIsLoadingLogout(false);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 500);
    } catch (err: any) {
      setIsLoadingLogout(false);
      if (err.message) {
        console.log('Logout error:', err.message);
      }
    }
  };

  const handleWorkCenterSelect = (id: number) => {
    navigation.navigate('Gest_MainTabNavigator', {
      access_token,
      user,
      workCenterId: id,
    });
  };
  const handleSelectItemLongPress = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderHeader = () => (
    <>
      <View className="flex-row justify-between items-center w-11/12 mb-5 mt-1 mx-auto">
        <Image
          className="w-16 h-16  md:portrait:w-20 md:portrait:h-20 lg:w-24 lg:h-24 mr-2"
          source={Icon_rafh}
        />

        <Text className="flex-1 text-gray-700 dark:text-slate-200 text-2xl sm:text-2xl md:text-4xl lg:text-5xl mr-1">
          <Text className="font-extrabold">Bienvenido, </Text>
          {user.usuario_nombre}
        </Text>

        <Pressable disabled={isLoadingLogout} onPress={handleLogout}>
          <MaterialCommunityIcons
            name="logout"
            size={40}
            color={colorScheme === 'light' ? '#374151' : '#94a3b8'}
          />
        </Pressable>
      </View>

      <View className="mb-3 mx-9">
        <Text className="text-gray-700 dark:text-slate-300 text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold">
          Centros de trabajo:
        </Text>
      </View>
    </>
  );
  const renderItem = ({ item }: ItemProps) => (
    <View className="flex-1 justify-center items-center mb-3">
      <View className="w-full md:portrait:w-11/12 lg:portrait:w-11/12 lg:landscape:w-11/12">
        <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-inner shadow-gray-600">
          <View className="items-center mt-2 mb-2 mx-2">
            <View className="w-full">
              <Pressable
                disabled={isLoadingLogout}
                onPress={() => handleWorkCenterSelect(item.id)}
                onLongPress={() => handleSelectItemLongPress(item.id)}
                delayLongPress={100}
                className="flex-col p-2 bg-slate-100 dark:bg-slate-800 active:bg-slate-300 active:dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-700 rounded-md shadow-sm ios:shadow-sm shadow-gray-600 dark:shadow-cyan-50"
              >
                <Image
                  className="w-full h-48 md:w-full md:h-96 lg:w-full lg:h-96 rounded-md"
                  source={item.image}
                ></Image>
                <View className="flex-1 flex-col p-3 ">
                  <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl lg:text-2xl font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-700 dark:text-slate-400 text-xl italic">
                    {item.rol}
                  </Text>
                </View>
                {expandedId === item.id && (
                  <View className="p-3 border-t-2 border-gray-200 dark:border-gray-600 mt-2">
                    <Text className="text-gray-800 dark:text-slate-300 font-bold text-lg mb-1">
                      Dirección:
                    </Text>
                    <Text className="text-gray-700 dark:text-slate-400 text-base mb-3">
                      {item.direccion}
                    </Text>

                    <Text className="text-gray-800 dark:text-slate-300 font-bold text-lg mb-1">
                      Responsable:
                    </Text>
                    <Text className="text-gray-700 dark:text-slate-400 text-base mb-3">
                      {item.responsable}
                    </Text>

                    <Text className="text-gray-800 dark:text-slate-300 font-bold text-lg mb-1">
                      Descripción:
                    </Text>
                    <Text className="text-gray-700 dark:text-slate-400 text-base">
                      {item.descripcion}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoadingLogout) {
    return (
      <StyleGlobal>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === 'light' ? 'gray' : 'white'}
          />
          <View className="items-center">
            <Text className="text-gray-700 dark:text-slate-300 text-2xl italic">
              Cerrando sesión...
            </Text>
          </View>
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
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}
      >
        <FlatList
          data={dataWorkCenters}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
        />
      </View>
    </StyleGlobal>
  );
}
