import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  FlatList,
  ActivityIndicator,
  Modal,
  LayoutAnimation,
} from 'react-native';

import React, { useState, useMemo, useCallback } from 'react';
import { useFocusEffect, RouteProp } from '@react-navigation/native'; // 🚀 Importante
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  iconMap,
  bienEstadosBg,
  bienEstadosTexto,
} from '@/src/components/dataBienes';

import { Access_token, RootStackParamList } from '@/src/models/types';

import {
  BienResguardado,
  BienesResguardanteResponseVerResguardos,
  ResguardanteInfo,
} from '@/src/models/types_InfoResguardante';

// 🚀 Importamos el Hook
import { useInfoResguardanteController } from '@/src/controllers/controllers_gestor/infoResguardante.controller';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

type GestInfoResguardanteRouteProp = RouteProp<
  RootStackParamList,
  'Gest_InfoResguardante'
>;

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => {
  if (!value) return null; // No mostrar la fila si no hay valor

  return (
    <View className="flex-row items-center mb-1.5">
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color="#6b7280" // text-gray-500
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

const ResguardanteHeader = ({
  itemResguardante,
  dataBienes,
}: {
  itemResguardante: ResguardanteInfo;
  dataBienes: BienResguardado[];
}) => {
  return (
    <View className="items-center px-4">
      <View className="w-full mb-3">
        <View className="bg-white dark:bg-[#14161A] p-1 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* --- INFORMACIÓN PERSONAL --- */}
          <View className="p-5">
            <Text className="text-lg md:text-xl font-extrabold text-gray-800 dark:text-slate-200 uppercase mb-4 tracking-wide">
              {itemResguardante.res_nombre || ''}{' '}
              {itemResguardante.res_apellidos || ''}
            </Text>

            <View className="mb-3">
              <DetailRow
                icon="email-outline"
                label="Correo"
                value={itemResguardante.res_correo || ''}
              />
              <DetailRow
                icon="phone-outline"
                label="Teléfono"
                value={itemResguardante.res_telefono || ''}
              />
            </View>

            <View className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2" />

            <View className="my-2">
              <DetailRow
                icon="office-building-outline"
                label="Departamento"
                value={itemResguardante.departamento.dep_nombre || ''}
              />
              <DetailRow
                icon="domain"
                label="Oficina"
                value={itemResguardante.oficina.nombre || ''}
              />
            </View>

            <View className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2" />

            <View className="mt-2">
              <DetailRow
                icon="card-account-details-outline"
                label="RFC"
                value={itemResguardante.res_rfc || ''}
              />
              <DetailRow
                icon="card-account-details-outline"
                label="CURP"
                value={itemResguardante.res_curp || ''}
              />
            </View>
          </View>

          <View className="h-2 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800" />

          {/* Componente de Resumen */}
          <ResumLevantamiento dataBienes={dataBienes} />
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

const ResumLevantamiento = ({
  dataBienes,
}: {
  dataBienes: BienResguardado[];
}) => {
  const colorScheme = useColorScheme();
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const statusCounts = useMemo(() => {
    if (!dataBienes)
      return { activo: 0, enTransito: 0, extraviado: 0, baja: 0 };

    return dataBienes.reduce(
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
  }, [dataBienes]);

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
            <Text className="text-xl md:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-slate-200">
              Bienes Asignados
            </Text>
            <Text className="text-base md:text-lg text-gray-500 dark:text-slate-400">
              Se encontraron {dataBienes.length} bienes (cargados).
            </Text>
          </View>
        </View>

        <StatusSummaryCard counts={statusCounts} total={dataBienes.length} />

        <Pressable
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
            {isLoadingPdf ? 'Generando PDF...' : 'Descargar Reporte en PDF'}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const BienItem = React.memo(function BienItem({
  item,
}: {
  item: BienResguardado;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // --- Lógica de Icono y Estado ---
  const iconName = (iconMap[item.bien_clave] || iconMap.default) as any;
  const estadoKey = item.bien_estado.toLowerCase();

  // Estilos existentes
  const estadoStyleBg = bienEstadosBg[estadoKey] || bienEstadosBg.default;
  const estadoStyleText =
    bienEstadosTexto[estadoKey] || bienEstadosTexto.default;

  // Colores para el punto (dot)
  const estadoDotColor =
    {
      activo: 'bg-green-500',
      mantenimiento: 'bg-yellow-500',
      inactivo: 'bg-red-500',
      transaccion: 'bg-gray-500',
      baja: 'bg-gray-500',
    }[estadoKey] || 'bg-gray-400';

  // --- LÓGICA PARA EL BORDE ---
  const borderStatusColor =
    {
      activo: 'border-green-200 dark:border-green-900',
      mantenimiento: 'border-yellow-200 dark:border-yellow-900',
      inactivo: 'border-red-200 dark:border-red-900',
      transaccion: 'border-gray-200 dark:border-gray-900',
      baja: 'border-gray-200 dark:border-gray-900',
    }[estadoKey] || 'border-gray-200 dark:border-gray-900';

  const iconBgColor = isDark ? 'bg-blue-900/40' : 'bg-blue-100/80';
  const iconColor = isDark ? '#60a5fa' : '#2563eb';

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="px-4 mb-3">
      <View
        className={`w-full bg-white dark:bg-[#14161A] border ${borderStatusColor} rounded-xl shadow-lg shadow-black/5 overflow-hidden`}
      >
        <Pressable
          onPress={toggleExpand}
          className="p-4"
          android_ripple={{ color: isDark ? '#333' : '#eee' }}
        >
          {/* Fila de Icono, Título y Estado */}
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
                className="text-base font-bold text-gray-800 dark:text-slate-200"
                numberOfLines={1}
              >
                {item.bien_codigo || ''}
              </Text>
              <Text
                className="text-sm text-gray-500 dark:text-slate-400"
                numberOfLines={4}
              >
                {item.bien_descripcion || ''}
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

          {/* === SECCIÓN DE RESUMEN === */}
          <View className="flex-row justify-between mt-4">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                Marca / Modelo
              </Text>
              <Text
                className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                numberOfLines={2}
              >
                {item.bien_marca
                  ? item.bien_marca.replace(/"/g, '')
                  : 'Sin Marca'}{' '}
                / {item.bien_modelo || 'Sin Modelo'}
              </Text>
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                Ubicación
              </Text>
              <Text
                className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                numberOfLines={1}
              >
                {item.bien_ubicacion_actual || ''}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* === SECCIÓN EXPANDIBLE === */}
        {isExpanded && (
          <View className="px-4 pb-4">
            <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
            <DetailRow
              icon="barcode"
              label="Serie"
              value={item.bien_serie || ''}
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
              value={item.bien_clave || ''}
            />
            <DetailRow
              icon="file-document-outline"
              label="Factura"
              value={item.bien_numero_factura || ''}
            />
            <DetailRow
              icon="truck-delivery-outline"
              label="Proveedor"
              value={item.bien_provedor || ''}
            />
            <DetailRow
              icon="tag-outline"
              label="Tipo Adquisición"
              value={item.bien_tipo_adquisicion || ''}
            />
            <DetailRow
              icon="counter"
              label="Secuencia"
              value={item.bien_secuencia || ''}
            />
          </View>
        )}
      </View>
    </View>
  );
});

export function Gest_InfoResguardante({
  route,
}: {
  route: GestInfoResguardanteRouteProp;
}) {
  const { access_token, id_resguardante } = route.params;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  // 🚀 Instanciamos el Hook
  const { getResguardante, getResguardos_Resguardante } =
    useInfoResguardanteController();

  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Loading principal
  const [isLoading, setIsLoading] = useState(false);
  // Loading para "cargar más"
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  // Lista acumulativa de bienes
  const [bienesList, setBienesList] = useState<BienResguardado[]>([]);

  const [miResguardante, setMiResguardante] = useState<ResguardanteInfo | null>(
    null,
  );

  // // --- 2. FUNCIÓN PARA CARGAR BIENES (PAGINADA) ---
  // const loadBienes = useCallback(
  //   async (page: number) => {
  //     const credenciales: Access_token = { access_token };

  //     if (page === 1) {
  //       // Si es carga inicial o refresh, no mostramos loading de footer
  //     } else {
  //       setIsFetchingMore(true);
  //     }

  //     try {
  //       console.log(`Cargando bienes página ${page}...`);
  //       const respuesta: BienesResguardanteResponseVerResguardos =
  //         await getResguardos_Resguardante(credenciales, id_resguardante, page);

  //       if (page === 1) {
  //         setBienesList(respuesta.data);
  //       } else {
  //         // Concatenar nuevos datos
  //         setBienesList((prev) => [...prev, ...respuesta.data]);
  //       }

  //       // Actualizar punteros
  //       setCurrentPage(respuesta.current_page);
  //       setLastPage(respuesta.last_page);
  //     } catch (error) {
  //       console.error('Error cargando bienes:', error);
  //       if (page > 1) {
  //         setAlertInfo({
  //           visible: true,
  //           title: 'Error de Conexión',
  //           message: 'No se pudieron cargar más bienes.',
  //         });
  //       }
  //     } finally {
  //       setIsFetchingMore(false);
  //     }
  //   },
  //   [access_token, id_resguardante],
  // );

  // // --- 1. CARGA INICIAL (PERFIL + PRIMERA PÁGINA) ---
  // const loadInitialData = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const credenciales: Access_token = { access_token };

  //     // 1. Obtener Info del Resguardante (Perfil) - No paginado
  //     const infoResguardante = await getResguardante(
  //       credenciales,
  //       id_resguardante,
  //     );
  //     setMiResguardante(infoResguardante);

  //     // 2. Obtener Bienes (Página 1)
  //     await loadBienes(1);
  //   } catch (error) {
  //     console.error(error);
  //     setAlertInfo({
  //       visible: true,
  //       title: 'Error',
  //       message: 'No se pudo cargar la información inicial.',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [access_token, id_resguardante, loadBienes]); // CORRECCIÓN: Agregamos loadBienes aquí

  // useEffect(() => {
  //   loadInitialData();
  // }, [loadInitialData]);

  // --- FUNCIÓN PARA CARGAR BIENES ---
  const loadBienes = useCallback(
    async (page: number, isActive: boolean = true) => {
      const credenciales: Access_token = { access_token };

      if (page > 1) {
        setIsFetchingMore(true);
      }

      try {
        console.log(`Cargando bienes página ${page}...`);
        const respuesta: BienesResguardanteResponseVerResguardos =
          await getResguardos_Resguardante(credenciales, id_resguardante, page);

        if (isActive) {
          if (page === 1) {
            setBienesList(respuesta.data);
          } else {
            setBienesList((prev) => [...prev, ...respuesta.data]);
          }
          setCurrentPage(respuesta.current_page);
          setLastPage(respuesta.last_page);
        }
      } catch (error: any) {
        if (error.message !== 'Unauthenticated.') {
          console.error('Error cargando bienes:', error);
          if (page > 1 && isActive) {
            setAlertInfo({
              visible: true,
              title: 'Error de Conexión',
              message: 'No se pudieron cargar más bienes.',
            });
          }
        }
      } finally {
        if (isActive) setIsFetchingMore(false);
      }
    },
    [access_token, id_resguardante, getResguardos_Resguardante],
  );

  // --- useFocusEffect para Carga Inicial ---
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadInitialData = async () => {
        setIsLoading(true);
        try {
          const credenciales: Access_token = { access_token };

          // 1. Perfil
          const infoResguardante = await getResguardante(
            credenciales,
            id_resguardante,
          );
          if (isActive) setMiResguardante(infoResguardante);

          // 2. Bienes Página 1
          await loadBienes(1, isActive);
        } catch (error: any) {
          if (error.message !== 'Unauthenticated.') {
            console.error(error);
            if (isActive) {
              setAlertInfo({
                visible: true,
                title: 'Error',
                message: 'No se pudo cargar la información inicial.',
              });
            }
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      loadInitialData();

      return () => {
        isActive = false;
      };
      // Dependencias clave: si cambia el ID o el token, recargamos
    }, [id_resguardante, access_token]),
  );

  // --- 3. LÓGICA SCROLL INFINITO ---
  const handleLoadMore = () => {
    if (!isLoading && !isFetchingMore && currentPage < lastPage) {
      loadBienes(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator
          size="small"
          color={colorScheme === 'light' ? 'gray' : 'white'}
        />
        <Text className="text-xs text-gray-500 mt-1">
          Cargando más bienes...
        </Text>
      </View>
    );
  };

  const EmptyListComponent = () => {
    if (isLoading) return null; // No mostrar vacío mientras carga inicial

    return (
      <View className="items-center pt-20">
        <View className="w-10/12 items-center p-4 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <MaterialCommunityIcons
            name="information-outline"
            size={50}
            color="gray"
          />
          <Text className="text-gray-500 dark:text-slate-400 text-xl text-center mt-2">
            No hay bienes asignados para mostrar.
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading && !miResguardante) {
    return (
      <StyleGlobal>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === 'dark' ? '#fff' : 'gray'}
          />
          <Text className="mt-4 text-gray-500 dark:text-gray-400">
            Cargando información del resguardante...
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
            data={bienesList}
            renderItem={({ item }) => <BienItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            // --- Props para Paginación ---
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            // -----------------------------

            ListHeaderComponent={
              <>
                <Header dataWorkPlace={dataWorkPlace} />
                {miResguardante && (
                  <ResguardanteHeader
                    itemResguardante={miResguardante}
                    dataBienes={bienesList} // Pasamos la lista acumulada para stats
                  />
                )}
              </>
            }
            ListEmptyComponent={EmptyListComponent}
          />
        </View>
      </KeyboardAvoidingView>

      <InfoAlertModal
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ ...alertInfo, visible: false })}
      />
    </StyleGlobal>
  );
}
