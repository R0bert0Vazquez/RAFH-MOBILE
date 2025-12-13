import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  FlatList,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import React, { useState, memo, useEffect, useRef } from 'react'; // 🚀 Importamos useRef

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  getDashboard,
  handleDecision,
} from '@/src/controllers/controllers_gestor/workPlace.controller';
import { DataWorkPlace, Access_token } from '@/src/models/types';
import {
  DashboardResponse,
  DashboardStats,
  MovimientoReciente,
  NotificacionDashboard,
} from '@/src/models/types_DashboardGestor';

// 🚀 NUEVO: Importamos nuestro servicio de Echo
import { createEchoInstance } from '@/src/services/echo';

interface MovimientoItem extends MovimientoReciente {
  id: number;
}

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace: DataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

// --- HELPERS DE ESTILO (El toque "Chingón") ---
const getStatusConfig = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('traspaso'))
    return {
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: '#D97706', // amber-600
      iconName: 'swap-horizontal',
      borderColor: 'border-amber-200 dark:border-amber-800',
    };
  if (t.includes('registro') || t.includes('alta'))
    return {
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: '#059669', // emerald-600
      iconName: 'plus-box-multiple-outline',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    };
  if (t.includes('baja'))
    return {
      bg: 'bg-rose-100 dark:bg-rose-900/40',
      iconColor: '#E11D48', // rose-600
      iconName: 'delete-alert-outline',
      borderColor: 'border-rose-200 dark:border-rose-800',
    };
  return {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: '#2563EB', // blue-600
    iconName: 'file-document-outline',
    borderColor: 'border-blue-200 dark:border-blue-800',
  };
};

// --- COMPONENTES INTERNOS ---
const StatCard = ({ icon, value, label, iconColor, bgColor }: any) => (
  <View className="w-[48%] bg-white dark:bg-[#14161A] p-3 rounded-2xl mb-3 border border-gray-100 dark:border-gray-700 shadow-sm items-center justify-center">
    <View
      className={`p-2 rounded-full mb-1 items-center justify-center ${bgColor}`}
    >
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
    </View>
    <Text className="text-xl font-bold text-gray-800 dark:text-white mt-1">
      {value || 0}
    </Text>
    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
      {label}
    </Text>
  </View>
);

