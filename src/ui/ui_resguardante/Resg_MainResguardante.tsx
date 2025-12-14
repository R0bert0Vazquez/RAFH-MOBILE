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
  TextInput as NativeTextInput,
} from 'react-native';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // 🚀
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

import { generarYCompartirValeResguardo } from '@/src/components/PDFGenerator_ValeResguardo';

import { User } from '@/src/models/types';
import {
  BienResguardado,
  AreaItem,
  DepartamentoItem,
  OficinaSimple,
} from '@/src/models/types_MainResguardante';

import { createEchoInstance } from '@/src/services/echo';

// IMPORTANTE: Importamos el nuevo Hook
import { useMainResguardanteControllers } from '@/src/controllers/controllers_resguardante/mainResguardante.controller';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

// =====================================================================
// COMPONENTE: MODAL DE ALERTAS PERSONALIZADO
// =====================================================================
const InfoAlertModal = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}) => {
  const getIcon = () => {
    if (title.includes('Error') || title.includes('Rechazada')) {
      return { name: 'alert-circle-outline', color: '#E53E3E' }; // Rojo
    }
    if (
      title.includes('Enviado') ||
      title.includes('Éxito') ||
      title.includes('Aprobada')
    ) {
      return { name: 'check-circle-outline', color: '#38A169' }; // Verde
    }
    if (title.includes('Confirmar') || title.includes('Regreso')) {
      return { name: 'help-circle-outline', color: '#2563eb' }; // Azul interrogación
    }
    return { name: 'information-outline', color: '#25A4D6' }; // Azul info
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

          <View className="flex-row gap-3">
            {onConfirm && (
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 shadow-sm active:bg-gray-300"
              >
                <Text className="text-gray-800 dark:text-gray-300 text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                if (onConfirm) onConfirm();
                else onClose();
              }}
              className={`flex-1 rounded-lg p-4 shadow-md active:opacity-80 ${onConfirm ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white text-center font-bold text-lg">
                {onConfirm ? 'Confirmar' : 'Aceptar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// =====================================================================
// COMPONENTE: HEADER CON BUSQUEDA Y FILTROS
// =====================================================================
const ResguardanteHeader = React.memo(function ResguardanteHeader({
  itemResguardante,
  dataBienes,
  totalBienes,
  searchValue,
  onSearchChange,
  filterOpen,
  setFilterOpen,
  filterValue,
  setFilterValue,
  filterItems,
  setFilterItems,
  onPdfGenerate,
}: {
  itemResguardante: User;
  dataBienes: BienResguardado[];
  totalBienes: number;
  searchValue: string;
  onSearchChange: (text: string) => void;
  filterOpen: boolean;
  setFilterOpen: any;
  filterValue: any;
  setFilterValue: any;
  filterItems: any[];
  setFilterItems: any;
  onPdfGenerate: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const statusCounts = useMemo(() => {
    return dataBienes.reduce(
      (acc, bien) => {
        const estado = (bien.bien_estado || '').toLowerCase();
        if (estado === 'activo') acc.activo++;
        else if (estado === 'en tránsito') acc.enTransito++;
        else if (estado.includes('extrav')) acc.extraviado++;
        else if (estado === 'baja') acc.baja++;
        return acc;
      },
      { activo: 0, enTransito: 0, extraviado: 0, baja: 0 },
    );
  }, [dataBienes]);

  return (
    <View className="items-center px-4 z-50 mb-4">
      <View className="w-full bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
        {/* Perfil */}
        <View className="flex-row items-center p-4">
          <View className="w-12 h-12 rounded-2xl items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            <MaterialCommunityIcons
              name="account-check-outline"
              size={35}
              color={isDark ? '#60a5fa' : '#2563eb'}
            />
          </View>
          <View className="flex-1 ml-3">
            <Text
              className="text-gray-900 dark:text-white font-bold text-lg"
              numberOfLines={2}
            >
              {itemResguardante.usuario_nombre}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Resguardante
            </Text>
          </View>
          <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
            <Text className="text-green-700 dark:text-green-400 text-xs font-bold">
              ACTIVO
            </Text>
          </View>
        </View>

        <View className="h-px bg-gray-200 dark:bg-gray-700 mx-4" />

        {/* Resumen */}
        <View className="p-4">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2 font-medium">
            Resumen de Bienes
          </Text>
          <StatusSummaryCard counts={statusCounts} total={totalBienes} />

          <Pressable
            onPress={onPdfGenerate}
            className="mt-3 bg-green-600 active:bg-green-700 py-3 rounded-lg flex-row justify-center items-center shadow-sm"
          >
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={24}
              color="white"
            />
            <Text className="text-white font-bold ml-2">Descargar Reporte</Text>
          </Pressable>
        </View>
      </View>

      {/* Buscador y Filtro */}
      <View className="flex-row mt-4 z-50 gap-2 w-full">
        <View className="flex-1 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg h-[50px] flex-row items-center px-3 shadow-sm">
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
          <NativeTextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder="Buscar bien..."
            placeholderTextColor="gray"
            className="flex-1 ml-2 text-base text-gray-900 dark:text-white"
          />
        </View>
        <View className="w-[45%] z-50">
          <DropDownPicker
            open={filterOpen}
            value={filterValue}
            items={filterItems}
            setOpen={setFilterOpen}
            setValue={setFilterValue}
            setItems={setFilterItems}
            theme={isDark ? 'DARK' : 'LIGHT'}
            placeholder="Estado"
            style={{
              borderColor: isDark ? '#374151' : '#e5e7eb',
              height: 50,
              backgroundColor: isDark ? '#14161A' : 'white',
            }}
            dropDownContainerStyle={{
              marginTop: '-400%',
              borderColor: isDark ? '#374151' : '#e5e7eb',
              backgroundColor: isDark ? '#14161A' : 'white',
            }}
          />
        </View>
      </View>
    </View>
  );
});

// =====================================================================
// COMPONENTE: MODAL MOVER BIEN (CASCADA)
// =====================================================================
const MoveModal = ({
  visible,
  onClose,
  bien,
  accessToken,
  onSuccess,
  onError,
}: {
  visible: boolean;
  onClose: () => void;
  bien: BienResguardado | null;
  accessToken: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) => {
  // HOOK: Usamos el hook aquí dentro para tener acceso a las funciones
  const { getAreas, getEstructuraArea, moverBien } =
    useMainResguardanteControllers();

  const [step, setStep] = useState(1); // 1: Area, 2: Depto, 3: Oficina
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [deptos, setDeptos] = useState<DepartamentoItem[]>([]);
  const [oficinas, setOficinas] = useState<OficinaSimple[]>([]);

  const [selectedArea, setSelectedArea] = useState<AreaItem | null>(null);
  const [selectedDepto, setSelectedDepto] = useState<DepartamentoItem | null>(
    null,
  );
  const [selectedOficina, setSelectedOficina] = useState<OficinaSimple | null>(
    null,
  );

  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setAreas([]);
      setDeptos([]);
      setOficinas([]);
      setSelectedArea(null);
      setSelectedDepto(null);
      setSelectedOficina(null);
      loadAreas();
    }
  }, [visible]);

  const loadAreas = async () => {
    setLoadingData(true);
    try {
      const data = await getAreas({ access_token: accessToken });
      setAreas(data);
    } catch (e: any) {
      console.error(e);
      // Filtramos error de auth
      if (e.message !== 'Unauthenticated.') {
        onError('No se pudieron cargar las áreas');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSelectArea = async (area: AreaItem) => {
    setSelectedArea(area);
    setLoadingData(true);
    try {
      const data = await getEstructuraArea(
        { access_token: accessToken },
        area.id,
      );
      setDeptos(data);
      setStep(2);
    } catch (e: any) {
      console.error('Error cargando departamentos', e);
      if (e.message !== 'Unauthenticated.') {
        onError('Error cargando departamentos');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSelectDepto = (depto: DepartamentoItem) => {
    setSelectedDepto(depto);
    setOficinas(depto.oficinas || []);
    setStep(3);
  };

  const handleConfirmMove = async () => {
    if (!selectedOficina || !bien) return;
    setSubmitting(true);
    try {
      await moverBien(
        { access_token: accessToken },
        {
          id_bien: bien.id,
          nuevo_id_oficina: selectedOficina.id,
        },
      );
      onClose();
      onSuccess();
    } catch (e: any) {
      onClose();
      if (e.message !== 'Unauthenticated.') {
        onError(e.message || 'No se pudo mover el bien');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderList = (
    data: any[],
    keyName: string,
    onSelect: (item: any) => void,
  ) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      className="w-full max-h-[300px]"
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          className="p-4 border-b border-gray-200 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 flex-row justify-between items-center"
        >
          <Text className="text-gray-800 dark:text-gray-200">
            {item[keyName] || item.nombre}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </Pressable>
      )}
    />
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-[#14161A] rounded-t-3xl p-5 h-[80%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Mover Bien
            </Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons name="close" size={28} color="gray" />
            </Pressable>
          </View>

          <Text className="text-gray-500 mb-4">
            {bien?.bien_descripcion} ({bien?.bien_codigo})
          </Text>

          {/* Breadcrumbs */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            <Text
              className={
                step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'
              }
            >
              1. Área
            </Text>
            <Text className="text-gray-400">{'>'}</Text>
            <Text
              className={
                step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'
              }
            >
              2. Depto
            </Text>
            <Text className="text-gray-400">{'>'}</Text>
            <Text
              className={
                step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'
              }
            >
              3. Oficina
            </Text>
          </View>

          {/* Selección Actual */}
          {(selectedArea || selectedDepto) && (
            <View className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
              {selectedArea && (
                <Text className="text-xs text-gray-500">
                  Área: {selectedArea.area_nombre}
                </Text>
              )}
              {selectedDepto && (
                <Text className="text-xs text-gray-500">
                  Depto: {selectedDepto.dep_nombre}
                </Text>
              )}
              {selectedOficina && (
                <Text className="text-sm font-bold text-blue-600 mt-1">
                  Oficina: {selectedOficina.nombre}
                </Text>
              )}
            </View>
          )}

          {loadingData ? (
            <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
          ) : (
            <>
              {step === 1 && renderList(areas, 'area_nombre', handleSelectArea)}
              {step === 2 &&
                renderList(deptos, 'dep_nombre', handleSelectDepto)}
              {step === 3 && (
                <>
                  <Text className="mb-2 font-bold text-gray-700 dark:text-gray-300">
                    Selecciona la Oficina:
                  </Text>
                  <FlatList
                    data={oficinas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => setSelectedOficina(item)}
                        className={`p-4 mb-2 rounded-lg border ${selectedOficina?.id === item.id ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <Text
                          className={`font-medium ${selectedOficina?.id === item.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {item.nombre}
                        </Text>
                      </Pressable>
                    )}
                  />
                </>
              )}
            </>
          )}

          <View className="flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {step > 1 && (
              <Pressable
                onPress={() => setStep(step - 1)}
                className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"
              >
                <Text className="text-center font-bold text-gray-700 dark:text-white">
                  Atrás
                </Text>
              </Pressable>
            )}
            {step === 3 && (
              <Pressable
                onPress={handleConfirmMove}
                disabled={!selectedOficina || submitting}
                className={`p-4 rounded-xl flex-1 ${!selectedOficina ? 'bg-gray-300' : 'bg-purple-600'}`}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center font-bold text-white">
                    Confirmar Mover
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// =====================================================================
// PANTALLA PRINCIPAL
// =====================================================================
export function Resg_MainResguardante({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();

  const { getResguardos_Resguardante, solicitarTraspaso, regresarBien } =
    useMainResguardanteControllers();

  // Estados de datos
  const [bienesList, setBienesList] = useState<BienResguardado[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    lastPage: 1,
    total: 0,
  });

  // Filtros Locales (Estado y Búsqueda)
  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('sin-filtro');

  // FILTROS CON ICONOS
  const [filterItems, setFilterItems] = useState([
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
      label: 'En tránsito',
      value: 'en tránsito',
      icon: () => (
        <MaterialCommunityIcons
          name="map-search-outline"
          size={18}
          color="#FFA500"
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
          color="#ef4444"
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
          color="gray"
        />
      ),
    },
  ]);

  const [selectedBien, setSelectedBien] = useState<BienResguardado | null>(
    null,
  );
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [alertInfo, setAlertInfo] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ visible: false, title: '', message: '' });

  // Función Fetch Principal
  const fetchBienes = async (page = 1, shouldRefresh = false) => {
    if (page > 1 && page > pagination.lastPage) return;

    if (shouldRefresh) {
      setLoading(true);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }

    try {
      const data = await getResguardos_Resguardante(
        { access_token },
        page,
        '',
        '',
      );

      setBienesList((prev) =>
        shouldRefresh ? data.data : [...prev, ...data.data],
      );
      setPagination({
        page: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      });
    } catch (e: any) {
      if (e.message !== 'Unauthenticated.') {
        console.error(e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🚀 useFocusEffect: Reemplaza al useEffect de carga inicial
  useFocusEffect(
    useCallback(() => {
      fetchBienes(1, true);
    }, [access_token]), // Dependencia solo del token
  );

  // 🚀 useEffect para WebSockets (Mantenemos useEffect porque el socket debe vivir mientras el componente esté montado)
  // O podemos usar useFocusEffect si queremos desconectar al salir de la pantalla.
  // Por lo general, socket en useEffect está bien para notificaciones globales de esta pantalla.
  useEffect(() => {
    if (user.id) {
      const echo = createEchoInstance(access_token);
      echo.channel('solicitudes').listen('.solicitud.actualizada', (e: any) => {
        if (parseInt(e.user_id_destinatario) === user.id) {
          const title =
            e.estado === 'Aprobada'
              ? '¡Solicitud Aprobada!'
              : 'Solicitud Rechazada';
          showAlert(
            title,
            `El traspaso de "${e.bien_nombre}" fue ${e.estado.toLowerCase()}.`,
          );
          fetchBienes(1, true);
        }
      });
      return () => echo.leave('solicitudes');
    }
  }, []);

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setAlertInfo({ visible: true, title, message, onConfirm });
  };

  const closeAlert = () => {
    setAlertInfo((prev) => ({ ...prev, visible: false }));
  };

  const filteredBienes = useMemo(() => {
    let result = bienesList;

    // 1. Filtrar por Estado (DropDown)
    if (filterValue && filterValue !== 'sin-filtro') {
      result = result.filter(
        (item) =>
          (item.bien_estado || '').toLowerCase() === filterValue.toLowerCase(),
      );
    }

    // 2. Filtrar por Texto (Buscador)
    if (searchText.trim() !== '') {
      const lowerText = searchText.toLowerCase();
      result = result.filter(
        (item) =>
          (item.bien_descripcion || '').toLowerCase().includes(lowerText) ||
          (item.bien_codigo || '').toLowerCase().includes(lowerText) ||
          (item.bien_serie || '').toLowerCase().includes(lowerText) ||
          (item.bien_marca || '').toLowerCase().includes(lowerText) ||
          (item.bien_modelo || '').toLowerCase().includes(lowerText),
      );
    }

    return result;
  }, [bienesList, searchText, filterValue]);

  const handleLoadMore = () => {
    if (!loading && pagination.page < pagination.lastPage) {
      fetchBienes(pagination.page + 1, false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBienes(1, true);
  };

  const handleRegresarBien = (bien: BienResguardado) => {
    showAlert(
      'Confirmar Regreso',
      '¿Confirmas que el bien ha llegado físicamente a su origen?',
      async () => {
        closeAlert();
        try {
          const success = await regresarBien({ access_token }, bien.id);
          if (success) {
            setTimeout(
              () => showAlert('Éxito', 'Bien marcado como regresado'),
              300,
            );
            fetchBienes(1, true);
          } else {
            // Si retorna false sin lanzar excepción, mostramos error genérico
            setTimeout(
              () => showAlert('Error', 'No se pudo regresar el bien'),
              300,
            );
          }
        } catch (e: any) {
          // Si el hook lanza excepción
          if (e.message !== 'Unauthenticated.') {
            setTimeout(
              () => showAlert('Error', 'No se pudo regresar el bien'),
              300,
            );
          }
        }
      },
    );
  };

  const onConfirmTransfer = async (idDestino: number) => {
    if (!selectedBien) return;
    try {
      await solicitarTraspaso(
        { access_token },
        {
          traspaso_id_bien: selectedBien.id,
          traspaso_id_usuario_destino: idDestino,
          traspaso_observaciones:
            'Solicitud desde traspaso generada por resguardante desde la App Movil',
        },
      );
      setShowTransferModal(false);
      showAlert(
        'Solicitud Enviada',
        'El traspaso está pendiente de aprobación',
      );
      fetchBienes(1, true);
    } catch (e: any) {
      if (e.message !== 'Unauthenticated.') {
        showAlert('Error', e.message);
      }
    }
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

        <FlatList
          data={filteredBienes}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <ResguardanteHeader
              itemResguardante={user}
              dataBienes={filteredBienes}
              totalBienes={pagination.total}
              searchValue={searchText}
              onSearchChange={setSearchText}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              onPdfGenerate={() =>
                generarYCompartirValeResguardo(
                  user,
                  filteredBienes,
                  'RESGUARDO',
                )
              }
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View className="p-10 items-center">
                <Text className="text-gray-500">No se encontraron bienes.</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loading && pagination.page > 1 ? (
              <ActivityIndicator className="py-4" />
            ) : null
          }
          renderItem={({ item }) => (
            <BienItem
              item={item}
              onMovePress={(b: BienResguardado) => {
                setSelectedBien(b);
                setShowMoveModal(true);
              }}
              onTransferPress={(b: BienResguardado) => {
                setSelectedBien(b);
                setShowTransferModal(true);
              }}
              onReturnPress={(b: BienResguardado) => handleRegresarBien(b)}
            />
          )}
        />

        {/* MODALES */}
        <MoveModal
          visible={showMoveModal}
          onClose={() => setShowMoveModal(false)}
          bien={selectedBien}
          accessToken={access_token}
          onSuccess={() => {
            showAlert('Éxito', 'El bien ha sido movido correctamente');
            fetchBienes(1, true);
          }}
          onError={(msg) => showAlert('Error', msg)}
        />

        <TransferModal
          visible={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onConfirm={onConfirmTransfer}
          bien={selectedBien}
          accessToken={access_token}
        />

        {/* ALERTA GLOBAL PERSONALIZADA */}
        <InfoAlertModal
          visible={alertInfo.visible}
          title={alertInfo.title}
          message={alertInfo.message}
          onClose={closeAlert}
          onConfirm={alertInfo.onConfirm}
        />
      </View>
    </StyleGlobal>
  );
}

// =====================================================================
// COMPONENTES AUXILIARES
// =====================================================================

const BienItem = ({
  item,
  onMovePress,
  onTransferPress,
  onReturnPress,
}: any) => {
  const [expanded, setExpanded] = useState(false);
  const isEnTransito = item.bien_estado === 'En tránsito';
  const isPending = !!item.traspaso_pendiente;

  const iconName =
    item.categoria === 'muebles' ? 'chair-rolling' : 'desktop-classic';

  return (
    <View className="mx-4 mb-3 bg-white dark:bg-[#14161A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="p-4 flex-row items-center"
      >
        <View className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mr-3">
          <MaterialCommunityIcons name={iconName} size={24} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text
            className="font-bold text-gray-800 dark:text-white"
            numberOfLines={1}
          >
            {item.bien_descripcion}
          </Text>
          <Text className="text-xs text-gray-500">{item.bien_codigo}</Text>
        </View>
        <View className="items-end">
          <StatusBadge status={item.bien_estado} />
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="gray"
            className="mt-1"
          />
        </View>
      </Pressable>

      {expanded && (
        <View className="px-4 pb-4 bg-gray-50 dark:bg-[#1c1f24]">
          <View className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
          <DetailRow
            label="Ubicación"
            value={item.ubicacion_actual?.nombre || 'N/A'}
          />
          <DetailRow label="Marca" value={item.bien_marca} />
          <DetailRow label="Modelo" value={item.bien_modelo} />
          <DetailRow label="Serie" value={item.bien_serie} />

          <View className="flex-row gap-2 mt-4">
            {isEnTransito ? (
              <ActionButton
                icon="backup-restore"
                label="Regresar Bien"
                color="bg-orange-600"
                onPress={() => onReturnPress(item)}
              />
            ) : isPending ? (
              <View className="flex-1 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg flex-row justify-center items-center">
                <MaterialCommunityIcons
                  name="clock"
                  size={18}
                  color="#b45309"
                />
                <Text className="ml-2 font-bold text-yellow-700 dark:text-yellow-500">
                  Pendiente Autorización
                </Text>
              </View>
            ) : (
              <>
                <ActionButton
                  icon="file-move"
                  label="Mover"
                  color="bg-purple-600"
                  onPress={() => onMovePress(item)}
                />
                <ActionButton
                  icon="account-arrow-right"
                  label="Traspasar"
                  color="bg-blue-600"
                  onPress={() => onTransferPress(item)}
                />
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const ActionButton = ({ icon, label, color, onPress }: any) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 ${color} p-3 rounded-lg flex-row justify-center items-center active:opacity-80`}
  >
    <MaterialCommunityIcons name={icon} size={18} color="white" />
    <Text className="text-white font-bold ml-2 text-xs">{label}</Text>
  </Pressable>
);

const DetailRow = ({ label, value }: any) => (
  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-500 text-xs font-bold">{label}:</Text>
    <Text
      className="text-gray-700 dark:text-gray-300 text-xs flex-1 text-right ml-4"
      numberOfLines={1}
    >
      {value || '-'}
    </Text>
  </View>
);

const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-gray-100 text-gray-600';
  if (status === 'Activo') color = 'bg-green-100 text-green-700';
  if (status === 'En tránsito') color = 'bg-orange-100 text-orange-700';
  if (status?.includes('Extrav')) color = 'bg-red-100 text-red-700';

  return (
    <View className={`px-2 py-0.5 rounded-full ${color.split(' ')[0]}`}>
      <Text
        className={`text-[10px] font-bold uppercase ${color.split(' ')[1]}`}
      >
        {status}
      </Text>
    </View>
  );
};

const TransferModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
  accessToken,
}: any) => {
  // HOOK: Usamos el hook aquí también
  const { buscarResguardantes } = useMainResguardanteControllers();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults([]);
      setSelected(null);
    }
  }, [visible]);

  const handleSearch = async () => {
    if (query.length < 3) return;
    setSearching(true);
    try {
      const data = await buscarResguardantes(
        { access_token: accessToken },
        query,
      );
      setResults(data);
    } catch (e: any) {
      console.error(e);
      if (e.message !== 'Unauthenticated.') {
        // Podrías mostrar alerta aquí o solo log
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-black/60 justify-center px-4"
      >
        <View className="bg-white dark:bg-[#14161A] rounded-xl overflow-hidden max-h-[70%]">
          <View className="p-4 border-b border-gray-100 dark:border-gray-700 flex-row justify-between">
            <Text className="font-bold text-lg dark:text-white">
              Traspasar Bien
            </Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="gray" />
            </Pressable>
          </View>
          <View className="p-4">
            <Text className="text-gray-500 mb-2">
              Buscar nuevo responsable:
            </Text>
            <View className="flex-row gap-2 mb-4">
              <NativeTextInput
                value={query}
                onChangeText={setQuery}
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 h-12 dark:text-white"
                placeholder="Nombre del empleado..."
                placeholderTextColor="gray"
              />
              <Pressable
                onPress={handleSearch}
                className="bg-blue-600 justify-center px-4 rounded-lg"
              >
                {searching ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <MaterialCommunityIcons
                    name="magnify"
                    color="white"
                    size={24}
                  />
                )}
              </Pressable>
            </View>

            <FlatList
              data={results}
              keyExtractor={(i) => i.id.toString()}
              renderItem={({ item }) => {
                const tieneUsuario = item.tiene_usuario;
                return (
                  <Pressable
                    onPress={() => tieneUsuario && setSelected(item)}
                    disabled={!tieneUsuario}
                    className={`p-3 rounded-lg mb-2 flex-row items-center ${
                      !tieneUsuario
                        ? 'bg-red-50 dark:bg-red-900/20 opacity-80'
                        : selected?.id === item.id
                          ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/50 dark:border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${tieneUsuario ? 'bg-blue-200' : 'bg-gray-300'}`}
                    >
                      <Text
                        className={`font-bold ${tieneUsuario ? 'text-blue-800' : 'text-gray-600'}`}
                      >
                        {item.iniciales}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800 dark:text-white">
                        {item.nombre}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {item.cargo}
                      </Text>

                      {!tieneUsuario && (
                        <View className="flex-row items-center mt-1">
                          <MaterialCommunityIcons
                            name="alert-circle"
                            size={12}
                            color="#DC2626"
                          />
                          <Text className="text-[10px] text-red-600 ml-1 font-bold">
                            Notificar a Almacén para creación de usuario
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              }}
            />

            <Pressable
              disabled={!selected}
              onPress={() => onConfirm(selected.id)}
              className={`mt-4 py-4 rounded-xl items-center ${selected ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <Text className="text-white font-bold">Confirmar Traspaso</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// =====================================================================
// COMPONENTE: TARJETA DE RESUMEN CON 5 ESTADOS E ICONOS
// =====================================================================
const StatusSummaryCard = ({ counts, total }: any) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="flex-row bg-gray-50 dark:bg-[#1c1f24] p-2 rounded-xl mt-2"
  >
    <View className="flex-row items-center space-x-4 min-w-full justify-between">
      <SummaryItem
        label="Total"
        count={total}
        color="text-blue-600"
        icon="format-list-bulleted"
      />
      <SummaryItem
        label="Activos"
        count={counts.activo}
        color="text-green-600"
        icon="check-circle-outline"
      />
      <SummaryItem
        label="Tránsito"
        count={counts.enTransito}
        color="text-orange-600"
        icon="truck-delivery-outline"
      />
      <SummaryItem
        label="Extraviado"
        count={counts.extraviado}
        color="text-red-600"
        icon="alert-circle-outline"
      />
      <SummaryItem
        label="Baja"
        count={counts.baja}
        color="text-gray-500"
        icon="archive-arrow-down-outline"
      />
    </View>
  </ScrollView>
);

const SummaryItem = ({ label, count, color, icon }: any) => {
  const getColorHex = (tailwindClass: string) => {
    if (tailwindClass.includes('blue')) return '#2563eb';
    if (tailwindClass.includes('green')) return '#16a34a';
    if (tailwindClass.includes('orange')) return '#ea580c';
    if (tailwindClass.includes('red')) return '#dc2626';
    if (tailwindClass.includes('gray')) return '#6b7280';
    return 'gray';
  };

  const iconColor = getColorHex(color);

  return (
    <View className="items-center px-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-yellow-500">
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={iconColor}
        className="mb-1 opacity-80"
      />
      <Text className={`font-bold text-lg ${color}`}>{count}</Text>
      <Text className="text-[10px] text-gray-500 uppercase font-medium">
        {label}
      </Text>
    </View>
  );
};
