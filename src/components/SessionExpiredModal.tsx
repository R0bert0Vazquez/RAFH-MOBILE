import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SessionExpiredModalProps {
  visible: boolean;
  onConfirm: () => void;
}

const { width } = Dimensions.get('window');

export const SessionExpiredModal = ({
  visible,
  onConfirm,
}: SessionExpiredModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}} // Bloquea el botón de atrás de Android para obligar a pulsar el botón
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="lock-alert"
              size={50}
              color="#EF4444"
            />
          </View>

          <Text style={styles.modalTitle}>Sesión Expirada</Text>
          <Text style={styles.modalText}>
            Tu token de seguridad ha caducado por inactividad o por seguridad.
            Por favor, inicia sesión nuevamente.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.textStyle}>Volver a Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
  },
  modalView: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 50,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalText: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    backgroundColor: '#3B82F6', // Azul principal
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
