import {
  StyleSheet,
  View,
  Text,
  Image,
  // TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';

// import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleGlobal } from '@/src/components/styleGlobal';
import React, { useState } from 'react';
import { TextInput, DefaultTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const Icon_itch = require('@/assets/icon_itch.png');

type NotificationProps = {
  orientation: number;
};

const ORIENTATION = {
  PORTRAIT_UP: 1,
  PORTRAIT_DOWN: 2,
  LANDSCAPE_LEFT: 3,
  LANDSCAPE_RIGHT: 4,
};

export function Notification({ orientation }: NotificationProps) {
  const insets = useSafeAreaInsets();
  // const navigation = useNavigation();

  const isLandscape =
    orientation === ORIENTATION.LANDSCAPE_LEFT ||
    orientation === ORIENTATION.LANDSCAPE_RIGHT;

  const finalIsLandscape = isLandscape;

  const colorScheme = useColorScheme();
  const themeTopbar =
    colorScheme === 'light' ? stylesTheme.darkTopbar : stylesTheme.lightTopbar;

  const data = [
    {
      name: 'John Doe',
      operacion: 'creado',
      text: 'al resguardante',
      name2: 'Maty Doe',
      fecha: '26/04/25',
      hora: '12:19',
      contexto: 'Se ha creado al gestor',
      name3: 'Maty Doe',
    },
    {
      name: 'John Doe',
      operacion: 'modificado',
      text: 'al resguardante',
      name2: 'Maty Doe',
      fecha: '12/04/25',
      hora: '12:19',
      contexto: 'Ha añadido rol de',
      name3: 'Jefe de departamento',
    },
    {
      name: 'John Doe',
      operacion: 'eliminado',
      text: 'al resguardante',
      name2: 'Juan Doe',
      fecha: '13/07/25',
      hora: '09:00',
      contexto: 'Se ha eliminado al resguardante',
      name3: 'Juan Doe',
    },
    {
      name: 'Admnistrador',
      operacion: 'modificado',
      text: 'el centro de trabajo',
      name2: 'ITCH',
      fecha: '12/10/25',
      hora: '02:30',
      contexto: 'Se ha modificado las politicas de transferencia a',
      name3: 'Autorizacion',
    },
  ];

  const notificationStyles: {
    [key: string]: { iconName: string; color: string };
  } = {
    creado: {
      iconName: 'account-plus-outline',
      color: 'green',
    },
    modificado: {
      iconName: 'account-edit-outline',
      color: 'yellow',
    },
    eliminado: {
      iconName: 'account-minus-outline',
      color: 'red',
    },
    default: {
      iconName: 'information-outline',
      color: 'gray',
    },
  };

  const [user, setUser] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null); // O un valor por defecto
  const [items, setItems] = useState([
    { label: 'Sin filtro', value: 'sin-filtro' },
    { label: 'Crear gestor', value: 'crear-gestor' }, //que el texto que salga en la seleccion salga en verde (crear)
    { label: 'Eliminar gestor', value: 'eliminar-gestor' }, //que el texto que salga en la seleccion salga en rojo (eliminar)
    { label: 'Modificar resguardante', value: 'mod-resguardante' }, //que el texto que salga en la seleccion salga en amarillo (modificar)
    { label: 'Eliminar resguardante', value: 'eliminar-resguardante' }, //que el texto que salga en la seleccion salga en rojo (eliminar)
    { label: 'Crear Rol', value: 'crear-rol' }, //que el texto que salga en la seleccion salga en verde (crear)
    { label: 'Modificar rol', value: 'mod-rol' }, //que el texto que salga en la seleccion salga en anarillo (modificar)
    { label: 'Eliminar rol', value: 'eliminar-rol' }, //que el texto que salga en la seleccion salga en rojo (eliminar)
  ]);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6', // Color principal (reemplaza el morado)
      background: 'transparent', // Fondo del input
      onSurface: 'gray', // Color del texto que se escribe
      placeholder: 'gray', // Color del texto del label cuando no está activo
      onSurfaceVariant: 'gray', // Color del borde o línea cuando no está activo
    },
  };

  return (
    <StyleGlobal>
      <SafeAreaView style={{ flex: 1 }}>
        {/*Topbar*/}
        <View
          style={[
            finalIsLandscape ? stylesLandscape.topbar : stylesPortrait.topbar,
            {
              paddingTop: 10,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <Image
            source={Icon_itch}
            style={
              finalIsLandscape ? stylesLandscape.logo : stylesPortrait.logo
            }
          ></Image>
          <Text
            style={[
              finalIsLandscape ? stylesLandscape.title : stylesPortrait.title,
              themeTopbar,
            ]}
          >
            Instituto Tecnológico de Chetumal
          </Text>
        </View>

        {/* Filtros */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <TextInput
            mode="flat"
            theme={customTheme}
            underlineColor="gray" // Color de la línea cuando no está activo
            activeUnderlineColor="#25A4D6" // Color de la línea cuando está activo
            value={user}
            onChangeText={setUser}
            label="Buscar Usuario"
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
            style={[
              finalIsLandscape
                ? stylesLandscape.textInput
                : stylesPortrait.textInput,
              { backgroundColor: 'transparent' },
            ]}
          ></TextInput>

          <DropDownPicker
            theme="DARK"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Filtrar por acción"
            style={{
              // backgroundColor: '#14161A',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              borderBottomColor: 'gray',
            }}
            containerStyle={{
              flex: 0.9, // Para que ocupe el espacio disponible
              justifyContent: 'center',
              marginTop: 'auto',
              marginLeft: '2%',
            }}
            textStyle={{
              color: 'gray',
              fontFamily: 'Audiowide',
            }}
            dropDownContainerStyle={{
              // backgroundColor: '#444e61ff',
              backgroundColor: '#14161A',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
            }}
          />
        </View>

        {/* Contenedor de notificaciones */}
        <ScrollView>
          {/**Contenedor de notificaciones */}
          {data.map((item, index) => {
            // PASO 1: OBTÉN LOS ESTILOS PARA EL ITEM ACTUAL USANDO EL MAPA
            const styles =
              notificationStyles[item.operacion] || notificationStyles.default;
            return (
              <View
                key={index}
                style={[
                  finalIsLandscape
                    ? stylesLandscape.containerNotification
                    : stylesPortrait.containerNotification,
                  // PASO 2: APLICA EL COLOR DE BORDE CONDICIONAL
                  { borderColor: styles.color, borderWidth: 1.5 },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '95%',
                    padding: 5,
                    marginInline: 15,
                  }}
                >
                  {/* PASO 3: RENDERIZA EL ICONO CONDICIONAL */}
                  <MaterialCommunityIcons
                    name={styles.iconName as any} // Usamos 'as any' para ayudar a TypeScript
                    size={30}
                    color={styles.color} // Usamos el mismo color para el icono
                    style={{ marginRight: 5 }} // Espacio entre el icono y el texto
                  />

                  <View
                    style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}
                  >
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.nameNotification
                          : stylesPortrait.nameNotification,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      a
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      {item.operacion}
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.nameNotification
                          : stylesPortrait.nameNotification,
                      ]}
                    >
                      {item.name2}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      {item.fecha}
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      -
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      {item.hora}
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.operacionNotification
                          : stylesPortrait.operacionNotification,
                      ]}
                    >
                      {item.contexto}
                    </Text>
                    <Text
                      style={[
                        finalIsLandscape
                          ? stylesLandscape.nameNotification
                          : stylesPortrait.nameNotification,
                      ]}
                    >
                      {item.name3}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </StyleGlobal>
  );
}

const stylesPortrait = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  title: {
    marginLeft: 10,
    fontFamily: 'Audiowide',
    fontSize: 15,
    fontWeight: 'bold',
  },
  containerNotification: {
    justifyContent: 'center',
    backgroundColor: '#14161A',
    borderRadius: 10,
    borderWidth: 0.1,
    marginTop: 10,
    padding: 5,
  },
  nameNotification: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 2,
    marginRight: 2,
  },
  operacionNotification: {
    color: 'white',
    fontWeight: 100,
    textAlign: 'left',
    marginLeft: 2,
    marginRight: 2,
  },
  textInput: {
    width: 190,
    maxWidth: 800,
    borderRadius: 8,
    padding: 5,
    marginBlock: 2,
  },
});

const stylesLandscape = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  title: {
    marginLeft: 15,
    fontFamily: 'Audiowide',
    fontSize: 25,
    fontWeight: 'bold',
  },
  containerNotification: {
    justifyContent: 'center',
    backgroundColor: '#14161A',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 0.1,
    marginTop: 10,
    padding: 5,
  },
  nameNotification: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 2,
    marginRight: 2,
  },
  operacionNotification: {
    color: 'white',
    fontWeight: 100,
    textAlign: 'left',
    marginLeft: 2,
    marginRight: 2,
  },
  textInput: {
    width: 290,
    maxWidth: 800,
    borderRadius: 8,
    padding: 5,
    marginBlock: 2,
  },
});

const stylesTheme = StyleSheet.create({
  lightTopbar: {
    color: 'white',
  },
  darkTopbar: {
    // color: 'dark',
    color: '#14161A',
  },
});
