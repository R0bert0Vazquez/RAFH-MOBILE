import {
  View,
  Text,
  Image,
  Pressable,
  useColorScheme,
  FlatList,
} from 'react-native';

import { StyleGlobal } from '@/src/components/styleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogoutCredenciales, RootStackParamList } from '@/src/models/types';
import { useState } from 'react';
import { logoutUsuario } from '@/src/controllers/login.controller';
import { ActivityIndicator } from 'react-native-paper';

const Icon_rafh = require('@/assets/icon2_512x512_rafh.png');
const Image_itch = require('@/assets/itch.png');
// const Image_urbanCo = require('@/assets/urbanCo.png');
// const Image_centroSalud = require('@/assets/centroSalud.png');

type WorkCentersRouteProp = RouteProp<RootStackParamList, 'WorkCenters'>;
type WorkCentersNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WorkCenters'
>;

type ItemProps = {
  item: {
    id: number;
    name: string;
    rol: string;
    image: any;
  };
};

const dataWorkCenters = [
  {
    id: 1,
    name: 'Instituto Tecnológico de Chetumal',
    rol: 'Administrador',
    image: Image_itch,
  },
  // {
  //   name: 'Urban Trails Corporation',
  //   rol: 'Administrador',
  //   image: Image_urbanCo,
  // },
  // {
  //   name: 'Centro de Salud',
  //   rol: 'Resguardante',
  //   image: Image_centroSalud,
  // },
];

export function WorkCenters() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<WorkCentersNavigationProp>();
  const route = useRoute<WorkCentersRouteProp>();
  const colorScheme = useColorScheme();

  const { loginRespuesta } = route.params;
  const { access_token, user } = loginRespuesta;

  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const credenciales: LogoutCredenciales = {
        access_token: access_token,
      };

      const logoutRespuesta = await logoutUsuario(credenciales);

      setTimeout(
        () => {
          console.log('Logout exitoso:', JSON.stringify(logoutRespuesta));
          navigation.navigate('Login');
        },
        500,
        setIsLoading(false),
      );
    } catch (err: any) {
      setIsLoading(false);
      if (err.message) {
        console.log('Logout error:', err.message);
      }
    }
  };

  const handleWorkCenterSelect = (id: number) => {
    console.log('Access_token:' + access_token);
    console.log('ID del Centro de Trabajo:' + id);
    navigation.navigate('MainApp', { access_token, workCenterId: id });
  };

  const renderHeader = () => (
    <>
      <View className="flex-row justify-between items-center w-11/12 mb-5 mt-1 mx-auto">
        <Image
          className="w-16 h-16  md:portrait:w-20 md:portrait:h-20 lg:w-24 lg:h-24 mr-2"
          source={Icon_rafh}
        />

        <Text className="flex-1 text-gray-700 dark:text-slate-400 text-2xl sm:text-2xl md:text-4xl lg:text-5xl mr-1">
          <Text className="font-bold">Bienvenido, </Text>
          {user.usuario_nombre}
        </Text>

        {isLoading && (
          <ActivityIndicator
            size="small"
            color={colorScheme === 'light' ? '#374151' : '#94a3b8'}
          />
        )}

        <Pressable disabled={isLoading} onPress={handleLogout}>
          <MaterialCommunityIcons
            name="logout"
            size={40}
            color={colorScheme === 'light' ? '#374151' : '#94a3b8'}
          />
        </Pressable>
      </View>

      <View className="mb-3 mx-9">
        <Text className="text-gray-700 dark:text-slate-400 text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold">
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
                disabled={isLoading}
                onPress={() => handleWorkCenterSelect(item.id)}
                className="flex-row p-2 bg-slate-100 dark:bg-slate-800 active:bg-slate-300 active:dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-700 rounded-md shadow-sm ios:shadow-sm shadow-gray-600 dark:shadow-cyan-50"
              >
                <Image
                  className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-lg"
                  source={item.image}
                ></Image>
                <View className="flex-1 flex-col p-3 ">
                  <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-700 dark:text-slate-400 text-xl italic">
                    {item.rol}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
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
