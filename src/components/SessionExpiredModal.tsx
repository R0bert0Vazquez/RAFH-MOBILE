import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SessionExpiredModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export const SessionExpiredModal = ({
  visible,
  onConfirm,
}: SessionExpiredModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}} // Bloquea el botón de atrás de Android
    >
      {/* Overlay: Fondo oscuro semitransparente (bg-black/60) */}
      <View className="flex-1 justify-center items-center bg-black/60">
        {/* Modal View */}
        {/* Modo Claro: bg-white | Modo Oscuro: bg-[#14161A] (Coincide con tu Login) */}
        <View className="w-[85%] bg-white dark:bg-[#14161A] rounded-2xl p-6 items-center shadow-lg">
          {/* Icon Container */}
          {/* Modo Claro: bg-red-100 | Modo Oscuro: bg-red-900/20 (más sutil) */}
          <View className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <MaterialCommunityIcons
              name="lock-alert"
              size={50}
              color="#EF4444" // Rojo (red-500) se ve bien en ambos
            />
          </View>

          {/* Title */}
          {/* Modo Claro: text-gray-800 | Modo Oscuro: text-slate-200 */}
          <Text className="mb-2.5 text-center text-xl font-bold text-gray-800 dark:text-slate-200">
            Sesión Expirada
          </Text>

          {/* Body Text */}
          {/* Modo Claro: text-gray-500 | Modo Oscuro: text-slate-400 */}
          <Text className="mb-6 text-center text-sm leading-5 text-gray-500 dark:text-slate-400">
            Tu token de seguridad ha caducado por inactividad o por seguridad.
            Por favor, inicia sesión nuevamente.
          </Text>

          {/* Button */}
          {/* bg-blue-500 es tu color primario (#3B82F6) */}
          <TouchableOpacity
            className="w-full rounded-xl p-3.5 bg-blue-500 active:bg-blue-600 shadow-sm"
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-center text-base">
              Volver a Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
