import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  LayoutAnimation,
  UIManager,
} from 'react-native';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Access_token, RootStackParamList } from '@/src/models/types';

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  BienDetallado,
  CompararBienesRespuesta,
  LevantamientoRequest,
  AccionSobrante,
  SobranteDetallado,
} from '@/src/models/types_BienesResponse';
import {
  compararBienes,
  subirLevantamiento,
} from '@/src/controllers/controllers_gestor/infoScannerQR.controller';

import { iconMap } from '@/src/components/dataBienes';
import { Select_Oficina_DropDown } from '@/src/components/Select_Oficina_DropDownPicker';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- CORRECCIÓN PUNTO 1: Agregar soporte para 'extravíado' con acento ---
const localBienEstadosBg: Record<string, string> = {
  activo: 'bg-green-100 dark:bg-green-900/30',
  'en tránsito': 'bg-yellow-100 dark:bg-yellow-900/30',
  extraviado: 'bg-red-100 dark:bg-red-900/30',
  extravíado: 'bg-red-100 dark:bg-red-900/30', // Agregado con acento
  baja: 'bg-gray-100 dark:bg-gray-900/30',
  default: 'bg-gray-100 dark:bg-gray-800',
};

const localBienEstadosTexto: Record<string, string> = {
  activo: 'text-green-700 dark:text-green-400',
  'en tránsito': 'text-yellow-700 dark:text-yellow-400',
  extraviado: 'text-red-700 dark:text-red-400',
  extravíado: 'text-red-700 dark:text-red-400', // Agregado con acento
  baja: 'text-gray-700 dark:text-gray-400',
  default: 'text-gray-600 dark:text-gray-400',
};
// ----------------------------------------------------------------------

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
    {
      id: 'faltantes',
      label: 'Faltantes',
      icon: 'alert-circle-outline',
      color: '#dc2626',
    },
    {
      id: 'sobrantes',
      label: 'Sobrantes',
      icon: 'help-circle-outline',
      color: '#ea580c',
    },
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

const UploadConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  isUploading,
  itemCount,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isUploading: boolean;
  itemCount: number;
}) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View className="flex-1 justify-center items-center bg-black/60 px-5">
      <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
        <View className="items-center mb-4">
          <MaterialCommunityIcons
            name="cloud-question-outline"
            size={50}
            color="#3B82F6" // Azul (a juego con el botón)
          />
        </View>

        <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
          Confirmar Envío
        </Text>

        <Text className="text-gray-600 dark:text-slate-400 text-base md:text-lg text-center mb-6">
          Estás a punto de subir <Text className="font-bold">{itemCount}</Text>{' '}
          bienes al inventario. ¿Deseas continuar?
        </Text>

        {/* --- Fila de Botones --- */}
        <View className="flex-row justify-between">
          {/* Botón de Cancelar */}
          <Pressable
            onPress={onClose}
            disabled={isUploading} // Deshabilitar si se está enviando
            className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
          >
            <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
              Cancelar
            </Text>
          </Pressable>

          {/* Botón de Confirmar */}
          <Pressable
            onPress={onConfirm}
            disabled={isUploading}
            className={`flex-1 rounded-lg p-4 ml-2 ${
              isUploading
                ? 'bg-gray-400 dark:bg-gray-500' // Estilo deshabilitado
                : 'bg-blue-600 active:bg-blue-700' // Estilo normal
            }`}
          >
            {isUploading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white text-center font-bold text-lg ml-2">
                  Enviando...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Sí, Subir
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const ResumLevantamiento = ({
  selectedOffice,
  currentData,
  apiResponse,
  onRestart,
  activeTab,
  access_token,
  setAlertInfo,
  tempFaltantes,
  tempSobrantes,
  loadData,
  tempEdits,
  tempMoves,
  setTempEdits,
  setTempMoves,
  setTempFaltantes,
  setTempSobrantes,
  handleRestartCapture,
}: {
  selectedOffice: {
    id: number;
    nombre: string;
    codigo: string;
  };
  currentData: BienDetallado[];
  apiResponse: CompararBienesRespuesta | null;
  onRestart: () => void;
  activeTab: string;
  access_token: string;
  setAlertInfo: (info: {
    visible: boolean;
    title: string;
    message: string;
  }) => void;
  tempFaltantes: Record<
    number,
    { id: number; accion: string; id_oficina_destino?: number }
  >;
  tempSobrantes: Record<
    number,
    { id: number; accion: 'ACTUALIZAR_AQUI' | 'REGRESO_ORIGEN' }
  >;
  loadData: () => Promise<void>;
  tempEdits: Record<number, Partial<BienDetallado>>;
  tempMoves: Record<number, { id_oficina: number; nombre_oficina: string }>;
  setTempEdits: (value: any) => void;
  setTempMoves: (value: any) => void;
  setTempFaltantes: (value: any) => void;
  setTempSobrantes: (value: any) => void;
  handleRestartCapture: () => void;
}) => {
  const colorScheme = useColorScheme();
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);

  const statusCounts = useMemo(() => {
    return currentData.reduce(
      (acc, bien) => {
        const estado = (bien.bien_estado || '').toLowerCase();
        if (estado === 'activo') {
          acc.activo += 1;
        } else if (estado === 'en tránsito') {
          acc.enTransito += 1;
        } else if (estado === 'extraviado' || estado === 'extravíado') {
          acc.extraviado += 1;
        } else if (estado === 'baja') {
          acc.baja += 1;
        }
        return acc;
      },
      { activo: 0, enTransito: 0, extraviado: 0, baja: 0 },
    );
  }, [currentData]);

  const handleGeneratePdf = async () => {
    if (isLoadingPdf) return;

    setIsLoadingPdf(true);
    try {
      const htmlContent = generatePdfHtml(currentData);
      const fileUri = `${FileSystem.cacheDirectory}reporte_bienes_${Date.now()}.pdf`;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612,
        height: 792,
      });

      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert(
          'La función de compartir no está disponible en este dispositivo.',
        );
        setIsLoadingPdf(false);
        return;
      }

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

  const handleOpenUploadModal = () => {
    setUploadModalVisible(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
  };

  const handleConfirmUpload = async () => {
    if (!apiResponse) return;
    setIsUploading(true);

    try {
      // 1. ENCONTRADOS
      const listaEncontrados = apiResponse.encontrados.map((item) => {
        const id = item.id;
        const moveData = tempMoves[id];
        const editData = tempEdits[id];

        if (moveData) {
          return {
            id: id,
            accion: 'EN_TRANSITO',
            id_oficina_destino: moveData.id_oficina,
          };
        }

        if (editData) {
          return {
            id: id,
            bien_marca: editData.bien_marca || item.bien_marca,
            bien_modelo: editData.bien_modelo || item.bien_modelo,
            bien_serie: editData.bien_serie || item.bien_serie,
            bien_descripcion:
              editData.bien_descripcion || item.bien_descripcion,
            bien_caracteristicas:
              editData.bien_caracteristicas || item.bien_caracteristicas,
          };
        }
        return { id: id };
      });

      // 2. FALTANTES
      const listaFaltantes = apiResponse.faltantes
        .map((item) => {
          const temp = tempFaltantes[item.id];
          if (temp) {
            return {
              id: item.id,
              accion: temp.accion,
              ...(temp.id_oficina_destino && {
                id_oficina_destino: temp.id_oficina_destino,
              }),
            };
          }
          // --- CORRECCIÓN: Comentamos el default y retornamos null ---
          /* return {
            id: item.id,
            accion: 'EXTRAVIADO',
          }; 
          */
          return null; // No hacemos nada con los que no se tocaron
        })
        .filter((item) => item !== null); // Filtramos los nulos para que no vayan en el JSON

      // 3. SOBRANTES
      const listaSobrantes = apiResponse.sobrantes.map((item) => {
        const temp = tempSobrantes[item.id];
        if (temp) {
          return { id: item.id, accion: temp.accion };
        }
        return { id: item.id, accion: 'ACTUALIZAR_AQUI' };
      });

      // Payload Final
      const payloadUpload: LevantamientoRequest = {
        id_oficina_levantamiento: selectedOffice.id,
        encontrados: listaEncontrados as any,
        faltantes: listaFaltantes as any,
        sobrantes: listaSobrantes as any,
      };

      console.log('🚀 Payload Final:', JSON.stringify(payloadUpload, null, 2));

      const credenciales: Access_token = { access_token };
      await subirLevantamiento(credenciales, payloadUpload);

      handleCloseUploadModal();
      setAlertInfo({
        visible: true,
        title: 'Éxito',
        message: 'Levantamiento actualizado correctamente.',
      });

      setTempEdits({});
      setTempMoves({});
      setTempFaltantes({});
      setTempSobrantes({});

      await loadData();

      handleRestartCapture();
    } catch (error: any) {
      console.error(error);
      handleCloseUploadModal();
      setAlertInfo({
        visible: true,
        title: 'Error',
        message: 'No se pudo subir el levantamiento.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <View className="px-4 md:px-6 lg:px-8 pt-2 pb-2">
        <View className="flex-row items-center mb-1">
          <MaterialCommunityIcons
            name="clipboard-list"
            size={40}
            color={colorScheme === 'light' ? '#6b7280' : 'white'}
          />
          <View className="flex-1 ml-2">
            <Text className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-slate-200">
              Resumen del Listado
            </Text>
            <Text className="text-base md:text-lg text-gray-500 dark:text-slate-400">
              {currentData.length} bienes listados.
            </Text>
          </View>
        </View>

        <StatusSummaryCard counts={statusCounts} total={currentData.length} />

        {/* {activeTab === 'found' && (
          <>
            <Pressable
              onPress={handleGeneratePdf}
              disabled={isLoadingPdf || isUploading || currentData.length === 0}
              className={`flex-row items-center justify-center rounded-lg p-3.5 my-2 ${
                isLoadingPdf || isUploading || currentData.length === 0
                  ? 'bg-gray-400 dark:bg-gray-600'
                  : 'bg-green-600 dark:bg-green-700 active:bg-green-800'
              } shadow-md`}
            >
              {isLoadingPdf ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialCommunityIcons
                  name="printer"
                  size={24}
                  color="white"
                  className="mr-2"
                />
              )}
              <Text className="text-white text-center font-bold text-base md:text-lg">
                {isLoadingPdf ? 'Generando PDF...' : 'Descargar Reporte en PDF'}
              </Text>
            </Pressable>
          </>
        )} */}

        {/* <Pressable
          onPress={handleGeneratePdf}
          disabled={isLoadingPdf || isUploading || currentData.length === 0}
          className={`flex-row items-center justify-center rounded-lg p-3.5 my-2 ${
            isLoadingPdf || isUploading || currentData.length === 0
              ? 'bg-gray-400 dark:bg-gray-600'
              : 'bg-green-600 dark:bg-green-700 active:bg-green-800'
          } shadow-md`}
        >
          {isLoadingPdf ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons
              name="printer"
              size={24}
              color="white"
              className="mr-2"
            />
          )}
          <Text className="text-white text-center font-bold text-base md:text-lg">
            {isLoadingPdf ? 'Generando PDF...' : 'Descargar Reporte en PDF'}
          </Text>
        </Pressable> */}
        <Pressable
          onPress={handleOpenUploadModal}
          disabled={isLoadingPdf || isUploading || currentData.length === 0}
          className={`flex-row items-center justify-center rounded-lg p-3.5 my-2 ${
            isLoadingPdf || isUploading || currentData.length === 0
              ? 'bg-gray-400 dark:bg-gray-600'
              : 'bg-blue-600 dark:bg-blue-700 active:bg-blue-800'
          } shadow-md`}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons
              name="cloud-arrow-up-outline"
              size={24}
              color="white"
              className="mr-2"
            />
          )}
          <Text className="text-white text-center font-bold text-base md:text-lg">
            {isUploading ? 'Subiendo levantamiento...' : 'Subir Levantamiento'}
          </Text>
        </Pressable>

        <View className="mt-1 mb-1">
          <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl shadow-sm flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
                Oficina Selecciona
              </Text>
              <Text
                className="text-sm font-bold text-gray-800 dark:text-white"
                numberOfLines={4}
              >
                {selectedOffice?.nombre || 'Oficina Desconocida'}
              </Text>
            </View>
            <Pressable
              onPress={onRestart}
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
      </View>

      <UploadConfirmModal
        visible={isUploadModalVisible}
        onClose={handleCloseUploadModal}
        onConfirm={handleConfirmUpload}
        isUploading={isUploading}
        itemCount={currentData.length}
      />
    </>
  );
};

const Filtros = ({
  searchValue,
  onSearchChange,
  filterOpen,
  setFilterOpen,
  filterValue,
  setFilterValue,
  filterItems,
  setFilterItems,
}: {
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
      primary: '#25A4D6',
      onSurface: '#94a3b8',
      placeholder: '#94a3b8',
      onSurfaceVariant: '#94a3b8',
    },
  };

  return (
    <>
      <View className="items-center px-4 mb-3">
        <View className="w-full md:w-full lg:w-full">
          <View className="landscape:flex-1 landscape:mt-1">
            <View className="landscape:items-center md:items-center">
              <View className="flex-row landscape:flex-row md:flex-row lg:flex-row items-center mt-1">
                <View className="w-6/12 landscape:w-5/12 md:w-5/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 mr-2 landscape:mr-2 md:mr-2 ">
                  <TextInput
                    mode="flat"
                    returnKeyType="search"
                    theme={customTheme}
                    value={searchValue}
                    onChangeText={onSearchChange}
                    label="Buscar..."
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
                    }}
                    textStyle={{
                      color: colorScheme === 'light' ? 'gray' : '#94a3b8',
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

const FormInput = ({
  label,
  icon,
  value,
  onChangeText,
  disabled = false,
  keyboardType = 'default',
  theme,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  keyboardType?: any;
  theme: any;
}) => (
  <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
    <TextInput
      mode="flat"
      theme={theme}
      label={label}
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      keyboardType={keyboardType}
      left={
        <TextInput.Icon
          icon={() => (
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={disabled ? '#9ca3af' : '#10b981'} // gris si disabled, esmeralda si no
            />
          )}
        />
      }
      style={{ backgroundColor: 'transparent' }}
    />
  </View>
);

const EditModal = ({
  visible,
  onClose,
  onConfirmEdit,
  bien,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirmEdit: (updatedBien: BienDetallado) => void;
  bien: BienDetallado | null;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [formData, setFormData] = useState<Partial<BienDetallado>>({});

  useEffect(() => {
    if (bien) {
      setFormData(bien);
    } else {
      setFormData({});
    }
  }, [bien]);

  const handleInputChange = (field: keyof BienDetallado, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#10b981',
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
          className="bg-black/60 px-5 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-1">
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={50}
                color="#10b981" // Verde Esmeralda
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center">
              Editar Información
            </Text>

            <Text
              className="text-gray-700 dark:text-slate-300 text-md md:text-xl text-center mb-3"
              numberOfLines={2}
            >
              {bien.bien_descripcion ? (
                <Text className="font-semibold"> Descripción: </Text>
              ) : (
                <Text className="font-semibold"> Código: </Text>
              )}
              <Text className="font-thin">
                {bien.bien_descripcion || bien.bien_codigo}
              </Text>
            </Text>

            {/* --- Formulario de Edición --- */}
            <View>
              {/* Marca */}
              <FormInput
                label="Marca"
                icon="tag-outline"
                value={formData.bien_marca || ''}
                onChangeText={(val) => handleInputChange('bien_marca', val)}
                theme={customTheme}
              />

              {/* Modelo */}
              <FormInput
                label="Modelo"
                icon="cog-outline"
                value={formData.bien_modelo || ''}
                onChangeText={(val) => handleInputChange('bien_modelo', val)}
                theme={customTheme}
              />

              {/* Serie */}
              <FormInput
                label="Serie"
                icon="cube-outline"
                value={formData.bien_serie || ''}
                onChangeText={(val) => handleInputChange('bien_serie', val)}
                theme={customTheme}
              />

              {/* Descripción */}
              <FormInput
                label="Descripción (Nombre)"
                icon="text-box-outline"
                value={formData.bien_descripcion || ''}
                onChangeText={(val) =>
                  handleInputChange('bien_descripcion', val)
                }
                theme={customTheme}
              />

              {/* Caracteristicas */}
              <FormInput
                label="Características"
                icon="information-outline"
                value={formData.bien_caracteristicas || ''}
                onChangeText={(val) =>
                  handleInputChange('bien_caracteristicas', val)
                }
                theme={customTheme}
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onConfirmEdit(formData as BienDetallado)}
                className="flex-1 bg-emerald-600 rounded-lg p-4 ml-2 active:bg-emerald-700"
              >
                <Text
                  className="text-white text-center font-bold text-lg"
                  numberOfLines={1}
                >
                  Guardar Cambios
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const RequestModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
  targetOffice, // Prop nueva para recibir la oficina seleccionada
  onPressSelectOffice, // Prop nueva para abrir el selector
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bien: BienDetallado | null;
  targetOffice: { nombre: string } | null;
  onPressSelectOffice: () => void;
}) => {
  if (!bien) return null;

  // Validación del botón Mover
  const isButtonDisabled = !targetOffice;

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
          className="bg-black/60 px-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={50}
                color="#a855f7"
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
              Selecciona la nueva oficina
            </Text>
            <Text
              className="text-gray-600 dark:text-slate-400 text-base text-center mb-4"
              numberOfLines={2}
            >
              Vas a mover el bien:{' '}
              <Text className="font-bold">{bien.bien_descripcion}</Text>.
            </Text>

            {/* -- SECCION DE OFICINA (Funcional) -- */}
            <View className="w-full mb-4">
              {targetOffice ? (
                <Pressable
                  onPress={onPressSelectOffice}
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
                      {targetOffice.nombre}
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
                  onPress={onPressSelectOffice}
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
                    <Text className="text-gray-800 dark:text-white font-bold text-base">
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
                onPress={isButtonDisabled ? null : onConfirm}
                // className="flex-1 bg-purple-600 rounded-lg p-4 ml-2 active:bg-purple-700"
                className={`flex-1 rounded-lg p-4 ml-2 ${
                  isButtonDisabled
                    ? 'bg-gray-400 dark:bg-gray-600' // Estilo deshabilitado (Gris)
                    : 'bg-purple-600 active:bg-purple-700' // Estilo activo (Morado)
                }`}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Mover
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- MODAL ACTUALIZADO CON BOTÓN ACTIVO ---
const ChangeStatusModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
  selectedOfficeForTransit,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (nuevoEstado: string) => void;
  bien: BienDetallado | null;
  selectedOfficeForTransit?: { nombre: string } | null;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (selectedOfficeForTransit) setSelectedStatus('en tránsito');
    else if (bien) setSelectedStatus(bien.bien_estado?.toLowerCase() || '');
  }, [bien, selectedOfficeForTransit]);

  if (!bien) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
          <View className="items-center mb-4">
            <MaterialCommunityIcons
              name="list-status"
              size={50}
              color="#ef4444"
            />
          </View>

          <Text className="text-gray-700 dark:text-slate-300 text-xl font-bold text-center mb-2">
            Cambiar Estado del Bien
          </Text>
          <Text className="text-gray-500 dark:text-slate-400 text-sm text-center mb-6">
            Selecciona el nuevo estado para:{' '}
            <Text className="font-bold">
              {bien.bien_descripcion || bien.bien_codigo}
            </Text>
          </Text>

          {/* Lista de Opciones */}
          <View className="mb-6">
            {/* OPCION 1: ACTIVO (NUEVO) */}
            <Pressable
              onPress={() => setSelectedStatus('activo')}
              className={`flex-row items-center p-3 mb-2 rounded-lg border ${
                selectedStatus === 'activo'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color={selectedStatus === 'activo' ? '#10b981' : 'gray'}
              />
              <Text
                className={`ml-3 font-bold text-base ${
                  selectedStatus === 'activo'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Activo
              </Text>
              {selectedStatus === 'activo' && (
                <View className="flex-1 items-end">
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#10b981"
                  />
                </View>
              )}
            </Pressable>

            {/* OPCION 2: EN TRANSITO */}
            <Pressable
              onPress={() => {
                setSelectedStatus('en tránsito');
                onConfirm('en tránsito');
              }}
              className={`flex-row items-center p-3 mb-2 rounded-lg border ${
                selectedStatus === 'en tránsito'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <MaterialCommunityIcons
                name="map-search-outline"
                size={24}
                color={selectedStatus === 'en tránsito' ? '#eab308' : 'gray'}
              />
              <View className="ml-3 flex-1">
                <Text
                  className={`font-bold text-base ${
                    selectedStatus === 'en tránsito'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  En Tránsito
                </Text>
                {selectedOfficeForTransit && (
                  <Text className="text-xs text-gray-500 italic mt-1">
                    Destino: {selectedOfficeForTransit.nombre}
                  </Text>
                )}
              </View>
              {selectedStatus === 'en tránsito' && (
                <View className="items-end">
                  {selectedOfficeForTransit ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#eab308"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#eab308"
                    />
                  )}
                </View>
              )}
            </Pressable>

            {/* OPCION 3: EXTRAVIADO */}
            <Pressable
              onPress={() => setSelectedStatus('extraviado')}
              className={`flex-row items-center p-3 mb-2 rounded-lg border ${
                selectedStatus === 'extraviado'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color={selectedStatus === 'extraviado' ? '#ef4444' : 'gray'}
              />
              <Text
                className={`ml-3 font-bold text-base ${
                  selectedStatus === 'extraviado'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Extraviado
              </Text>
              {selectedStatus === 'extraviado' && (
                <View className="flex-1 items-end">
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#ef4444"
                  />
                </View>
              )}
            </Pressable>
          </View>

          {/* BOTONES */}
          <View className="flex-row justify-between">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2"
            >
              <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (
                  selectedStatus === 'en tránsito' &&
                  !selectedOfficeForTransit
                )
                  return;
                onConfirm(selectedStatus);
              }}
              disabled={
                !(
                  selectedStatus === 'extraviado' ||
                  selectedStatus === 'activo' ||
                  (selectedStatus === 'en tránsito' && selectedOfficeForTransit)
                )
              }
              className={`flex-1 rounded-lg p-4 ml-2 ${
                selectedStatus === 'extraviado' ||
                selectedStatus === 'activo' ||
                (selectedStatus === 'en tránsito' && selectedOfficeForTransit)
                  ? 'bg-blue-600 active:bg-blue-700'
                  : 'bg-gray-400'
              }`}
            >
              <Text className="text-white text-center font-bold text-lg">
                Guardar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
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
      return { name: 'alert-circle-outline', color: '#E53E3E' };
    }
    if (title.includes('Enviado') || title.includes('Éxito')) {
      return { name: 'check-circle-outline', color: '#38A169' };
    }
    if (title.includes('Seleccionar') || title.includes('Requerida')) {
      return { name: 'home-search-outline', color: '#E53E3E' };
    }
    return { name: 'information-outline', color: '#25A4D6' };
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

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => {
  if (!value) return null;

  return (
    <View className="flex-row items-center mb-1.5">
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color="#6b7280"
        style={{ width: 20 }}
      />
      <Text
        className="text-sm text-gray-700 dark:text-slate-300 ml-2"
        numberOfLines={3}
      >
        <Text className="font-bold">{label}: </Text>
        <Text className="font-light">{value}</Text>
      </Text>
    </View>
  );
};

const BienItem = ({
  item,
  type,
  onEditPress,
  onRequestPress,
  onChangeStatusPress,
  // NUEVOS PROPS
  onSobranteAction, // Función para manejar el click
  currentSobranteAction, // Para saber cuál está seleccionado y pintarlo de color
  apiResposeSobrantes,
}: {
  item: BienDetallado;
  type: 'found' | 'missing' | 'extra';
  onRequestPress: (item: BienDetallado) => void;
  onEditPress: (item: BienDetallado) => void;
  onChangeStatusPress: (item: BienDetallado) => void;
  // Tipos nuevos
  onSobranteAction?: (item: BienDetallado, action: AccionSobrante) => void;
  currentSobranteAction?: string;
  apiResposeSobrantes?: SobranteDetallado;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const iconName = (iconMap[item.bien_clave] || iconMap.default) as any;
  const estadoKey = (item.bien_estado || '').toLowerCase(); // Normalizamos

  // Aquí ahora 'extravíado' con acento funcionará gracias al mapa actualizado
  const estadoStyleBg =
    localBienEstadosBg[estadoKey] || localBienEstadosBg.default;
  const estadoStyleText =
    localBienEstadosTexto[estadoKey] || localBienEstadosTexto.default;

  // Agregamos soporte para dot color también
  const estadoDotColor =
    {
      activo: 'bg-green-500',
      'en tránsito': 'bg-yellow-500',
      extraviado: 'bg-red-500',
      extravíado: 'bg-red-500', // Fix Punto 1
      baja: 'bg-gray-500',
    }[estadoKey] || 'bg-gray-400';

  const iconBgColor = isDark ? 'bg-blue-900/40' : 'bg-blue-100/80';
  const iconColor = isDark ? '#60a5fa' : '#2563eb';

  const statusColor = {
    found: 'text-green-600 dark:text-green-400',
    missing: 'text-red-600 dark:text-red-400',
    extra: 'text-orange-600 dark:text-orange-400',
  }[type as 'found' | 'missing' | 'extra'];

  const borderColor = {
    found: 'border-green-200 dark:border-green-900',
    missing: 'border-red-200 dark:border-red-900',
    extra: 'border-orange-200 dark:border-orange-900',
  }[type];

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="px-4 mb-3">
      <View
        className={`w-full bg-white dark:bg-[#14161A] border ${borderColor} rounded-xl shadow-lg shadow-black/5 overflow-hidden`}
      >
        {type === 'found' && (
          <>
            {/* === SECCIÓN SUPERIOR (HEADER) === */}
            <Pressable
              onPress={toggleExpand}
              className="p-4"
              android_ripple={{ color: isDark ? '#333' : '#eee' }}
            >
              <View className="flex-row items-center">
                {/* Icono */}
                <View
                  className={`w-12 h-12 rounded-lg items-center justify-center ${iconBgColor} mr-3`}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={28}
                    color={iconColor}
                  />
                </View>

                {/* Código y Descripción */}
                <View className="flex-1 mr-2">
                  <Text
                    // Aplicamos el color de estado al código del bien
                    className={`text-base font-bold ${statusColor}`}
                    numberOfLines={1}
                  >
                    {item.bien_codigo}
                  </Text>
                  <Text
                    className="text-sm text-gray-500 dark:text-slate-400"
                    numberOfLines={4}
                  >
                    {item.bien_descripcion}
                  </Text>
                </View>

                {/* Píldora de Estado */}
                <View
                  className={`flex-row items-center rounded-full px-2.5 py-1 ${estadoStyleBg}`}
                >
                  <View
                    className={`w-2 h-2 rounded-full ${estadoDotColor} mr-1.5`}
                  />
                  <Text
                    className={`text-xs font-bold uppercase ${estadoStyleText}`}
                  >
                    {item.bien_estado}
                  </Text>
                </View>
              </View>

              {/* === SECCIÓN DE RESUMEN (SIEMPRE VISIBLE) === */}
              <View className="flex-row justify-between mt-4">
                <View className="flex-1 mr-2">
                  <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    Marca / Modelo
                  </Text>
                  <Text
                    className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                    numberOfLines={2}
                  >
                    {(item.bien_marca || 'Sin Marca').replace(/"/g, '')} /{' '}
                    {item.bien_modelo || 'Sin Modelo'}
                  </Text>
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    Ubicación
                  </Text>
                  <Text
                    className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                    numberOfLines={3}
                  >
                    {item.oficina.nombre}
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* === SECCIÓN EXPANDIBLE (DETALLES) === */}
            {isExpanded && (
              <View className="px-4 pb-4">
                <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
                <DetailRow
                  icon="domain-switch"
                  label="Ubicacion Actual"
                  value={item.ubicacion_actual.nombre}
                />

                <DetailRow
                  icon="barcode"
                  label="Serie"
                  value={item.bien_serie}
                />

                <DetailRow
                  icon="archive-cog-outline"
                  label="Caracteristicas"
                  value={item.bien_caracteristicas}
                />

                <DetailRow
                  icon="cash"
                  label="Valor"
                  value={`$ ${Number(item.bien_valor_monetario).toFixed(2)}`}
                />
                <DetailRow
                  icon="calendar-check"
                  label="Fecha Alta"
                  value={new Date(item.bien_fecha_alta).toLocaleDateString(
                    'es-MX',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                />
                <DetailRow
                  icon="key-variant"
                  label="Clave"
                  value={item.bien_clave}
                />
                <DetailRow
                  icon="file-document-outline"
                  label="Factura"
                  value={item.bien_numero_factura}
                />
                <DetailRow
                  icon="truck-delivery-outline"
                  label="Proveedor"
                  value={item.bien_provedor}
                />
                <DetailRow
                  icon="tag-outline"
                  label="Tipo Adquisición"
                  value={item.bien_tipo_adquisicion}
                />
                <DetailRow
                  icon="counter"
                  label="Secuencia"
                  value={item.bien_secuencia}
                />
              </View>
            )}
          </>
        )}

        {type === 'missing' && (
          <>
            {/* === SECCIÓN SUPERIOR (HEADER) === */}
            <Pressable
              onPress={toggleExpand}
              className="p-4"
              android_ripple={{ color: isDark ? '#333' : '#eee' }}
            >
              <View className="flex-row items-center">
                {/* Icono */}
                <View
                  className={`w-12 h-12 rounded-lg items-center justify-center ${iconBgColor} mr-3`}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={28}
                    color={iconColor}
                  />
                </View>

                {/* Código y Descripción */}
                <View className="flex-1 mr-2">
                  <Text
                    // Aplicamos el color de estado al código del bien
                    className={`text-base font-bold ${statusColor}`}
                    numberOfLines={1}
                  >
                    {item.bien_codigo}
                  </Text>
                  <Text
                    className="text-sm text-gray-500 dark:text-slate-400"
                    numberOfLines={4}
                  >
                    {item.bien_descripcion}
                  </Text>
                </View>

                {/* Píldora de Estado */}
                <View
                  className={`flex-row items-center rounded-full px-2.5 py-1 ${estadoStyleBg}`}
                >
                  <View
                    className={`w-2 h-2 rounded-full ${estadoDotColor} mr-1.5`}
                  />
                  <Text
                    className={`text-xs font-bold uppercase ${estadoStyleText}`}
                  >
                    {item.bien_estado}
                  </Text>
                </View>
              </View>

              {/* === SECCIÓN DE RESUMEN (SIEMPRE VISIBLE) === */}
              <View className="flex-row justify-between mt-4">
                <View className="flex-1 mr-2">
                  <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    Marca / Modelo
                  </Text>
                  <Text
                    className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                    numberOfLines={2}
                  >
                    {(item.bien_marca || 'Sin Marca').replace(/"/g, '')} /{' '}
                    {item.bien_modelo || 'Sin Modelo'}
                  </Text>
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    Ubicación
                  </Text>
                  <Text
                    className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                    numberOfLines={3}
                  >
                    {item.oficina.nombre}
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* === SECCIÓN EXPANDIBLE (DETALLES) === */}
            {isExpanded && (
              <View className="px-4 pb-4">
                <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />

                <DetailRow
                  icon="domain-switch"
                  label="Ubicacion Actual"
                  value={item.ubicacion_actual.nombre}
                />

                <DetailRow
                  icon="barcode"
                  label="Serie"
                  value={item.bien_serie}
                />

                <DetailRow
                  icon="archive-cog-outline"
                  label="Caracteristicas"
                  value={item.bien_caracteristicas}
                />

                <DetailRow
                  icon="cash"
                  label="Valor"
                  value={`$ ${Number(item.bien_valor_monetario).toFixed(2)}`}
                />
                <DetailRow
                  icon="calendar-check"
                  label="Fecha Alta"
                  value={new Date(item.bien_fecha_alta).toLocaleDateString(
                    'es-MX',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                />
                <DetailRow
                  icon="key-variant"
                  label="Clave"
                  value={item.bien_clave}
                />
                <DetailRow
                  icon="file-document-outline"
                  label="Factura"
                  value={item.bien_numero_factura}
                />
                <DetailRow
                  icon="truck-delivery-outline"
                  label="Proveedor"
                  value={item.bien_provedor}
                />
                <DetailRow
                  icon="tag-outline"
                  label="Tipo Adquisición"
                  value={item.bien_tipo_adquisicion}
                />
                <DetailRow
                  icon="counter"
                  label="Secuencia"
                  value={item.bien_secuencia}
                />
              </View>
            )}
          </>
        )}

        {type === 'extra' && (
          <>
            {/* === SECCIÓN SUPERIOR (HEADER) === */}
            <Pressable
              onPress={toggleExpand}
              className="p-4"
              android_ripple={{ color: isDark ? '#333' : '#eee' }}
            >
              <View className="flex-row items-center">
                {/* Icono */}
                <View
                  className={`w-12 h-12 rounded-lg items-center justify-center ${iconBgColor} mr-3`}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={28}
                    color={iconColor}
                  />
                </View>

                {/* Código y Descripción */}
                <View className="flex-1 mr-2">
                  <Text
                    className={`text-base font-bold ${statusColor}`}
                    numberOfLines={1}
                  >
                    {/* Usamos apiResposeSobrantes si existe, si no fallback a item (por seguridad) */}
                    {apiResposeSobrantes?.codigo || item.bien_codigo}
                  </Text>
                  <Text
                    className="text-sm text-gray-500 dark:text-slate-400"
                    numberOfLines={4}
                  >
                    {apiResposeSobrantes?.descripcion || item.bien_descripcion}
                  </Text>
                </View>
              </View>

              {/* === SECCIÓN DE RESUMEN (SIEMPRE VISIBLE) === */}
              <View className="flex-row justify-between mt-4">
                <View className="flex-1 mr-2">
                  <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    RESGUARDANTE
                  </Text>
                  <Text
                    className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                    numberOfLines={2}
                  >
                    {apiResposeSobrantes?.resguardante || 'Sin Asignar'}
                  </Text>
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                    Ubicación Actual
                  </Text>
                  <Text
                    className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                    numberOfLines={3}
                  >
                    {/* Aquí usamos item.bien_ubicacion_actual porque en displayedData ya mapeamos la oficina */}
                    {apiResposeSobrantes?.ubicacion_actual ||
                      item.oficina.nombre}
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* === SECCIÓN EXPANDIBLE (DETALLES) === */}
            {isExpanded && (
              <View className="px-4 pb-4">
                <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />

                <DetailRow
                  icon="office-building"
                  label="Departamento Resguardante"
                  value={
                    apiResposeSobrantes?.departamento_resguardante ||
                    'No especificado'
                  }
                />
                <DetailRow
                  icon="domain"
                  label="Oficina Pertenencia"
                  value={
                    apiResposeSobrantes?.oficina_pertenencia ||
                    'No especificada'
                  }
                />
              </View>
            )}
          </>
        )}

        {/* === SECCIÓN DE BOTONES (PIE DE PÁGINA) === */}
        <View className="flex-row border-t border-gray-200 dark:border-gray-700">
          {type === 'found' && (
            <>
              <Pressable
                onPress={() => onEditPress(item)}
                className="flex-1 flex-row items-center justify-center p-4 active:bg-emerald-100 dark:active:bg-emerald-700/20 border-r border-gray-200 dark:border-gray-700"
              >
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={18}
                  color={isDark ? '#34d399' : '#10b981'} // emerald-400 || emerald-500
                />
                <Text
                  className="text-emerald-500 dark:text-emerald-400 font-bold text-sm ml-1.5"
                  numberOfLines={1}
                >
                  Editar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onRequestPress(item)}
                className="flex-1 flex-row items-center justify-center p-4 active:bg-purple-100 dark:active:bg-purple-700/20 border-r border-gray-200 dark:border-gray-700"
              >
                <MaterialCommunityIcons
                  name="account-switch-outline"
                  size={18}
                  color={isDark ? '#c084fc' : '#a855f7'} // purple-400 || purple-500
                />
                <Text
                  className="text-purple-500 dark:text-purple-400 font-bold text-sm ml-1.5"
                  numberOfLines={1}
                >
                  Mover a...
                </Text>
              </Pressable>
            </>
          )}

          {type === 'missing' && (
            <Pressable
              onPress={() => onChangeStatusPress(item)}
              className="flex-1 flex-row items-center justify-center p-4 active:bg-red-100 dark:active:bg-red-700/20"
            >
              <MaterialCommunityIcons
                name="archive-off-outline"
                size={18}
                color={isDark ? '#f87171' : '#ef4444'} // red-500
              />
              <Text
                className="text-red-500 dark:text-red-400 font-bold text-sm ml-1.5"
                numberOfLines={1}
              >
                Cambiar Estado
              </Text>
            </Pressable>
          )}

          {type === 'extra' && (
            <>
              <Pressable
                onPress={() =>
                  onSobranteAction && onSobranteAction(item, 'ACTUALIZAR_AQUI')
                }
                className={`flex-1 flex-row items-center justify-center p-4 border-r border-gray-200 dark:border-gray-700 
                  ${
                    currentSobranteAction === 'ACTUALIZAR_AQUI'
                      ? 'bg-blue-100 dark:bg-blue-900/40' // Color activo
                      : 'active:bg-gray-100 dark:active:bg-gray-800'
                  }`}
              >
                <MaterialCommunityIcons
                  name={
                    currentSobranteAction === 'ACTUALIZAR_AQUI'
                      ? 'check-circle'
                      : 'update'
                  }
                  size={18}
                  color="#3b82f6"
                />
                <Text className="text-blue-500 dark:text-blue-400 font-bold text-[10px] ml-1.5 uppercase text-center">
                  Actualizar Aquí
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  onSobranteAction && onSobranteAction(item, 'REGRESAR_ORIGEN')
                }
                className={`flex-1 flex-row items-center justify-center p-4 
                  ${
                    currentSobranteAction === 'REGRESO_ORIGEN'
                      ? 'bg-orange-100 dark:bg-orange-900/40' // Color activo
                      : 'active:bg-gray-100 dark:active:bg-gray-800'
                  }`}
              >
                <MaterialCommunityIcons
                  name={
                    currentSobranteAction === 'REGRESO_ORIGEN'
                      ? 'check-circle'
                      : 'keyboard-return'
                  }
                  size={18}
                  color="#f97316"
                />
                <Text className="text-orange-500 dark:text-orange-400 font-bold text-[10px] ml-1.5 uppercase text-center">
                  Regreso Origen
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
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
    enTransito: number;
    extraviado: number;
    baja: number;
  };
  total: number;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg my-4 overflow-hidden">
      <View className="flex-row divide-x divide-gray-200 dark:divide-gray-700">
        {/* Total */}
        <StatusItem
          iconName="apps"
          label="Total"
          count={total}
          colorClass="text-blue-500 dark:text-blue-400"
          color={colorScheme === 'light' ? '#3b82f6' : '#60a5fa'}
        />
        {/* Activos */}
        <StatusItem
          iconName="check-circle-outline"
          label="Activos"
          count={counts.activo}
          colorClass="text-green-600 dark:text-green-500"
          color={colorScheme === 'light' ? '#16a34a' : '#22c55e'}
        />
        {/* En Tránsito */}
        <StatusItem
          iconName="map-search-outline"
          label="En Tránsito"
          count={counts.enTransito}
          colorClass="text-yellow-600 dark:text-yellow-500"
          color={colorScheme === 'light' ? '#ca8a04' : '#eab308'}
        />
        {/* Extraviado */}
        <StatusItem
          iconName="alert-circle-outline"
          label="Extraviado"
          count={counts.extraviado}
          colorClass="text-red-600 dark:text-red-500"
          color={colorScheme === 'light' ? '#dc2626' : '#ef4444'}
        />
        {/* Baja */}
        <StatusItem
          iconName="archive-arrow-down-outline"
          label="Baja"
          count={counts.baja}
          colorClass="text-gray-600 dark:text-gray-500"
          color={colorScheme === 'light' ? '#4b5563' : '#6b7280'}
        />
      </View>
    </View>
  );
};

const generatePdfHtml = (data: BienDetallado[]) => {
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

  const tableRows = data
    .map(
      (bien) => `
    <tr>
      <td>${bien.bien_codigo}</td>
      <td>${bien.bien_secuencia}</td>
      <td>${bien.bien_marca}</td>
      <td>${bien.bien_modelo}</td>
      <td>${bien.oficina.nombre}</td>
      <td>${bien.bien_estado}</td>
    </tr>
  `,
    )
    .join('');

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
        <p>Total de bienes listados: ${data.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Secuencia</th>
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

export function Gest_InfoScannerQR() {
  const insets = useSafeAreaInsets();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const route = useRoute<RouteProp<RootStackParamList, 'Gest_InfoScannerQR'>>();
  const navigation = useNavigation();

  const { access_token, payload, selectedOffice } = route.params;

  const [valueTextInp, setValueTextInp] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

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
          color="#4ade80" // Green
        />
      ),
    },
    {
      label: 'En tránsito',
      value: 'en tránsito',
      icon: () => (
        <MaterialCommunityIcons
          name="map-search-outline"
          size={18}
          color="#FFA500" // Orange/Yellow
        />
      ),
    },
    {
      label: 'Extraviado',
      value: 'extraviado',
      icon: () => (
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={18}
          color="#ef4444" // Red
        />
      ),
    },
    {
      label: 'Baja',
      value: 'baja',
      icon: () => (
        <MaterialCommunityIcons
          name="archive-arrow-down-outline"
          size={18}
          color="gray" // Gray
        />
      ),
    },
  ]);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);
  const [isChangeStatusModalVisible, setChangeStatusModalVisible] =
    useState(false);
  const [selectedBien, setSelectedBien] = useState<BienDetallado | null>(null);

  const [targetOffice, setTargetOffice] = useState<{
    id: number;
    nombre: string;
    codigo: string;
  } | null>(null);
  const [targetOfficeModalVisible, setTargetOfficeModalVisible] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] =
    useState<CompararBienesRespuesta | null>(null);

  const [activeTab, setActiveTab] = useState('encontrados');

  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const [officeSelectionMode, setOfficeSelectionMode] = useState<
    'MOVE' | 'TRANSIT_MISSING'
  >('MOVE');

  // Estados Temporales
  const [tempEdits, setTempEdits] = useState<
    Record<number, Partial<BienDetallado>>
  >({});
  const [tempMoves, setTempMoves] = useState<
    Record<number, { id_oficina: number; nombre_oficina: string }>
  >({});

  // CORRECCIÓN IMAGEN 1: Cambiado de 'estado' a 'accion' para coincidir con el uso
  const [tempFaltantes, setTempFaltantes] = useState<
    Record<number, { id: number; accion: string; id_oficina_destino?: number }>
  >({});

  const [tempSobrantes, setTempSobrantes] = useState<
    Record<number, { id: number; accion: 'ACTUALIZAR_AQUI' | 'REGRESO_ORIGEN' }>
  >({});

  const loadData = useCallback(async () => {
    const credenciales: Access_token = { access_token };
    setIsLoading(true);
    try {
      const respuesta: CompararBienesRespuesta = await compararBienes(
        credenciales,
        payload,
      );
      setApiResponse(respuesta);
    } catch (error) {
      console.error(error);
      setAlertInfo({
        visible: true,
        title: 'Error',
        message:
          'No se pudo conectar con el servidor para actualizar la lista.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [access_token, payload]);

  useEffect(() => {
    const initLoad = async () => {
      setIsLoading(true);
      await loadData();
      setIsLoading(false);
    };
    initLoad();
  }, [loadData]);

  const processedData = useMemo(() => {
    if (!apiResponse) return [];

    if (activeTab === 'encontrados') {
      return apiResponse.encontrados.map((item) => {
        const editTemp = tempEdits[item.id];
        const moveTemp = tempMoves[item.id];

        return {
          ...item,
          ...editTemp,
          temp_moved_to: moveTemp ? moveTemp.nombre_oficina : undefined,
          bien_ubicacion_actual: moveTemp
            ? moveTemp.nombre_oficina
            : item.oficina?.nombre,
        };
      });
    }

    if (activeTab === 'faltantes') {
      return apiResponse.faltantes.map((i) => {
        const temp = tempFaltantes[i.id];
        // CORRECCIÓN IMAGEN 3: Ahora 'temp.accion' existe en el tipo
        return {
          ...i,
          bien_estado: temp ? temp.accion : i.bien_estado,
          bien_ubicacion_actual: i.oficina?.nombre,
          temp_transit_dest: temp?.id_oficina_destino,
        };
      });
    }

    return apiResponse.sobrantes;
  }, [apiResponse, activeTab, tempFaltantes, tempEdits, tempMoves]);

  const displayedData = processedData as BienDetallado[];

  const EmptyListComponent = () => {
    const colorScheme = useColorScheme();
    if (isLoading) {
      return (
        <View className="items-center pt-5">
          <ActivityIndicator
            size="large"
            color={colorScheme === 'light' ? 'gray' : 'white'}
          />
          <Text className="text-gray-500 mt-4">Cargando datos...</Text>
        </View>
      );
    }

    let message = 'No hay bienes asignados para mostrar.';
    const searchTerm = valueTextInp.trim();

    if (searchTerm.length > 0) {
      message = `No se encontraron bienes que coincidan con "${searchTerm}".`;
    } else if (value && value !== 'sin-filtro') {
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

  const handleOpenEdit = (bien: BienDetallado) => {
    setSelectedBien(bien);
    setEditModalVisible(true);
  };
  const handleCloseEdit = () => {
    setEditModalVisible(false);
    setSelectedBien(null);
  };
  const handleConfirmEdit = async (updatedBien: BienDetallado) => {
    setTempEdits((prev) => ({
      ...prev,
      [updatedBien.id]: {
        bien_marca: updatedBien.bien_marca,
        bien_modelo: updatedBien.bien_modelo,
        bien_serie: updatedBien.bien_serie,
        bien_descripcion: updatedBien.bien_descripcion,
        bien_caracteristicas: updatedBien.bien_caracteristicas,
      },
    }));
    handleCloseEdit();
    setAlertInfo({
      visible: true,
      title: 'Cambio Guardado Temporalmente',
      message: 'Este cambio se aplicará al "Subir Levantamiento".',
    });
  };

  const handleOpenRequest = (bien: BienDetallado) => {
    setSelectedBien(bien);
    setTargetOffice(null);
    setOfficeSelectionMode('MOVE');
    setRequestModalVisible(true);
  };
  const handleCloseRequest = () => {
    setRequestModalVisible(false);
  };
  const handleOpenOfficeSelector = () => {
    setRequestModalVisible(false);
    setTargetOfficeModalVisible(true);
  };

  const handleOpenChangeStatus = (bien: BienDetallado) => {
    setSelectedBien(bien);
    setOfficeSelectionMode('TRANSIT_MISSING');
    setTargetOffice(null);
    setChangeStatusModalVisible(true);
  };

  const handleCloseChangeStatus = () => {
    setChangeStatusModalVisible(false);
    setTargetOffice(null);
  };

  // --- LÓGICA DE CONFIRMACIÓN DE ESTADO ACTUALIZADA ---
  const handleConfirmChangeStatus = async (nuevoEstado: string) => {
    if (!selectedBien) return;

    if (nuevoEstado === 'en tránsito') {
      if (!targetOffice) {
        setChangeStatusModalVisible(false);
        setTargetOfficeModalVisible(true);
        return;
      }
      setTempFaltantes((prev) => ({
        ...prev,
        [selectedBien.id]: {
          id: selectedBien.id,
          accion: 'EN_TRANSITO',
          id_oficina_destino: targetOffice.id,
        },
      }));
      handleCloseChangeStatus();
    } else if (nuevoEstado === 'activo') {
      // NUEVO: Manejo del estado ACTIVO
      setTempFaltantes((prev) => ({
        ...prev,
        [selectedBien.id]: {
          id: selectedBien.id,
          accion: 'ACTIVO',
        },
      }));
      handleCloseChangeStatus();
    } else {
      // Extraviado
      setTempFaltantes((prev) => ({
        ...prev,
        [selectedBien.id]: {
          id: selectedBien.id,
          accion: 'EXTRAVIADO',
        },
      }));
      handleCloseChangeStatus();
    }
  };

  const handleOfficeSelected = (oficina: any) => {
    setTargetOffice(oficina);
    setTimeout(() => {
      if (officeSelectionMode === 'MOVE') {
        setRequestModalVisible(true);
      } else if (officeSelectionMode === 'TRANSIT_MISSING') {
        setChangeStatusModalVisible(true);
      }
    }, 300);
  };

  const handleSobranteAction = (item: any, action: any) => {
    setTempSobrantes((p) => ({
      ...p,
      [item.id]: { id: item.id, accion: action },
    }));
  };

  const handleConfirmRequest = async () => {
    if (!targetOffice || !selectedBien) {
      setAlertInfo({
        visible: true,
        title: 'Oficina Requerida',
        message: 'Debes seleccionar una oficina.',
      });
      return;
    }
    setTempMoves((prev) => ({
      ...prev,
      [selectedBien.id]: {
        id_oficina: targetOffice.id,
        nombre_oficina: targetOffice.nombre,
      },
    }));
    handleCloseRequest();
    setAlertInfo({
      visible: true,
      title: 'Movimiento Pendiente',
      message: `El bien se moverá a ${targetOffice.nombre} al subir el levantamiento.`,
    });
  };

  const handleRestartCapture = () => {
    navigation.goBack();
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
            paddingBottom: insets.bottom,
          }}
        >
          <Header dataWorkPlace={dataWorkPlace} />

          <FlatList
            data={displayedData}
            ListHeaderComponent={
              <>
                <ResumLevantamiento
                  selectedOffice={selectedOffice}
                  currentData={displayedData}
                  apiResponse={apiResponse}
                  onRestart={handleRestartCapture}
                  activeTab={activeTab}
                  access_token={access_token}
                  setAlertInfo={setAlertInfo}
                  tempFaltantes={tempFaltantes}
                  tempSobrantes={tempSobrantes}
                  loadData={loadData}
                  tempEdits={tempEdits}
                  tempMoves={tempMoves}
                  // PASAR LOS SETTERS AQUÍ
                  setTempEdits={setTempEdits}
                  setTempMoves={setTempMoves}
                  setTempFaltantes={setTempFaltantes}
                  setTempSobrantes={setTempSobrantes}
                  handleRestartCapture={handleRestartCapture}
                />

                <TabSelector
                  activeTab={activeTab}
                  onSelect={(tab) => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setActiveTab(tab);
                  }}
                />

                <Filtros
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
                type={
                  activeTab === 'faltantes'
                    ? 'missing'
                    : activeTab === 'sobrantes'
                      ? 'extra'
                      : 'found'
                }
                onEditPress={handleOpenEdit}
                onRequestPress={handleOpenRequest}
                onChangeStatusPress={handleOpenChangeStatus}
                onSobranteAction={handleSobranteAction}
                currentSobranteAction={tempSobrantes[item.id]?.accion}
                apiResposeSobrantes={
                  activeTab === 'sobrantes'
                    ? (item as unknown as SobranteDetallado)
                    : undefined
                }
              />
            )}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={EmptyListComponent}
          />
        </View>
      </KeyboardAvoidingView>

      <EditModal
        visible={isEditModalVisible}
        bien={selectedBien}
        onClose={handleCloseEdit}
        onConfirmEdit={handleConfirmEdit}
      />

      <RequestModal
        visible={isRequestModalVisible}
        bien={selectedBien}
        targetOffice={targetOffice}
        onPressSelectOffice={handleOpenOfficeSelector}
        onClose={handleCloseRequest}
        onConfirm={handleConfirmRequest}
      />

      <ChangeStatusModal
        visible={isChangeStatusModalVisible}
        bien={selectedBien}
        onClose={handleCloseChangeStatus}
        onConfirm={handleConfirmChangeStatus}
        selectedOfficeForTransit={
          officeSelectionMode === 'TRANSIT_MISSING' ? targetOffice : null
        }
      />

      <InfoAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
      />

      <Select_Oficina_DropDown
        visible={targetOfficeModalVisible}
        onClose={() => {
          setTargetOfficeModalVisible(false);
          if (selectedBien) {
            if (officeSelectionMode === 'MOVE') {
              setRequestModalVisible(true);
            } else if (officeSelectionMode === 'TRANSIT_MISSING') {
              setChangeStatusModalVisible(true);
            }
          }
        }}
        access_token={access_token}
        onSelect={(oficina) => {
          handleOfficeSelected(oficina);
        }}
      />
    </StyleGlobal>
  );
}
