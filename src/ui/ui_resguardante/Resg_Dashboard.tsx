import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { SessionExpiredModal } from '@/src/components/SessionExpiredModal'; // Importamos el modal
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useResgDashboard } from '@/src/controllers/controllers_resguardante/dashboard.controller';
import { User } from '@/src/models/types';
import { useNavigation } from '@react-navigation/native'; // Importamos hook de navegación

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

export function Resg_Dashboard({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation<any>(); // Instanciamos navegación

  // Usamos el hook controlador que ahora retorna isSessionExpired
  const {
    isLoading,
    refreshing,
    error,
    isSessionExpired, // <--- Nueva propiedad
    dashboardData,
    onRefresh,
    getUserName,
    formatDate,
    getMovementTypeConfig,
  } = useResgDashboard(access_token, user);

  // Colores dinámicos
  const colors = {
    background: isDark ? '#121212' : '#F3F4F6',
    cardBg: isDark ? '#1B1D21' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    accentBlue: '#3B82F6',
    accentGreen: '#10B981',
    accentOrange: '#F59E0B',
  };

  // Función para redirigir al Login cuando expire la sesión
  const handleSessionExpired = () => {
    // Pequeño timeout para asegurar que el modal se cierre visualmente antes de cambiar de stack si fuera necesario
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 200);
  };

  // Componente de Tarjeta de Estadística (StatCard)
  const StatCard = ({ title, count, icon, color, subtitle }: any) => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.cardBg,
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 6,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginTop: 4,
            }}
          >
            {count}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isDark ? `${color}20` : `${color}15`,
            padding: 8,
            borderRadius: 12,
          }}
        >
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
      </View>
      <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>
        {subtitle}
      </Text>
    </View>
  );

  return (
    <StyleGlobal>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingHorizontal: insets.left,
        }}
      >
        {/* --- MODAL DE SESIÓN EXPIRADA --- */}
        {/* Se coloca aquí para que se sobreponga a todo */}
        <SessionExpiredModal
          visible={isSessionExpired}
          onConfirm={handleSessionExpired}
        />

        <Header dataWorkPlace={dataWorkPlace} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accentBlue}
              colors={[colors.accentBlue]}
            />
          }
        >
          {/* --- Sección de Saludo y Contexto --- */}
          <View style={{ marginVertical: 20 }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '800',
                color: colors.textPrimary,
                fontFamily: 'System',
              }}
            >
              Hola,{' '}
              <Text style={{ color: colors.accentBlue }}>{getUserName()}</Text>
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 4,
              }}
            >
              Panel de Resguardante
            </Text>

            {/* Tarjeta de Información de Ubicación */}
            <View
              style={{
                marginTop: 16,
                backgroundColor: isDark ? '#2D3748' : '#DBEAFE',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="office-building-marker"
                size={28}
                color={isDark ? '#93C5FD' : '#2563EB'}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: isDark ? '#93C5FD' : '#2563EB',
                    textTransform: 'uppercase',
                  }}
                >
                  Ubicación Actual
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginTop: 2,
                  }}
                >
                  {dashboardData.info.departamento || 'Sin asignar'}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 12, color: colors.textSecondary }}
                >
                  {dashboardData.info.oficina || 'Sin asignar'}
                </Text>
              </View>
            </View>
          </View>

          {/* --- Manejo de Carga y Error --- */}
          {isLoading && !refreshing ? (
            <View
              style={{
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color={colors.accentBlue} />
              <Text style={{ marginTop: 10, color: colors.textSecondary }}>
                Cargando datos...
              </Text>
            </View>
          ) : error ? (
            <View
              style={{
                backgroundColor: isDark ? '#451a1a' : '#FEE2E2',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="alert-circle"
                size={32}
                color="#EF4444"
              />
              <Text
                style={{ color: '#EF4444', textAlign: 'center', marginTop: 8 }}
              >
                {error}
              </Text>
              <TouchableOpacity
                onPress={onRefresh}
                style={{
                  marginTop: 12,
                  backgroundColor: '#EF4444',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Reintentar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* --- Sección de Estadísticas (Cards) --- */}
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', marginBottom: 0 }}>
                  <StatCard
                    title="Bienes"
                    count={dashboardData.contadores.bienes}
                    icon="cube-outline"
                    color={colors.accentBlue}
                    subtitle="Total asignado"
                  />
                  <StatCard
                    title="Movimientos"
                    count={dashboardData.contadores.movimientos}
                    icon="swap-horizontal"
                    color={colors.accentGreen}
                    subtitle="Historial"
                  />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <StatCard
                    title="Traspasos"
                    count={dashboardData.contadores.transferencias}
                    icon="transfer"
                    color={colors.accentOrange}
                    subtitle="Enviados / Recibidos"
                  />
                  <View style={{ flex: 1, marginHorizontal: 6 }} />
                </View>
              </View>

              {/* --- Sección de Últimos Movimientos --- */}
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: colors.textPrimary,
                    }}
                  >
                    Movimientos Recientes
                  </Text>
                </View>

                {dashboardData.ultimos_movimientos.length === 0 ? (
                  <View
                    style={{
                      padding: 30,
                      alignItems: 'center',
                      backgroundColor: colors.cardBg,
                      borderRadius: 16,
                      borderStyle: 'dashed',
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="folder-open-outline"
                      size={40}
                      color={colors.textSecondary}
                    />
                    <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
                      No hay movimientos recientes
                    </Text>
                  </View>
                ) : (
                  dashboardData.ultimos_movimientos.map((mov, index) => {
                    const typeConfig = getMovementTypeConfig(
                      mov.movimiento_tipo,
                    );
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: colors.cardBg,
                          borderRadius: 12,
                          padding: 14,
                          marginBottom: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderBottomWidth: 1,
                          borderBottomColor: isDark ? 'transparent' : '#F3F4F6',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: isDark ? 0.2 : 0.03,
                          shadowRadius: 3,
                          elevation: 1,
                        }}
                      >
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: isDark
                              ? `${typeConfig.color}20`
                              : `${typeConfig.color}15`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 14,
                          }}
                        >
                          <MaterialCommunityIcons
                            name={typeConfig.icon as any}
                            size={22}
                            color={typeConfig.color}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: '700',
                                color: typeConfig.color,
                                marginBottom: 2,
                              }}
                            >
                              {typeConfig.label}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                color: colors.textSecondary,
                              }}
                            >
                              {formatDate(mov.created_at)}
                            </Text>
                          </View>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: colors.textPrimary,
                            }}
                          >
                            {mov.bien?.bien_descripcion || 'Bien desconocido'}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 4,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-right-thin"
                              size={14}
                              color={colors.textSecondary}
                              style={{ marginRight: 2 }}
                            />
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                                flex: 1,
                              }}
                            >
                              {mov.departamento?.dep_nombre || 'N/A'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </StyleGlobal>
  );
}
