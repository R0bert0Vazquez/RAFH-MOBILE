import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

// Configuración de Echo para React Native
// NOTA: Asegúrate de tener estas variables en tu .env de Expo
// EXPO_PUBLIC_REVERB_APP_KEY, EXPO_PUBLIC_REVERB_HOST, etc.

export const createEchoInstance = (token: string) => {
  // 1. Configuramos Pusher manualmente
  const PusherClient = new Pusher(process.env.EXPO_PUBLIC_REVERB_APP_KEY!, {
    cluster: 'mt1',
    wsHost: process.env.EXPO_PUBLIC_REVERB_HOST,
    wsPort: process.env.EXPO_PUBLIC_REVERB_PORT
      ? parseInt(process.env.EXPO_PUBLIC_REVERB_PORT)
      : 80,
    wssPort: process.env.EXPO_PUBLIC_REVERB_PORT
      ? parseInt(process.env.EXPO_PUBLIC_REVERB_PORT)
      : 443,
    forceTLS: (process.env.EXPO_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${process.env.EXPO_PUBLIC_API_URL}/broadcasting/auth`, // Ajusta tu URL base
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  // 2. Creamos la instancia de Echo usando el cliente de Pusher que acabamos de configurar
  const echo = new Echo({
    broadcaster: 'reverb',
    client: PusherClient, // Pasamos el cliente explícitamente
  });

  return echo;
};
