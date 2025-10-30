import {
  LoginCredenciales,
  LoginRespuesta,
  LogoutCredenciales,
  LogoutRespuesta,
} from '@/src/models/types';
// const API_BASE_URL = 'http://192.168.3.33:8080/api';
// const API_BASE_URL = 'http://192.168.3.61:8080/api';

/**
 * Intenta autenticar a un usuario contra la API.
 * @param credenciales - El correo y contraseña del usuario.
 * @returns Una promesa que se resuelve con los datos del Usuario (incluyendo token).
 * @throws Lanza un error si las credenciales son incorrectas o hay un error de red.
 */
export async function loginUsuario(
  credenciales: LoginCredenciales,
): Promise<LoginRespuesta> {
  try {
    const respuesta = await fetch(process.env.EXPO_PUBLIC_API_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(credenciales),
    });

    if (respuesta.status === 422) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Correo o contraseña incorrectos');
    }

    if (!respuesta.ok) {
      throw new Error('Error en el servidor, Itenta de nuevo más tarde');
    }

    const loginRespuesta: LoginRespuesta = await respuesta.json();
    return loginRespuesta;
  } catch (error) {
    console.error('Error en el loginUsuario:', error);
    throw error;
  }
}

/**
 * Intenta autenticar a un usuario contra la API.
 * @param credenciales - El access_token del usuario.
 * @returns Una promesa que debuelve un mensaje de logout exitoso
 * @throws Lanza un error si las credenciales son incorrectas o hay un error de red.
 */
export async function logoutUsuario(
  credenciales: LogoutCredenciales,
): Promise<LogoutRespuesta> {
  try {
    const respuesta = await fetch(process.env.EXPO_PUBLIC_API_URL + '/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (respuesta.status === 401) {
      const errorLogout = await respuesta.json();
      throw new Error(errorLogout.message || 'No autorizado');
    }

    if (!respuesta.ok) {
      throw new Error('Error en el servidor, Itenta de nuevo más tarde');
    }

    const logoutRespuesta: LogoutRespuesta = await respuesta.json();
    return logoutRespuesta;
  } catch (error) {
    console.error('Error en el logoutUsuario:', error);
    throw error;
  }
}
