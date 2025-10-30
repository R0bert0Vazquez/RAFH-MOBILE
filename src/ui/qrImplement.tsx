import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';

export function QR({ navigation }) {
  const inset = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);

  if (!permission) {
    // Mientras se cargan los permisos
    return <View />;
  }

  if (!permission.granted) {
    // Si no hay permisos, pedirlos
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos tu permiso para acceder a la cámara
        </Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  // Cambiar cámara frontal/trasera
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  // Handler para cuando se escanea un código
  const handleBarCodeScanned = (result) => {
    if (scanned) return; // evitar múltiples lecturas seguidas
    setScanned(true);
    setData(result.data);

    Alert.alert('QR escaneado', `Contenido: ${result.data}`, [
      {
        text: 'OK',
        onPress: () => {
          setScanned(false);
          // Si tienes navegación, puedes regresar a la vista anterior
          if (navigation && navigation.goBack) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: inset.top,
        paddingLeft: inset.left,
        paddingRight: inset.right,
        paddingBottom: inset.bottom,
      }}
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'], // solo escanea códigos QR
          }}
          onBarcodeScanned={handleBarCodeScanned}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
