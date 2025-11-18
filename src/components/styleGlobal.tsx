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
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#14161A',
  },
  backgroundImage: {
    opacity: 0.4,
  },
});
