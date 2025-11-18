import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  FlatList,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import React, { useState, useMemo } from 'react';
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import { dataBienes } from '@/src/components/dataBienes';
import { dataResguardantes } from '@/src/components/dataResguardantes';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

import { DataBien, Resguardante, User } from '@/src/models/types';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

const ResguardanteHeader = ({
  itemResguardante,
  searchValue,
  onSearchChange,
  filterOpen,
  setFilterOpen,
  filterValue,
  setFilterValue,
  filterItems,
  setFilterItems,
}: {
  itemResguardante: Resguardante;
  searchValue: string;
  onSearchChange: (text: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filterValue: any;
  setFilterValue: (value: any) => void;
  filterItems: any[];
  setFilterItems: (items: any) => void;
}) => {
  const colorScheme = useColorScheme();
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

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // --- NOTA IMPORTANTE ---
  // Actualmente, la lista y el PDF usan 'dataBienes' (datos de ejemplo).
  // En el futuro, aquí deberías tomar 'scannedData',
  // hacer un fetch a tu API para obtener los detalles de esos códigos,
  // y guardar esa respuesta en un estado (ej. const [listaBienes, setListaBienes] = useState<DataBien[]>([]))
  // Por ahora, seguimos con 'dataBienes' como pediste.
  const datosParaMostrar = dataBienes; // <- Reemplazar esto con los datos de la API

  const statusCounts = useMemo(() => {
    return datosParaMostrar.reduce(
      (acc, bien) => {
        const estado = bien.bien_estado.toLowerCase();
        if (estado === 'activo') {
          acc.activo += 1;
        } else if (estado === 'mantenimiento') {
          acc.mantenimiento += 1;
        } else if (estado === 'inactivo') {
          acc.inactivo += 1;
        } else if (estado === 'transaccion') {
          acc.transaccion += 1;
        }
        return acc;
      },
      { activo: 0, mantenimiento: 0, inactivo: 0, transaccion: 0 },
    );
  }, [datosParaMostrar]); // Se recalcula solo si 'datosParaMostrar' cambia

  const handleGeneratePdf = async () => {
    if (isLoadingPdf) return; // Evitar doble click

    setIsLoadingPdf(true);
    try {
      // 1. Generar HTML
      const htmlContent = generatePdfHtml(datosParaMostrar);

      // 2. Definir ruta del archivo
      // Usamos FileSystem.cacheDirectory para guardar el archivo temporalmente
      const fileUri = `${FileSystem.cacheDirectory}reporte_bienes_${Date.now()}.pdf`;

      // 3. Crear el PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612, // Ancho de página estándar (Letter)
        height: 792, // Alto de página estándar (Letter)
      });
      console.log('PDF generado en:', uri);

      // 4. Mover el archivo a nuestra ruta (esto es más robusto en Android)
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // 5. Comprobar si se puede compartir
      if (!(await Sharing.isAvailableAsync())) {
        alert(
          'La función de compartir no está disponible en este dispositivo.',
        );
        setIsLoadingPdf(false);
        return;
      }

      // 6. Compartir el archivo
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Descargar Reporte de Bienes',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error('Error generando el PDF:', error);
      alert('Hubo un error al generar el PDF. Intenta de nuevo.');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <>
      <View className="items-center px-4">
        <View className="w-full md:w-full lg:w-full mb-3">
          <View className="bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
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
                  className="text-gray-800 dark:text-slate-300 text-base font-bold"
                  numberOfLines={1}
                >
                  {itemResguardante.res_nombre} {itemResguardante.res_apellidos}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="office-building-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-slate-300 text-sm ml-1">
                    {itemResguardante.res_departamento}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-slate-300 text-sm ml-1">
                    {itemResguardante.res_telefono}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-gray-500 dark:text-slate-300 text-sm ml-1">
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
                <Text className="text-gray-400 dark:text-slate-300 text-xs mt-1">
                  {itemResguardante.res_puesto}
                </Text>
              </View>
            </View>

            {/* Separador sutil */}
            <View className="h-px bg-gray-300 dark:bg-gray-700 mx-4" />

            <View className="px-4 md:px-6 lg:px-8 pt-4 pb-2">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={40}
                  color={colorScheme === 'light' ? '#6b7280' : 'white'}
                />
                <View className="flex-1 ml-2">
                  <Text className="text-xl md:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-slate-200">
                    Bienes Encontrados:
                  </Text>
                  <Text className="text-base md:text-lg text-gray-500 dark:text-slate-400">
                    Se encontraron {datosParaMostrar.length} bienes.
                  </Text>
                </View>
              </View>

              <StatusSummaryCard
                counts={statusCounts}
                total={datosParaMostrar.length}
              />

              <Pressable
                onPress={handleGeneratePdf}
                disabled={isLoadingPdf}
                className={`flex-row items-center justify-center rounded-lg p-3.5 my-2 ${
                  isLoadingPdf
                    ? 'bg-gray-400 dark:bg-gray-600'
                    : 'bg-green-600 dark:bg-green-700 active:bg-green-800'
                } shadow-md`}
              >
                {isLoadingPdf ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={24}
                    color="white"
                    className="mr-2"
                  />
                )}
                <Text className="text-white text-center font-bold text-base md:text-lg">
                  {isLoadingPdf
                    ? 'Generando PDF...'
                    : 'Descargar Reporte en PDF'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Filtros */}
          <View className="mt-3 landscape:flex-1 landscape:mt-1 mb-1">
            <View className="landscape:items-center md:items-center">
              <View className="flex-row landscape:flex-row md:flex-row lg:flex-row items-center mt-1">
                <View className="w-6/12 landscape:w-5/12 md:w-5/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 mr-2 landscape:mr-2 md:mr-2 ">
                  <TextInput
                    mode="flat"
                    returnKeyType="search"
                    theme={customTheme}
                    value={searchValue}
                    onChangeText={onSearchChange}
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

                <View className="w-6/12 landscape:w-5/12 md:w-5/12 mt-1 md:mt-0 lg:mt-0 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
                  <DropDownPicker
                    theme="DARK"
                    open={filterOpen}
                    value={filterValue}
                    items={filterItems}
                    setOpen={setFilterOpen as any}
                    setValue={setFilterValue}
                    setItems={setFilterItems}
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
                      marginTop: '-400%',
                      backgroundColor:
                        colorScheme === 'light' ? 'white' : '#14161A',
                      borderColor: colorScheme === 'light' ? 'gray' : 'gray',
                      borderWidth: 0.5,
                      borderRadius: 10,
                      borderTopStartRadius: 10,
                      borderTopEndRadius: 10,
                    }}
                  ></DropDownPicker>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const bienIconos: { [key: string]: string } = {
  'equipo de cómputo': 'laptop',
  'equipo audiovisual': 'projector',
  climatización: 'air-conditioner',
  'equipo de oficina': 'printer',
  'equipo de laboratorio': 'microscope',
  'equipo didáctico': 'presentation',
  default: 'cube-outline',
};

