import {
  View,
  Text,
  useColorScheme,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useResgMovimientos } from '@/src/controllers/controllers_resguardante/movimientos.controller';
import { User } from '@/src/models/types';
import { Movimiento } from '@/src/models/types_Resg_Movimientos';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

export function Resg_Movimientos({
  access_token,
  user,
}: {
  access_token: string;
  user: User;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Hook del controlador
  const {
    isLoading,
    refreshing,
    error,
    movimientos,
    currentPage,
    lastPage,
    totalRecords,
    onRefresh,
    goToNextPage,
    goToPrevPage,
    formatDate,
  } = useResgMovimientos(access_token);

  // Colores (coherentes con el dashboard)
  const colors = {
    background: isDark ? '#121212' : '#F3F4F6',
    cardBg: isDark ? '#1B1D21' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    accentBlue: '#3B82F6',
    accentGray: isDark ? '#4B5563' : '#D1D5DB',
    success: '#10B981',
  };

  // Renderizado de cada item (Tarjeta de Movimiento)
  const renderItem = ({ item }: { item: Movimiento }) => {
    return (
      <View
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          marginHorizontal: 16, // Margen lateral para que no pegue a los bordes
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Cabecera de la tarjeta: Fecha y Código */}
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
              <MaterialCommunityIcons
                name="cube-scan"
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
            {formatDate(item.movimiento_fecha)}
          </Text>
        </View>

        {/* Cuerpo: Nombre del bien */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: 12,
          }}
          numberOfLines={2}
        >
          {item.bien?.bien_descripcion || 'Descripción no disponible'}
        </Text>

        {/* Sección de Origen -> Destino */}
        <View
          style={{
            backgroundColor: isDark ? '#2D2D2D' : '#F9FAFB',
            borderRadius: 8,
            padding: 10,
          }}
        >
          {/* Origen */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <MaterialCommunityIcons
              name="office-building"
              size={16}
              color={colors.textSecondary}
              style={{ width: 24 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                Origen
              </Text>
              <Text
                style={{ fontSize: 13, color: colors.textPrimary }}
                numberOfLines={1}
              >
                {item.bien?.oficina?.nombre || 'Desconocido'}
              </Text>
            </View>
          </View>

          {/* Flecha conectora */}
          <View style={{ paddingLeft: 8, marginBottom: 6 }}>
            <MaterialCommunityIcons
              name="arrow-down-left"
              size={16}
              color={colors.success}
            />
          </View>

          {/* Destino */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={16}
              color={colors.textSecondary}
              style={{ width: 24 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                Destino Actual
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textPrimary,
                  fontWeight: '600',
                }}
                numberOfLines={1}
              >
                {item.departamento?.dep_nombre || 'Desconocido'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Componente Footer para paginación
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
            Movimientos
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            Historial de traslados realizados
          </Text>
        </View>

        {isLoading && !refreshing ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.accentBlue} />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>
              Cargando historial...
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
        ) : movimientos.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.7,
            }}
          >
            <MaterialCommunityIcons
              name="folder-move-outline"
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
              Sin movimientos
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
              No hay registros disponibles aún.
            </Text>
          </View>
        ) : (
          <FlatList
            data={movimientos}
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
            // Agregamos el footer para la paginación dentro del scroll
            ListFooterComponent={lastPage > 1 ? <PaginationFooter /> : null}
          />
        )}

        {/* Footer flotante alternativo si hay datos y no está cargando (si prefieres que esté fijo abajo, descomenta esto y quita ListFooterComponent) */}
        {/* {!isLoading && movimientos.length > 0 && <PaginationFooter />} */}
      </View>
    </StyleGlobal>
  );
}
