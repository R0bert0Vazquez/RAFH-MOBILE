import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput as RNTextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import React, { useState, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleGlobal } from '@/src/components/styleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loginUsuario } from '@/src/controllers/login.controller';
import { LoginCredenciales, RootStackParamList } from '@/src/models/types';
import { StackNavigationProp } from '@react-navigation/stack';

const Icon_rafh = require('@/assets/icon2_512x512_rafh.png');
const Icon_microsoft = require('@/assets/icons/icon_microsoft.png');

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

export function Login() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();
  const passwordInputRef = useRef<RNTextInput>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSuccess, setIsSucceess] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Correo y contraseña son requeridos');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSucceess(false);

    try {
      // console.log('\nLogin attempt with credentials:', { email, password });

      const credenciales: LoginCredenciales = {
        usuario_correo: email,
        usuario_pass: password,
      };

      const loginRespuesta = await loginUsuario(credenciales);

      setIsLoading(false);
      setIsSucceess(true);

      setTimeout(() => {
        // console.log('\nLogin exitoso:', JSON.stringify(loginRespuesta));
        // navigation.navigate('WorkCenters', { loginRespuesta });
        navigation.reset({
          index: 0,
          routes: [{ name: 'WorkCenters', params: { loginRespuesta } }],
        });
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      if (err.message) {
        setError('Credendenciales incorrectas');
      }
    }
  };

  const handleLoginWithMicrosoft = () => {
    console.log('Login with Microsoft attempt');
  };

  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const getButtonClass = () => {
    if (isSuccess) {
      return 'bg-green-500'; // Estado de éxito
    }
    if (isLoading) {
      return 'bg-blue-500'; // Estado de carga (se mantiene azul)
    }
    return 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'; // Estado normal
  };

  const getButtonContent = () => {
    if (isSuccess) {
      return (
        <Text className="text-white text-center font-bold">
          Inicio de sesión exitoso
        </Text>
      );
    }
    if (isLoading) {
      return <ActivityIndicator size="small" color="white" />;
    }
    return (
      <Text className="text-white text-center font-bold">Iniciar Sesion</Text>
    );
  };

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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={keyboardAvoidingBehavior}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center items-center portrait:flex-col landscape:flex-row">
              <View className="items-center landscape:mr-16 pb-10">
                <Image
                  className="w-40 h-40 md:w-55 md:h-55 lg:w-60 lg:h-60"
                  source={Icon_rafh}
                ></Image>
                <Text className="text-gray-700 dark:text-slate-400 text-6xl md:text-6xl lg:text-8xl font-extrabold italic mt-2">
                  RAFH
                </Text>
              </View>

              <View className="w-11/12 md:w-3/4 landscape:w-1/2 lg:landscape:w-1/2">
                <View className=" bg-white dark:bg-[#14161A] border-2  border-gray-200 dark:border-1 dark:dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 ">
                  <Text className="text-gray-700 dark:text-slate-400 text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 mb-1">
                    Iniciar Sesion
                  </Text>
                  <View>
                    <TextInput
                      mode="flat"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        passwordInputRef.current?.focus();
                      }}
                      theme={customTheme}
                      underlineColor="gray"
                      activeUnderlineColor="#25A4D6"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      label="Correo o Usuario"
                      disabled={isLoading || isSuccess}
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <MaterialCommunityIcons
                              name="email-outline"
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

                    <TextInput
                      mode="flat"
                      ref={passwordInputRef}
                      returnKeyType="send"
                      theme={customTheme}
                      onSubmitEditing={handleLogin}
                      underlineColor="gray"
                      activeUnderlineColor="#25A4D6"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!isPasswordVisible}
                      label="Contraseña"
                      disabled={isLoading || isSuccess}
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <MaterialCommunityIcons
                              name="lock-outline"
                              size={24}
                              color="#25A4D6"
                            />
                          )}
                        />
                      }
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <Pressable onPress={togglePasswordVisibility}>
                              <MaterialCommunityIcons
                                name={
                                  isPasswordVisible
                                    ? 'eye-outline'
                                    : 'eye-off-outline'
                                }
                                size={24}
                                color="#25A4D6"
                              />
                            </Pressable>
                          )}
                        />
                      }
                      style={{
                        backgroundColor: 'transparent',
                      }}
                    />
                  </View>

                  <TouchableOpacity disabled={isLoading || isSuccess}>
                    <Text className="text-blue-900 text-right font-bold mr-5 mb-1 mt-3">
                      ¿Olvidaste tu Contraseña?
                    </Text>
                  </TouchableOpacity>

                  {error && (
                    <Text className="text-red-500 text-center font-bold mt-2 mx-5">
                      {error}
                    </Text>
                  )}

                  <Pressable
                    className={`rounded-lg p-3 m-5 ${getButtonClass()}`}
                    onPress={handleLogin}
                    disabled={isLoading || isSuccess}
                  >
                    {getButtonContent()}
                  </Pressable>

                  <View className="flex-row justify-center items-center mb-4">
                    <Image
                      source={Icon_microsoft}
                      className="w-8 h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 mr-3"
                    ></Image>
                    <TouchableOpacity
                      onPress={handleLoginWithMicrosoft}
                      disabled={isLoading || isSuccess}
                    >
                      <Text className="text-gray-700 dark:text-slate-400 font-bold">
                        Inicia Sesión con Microsoft
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </StyleGlobal>
  );
}
