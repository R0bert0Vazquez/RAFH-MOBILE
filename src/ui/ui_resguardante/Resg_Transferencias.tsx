import {
  View,
  Text,
  useColorScheme,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // 🚀
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useResgTransferencias } from '@/src/controllers/controllers_resguardante/transferencias.controller';
import { User } from '@/src/models/types';
import { Traspaso } from '@/src/models/types_Resg_Transferencias';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

export function Resg_Transferencias({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Hook del controlador específico de Transferencias
  const {
    isLoading,
    refreshing,
    error,
    transferencias,
    currentPage,
    lastPage,
    totalRecords,
    fetchData, // 🚀 Exponemos la función
    onRefresh,
    goToNextPage,
    goToPrevPage,
    formatDate,
    getStatusConfig,
    getTransferRole,
  } = useResgTransferencias(access_token, user);

  // 🚀 useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchData(1);
    }, [access_token, user.id]),
  );

  // Colores (Sistema de diseño coherente)
  const colors = {
    background: isDark ? '#121212' : '#F3F4F6',
    cardBg: isDark ? '#1B1D21' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    accentBlue: '#3B82F6',
    accentPurple: '#8B5CF6',
  };

  // Renderizado de cada item (Tarjeta de Transferencia)
  const renderItem = ({ item }: { item: Traspaso }) => {
    const statusConfig = getStatusConfig(item.traspaso_estado);
    const role = getTransferRole(item); // 'SENDER' | 'RECEIVER'

    // Nombres de las partes involucradas
    const origenName = item.resguardante_origen?.res_nombre
      ? `${item.resguardante_origen.res_nombre} ${item.resguardante_origen.res_apellidos}`
      : 'Desconocido';
    const destinoName = item.resguardante_destino?.res_nombre
      ? `${item.resguardante_destino.res_nombre} ${item.resguardante_destino.res_apellidos}`
      : 'Desconocido';

    return (
      <View
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          marginHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.border,
          borderLeftWidth: 4,
          borderLeftColor: statusConfig.color, // Indicador de color lateral según estado
        }}
      >
        {/* Cabecera: Código y Fecha */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: isDark ? '#3B82F620' : '#EBF5FF',
                padding: 4,
                borderRadius: 6,
                marginRight: 8,
              }}
            >
              {/* Icono cambia si envío o recibo */}
              <MaterialCommunityIcons
                name={
                  role === 'SENDER' ? 'arrow-top-right' : 'arrow-bottom-left'
                }
                size={16}
                color={colors.accentBlue}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: colors.accentBlue,
              }}
            >
              {item.bien?.bien_codigo || 'S/N'}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>
            {formatDate(item.created_at)}
          </Text>
        </View>

        {/* Cuerpo: Descripción y Estado */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.bien?.bien_descripcion || 'Descripción no disponible'}
        </Text>

        {/* Badge de Estado */}
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark
                ? `${statusConfig.color}20`
                : `${statusConfig.color}15`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <MaterialCommunityIcons
              name={statusConfig.icon as any}
              size={14}
              color={statusConfig.color}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: statusConfig.color,
              }}
            >
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Sección de Flujo (Quién a Quién) */}
        <View
          style={{
            backgroundColor: isDark ? '#2D2D2D' : '#F9FAFB',
            borderRadius: 8,
            padding: 10,
          }}
        >
          {role === 'SENDER' ? (
            // YO ENVIÉ -> Muestro Destinatario
            <View>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                Enviado a:
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="account-arrow-right"
                  size={18}
                  color={colors.accentPurple}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textPrimary,
                    fontWeight: '600',
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {destinoName}
                </Text>
              </View>
            </View>
          ) : (
            // YO RECIBO -> Muestro Remitente
            <View>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                Recibido de:
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="account-arrow-left"
                  size={18}
                  color={colors.accentPurple}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textPrimary,
                    fontWeight: '600',
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {origenName}
                </Text>
              </View>
            </View>
          )}

          {/* Observaciones (Si existen) */}
          {item.traspaso_observaciones ? (
            <View
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: isDark ? '#444' : '#E5E7EB',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={14}
                  color={colors.textSecondary}
                  style={{ marginTop: 2, marginRight: 4 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontStyle: 'italic',
                    flex: 1,
                  }}
                >
                  {item.traspaso_observaciones}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  // Componente Footer para paginación (Idéntico a Movimientos)
  const PaginationFooter = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginTop: 8,
        backgroundColor: isDark ? '#121212' : '#F3F4F6',
      }}
    >
      <TouchableOpacity
        onPress={goToPrevPage}
        disabled={currentPage === 1 || isLoading}
        style={{
          padding: 10,
          backgroundColor:
            currentPage === 1
              ? isDark
                ? '#333'
                : '#E5E7EB'
              : colors.accentBlue,
          borderRadius: 8,
          opacity: currentPage === 1 ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons name="chevron-left" size={20} color="white" />
        <Text style={{ color: 'white', fontWeight: '600', marginLeft: 4 }}>
          Ant.
        </Text>
      </TouchableOpacity>

      <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>
          Pág {currentPage} de {lastPage}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 10 }}>
          {totalRecords} registros
        </Text>
      </View>

      <TouchableOpacity
        onPress={goToNextPage}
        disabled={currentPage === lastPage || isLoading}
        style={{
          padding: 10,
          backgroundColor:
            currentPage === lastPage
              ? isDark
                ? '#333'
                : '#E5E7EB'
              : colors.accentBlue,
          borderRadius: 8,
          opacity: currentPage === lastPage ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600', marginRight: 4 }}>
          Sig.
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
      </TouchableOpacity>
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
        <Header dataWorkPlace={dataWorkPlace} />

        <View
          style={{ paddingHorizontal: 16, marginBottom: 10, marginTop: 10 }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.textPrimary,
              fontFamily: 'System',
            }}
          >
            Transferencias
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            Historial de solicitudes (Traspasos)
          </Text>
        </View>

        {isLoading && !refreshing ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.accentBlue} />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>
              Cargando transferencias...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text
              style={{
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={onRefresh}
              style={{
                backgroundColor: colors.accentBlue,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : transferencias.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.7,
            }}
          >
            <MaterialCommunityIcons
              name="swap-horizontal-bold"
              size={64}
              color={colors.textSecondary}
            />
            <Text
              style={{
                marginTop: 16,
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Sin transferencias
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
              No hay registros disponibles.
            </Text>
          </View>
        ) : (
          <FlatList
            data={transferencias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accentBlue}
                colors={[colors.accentBlue]}
              />
            }
            // Footer de paginación
            ListFooterComponent={lastPage > 1 ? <PaginationFooter /> : null}
          />
        )}
      </View>
    </StyleGlobal>
  );
}
