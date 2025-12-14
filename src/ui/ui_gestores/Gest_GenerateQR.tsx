import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import React, { useState } from 'react';

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { customTheme } from '@/src/components/customThemeTextInput-R.Paper';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { generateLabelsPDF } from '@/src/components/PDFGenerator_Labels';

import { Access_token } from '@/src/models/types';
import {
  CompararBienes,
  CompararBienesRespuesta,
} from '@/src/models/types_BienesResponse';
import { useGenerateQRController } from '@/src/controllers/controllers_gestor/generateQR.controller';

import { Select_Oficina_DropDown } from '@/src/components/Select_Oficina_DropDownPicker';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

const InfoAlertModal = ({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) => {
  const getIcon = () => {
    if (
      title.includes('Error') ||
      title.includes('Vacía') ||
      title.includes('Sin datos') ||
      title.includes('Duplicado')
    ) {
      return { name: 'alert-circle-outline', color: '#E53E3E' }; // Rojo
    }
    if (title.includes('Enviado') || title.includes('Éxito')) {
      return { name: 'check-circle-outline', color: '#38A169' }; // Verde
    }
    if (title.includes('Seleccionar') || title.includes('Requerida')) {
      return { name: 'home-search-outline', color: '#E53E3E' }; // Rojo/Naranja
    }
    return { name: 'information-outline', color: '#25A4D6' }; // Azul
  };
  const icon = getIcon();

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
          <View className="items-center mb-4">
            <MaterialCommunityIcons
              name={icon.name as any}
              size={50}
              color={icon.color}
            />
          </View>

          <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
            {title}
          </Text>

          <Text className="text-gray-600 dark:text-slate-400 text-base md:text-lg text-center mb-6">
            {message}
          </Text>

          <Pressable
            onPress={onClose}
            className="bg-blue-500 dark:bg-blue-600 rounded-lg p-4 w-full shadow-md active:bg-blue-700"
          >
            <Text className="text-white text-center font-bold text-lg">
              Aceptar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const ConfirmationModal = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
          <View className="items-center mb-4">
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={50}
              color="#25A4D6"
            />
          </View>

          <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
            {title}
          </Text>

          <Text className="text-gray-600 dark:text-slate-400 text-base md:text-lg text-center mb-6">
            {message}
          </Text>

          <View className="flex-row justify-between">
            <Pressable
              onPress={onCancel}
              className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 active:dark:bg-gray-700"
            >
              <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 bg-blue-600 rounded-lg p-4 ml-2 active:bg-blue-700"
            >
              <Text className="text-white text-center font-bold text-lg">
                Sí, Confirmar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CaptureItemCard = ({
  code,
  onEdit,
  onDelete,
}: {
  code: string;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="px-3 mb-3">
      <View className="bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex-row items-center">
        <View className="w-2 bg-blue-500 h-full" />
        <View className="p-4 flex-1 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <MaterialCommunityIcons
              name="qrcode-edit"
              size={24}
              color={isDark ? '#fff' : '#333'}
              className="mr-2"
            />
            <Text
              className="flex-1 text-base md:text-lg lg:text-lg font-bold text-gray-700 dark:text-slate-200"
              numberOfLines={1}
            >
              {code}
            </Text>
          </View>
          <View className="flex-row">
            <Pressable
              onPress={onEdit}
              className="p-4 bg-blue-50 dark:bg-blue-900/30 active:bg-blue-100 active:dark:bg-blue-900/10 rounded-lg mr-2"
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#3B82F6" />
            </Pressable>
            <Pressable
              onPress={onDelete}
              className="p-4 bg-red-50 dark:bg-red-900/30  active:dark:bg-red-900/10 active:bg-red-100 rounded-lg"
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={18}
                color="#ef4444"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const ResultItemCard = ({
  item,
  type,
}: {
  item: any;
  type: 'found' | 'missing' | 'extra';
}) => {
  const statusColor = {
    found: 'text-green-600 dark:text-green-400',
    missing: 'text-red-600 dark:text-red-400',
    extra: 'text-orange-600 dark:text-orange-400',
  }[type];

  const borderColor = {
    found: 'border-green-200 dark:border-green-900',
    missing: 'border-red-200 dark:border-red-900',
    extra: 'border-orange-200 dark:border-orange-900',
  }[type];

  return (
    <View className="px-4 mb-3">
      <View
        className={`bg-white dark:bg-[#14161A] border ${borderColor} rounded-xl shadow-sm p-4`}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-xs text-gray-400 uppercase font-bold">
              Código de Bien
            </Text>
            <Text className={`text-lg font-bold ${statusColor}`}>
              {item.bien_codigo}
            </Text>
          </View>
          <View className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            <Text className="text-gray-600 dark:text-gray-300 text-xs font-bold">
              Sec: {item.bien_secuencia}
            </Text>
          </View>
        </View>

        <View className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons
            name="office-building"
            size={16}
            color="gray"
          />
          <Text className="text-sm text-gray-500 dark:text-slate-500 ml-2 flex-1">
            {item.oficina.departamento?.dep_nombre ||
              'Departamento Desconocido'}
          </Text>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="domain" size={16} color="gray" />
          <Text
            className="text-sm text-gray-700 dark:text-slate-300 ml-2 flex-1 font-medium"
            numberOfLines={1}
          >
            {item.oficina?.nombre || 'Oficina Desconocida'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TabSelector = ({
  activeTab,
  onSelect,
}: {
  activeTab: string;
  onSelect: (tab: string) => void;
}) => {
  const tabs = [
    {
      id: 'encontrados',
      label: 'Encontrados',
      icon: 'check-circle-outline',
      color: '#16a34a',
    },
    // {
    //   id: 'faltantes',
    //   label: 'Faltantes',
    //   icon: 'alert-circle-outline',
    //   color: '#dc2626',
    // },
    // {
    //   id: 'sobrantes',
    //   label: 'Sobrantes',
    //   icon: 'help-circle-outline',
    //   color: '#ea580c',
    // },
  ];

  return (
    <View className="flex-row text-gray-400 justify-around bg-white dark:bg-[#14161A] p-2 mx-4 mb-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onSelect(tab.id)}
          className={`items-center flex-1 py-2 rounded-lg ${
            activeTab === tab.id ? 'bg-gray-100 dark:bg-gray-800' : ''
          }`}
        >
          <MaterialCommunityIcons
            name={tab.icon as any}
            size={24}
            color={tab.color}
          />
          <Text
            className={`text-xs mt-1 font-bold ${
              activeTab === tab.id
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const InputModal = ({
  visible,
  value,
  onChangeText,
  onClose,
  onSave,
  isEditing,
}: any) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-2xl p-6">
          <Text className="text-xl font-bold text-gray-800 dark:text-slate-200 text-center mb-4">
            {isEditing ? 'Editar Código' : 'Agregar Código'}
          </Text>
          <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-6">
            <TextInput
              mode="flat"
              label="Clave / N° Serie"
              value={value}
              onChangeText={onChangeText}
              theme={customTheme}
              autoCapitalize="characters"
              style={{ backgroundColor: 'transparent' }}
              left={<TextInput.Icon icon="barcode" />}
            />
          </View>
          <View className="flex-row justify-between">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mr-2"
            >
              <Text className="text-gray-700 dark:text-gray-300 text-center font-bold">
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={onSave}
              className="flex-1 bg-blue-600 rounded-lg p-4 ml-2"
            >
              <Text className="text-white text-center font-bold">
                {isEditing ? 'Actualizar' : 'Agregar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export function Gest_GenerateQR({ access_token }: { access_token: string }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  // 🚀 Instanciamos el Hook
  const { compararBienes } = useGenerateQRController();

  const [inputCodes, setInputCodes] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [selectedOffice, setSelectedOffice] = useState<{
    id: number;
    nombre: string;
    codigo: string;
  } | null>(null);
  const [officeModalVisible, setOfficeModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] =
    useState<CompararBienesRespuesta | null>(null);

  // --- NUEVO ESTADO PARA BOTONES INDEPENDIENTES ---
  // Puede ser 'csv', 'pdf' o null (ninguno)
  const [generatingFile, setGeneratingFile] = useState<'csv' | 'pdf' | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState('encontrados');

  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    title: '',
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleOpenInputModal = () => {
    if (!selectedOffice) {
      // setAlertInfo({
      //   visible: true,
      //   title: 'Seleccionar Oficina',
      //   message:
      //     'Para poder agregar códigos, primero debes seleccionar una oficina.',
      // });
      return;
    }
    setInputText('');
    setEditingIndex(null);
    setModalVisible(true);
  };

  const handleSaveInput = () => {
    if (!inputText.trim()) return;
    const code = inputText.trim().toUpperCase();

    // 1. Caso de Edición
    if (editingIndex !== null) {
      const updated = [...inputCodes];
      updated[editingIndex] = code;
      setInputCodes(updated);
      setModalVisible(false);
      setInputText('');
    }
    // 2. Caso de Nuevo Ingreso
    else {
      if (!inputCodes.includes(code)) {
        // Si NO existe, agregamos y cerramos
        setInputCodes([code, ...inputCodes]);
        setModalVisible(false);
        setInputText('');
      } else {
        // 3. SI ES DUPLICADO:
        // Primero cerramos el modal de input
        setModalVisible(false);

        // Le damos un mini delay para que se cierre bien antes de abrir el AlertModal
        setTimeout(() => {
          setAlertInfo({
            visible: true,
            title: 'Código Duplicado',
            message: `El código "${code}" ya existe en la lista.`,
          });
        }, 400); // 400ms es suficiente para que la animación de cierre termine
      }
    }
  };

  const handleDeleteTrigger = (index: number) => {
    setConfirmModal({
      visible: true,
      title: 'Eliminar Código',
      message: '¿Estás seguro de que quieres eliminar este código de la lista?',
      onConfirm: () => {
        const updated = [...inputCodes];
        updated.splice(index, 1);
        setInputCodes(updated);
        setConfirmModal({ ...confirmModal, visible: false });
      },
    });
  };

  const handleFinishAndValidate = async () => {
    if (inputCodes.length === 0) {
      setAlertInfo({
        visible: true,
        title: 'Lista Vacía',
        message: 'Agrega al menos un código para validar.',
      });
      return;
    }
    if (!selectedOffice) {
      setAlertInfo({
        visible: true,
        title: 'Oficina Requerida',
        message: 'No hay una oficina seleccionada para validar.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: CompararBienes = {
        id_oficina: selectedOffice.id,
        claves_escaneadas: inputCodes as any,
      };

      const credenciales: Access_token = { access_token };
      console.log('Ver Paylod: ', payload);

      // 🚀 Usamos la función del hook
      const respuesta: CompararBienesRespuesta = await compararBienes(
        credenciales,
        payload,
      );

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setApiResponse(respuesta);
      setActiveTab('encontrados');
    } catch (error: any) {
      // Ignoramos el error de autenticación porque el modal ya se encargará
      if (error.message !== 'Unauthenticated.') {
        console.error(error);
        setAlertInfo({
          visible: true,
          title: 'Error',
          message: 'No se pudo conectar con el servidor.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCSV = async () => {
    if (
      !apiResponse ||
      !apiResponse.encontrados ||
      apiResponse.encontrados.length === 0
    ) {
      setAlertInfo({
        visible: true,
        title: 'Sin datos',
        message: 'No hay bienes encontrados para generar el reporte.',
      });
      return;
    }

    try {
      setIsLoading(true);
      setGeneratingFile('csv'); // <--- AGREGAR ESTO (Inicia bloqueo)

      let csvContent = 'Código de bien,Secuencia,Oficina,Departamento\n';

      apiResponse.encontrados.forEach((item) => {
        const codigo = `"${item.bien_codigo}"`;
        const secuencia = `"${item.bien_secuencia}"`;
        const oficina = `"${item.oficina?.nombre || 'Sin Oficina'}"`;
        const depto = `"${item.oficina?.departamento?.dep_nombre || 'N/A'}"`;
        csvContent += `${codigo},${secuencia},${oficina},${depto}\n`;
      });

      const fileName = `${FileSystem.cacheDirectory}Reporte_Encontrados_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileName, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileName);
      } else {
        setAlertInfo({
          visible: true,
          title: 'Error',
          message: 'La función de compartir no está disponible.',
        });
      }
    } catch (error) {
      console.error('Falló la generación del CSV.' + error);
      setAlertInfo({
        visible: true,
        title: 'Error',
        message: 'Falló la generación del CSV.',
      });
    } finally {
      setIsLoading(false);
      setGeneratingFile(null); // <--- AGREGAR ESTO (Libera bloqueo)
    }
  };

  const handleGeneratePDF = async () => {
    if (
      !apiResponse ||
      !apiResponse.encontrados ||
      apiResponse.encontrados.length === 0
    ) {
      setAlertInfo({
        visible: true,
        title: 'Sin datos',
        message: 'No hay bienes encontrados para generar las etiquetas.',
      });
      return;
    }

    try {
      setIsLoading(true);
      setGeneratingFile('pdf'); // <--- AGREGAR ESTO (Inicia bloqueo)

      // Llamamos al componente externo
      const pdfUri = await generateLabelsPDF(apiResponse.encontrados, true);

      // Verificamos si podemos compartir
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Descargar Etiquetas de Bienes',
        });
      } else {
        setAlertInfo({
          visible: true,
          title: 'PDF Generado',
          message: `El PDF se guardó en: ${pdfUri}`,
        });
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      setAlertInfo({
        visible: true,
        title: 'Error PDF',
        message: 'Hubo un error al crear el archivo PDF.',
      });
    } finally {
      setIsLoading(false);
      setGeneratingFile(null); // <--- AGREGAR ESTO (Libera bloqueo)
    }
  };

  const handleRestartTrigger = () => {
    setConfirmModal({
      visible: true,
      title: 'Reiniciar',
      message: '¿Deseas borrar todo y empezar de nuevo?',
      onConfirm: () => {
        setApiResponse(null);
        setInputCodes([]);
        setConfirmModal({ ...confirmModal, visible: false });
      },
    });
  };

  const renderCaptureView = () => (
    <>
      <FlatList
        data={inputCodes}
        keyExtractor={(item, index) => `${index}-${item}`}
        renderItem={({ item, index }) => (
          <CaptureItemCard
            code={item}
            onEdit={() => {
              setInputText(item);
              setEditingIndex(index);
              setModalVisible(true);
            }}
            onDelete={() => handleDeleteTrigger(index)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="px-4 mt-4 mb-2">
              <View className="items-center">
                <View className="w-full md:w-10/12 lg:w-3/4 bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 p-4 rounded-2xl shadow-lg mb-4">
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="keyboard-variant"
                      size={50}
                      color={colorScheme === 'light' ? 'gray' : 'white'}
                    />
                  </View>

                  <Text className="text-gray-800 dark:text-slate-300 text-2xl font-bold text-center">
                    Generación Manual
                  </Text>
                  <Text className="text-gray-700 dark:text-slate-400 text-center mb-4">
                    Captura códigos para validar.
                  </Text>

                  {/* --- NUEVO: Display de Oficina Seleccionada --- */}
                  <View className="w-full mb-3">
                    {selectedOffice ? (
                      <Pressable
                        onPress={() => setOfficeModalVisible(true)}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex-row items-center"
                      >
                        <View className="bg-blue-500 rounded-full p-2 mr-3">
                          <MaterialCommunityIcons
                            name="office-building"
                            size={20}
                            color="white"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">
                            Oficina Seleccionada
                          </Text>
                          <Text
                            className="text-gray-800 dark:text-white font-bold text-base"
                            numberOfLines={1}
                          >
                            {selectedOffice.nombre}
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name="pencil"
                          size={18}
                          color="#2563eb"
                        />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => setOfficeModalVisible(true)}
                        className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 flex-row items-center"
                      >
                        <View className="bg-orange-500 rounded-full p-2 mr-3">
                          <MaterialCommunityIcons
                            name="alert"
                            size={20}
                            color="white"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-800 dark:text-white font-bold text-base uppercase">
                            Seleccionar Oficina
                          </Text>
                          <Text className="text-xs text-orange-600 dark:text-orange-400">
                            Requerido para comenzar
                          </Text>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color="#ea580c"
                        />
                      </Pressable>
                    )}
                  </View>

                  {/* Botón Agregar Código (Controlado) */}
                  <Pressable
                    onPress={handleOpenInputModal}
                    className={`${
                      selectedOffice
                        ? 'bg-blue-500 dark:bg-blue-700 active:bg-blue-600 active:dark:bg-blue-800'
                        : 'bg-gray-300 dark:bg-gray-700'
                    } rounded-lg py-3 flex-row justify-center items-center shadow w-full`}
                  >
                    <MaterialCommunityIcons
                      name={selectedOffice ? 'plus' : 'lock'}
                      size={20}
                      color={selectedOffice ? 'white' : '#666'}
                    />
                    <Text
                      className={`${selectedOffice ? 'text-white' : 'text-gray-500'} font-bold ml-2`}
                    >
                      Agregar Código
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="flex-row justify-between items-end mb-2">
                <Text className="text-gray-500 font-bold">
                  LISTA PRELIMINAR
                </Text>
                <Text className="text-gray-400">
                  {inputCodes.length} códigos
                </Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View className="items-center py-10 opacity-90">
            <MaterialCommunityIcons
              name="playlist-plus"
              size={60}
              color="gray"
            />
            <Text className="text-gray-500 mt-2">Lista vacía</Text>
          </View>
        }
      />

      {inputCodes.length > 0 && (
        <View className="absolute bottom-5 left-4 right-4">
          <Pressable
            onPress={handleFinishAndValidate}
            className="bg-green-600 dark:bg-green-700 py-4 rounded-xl shadow-xl flex-row justify-center items-center"
          >
            <Text className="text-white font-bold text-lg mr-2">
              Terminar y Validar
            </Text>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={24}
              color="white"
            />
          </Pressable>
        </View>
      )}
    </>
  );

  const renderResultsView = () => {
    let currentData = [];
    let currentType: 'found' | 'missing' | 'extra' = 'found';

    if (activeTab === 'encontrados') {
      currentData = apiResponse?.encontrados || [];
      currentType = 'found';
    } else if (activeTab === 'faltantes') {
      currentData = apiResponse?.faltantes || [];
      currentType = 'missing';
    } else {
      currentData = apiResponse?.sobrantes || [];
      currentType = 'extra';
    }

    return (
      <>
        {/* Header de Resumen */}
        <View className="px-4 mt-4 mb-2">
          <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl shadow-sm flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
                Oficina Validada
              </Text>
              <Text
                className="text-sm font-bold text-gray-800 dark:text-white"
                numberOfLines={4}
              >
                {selectedOffice?.nombre}
              </Text>
            </View>
            <Pressable
              onPress={handleRestartTrigger}
              className="bg-blue-100 dark:bg-blue-900/30 active:bg-blue-200 active:dark:bg-blue-900/50 p-4 py-2 px-2 rounded-lg"
            >
              <View className="items-center">
                <MaterialCommunityIcons
                  name="refresh"
                  size={22}
                  color="#2563eb"
                />
                <Text
                  className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase"
                  numberOfLines={1}
                >
                  Nueva Captura
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <TabSelector
          activeTab={activeTab}
          onSelect={(tab) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setActiveTab(tab);
          }}
        />

        <FlatList
          data={currentData as any[]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ResultItemCard item={item} type={currentType} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center py-10 opacity-50">
              <MaterialCommunityIcons
                name="folder-open-outline"
                size={50}
                color="gray"
              />
              <Text className="text-gray-500 mt-2">
                No hay items en esta categoría
              </Text>
            </View>
          }
        />

        {activeTab === 'encontrados' && currentData.length > 0 && (
          <View className="absolute bottom-1 left-4 right-4">
            {/* BOTÓN CSV */}
            <Pressable
              onPress={handleGenerateCSV}
              // Desactivar si isLoading es true (general) O si se está generando el OTRO archivo (pdf)
              disabled={isLoading || generatingFile === 'pdf'}
              className={`py-4 rounded-xl shadow-xl flex-row justify-center items-center border 
                ${
                  generatingFile === 'pdf'
                    ? 'bg-gray-400 border-gray-400 opacity-50' // Estilo Gris (Desactivado por el otro)
                    : 'bg-blue-700 dark:bg-blue-700 border-blue-700 dark:border-blue-600 active:bg-blue-800' // Estilo Normal
                }`}
            >
              {generatingFile === 'csv' ? ( // Solo mostrar carga si este botón fue el presionado
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="file-delimited"
                    size={24}
                    color="white"
                  />
                  <Text className="text-white font-bold text-lg ml-2">
                    Descargar CSV
                  </Text>
                </>
              )}
            </Pressable>

            {/* BOTÓN PDF */}
            <Pressable
              onPress={handleGeneratePDF}
              // Desactivar si isLoading es true (general) O si se está generando el OTRO archivo (csv)
              disabled={isLoading || generatingFile === 'csv'}
              className={`mt-2 py-4 rounded-xl shadow-xl flex-row justify-center items-center border 
                ${
                  generatingFile === 'csv'
                    ? 'bg-gray-400 border-gray-400 opacity-50' // Estilo Gris (Desactivado por el otro)
                    : 'bg-green-700 dark:bg-green-700 border-green-700 dark:border-green-600 active:bg-green-800' // Estilo Normal
                }`}
            >
              {generatingFile === 'pdf' ? ( // Solo mostrar carga si este botón fue el presionado
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="printer"
                    size={24}
                    color="white"
                  />
                  <Text className="text-white font-bold text-lg ml-2">
                    Descargar PDF
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      </>
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
        <Header dataWorkPlace={dataWorkPlace} />

        <View style={{ flex: 1 }}>
          {isLoading && !apiResponse ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator
                size="large"
                color={colorScheme === 'light' ? 'gray' : 'white'}
              />
              <Text className="text-gray-500 mt-4 font-bold">
                Procesando...
              </Text>
            </View>
          ) : apiResponse ? (
            renderResultsView()
          ) : (
            renderCaptureView()
          )}
        </View>
      </View>

      {/* --- Modales --- */}
      <InputModal
        visible={modalVisible}
        value={inputText}
        onChangeText={setInputText}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveInput}
        isEditing={editingIndex !== null}
      />

      <Select_Oficina_DropDown
        visible={officeModalVisible}
        onClose={() => setOfficeModalVisible(false)}
        access_token={access_token}
        onSelect={(oficina) => {
          setSelectedOffice(oficina);
        }}
      />

      <InfoAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
      />

      <ConfirmationModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, visible: false })}
      />
    </StyleGlobal>
  );
}