const NotificationCard = ({
  item,
  access_token,
}: {
  item: NotificacionDashboard;
  access_token: string;
}) => {
  const credenciales: Access_token = { access_token };

  const handleAuthorize = () =>
    handleDecision(credenciales, item.id_traspaso, 'Aprobada');
  const handleDeny = () =>
    handleDecision(credenciales, item.id_traspaso, 'Rechazada');

  return (
    <View className="items-center mb-2 shadow-sm">
      <View className="w-11/12 md:w-10/12 lg:w-9/12 bg-white dark:bg-[#14161A]/80 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Ticket */}
        <View className="bg-blue-600 px-5 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={20}
              color="white"
            />
            <Text className="text-white font-bold text-base ml-2">
              Solicitud de Traspaso
            </Text>
          </View>
          <View className="bg-white/20 px-2 py-1 rounded">
            <Text className="text-white text-[10px] font-bold uppercase">
              Pendiente
            </Text>
          </View>
        </View>

        <View className="p-5">
          {/* Info Bien */}
          <View className="flex-row items-center mb-5 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <View className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-3">
              <MaterialCommunityIcons
                name="cube-send"
                size={24}
                color="#2563EB"
              />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] text-gray-400 font-bold uppercase">
                Bien a transferir
              </Text>
              <Text className="text-gray-800 dark:text-white font-bold text-base leading-5">
                {item.bien_nombre}
              </Text>
            </View>
          </View>

          {/* Flujo Visual */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1 items-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
              <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                De
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 font-semibold text-xs text-center">
                {item.emisor}
              </Text>
            </View>
            <View className="px-2">
              <MaterialCommunityIcons
                name="arrow-right-thin-circle-outline"
                size={28}
                color="#94A3B8"
              />
            </View>
            <View className="flex-1 items-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
              <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                A
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 font-semibold text-xs text-center">
                {item.receptor}
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View className="flex-row gap-3" style={{ gap: 10 }}>
            <Pressable
              onPress={handleDeny}
              className="flex-1 bg-rose-600 active:bg-rose-700 rounded-xl py-3 flex-row items-center justify-center"
            >
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={20}
                color="white"
                style={{ marginRight: 4 }}
              />
              {/* <Text className="text-rose-600 dark:text-rose-400 font-bold"> */}
              <Text className="text-white font-bold">Rechazar</Text>
            </Pressable>
            <Pressable
              onPress={handleAuthorize}
              className="flex-1 bg-green-600 active:bg-green-700 rounded-xl py-3 flex-row items-center justify-center shadow-sm"
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="white"
                style={{ marginRight: 4 }}
              />
              <Text className="text-white font-bold">Aprobar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
const WorkPlaceHeader = ({
  stats,
  notificaciones,
  access_token,
}: {
  stats: DashboardStats;
  notificaciones: NotificacionDashboard | null;
  access_token: string;
}) => {
  return (
    <View className="mb-4">
      <View className="items-center mt-2">
        <View className="w-11/12 md:w-10/12 lg:w-9/12">
          <Text className="text-gray-800 dark:text-white text-lg font-bold mb-3 pl-1">
            Resumen General
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <StatCard
              icon="archive-check-outline"
              value={stats?.bienes_registrados}
              label="Bienes"
              iconColor="#2563EB"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              icon="account-group-outline"
              value={stats?.gestores_asignados}
              label="Gestores"
              iconColor="#7C3AED"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
            <StatCard
              icon="floor-plan"
              value={stats?.areas_asociadas}
              label="Áreas"
              iconColor="#059669"
              bgColor="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <StatCard
              icon="shield-account-outline"
              value={stats?.resguardantes_registrados}
              label="Resguardantes"
              iconColor="#D97706"
              bgColor="bg-amber-50 dark:bg-amber-900/20"
            />
          </View>
        </View>
      </View>

      <View className="w-11/12 mx-auto mt-2 mb-3 flex-row items-center">
        <View className="h-6 w-1 bg-rose-500 rounded-full mr-2" />
        <Text className="text-gray-800 dark:text-white text-xl font-bold">
          Notificaciones
        </Text>
        {notificaciones && (
          <View className="bg-rose-500 rounded-full w-2 h-2 ml-2 mt-1" />
        )}
      </View>

      <View className="w-full">
        {!notificaciones ? (
          <View className="items-center my-4 px-5 opacity-60">
            <View className="bg-gray-100 dark:bg-slate-700 p-4 rounded-full mb-2">
              <MaterialCommunityIcons
                name="bell-sleep-outline"
                size={32}
                color="#94A3B8"
              />
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
              Todo tranquilo por aquí.
            </Text>
          </View>
        ) : (
          // Nota: En RN puro, FlatList horizontal funciona bien, aquí simulo uno solo
          <NotificationCard item={notificaciones} access_token={access_token} />
        )}
      </View>

      <View className="w-11/12 mx-auto mt-4 mb-3 flex-row items-center">
        <View className="h-6 w-1 bg-indigo-500 rounded-full mr-2" />
        <Text className="text-gray-800 dark:text-white text-xl font-bold">
          Últimos Movimientos
        </Text>
      </View>
    </View>
  );
};
const ItemComponent = ({
  item,
  isExpanded,
  onPress,
}: {
  item: MovimientoItem;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const config = getStatusConfig(item.tipo);

  return (
    <Pressable onPress={onPress} className="items-center mb-3">
      <View className="w-11/12 md:w-10/12 lg:w-9/12">
        <View
          className={`bg-white dark:bg-[#14161A] rounded-2xl shadow-sm border overflow-hidden ${isExpanded ? 'border-indigo-500 dark:border-indigo-300' : 'border-gray-100 dark:border-gray-700'}`}
        >
          <View className="flex-row items-center p-4">
            <View
              className={`h-12 w-12 rounded-full items-center justify-center mr-4 ${config.bg}`}
            >
              <MaterialCommunityIcons
                name={config.iconName as any}
                size={24}
                color={config.iconColor}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 dark:text-white text-base font-bold capitalize">
                {item.tipo}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm font-medium"
                numberOfLines={1}
              >
                {item.bien_involucrado}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={isExpanded ? '#6366f1' : '#9CA3AF'}
            />
          </View>

          {isExpanded && (
            <View className="bg-gray-50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-gray-700 p-4">
              <View className="space-y-3">
                <View className="flex-row items-start mb-2">
                  <MaterialCommunityIcons
                    name="account-tie-outline"
                    size={18}
                    color="#94A3B8"
                    style={{ marginTop: 2, marginRight: 8 }}
                  />
                  <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase">
                      Gestor
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      {item.gestor_encargado}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start mb-2">
                  <MaterialCommunityIcons
                    name="shield-account-outline"
                    size={18}
                    color="#94A3B8"
                    style={{ marginTop: 2, marginRight: 8 }}
                  />
                  <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase">
                      Resguardante
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      {item.resguardante_responsable}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start">
                  <MaterialCommunityIcons
                    name="map-marker-radius-outline"
                    size={18}
                    color="#94A3B8"
                    style={{ marginTop: 2, marginRight: 8 }}
                  />
                  <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase">
                      Ubicación
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      {item.area}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
const Item = memo(ItemComponent);

export function Gest_WorkPlace({
  access_token,
  workCenterId,
}: {
  access_token: string;
  workCenterId: number;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );
  const [movimientosData, setMovimientosData] = useState<MovimientoItem[]>([]);

  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 🚀 NUEVO: Referencia para guardar la instancia de Echo y no perderla entre renderizados
  const echoRef = useRef<any>(null);

  // 1. useEffect para Carga Inicial (HTTP) - Igual que tenías
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const credenciales: Access_token = { access_token: access_token };
        const getDashboardRespuesta = await getDashboard(credenciales);

        setDashboardData(getDashboardRespuesta);

        const movimientosProcesados: MovimientoItem[] =
          getDashboardRespuesta.ultimos_movimientos.map((item, index) => ({
            id: index, // Nota: Usar index como ID puede dar problemas al insertar nuevos items dinámicos, idealmente usa un ID único del backend
            ...item,
          }));
        setMovimientosData(movimientosProcesados);
      } catch (error: any) {
        if (error.message) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [access_token, workCenterId]);

  // 🚀 useEffect MEJORADO para WebSockets
  useEffect(() => {
    if (!access_token) return;

    console.log('🔌 Iniciando servicio de Echo...');
    const echo = createEchoInstance(access_token);
    echoRef.current = echo;

    // --- DEBUGGING: Verificar conexión ---
    // Esto te dirá en la consola si realmente se conectó o falló
    echo.connector.pusher.connection.bind('connected', () => {
      console.log(
        '✅✅✅ WEBSOCKET CONECTADO EXITOSAMENTE A: ' +
          process.env.EXPO_PUBLIC_REVERB_HOST,
      );
    });
    echo.connector.pusher.connection.bind('error', (err: any) => {
      console.error('❌❌❌ ERROR DE CONEXIÓN SOCKET:', err);
    });
    echo.connector.pusher.connection.bind('disconnected', () => {
      console.log('⚠️ WebSocket desconectado');
    });

    // --- SUSCRIPCIÓN AL CANAL ---
    const channel = echo.channel('solicitudes');

    // 1. EVENTO: Solicitud Creada (Notificación Superior)
    channel.listen('.solicitud.creada', (eventData: any) => {
      console.log('🔔 EVENTO RECIBIDO: solicitud.creada', eventData);

      const nuevaNotificacion: NotificacionDashboard = {
        id_traspaso: eventData.id,
        bien_nombre: eventData.bien_nombre,
        emisor: eventData.emisor,
        receptor: eventData.receptor,
      };

      setDashboardData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          notificaciones: nuevaNotificacion,
        };
      });
    });

    // 2. EVENTO: Solicitud Actualizada
    channel.listen('.solicitud.actualizada', (eventData: any) => {
      console.log('✅ EVENTO RECIBIDO: solicitud.actualizada', eventData);

      setDashboardData((prevData) => {
        if (!prevData) return null;
        // Solo limpia la notificación si es la misma que estamos viendo
        if (prevData.notificaciones?.id_traspaso === eventData.id) {
          return { ...prevData, notificaciones: null };
        }
        return prevData;
      });
    });

    return () => {
      console.log('🔌 Desconectando WebSockets...');
      echo.leave('solicitudes');
      echo.disconnect();
    };
  }, [access_token]);

  const handleSelectItem = (item: MovimientoItem) => {
    setExpandedId(expandedId === item.id ? null : item.id);
  };

  if (isLoading) {
    return (
      <StyleGlobal>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator
            size="large"
            color={colorScheme === 'light' ? 'gray' : 'white'}
          />
          <Text className="text-gray-500 mt-4 text-sm font-medium">
            Cargando tablero...
          </Text>
        </View>
      </StyleGlobal>
    );
  }

  if (error) {
    return (
      <StyleGlobal>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: 'red', padding: 20, textAlign: 'center' }}>
            Error: {error}
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
            data={movimientosData}
            renderItem={({ item }) => (
              <Item
                item={item}
                isExpanded={expandedId === item.id}
                onPress={() => handleSelectItem(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            extraData={expandedId}
            ListHeaderComponent={
              <>
                <Header dataWorkPlace={dataWorkPlace} />
                <WorkPlaceHeader
                  access_token={access_token}
                  stats={dashboardData!.stats}
                  notificaciones={dashboardData?.notificaciones || null}
                />
              </>
            }
            ListEmptyComponent={
              <View className="items-center mb-3 px-5">
                <Text className="text-base text-gray-500 dark:text-slate-500 italic text-center">
                  No tienes ultimos movimientos registrados.
                </Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </StyleGlobal>
  );
}
