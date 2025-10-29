import { useColorScheme, StyleSheet, ImageBackground } from 'react-native';
import React from 'react';

const imgBackGround = require('@/assets/bg-waves.png');

type StyleGlobalProps = {
  children: React.ReactNode;
};

export function StyleGlobal({ children }: StyleGlobalProps) {
  const colorScheme = useColorScheme();
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <ImageBackground
      source={imgBackGround}
      style={[styles.background, themeContainerStyle]}
      resizeMode="cover" // Asegura que la imagen cubra todo el espacio sin deformarse
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Estilo base para el fondo
  background: {
    flex: 1, // Ocupa t oda la pantalla
    width: '100%',
    height: '100%',
    position: 'absolute',
    // alignItems: 'center', // Centra el contenido horizontalmente
    // justifyContent: 'center', // Centra el contenido verticalmente
  },
  lightContainer: {
    // backgroundColor: '#d1c9c9ff', // Esto funcionará como un tinte o color de respaldo
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#14161A',
  },
});
