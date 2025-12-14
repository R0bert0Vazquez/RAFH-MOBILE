import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useState } from 'react';

import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, Access_token } from '@/src/models/types';

import { Select_Oficina_DropDown } from '@/src/components/Select_Oficina_DropDownPicker';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompararBienes } from '@/src/models/types_BienesResponse';

// 🚀 Importamos el hook
import { useScannerQRController } from '@/src/controllers/controllers_gestor/scannerQR.controller';
const Icon_itch = require('@/assets/icon_itch.png');

const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

// --- Tarjeta de Inicio (Modificada con Selector de Oficina) ---
const StartScanningCard = ({
  onPressStart,
  onPressSelectOffice,
  selectedOffice,
}: {
  onPressStart: () => void;
  onPressSelectOffice: () => void;
  selectedOffice: { nombre: string } | null;
}) => (
  <View className="w-full md:w-10/12 lg:w-3/4">
    <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-lg p-6 items-center">
      <MaterialCommunityIcons
        name="qrcode-scan"
        size={50}
        color="#25A4D6"
        className="mb-4"
      />
      <Text className="text-xl md:text-3xl lg:text-3xl font-bold text-center text-gray-700 dark:text-slate-300 mb-2">
        Levantamiento de Inventario
      </Text>
      <Text className="text-base md:text-xl lg:text-xl text-center text-gray-500 dark:text-slate-400 mb-6">
        Selecciona la oficina y presiona el botón para comenzar a escanear.
      </Text>

      {/* --- SECCIÓN DE OFICINA --- */}
      <View className="w-full mb-4">
        {selectedOffice ? (
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
                {selectedOffice.nombre}
              </Text>
            </View>
            <MaterialCommunityIcons name="pencil" size={18} color="#2563eb" />
          </Pressable>
        ) : (
          <Pressable
            onPress={onPressSelectOffice}
            className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 flex-row items-center"
          >
            <View className="bg-orange-500 rounded-full p-2 mr-3">
              <MaterialCommunityIcons name="alert" size={20} color="white" />
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

      {/* --- Botón de Empezar (Controlado) --- */}
      <Pressable
        onPress={onPressStart}
        className={`${
          selectedOffice
            ? 'bg-blue-500 dark:bg-blue-600 active:bg-blue-700'
            : 'bg-gray-300 dark:bg-gray-700'
        } rounded-lg p-4 w-full shadow-md flex-row justify-center items-center`}
      >
        <MaterialCommunityIcons
          name={selectedOffice ? 'qrcode-scan' : 'lock'}
          size={20}
          color={selectedOffice ? 'white' : '#666'}
          style={{ marginRight: 10 }}
        />
        <Text
          className={`${
            selectedOffice ? 'text-white' : 'text-gray-500'
          } md:text-xl lg:text-xl text-center font-bold text-lg`}
        >
          Empezar Levantamiento
        </Text>
      </Pressable>
    </View>
  </View>
);

const ScanningCard = ({
  facing,
  handleBarCodeScanned,
  scanned,
  lastScannedData,
  onStop,
  onCancel,
  isSubmitting,
  isModalOpen,
}: {
  facing: CameraType;
  handleBarCodeScanned: (result: BarcodeScanningResult) => void;
  scanned: boolean;
  lastScannedData: string | null;
  onStop: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isModalOpen: boolean;
}) => (
  <View className="w-full md:w-10/12 lg:w-3/4">
    {/* --- El Cuadro de la Cámara --- */}
    <View className="w-full h-72 md:h-96 lg:h-[300px] bg-black dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-300 dark:border-gray-700">
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        // --- LOGICA CRITICA AQUI ---
        // Si hay un modal abierto, pasamos undefined.
        // Esto le dice a la cámara: "Deja de procesar QR aunque sigas mostrando video"
        onBarcodeScanned={isModalOpen ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {/* --- Overlay de "Buscando..." o "Escaneado" --- */}
      {scanned && (
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 items-center justify-center flex-row">
          <ActivityIndicator size="small" color="#fff" />
          <Text className="text-white font-bold text-lg ml-2">
            Procesando...
          </Text>
        </View>
      )}
    </View>

    {/* --- Tarjeta de "Último Escaneo" --- */}
    <View className="mt-4 bg-white dark:bg-[#14161A] rounded-xl shadow-lg p-4 border-2 border-gray-200 dark:border-gray-700">
      <Text className="text-sm md:text-xl lg:text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">
        ÚLTIMO ESCANEO
      </Text>
      {lastScannedData ? (
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#198A43" // Verde
            className="mr-2"
          />
          <Text
            className="text-lg text-gray-700 dark:text-slate-300 font-medium"
            numberOfLines={1}
          >
            {lastScannedData}
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="scan-helper"
            size={24}
            color="#25A4D6" // Azul
            className="mr-2"
          />
          <Text className="text-lg md:text-xl lg:text-xl text-gray-500 dark:text-slate-400 italic">
            Buscando QR...
          </Text>
        </View>
      )}
    </View>

    {/* --- Botón de Terminar --- */}
    <Pressable
      onPress={onStop}
      disabled={isSubmitting || isModalOpen} // Deshabilitar mientras se envía
      className={`rounded-lg p-4 w-full shadow-md mt-4 ${
        isSubmitting
          ? 'bg-gray-400 dark:bg-gray-600 opacity-50' // Estilo deshabilitado
          : 'bg-green-600 dark:bg-green-700 active:bg-green-800' // Estilo normal
      }`}
    >
      {isSubmitting ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator size="small" color="#fff" />
          <Text className="text-white text-center font-bold text-lg md:text-xl lg:text-xl ml-3">
            Enviando...
          </Text>
        </View>
      ) : (
        <Text className="text-white text-center font-bold text-lg md:text-xl lg:text-xl">
          Terminar Levantamiento
        </Text>
      )}
    </Pressable>

    <Pressable
      onPress={onCancel}
      disabled={isSubmitting || isModalOpen}
      className={`rounded-lg p-4 w-full shadow-md mt-4 ${
        isSubmitting
          ? 'bg-gray-400 dark:bg-gray-600 opacity-50' // Estilo deshabilitado
          : 'bg-gray-600 dark:bg-gray-700 active:bg-gray-800' // Estilo normal
      }`}
    >
      <Text className="text-white text-center font-bold text-lg md:text-xl lg:text-xl">
        Cancelar Levantamiento
      </Text>
    </Pressable>
  </View>
);

const ScannedItemCard = ({ item, index }: { item: string; index: number }) => (
  <View className="items-center mb-2">
    <View className="w-11/12 md:w-10/12 lg:w-3/4 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 flex-row items-center">
      <MaterialCommunityIcons
        name="barcode-scan"
        size={24}
        color="#25A4D6"
        className="mr-3"
      />
      <Text
        className="flex-1 text-base text-gray-700 dark:text-slate-300"
        numberOfLines={1}
      >
        {item}
      </Text>
    </View>
  </View>
);

const ConfirmStopModal = ({
  visible,
  onConfirm,
  onCancel,
  itemCount,
  isSubmitting,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemCount: number;
  isSubmitting: boolean;
}) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View className="flex-1 justify-center items-center bg-black/60 px-5">
      <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
        <View className="items-center mb-4">
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={50}
            color="#25A4D6" // Azul
          />
        </View>

        <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
          Terminar Levantamiento
        </Text>

        <Text className="text-gray-600 dark:text-slate-400 text-base md:text-lg text-center mb-6">
          ¿Estás seguro de terminar? Tienes{' '}
          <Text className="font-bold">{itemCount}</Text> bienes escaneados.
        </Text>

        {/* --- Fila de Botones --- */}
        <View className="flex-row justify-between">
          {/* Botón de Cancelar */}
          <Pressable
            onPress={onCancel}
            disabled={isSubmitting} // Deshabilitar si se está enviando
            className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
          >
            <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
              Cancelar
            </Text>
          </Pressable>

          {/* Botón de Confirmar */}
          <Pressable
            onPress={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 rounded-lg p-4 ml-2 ${
              isSubmitting
                ? 'bg-gray-400' // Estilo deshabilitado
                : 'bg-green-600 active:bg-green-700' // Estilo normal
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Sí, Terminar
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const ConfirmCancelModal = ({
  visible,
  onConfirm,
  onCancel,
  itemCount,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemCount: number;
}) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View className="flex-1 justify-center items-center bg-black/60 px-5">
      <View className="w-full max-w-lg bg-white dark:bg-[#14161A] border-2 border-red-200 dark:border-red-900 rounded-xl shadow-xl p-6">
        <View className="items-center mb-4">
          <MaterialCommunityIcons
            name="alert-remove-outline"
            size={50}
            color="#E53E3E" // Rojo para indicar peligro/borrado
          />
        </View>

        <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
          ¿Cancelar Levantamiento?
        </Text>

        <Text className="text-gray-600 dark:text-slate-400 text-base md:text-lg text-center mb-6">
          Si cancelas ahora,{' '}
          <Text className="font-bold text-red-500">
            se perderán los {itemCount} bienes
          </Text>{' '}
          que has escaneado hasta el momento.
        </Text>

        {/* --- Fila de Botones --- */}
        <View className="flex-row justify-between">
          {/* Botón de Regresar (No cancelar) */}
          <Pressable
            onPress={onCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-600"
          >
            <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
              No, Continuar
            </Text>
          </Pressable>

          {/* Botón de Confirmar Cancelación (Destructivo) */}
          <Pressable
            onPress={onConfirm}
            className="flex-1 bg-red-500 dark:bg-red-600 rounded-lg p-4 ml-2 active:bg-red-700"
          >
            <Text className="text-white text-center font-bold text-lg">
              Sí, Borrar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

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
    if (title.includes('Error')) {
      return { name: 'alert-circle-outline', color: '#E53E3E' }; // Rojo
    }
    if (title.includes('Enviado')) {
      return { name: 'check-circle-outline', color: '#38A169' }; // Verde
    }
    if (title.includes('Seleccionar')) {
      return { name: 'selection-search', color: '#E53E3E' }; // Rojo
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

export function Gest_ScannerQR({ access_token }: { access_token: string }) {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, 'Gest_InfoScannerQR'>
    >();
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  // 🚀 Instanciamos el controlador
  const { compararBienes } = useScannerQRController();

  // --- NUEVO: Estado de Oficina Seleccionada ---
  const [selectedOffice, setSelectedOffice] = useState<{
    id: number;
    nombre: string;
    codigo: string;
  } | null>(null);
  const [officeModalVisible, setOfficeModalVisible] = useState(false);

  // --- Estados ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string[]>([]);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // --- CALCULO CRITICO ---
  // Esta variable determina si hay algun modal que tape la pantalla
  // Si es TRUE, bloqueamos el escaneo
  const isAnyModalOpen =
    showConfirmModal ||
    showCancelModal ||
    alertInfo.visible ||
    officeModalVisible;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <StyleGlobal>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View className="items-center mb-8 absolute top-safe">
            <View className="flex-row items-center">
              <Image
                className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full mr-2"
                source={dataWorkPlace.image}
              />
              <Text className="text-gray-700 dark:text-slate-400 text-xl sm:text-xl md:text-4xl lg:text-5xl font-extrabold">
                {dataWorkPlace.title}
              </Text>
            </View>
          </View>

          <View className="w-10/12 md:w-6/12 lg:w-5/12">
            <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl ios:shadow-sm shadow-gray-600 p-6">
              <View className="items-center mb-4">
                <MaterialCommunityIcons
                  name="camera"
                  size={50}
                  color="#25A4D6"
                />
              </View>

              <Text className="text-gray-700 dark:text-slate-400 text-xl md:text-2xl lg:text-2xl font-bold text-center mb-2">
                Permiso de Cámara Requerido
              </Text>

              <Text className="text-gray-600 dark:text-slate-400 text-base text-center mb-6">
                Para poder escanear códigos QR y brindarte la mejor experiencia,
                necesitamos acceso a tu cámara.
              </Text>

              <Pressable
                onPress={requestPermission}
                className="bg-blue-500 dark:bg-blue-600 rounded-lg p-4 w-full shadow-md"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Conceder Permiso
                </Text>
              </Pressable>

              <Text className="text-gray-500 dark:text-slate-500 text-xs text-center mt-4">
                Tu privacidad es importante. Solo usaremos la cámara para
                escanear códigos QR.
              </Text>
            </View>
          </View>
        </View>
      </StyleGlobal>
    );
  }

  // --- Handlers ---
  const handleStartScanning = () => {
    if (!selectedOffice) {
      // setAlertInfo({
      //   visible: true,
      //   title: 'Seleccionar Oficina',
      //   message: 'Debes seleccionar una oficina antes de comenzar.',
      // });
      return;
    }

    setIsScanning(true);
    setLastScannedData(null);
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    // DOBLE SEGURIDAD: Si por alguna razón la propiedad de CameraView no actualizó a tiempo,
    // este return previene la lógica.
    if (scanned || isAnyModalOpen) return;
    setScanned(true);

    const data = result.data;
    // console.log('\nQR Escaneado:', data);
    setLastScannedData(data);

    setScannedData((prevData) => {
      if (prevData.includes(data)) {
        // console.log('Dato duplicado, no se agregará:', data);

        setAlertInfo({
          visible: true,
          title: 'QR ya escaneado',
          message: `El QR "${data}" ya ha sido escaneado.`,
        });
        return prevData;
      } else {
        // console.log('Dato NUEVO, agregando:', data);
        return [data, ...prevData];
      }
    });

    setTimeout(() => {
      setScanned(false);
    }, 3000);
  };

  const handleSubmitInventory = async () => {
    setShowConfirmModal(false);

    if (scannedData.length === 0) {
      setAlertInfo({
        visible: true,
        title: 'Lista Vacía',
        message: 'No has escaneado ningún bien para enviar.',
      });
      setIsScanning(false);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!selectedOffice) return;

      // 🚀 LLAMADA REAL A LA API USANDO EL HOOK
      const credenciales: Access_token = { access_token };
      const payload: CompararBienes = {
        id_oficina: selectedOffice.id,
        claves_escaneadas: scannedData as any,
      };

      await compararBienes(credenciales, payload);

      setAlertInfo({
        visible: true,
        title: 'Levantamiento Enviado',
        message: `Se enviaron ${scannedData.length} bienes exitosamente.`,
      });
    } catch (error: any) {
      if (error.message !== 'Unauthenticated.') {
        console.error('Error al enviar inventario:', error);
        setAlertInfo({
          visible: true,
          title: 'Error',
          message:
            'No se pudo enviar el levantamiento. Por favor, intenta de nuevo.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    if (alertInfo.title.includes('Enviado')) {
      if (!selectedOffice) return;

      const payload: CompararBienes = {
        id_oficina: selectedOffice.id,
        claves_escaneadas: scannedData as any,
      };

      setAlertInfo({ ...alertInfo, visible: false });
      navigation.navigate('Gest_InfoScannerQR', {
        access_token,
        payload,
        selectedOffice,
      });
      setIsScanning(false);
      setLastScannedData(null);
      setScannedData([]);
      // Opcional: setSelectedOffice(null); si quieres que vuelvan a seleccionar
    } else {
      setAlertInfo({ ...alertInfo, visible: false });
    }
  };

  const handleStopScanning = () => {
    setShowConfirmModal(true);
  };

  // 1. Al presionar el botón "Cancelar Levantamiento" en la UI
  const handleCancelScanning = () => {
    // Si no hay nada escaneado, simplemente salimos del modo escaneo sin preguntar
    if (scannedData.length === 0) {
      setIsScanning(false);
      setLastScannedData(null);
      return;
    }
    // Si hay datos, mostramos el modal de advertencia
    setShowCancelModal(true);
  };

  // 2. Al confirmar que SÍ quiere cancelar (Botón Rojo del Modal)
  const handleConfirmCancel = () => {
    setShowCancelModal(false); // Cierra modal
    setIsScanning(false); // Oculta la cámara
    setScannedData([]); // Borra la lista
    setLastScannedData(null); // Borra el último escaneo

    // Opcional: Feedback visual de que se canceló
    // setAlertInfo({
    //   visible: true,
    //   title: 'Cancelado',
    //   message: 'El levantamiento ha sido cancelado y los datos descartados.'
    // });
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
        <FlatList
          data={scannedData}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item, index }) => (
            <ScannedItemCard item={item} index={index} />
          )}
          ListHeaderComponent={
            <>
              <Header dataWorkPlace={dataWorkPlace} />
              <View className="items-center px-4 md:px-6 py-4">
                {!isScanning ? (
                  <StartScanningCard
                    onPressStart={handleStartScanning}
                    onPressSelectOffice={() => setOfficeModalVisible(true)}
                    selectedOffice={selectedOffice}
                  />
                ) : (
                  <ScanningCard
                    facing={facing}
                    handleBarCodeScanned={handleBarCodeScanned}
                    scanned={scanned}
                    lastScannedData={lastScannedData}
                    onStop={handleStopScanning}
                    onCancel={handleCancelScanning}
                    isSubmitting={isSubmitting}
                    isModalOpen={isAnyModalOpen} // <--- PASAMOS LA BANDERA AQUI
                  />
                )}
              </View>

              <View className="px-5 md:px-10 lg:px-12 mt-4 mb-3">
                <Text className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-700 dark:text-slate-300">
                  Levantamiento ({scannedData.length} Bienes)
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <Text className="text-center text-xl md:text-2xl lg:text-2xl  text-gray-600 dark:text-slate-400 mt-4 px-6">
              {!isScanning
                ? 'Selecciona una oficina y presiona "Empezar Levantamiento".'
                : 'Esperando primer escaneo...'}
            </Text>
          }
          className="mb-2"
        />
      </View>

      <ConfirmStopModal
        visible={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleSubmitInventory}
        itemCount={scannedData.length}
        isSubmitting={isSubmitting}
      />

      <ConfirmCancelModal
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        itemCount={scannedData.length}
      />

      <InfoAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={handleCloseAlert}
      />

      <Select_Oficina_DropDown
        visible={officeModalVisible}
        onClose={() => setOfficeModalVisible(false)}
        access_token={access_token}
        onSelect={(oficina) => {
          setSelectedOffice(oficina);
        }}
      />
    </StyleGlobal>
  );
}