const bienEstadosBg: { [key: string]: string } = {
  activo: 'bg-green-500/20',
  mantenimiento: 'bg-yellow-500/20',
  inactivo: 'bg-red-500/20',
  default: 'bg-gray-500/20',
};

const bienEstadosTexto: { [key: string]: string } = {
  activo: 'text-green-600',
  mantenimiento: 'text-yellow-600',
  inactivo: 'text-red-600',
  default: 'text-gray-600',
};

// --- NUEVO COMPONENTE MODAL ---
const TransferModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bien: DataBien | null;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const modalBackgroundColor = isDarkMode ? '#14161A' : '#f1f5f9';
  const modalBorderColor = isDarkMode ? 'e5e7eb' : '#e5e7eb';
  const modalTextColor = 'gray';
  const modalSearchBgColor = isDarkMode ? '#14161A' : '#ffffff';
  const modalSearchBorderColor = isDarkMode ? '#334155' : '#e2e8f0';

  const [searchUser, setSearchUser] = useState('');
  const [officeOpen, setOfficeOpen] = useState(false);
  const [officeValue, setOfficeValue] = useState(null);
  const [officeItems, setOfficeItems] = useState([
    {
      label: 'Sistemas y Computación',
      value: 'sistemas',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
    {
      label: 'Mantenimiento de Equipo',
      value: 'manto',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
    {
      label: 'Dirección General',
      value: 'dir',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
    {
      label: 'Recursos Financieros',
      value: 'fin',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
  ]);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6',
      background: colorScheme === 'light' ? '#f0f0f0' : '#2d2d2d',
      onSurface: 'gray',
      onSurfaceVariant: 'gray',
    },
  };

  if (!bien) return null; // No renderizar nada si no hay un bien seleccionado

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-black/60 px-5" // <--- Clases movidas aquí
          keyboardShouldPersistTaps="handled" // <--- Buena práctica
        >
          {/* <View className="flex-1 justify-center items-center bg-black/60 px-5"> */}
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="account-switch-outline"
                size={50}
                color="#25A4D6"
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
              Traspasar Bien
            </Text>
            <Text
              className="text-gray-600 dark:text-slate-400 text-base text-center mb-4"
              numberOfLines={2}
            >
              Vas a traspasar el bien:{' '}
              <Text className="font-bold">{bien.bien_codigo}</Text>.
            </Text>

            {/* --- Controles de Búsqueda --- */}
            <View style={{ zIndex: 1000 }}>
              {/* TextInput de Búsqueda */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
                <TextInput
                  mode="flat"
                  theme={customTheme}
                  value={searchUser}
                  onChangeText={setSearchUser}
                  label="Buscar resguardante..."
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="account-search"
                          size={24}
                          color={'#25A4D6'}
                        />
                      )}
                    />
                  }
                  style={{ backgroundColor: 'transparent' }}
                />
              </View>

              {/* Dropdown de Oficinas */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-6">
                <DropDownPicker
                  theme={colorScheme === 'light' ? 'LIGHT' : 'DARK'}
                  open={officeOpen}
                  value={officeValue}
                  items={officeItems}
                  setOpen={setOfficeOpen}
                  setValue={setOfficeValue}
                  setItems={setOfficeItems}
                  placeholder="Filtrar por oficina..."
                  listMode="MODAL"
                  modalAnimationType="slide"
                  modalTitle="Selecciona una Oficina"
                  searchable={true}
                  searchPlaceholder="Buscar oficina..."
                  translation={{
                    NOTHING_TO_SHOW: 'No se encontraron oficinas.',
                  }}
                  modalContentContainerStyle={{
                    backgroundColor: modalBackgroundColor,
                  }}
                  modalTitleStyle={{
                    color: modalTextColor,
                    fontWeight: 'bold',
                  }}
                  searchContainerStyle={{
                    borderBottomColor: modalBorderColor,
                  }}
                  searchTextInputStyle={{
                    color: modalTextColor,
                    backgroundColor: modalSearchBgColor,
                    borderColor: modalSearchBorderColor,
                    borderRadius: 8,
                    borderWidth: 1,
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  textStyle={{ color: 'gray' }}
                />
              </View>
            </View>

            {/* --- Lista de Resguardantes (Simulada) --- */}
            <View className="h-24 mb-6 items-center justify-center border border-dashed border-gray-400 dark:border-gray-600 rounded-lg">
              <Text className="text-gray-500 dark:text-gray-400">
                (Aquí aparecerá la lista de resguardantes)
              </Text>
            </View>

            {/* --- Fila de Botones --- */}
            <View className="flex-row justify-between">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                className="flex-1 bg-green-600 rounded-lg p-4 ml-2 active:bg-green-700"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- NUEVO COMPONENTE: MODAL DE SOLICITUD ---
const RequestModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bien: DataBien | null;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const modalBackgroundColor = isDarkMode ? '#14161A' : '#f1f5f9';
  // const modalBorderColor = isDarkMode ? 'e5e7eb' : '#e5e7eb';
  const modalTextColor = 'gray';

  // --- Estados internos para el formulario ---
  const [requestTypeOpen, setRequestTypeOpen] = useState(false);
  const [requestTypeValue, setRequestTypeValue] = useState(null);
  const [justification, setJustification] = useState('');

  const [requestTypeItems, setRequestTypeItems] = useState([
    {
      label: 'Solicitar Mantenimiento',
      value: 'mantenimiento',
      icon: () => (
        <MaterialCommunityIcons name="cogs" size={18} color="#f59e0b" />
      ), // color-yellow-500
    },
    {
      label: 'Solicitar Baja de Bien',
      value: 'baja',
      icon: () => (
        <MaterialCommunityIcons
          name="archive-arrow-down-outline"
          size={18}
          color="#ef4444" // color-red-500
        />
      ),
    },
    {
      label: 'Otra Solicitud',
      value: 'otra',
      icon: () => (
        <MaterialCommunityIcons
          name="comment-question-outline"
          size={18}
          color="gray"
        />
      ),
    },
  ]);

  // Tema para el TextInput de justificación
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#a855f7', // Púrpura, a juego con el botón
      background: isDarkMode ? '#2d2d2d' : '#f0f0f0',
      onSurface: 'gray',
      onSurfaceVariant: 'gray',
    },
  };

  if (!bien) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-black/60 px-5" // <--- Clases movidas aquí
          keyboardShouldPersistTaps="handled" // <--- Buena práctica
        >
          {/* <View className="flex-1 justify-center items-center bg-black/60 px-5"> */}
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={50}
                color="#a855f7" // Púrpura
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
              Generar Solicitud
            </Text>
            <Text
              className="text-gray-600 dark:text-slate-400 text-base text-center mb-4"
              numberOfLines={4}
            >
              Estás generando una solicitud para el bien:{' '}
              <Text className="font-bold">{bien.bien_descripcion}</Text>.
            </Text>

            {/* --- Controles del Formulario --- */}
            <View style={{ zIndex: 1000 }}>
              {/* Dropdown de Tipo de Solicitud */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
                <DropDownPicker
                  theme={colorScheme === 'light' ? 'LIGHT' : 'DARK'}
                  open={requestTypeOpen}
                  value={requestTypeValue}
                  items={requestTypeItems}
                  setOpen={setRequestTypeOpen}
                  setValue={setRequestTypeValue}
                  setItems={setRequestTypeItems}
                  placeholder="Selecciona un tipo de solicitud"
                  listMode="MODAL"
                  modalTitle="Tipo de Solicitud"
                  modalContentContainerStyle={{
                    backgroundColor: modalBackgroundColor,
                  }}
                  modalTitleStyle={{
                    color: modalTextColor,
                    fontWeight: 'bold',
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  textStyle={{ color: 'gray' }}
                  dropDownContainerStyle={{
                    backgroundColor:
                      colorScheme === 'light' ? '#f3f4f6' : '#2d2d2d',
                    borderColor:
                      colorScheme === 'light' ? '#f3f4f6' : '#2d2d2d',
                    borderWidth: 0.2,
                  }}
                />
              </View>

              {/* TextInput de Justificación */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-6">
                <TextInput
                  mode="flat"
                  returnKeyType="send"
                  theme={customTheme}
                  value={justification}
                  onChangeText={setJustification}
                  label="Motivo o Justificación"
                  // multiline
                  numberOfLines={4}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="comment-text-outline"
                          size={24}
                          color={'#a855f7'}
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

            {/* --- Fila de Botones --- */}
            <View className="flex-row justify-between">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                className="flex-1 bg-purple-600 rounded-lg p-4 ml-2 active:bg-purple-700"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Enviar Solicitud
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const StatusItem = ({
  iconName,
  label,
  count,
  colorClass,
  color,
}: {
  iconName: string;
  label: string;
  count: number;
  colorClass: string;
  color: string;
}) => (
  <View className="flex-1 items-center px-2 py-3">
    <MaterialCommunityIcons name={iconName as any} size={28} color={color} />
    <Text className={`text-2xl font-bold mt-1 ${colorClass}`}>{count}</Text>
    <Text
      className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase"
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

const StatusSummaryCard = ({
  counts,
  total,
}: {
  counts: {
    activo: number;
    mantenimiento: number;
    inactivo: number;
    transaccion: number;
  };
  total: number;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg my-4 overflow-hidden">
      <View className="flex-row divide-x divide-gray-200 dark:divide-gray-700">
        <StatusItem
          iconName="apps"
          label="Total"
          count={total}
          colorClass="text-blue-500 dark:text-blue-400"
          color={colorScheme === 'light' ? '#3b82f6' : '#60a5fa'}
        />
        <StatusItem
          iconName="check-circle-outline"
          label="Activos"
          count={counts.activo}
          colorClass="text-green-600 dark:text-green-500"
          color={colorScheme === 'light' ? '#16a34a' : '#22c55e'}
        />
        <StatusItem
          iconName="progress-wrench"
          label="Mantenimiento"
          count={counts.mantenimiento}
          colorClass="text-yellow-600 dark:text-yellow-500"
          color={colorScheme === 'light' ? '#ca8a04' : '#eab308'}
        />
        <StatusItem
          iconName="close-circle-outline"
          label="Inactivos"
          count={counts.inactivo}
          colorClass="text-red-600 dark:text-red-500"
          color={colorScheme === 'light' ? '#dc2626' : '#ef4444'}
        />
        <StatusItem
          iconName="transfer"
          label="Transaccion"
          count={counts.transaccion}
          colorClass="text-gray-600 dark:text-gray-500"
          color={colorScheme === 'light' ? '#4b5563' : '#6b7280'}
        />
      </View>
    </View>
  );
};

const generatePdfHtml = (data: DataBien[]) => {
  const styles = `
    <style>
      body { font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; }
      @page { margin: 20mm; }
      h1 { text-align: center; color: #25A4D6; font-size: 24px; }
      h2 { text-align: center; color: #555; font-size: 18px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; font-size: 11px; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      .footer { text-align: center; font-size: 8px; color: #777; position: fixed; bottom: 10mm; width: 100%; }
    </style>
  `;

  // Filas de la tabla
  const tableRows = data
    .map(
      (bien) => `
    <tr>
      <td>${bien.bien_codigo}</td>
      <td>${bien.bien_clave}</td>
      <td>${bien.bien_marca}</td>
      <td>${bien.bien_modelo}</td>
      <td>${bien.bien_ubicacion_actual}</td>
      <td>${bien.bien_estado}</td>
    </tr>
  `,
    )
    .join(''); // Une todas las filas

  // Plantilla HTML completa
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Bienes</title>
        ${styles}
      </head>
      <body>
        <h1>RAFH</h1>
        <h2>Reporte de Levantamiento de Inventario</h2>
        <h3>${dataWorkPlace.title}</h3>
        <p>Reporte generado el: ${new Date().toLocaleString('es-MX')}</p>
        <p>Total de bienes encontrados: ${data.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div class="footer">
          RAFH - Reporte de Inventario
        </div>
      </body>
    </html>
  `;
};

const BienItem = ({
  item,
  onTransferPress,
  onRequestPress,
}: {
  item: DataBien;
  onTransferPress: (item: DataBien) => void;
  onRequestPress: (item: DataBien) => void;
}) => {
  const colorScheme = useColorScheme();
  const iconName = (bienIconos[item.bien_codigo.toLowerCase()] ||
    bienIconos.default) as any;

  const estadoStyleBg =
    bienEstadosBg[item.bien_estado.toLowerCase()] || bienEstadosBg.default;

  const estadoStyleText =
    bienEstadosTexto[item.bien_estado.toLowerCase()] ||
    bienEstadosTexto.default;

  return (
    <View className="items-center px-4">
      <View className="w-full md:w-11/12 lg:w-11/12 mb-1">
        <View className="bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ">
          <View className="flex-row items-center p-4">
            {/* Icono del Bien */}
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-cyan-600/20 mr-4">
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={colorScheme === 'light' ? '#22d3ee' : 'white'}
              />
            </View>

            {/* Info del Bien */}
            <View className="flex-1">
              <Text
                className="text-gray-700 bg-red dark:text-slate-400 text-md font-bold"
                numberOfLines={1}
              >
                {item.bien_codigo}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-bold">Código: </Text>
                {item.bien_codigo}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-bold">Ubicación: </Text>
                {item.bien_ubicacion_actual}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-bold">Modelo: </Text>
                {item.bien_modelo}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-bold">Marca: </Text>
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
            </View>
          </View>

          <View className="h-px bg-gray-300 dark:bg-gray-700 mx-4" />

          {/* --- NUEVA SECCIÓN DE BOTONES --- */}
          <View className="px-4 py-3 flex-row justify-around items-center">
            {/* Botón de Solicitud */}
            <Pressable
              onPress={() => onRequestPress(item)}
              className="flex-row items-center bg-purple-500/10 dark:bg-purple-500/20 px-3 py-2 rounded-lg active:bg-purple-600/20"
            >
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={18}
                color="#a855f7" // purple-500
              />
              <Text className="text-purple-500 font-bold text-sm ml-1.5">
                Mover a...
              </Text>
            </Pressable>

            {/* Botón de Traspasar */}
            <Pressable
              onPress={() => onTransferPress(item)} // Llama a la función del padre
              className="flex-row items-center bg-blue-500/10 dark:bg-blue-500/20 px-3 py-2 rounded-lg active:bg-blue-600/20"
            >
              <MaterialCommunityIcons
                name="account-switch-outline"
                size={18}
                color="#3B82F6" // blue-500
              />
              <Text className="text-blue-500 font-bold text-sm ml-1.5">
                Traspasar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export function Resg_MainResguardante({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();
  // const colorScheme = useColorScheme();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const miResguardante = dataResguardantes[0];

  const [valueTextInp, setValueTextInp] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null); // Valor del Dropdown
  const [itemsTipo, setTipo] = useState([
    {
      label: 'Sin filtro',
      value: 'sin-filtro',
      icon: () => (
        <MaterialCommunityIcons
          name="filter-variant-remove"
          size={18}
          color={'gray'}
        />
      ),
    },
    {
      label: 'Activo',
      value: 'activo',
      icon: () => (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={18}
          color="#4ade80"
        />
      ),
    },
    {
      label: 'Inactivo',
      value: 'inactivo',
      icon: () => (
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={18}
          color="#ef4444"
        />
      ),
    },
    {
      label: 'Mantenimiento',
      value: 'mantenimiento',
      icon: () => (
        <MaterialCommunityIcons
          name="progress-wrench"
          size={18}
          color="#FFA500"
        />
      ),
    },
    {
      label: 'Transaccion',
      value: 'transaccion',
      icon: () => (
        <MaterialCommunityIcons name="transfer" size={18} color="gray" />
      ),
    },
  ]);

  const [isTransferModalVisible, setTransferModalVisible] = useState(false);
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);
  const [selectedBien, setSelectedBien] = useState<DataBien | null>(null);

  const displayedData = useMemo(() => {
    let filteredData = dataBienes;
    const searchTerm = valueTextInp.toLowerCase().trim();

    // A. Filtro por Dropdown (Estado)
    if (value && value !== 'sin-filtro') {
      filteredData = filteredData.filter(
        // Comparamos ambos en minúsculas
        (bien) => bien.bien_estado.toLowerCase() === value,
      );
    }

    // B. Filtro por TextInput (Búsqueda General) - MODIFICADO
    if (searchTerm.length > 0) {
      filteredData = filteredData.filter((bien) => {
        // Usamos Object.entries para obtener la 'key' y el 'fieldValue'
        return Object.entries(bien).some(([key, fieldValue]) => {
          // *** ¡AQUÍ ESTÁ TU REGLA! ***
          // Si la llave es 'bien_estado', no busques en este campo y retorna falso.
          if (key === 'bien_estado') {
            return false;
          }
          // Para todas las otras llaves, haz la búsqueda normal
          return String(fieldValue).toLowerCase().includes(searchTerm);
        });
      });
    }

    return filteredData;
  }, [value, valueTextInp]); // Se recalcula si 'value' (dropdown) o 'valueTextInp' (buscador) cambian

  const EmptyListComponent = () => {
    let message = 'No hay bienes asignados para mostrar.'; // Mensaje por defecto
    const searchTerm = valueTextInp.trim();

    if (searchTerm.length > 0) {
      // Si el buscador está activo, prioriza este mensaje
      message = `No se encontraron bienes que coincidan con "${searchTerm}".`;
    } else if (value && value !== 'sin-filtro') {
      // Si el filtro de estado está activo
      const filterLabel =
        itemsTipo.find((item) => item.value === value)?.label || value;
      message = `No hay bienes con el estado: "${filterLabel}".`;
    }

    return (
      <View className="items-center pt-20">
        <View className="w-10/12 landscape:w-10/12 md:w-10/12 items-center p-4 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
          <MaterialCommunityIcons
            name="information-outline"
            size={50}
            color="gray"
          />
          <Text className="text-gray-500 dark:text-slate-400 text-xl text-center mt-2">
            {message}
          </Text>
        </View>
      </View>
    );
  };

  const handleOpenTransfer = (bien: DataBien) => {
    setSelectedBien(bien);
    setTransferModalVisible(true);
  };

  const handleCloseTransfer = () => {
    setTransferModalVisible(false);
    setSelectedBien(null);
  };

  const handleConfirmTransfer = () => {
    // Lógica para enviar a la API...
    console.log('Confirmado traspaso de:', selectedBien?.bien_codigo);
    // ...
    handleCloseTransfer();
  };

  const handleOpenRequest = (bien: DataBien) => {
    setSelectedBien(bien);
    setRequestModalVisible(true);
  };

  const handleCloseRequest = () => {
    setRequestModalVisible(false);
    setSelectedBien(null);
  };

  const handleConfirmRequest = () => {
    // Aquí iría tu lógica de API para enviar la solicitud
    console.log('Confirmada solicitud para:', selectedBien?.bien_codigo);
    // ...
    handleCloseRequest();
  };

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
            paddingBottom: 4,
          }}
        >
          <FlatList
            data={displayedData}
            ListHeaderComponent={
              <>
                <Header dataWorkPlace={dataWorkPlace} />
                <ResguardanteHeader
                  itemResguardante={miResguardante}
                  searchValue={valueTextInp}
                  onSearchChange={setValueTextInp}
                  filterOpen={open}
                  setFilterOpen={setOpen}
                  filterValue={value}
                  setFilterValue={setValue}
                  filterItems={itemsTipo}
                  setFilterItems={setTipo}
                />
              </>
            }
            renderItem={({ item }) => (
              <BienItem
                item={item}
                onTransferPress={handleOpenTransfer}
                onRequestPress={handleOpenRequest}
              />
            )}
            keyExtractor={(item) => item.bien_codigo}
            ListEmptyComponent={EmptyListComponent}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>

      {/* --- RENDERIZAR EL MODAL DE TRANSFERENCIA --- */}
      <TransferModal
        visible={isTransferModalVisible}
        bien={selectedBien}
        onClose={handleCloseTransfer}
        onConfirm={handleConfirmTransfer}
      />

      {/* ---RENDERIZAR EL MODAL DE SOLICITUD --- */}
      <RequestModal
        visible={isRequestModalVisible}
        bien={selectedBien}
        onClose={handleCloseRequest}
        onConfirm={handleConfirmRequest}
      />
    </StyleGlobal>
  );
}
