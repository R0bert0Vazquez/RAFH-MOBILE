import { Access_token, DashboardWorkPlace } from '@/src/models/types';

const API_BASE_URL = 'http://192.168.100.77:8080/api';

/**
 * @param credenciales - El token del usuario para solicitar la informacion del dashboard
 * @returns Una promesa que se resuelve con el token, regresa la informacion del dashboard
 * @throws Lanza un error si las credenciales son incorrectas o hay un error.
 */
export async function getDashboard(
  credenciales: Access_token,
): Promise<DashboardWorkPlace> {
  try {
    const respuesta = await fetch(API_BASE_URL + '/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (respuesta.status === 401) {
      const errorWorkPlace = await respuesta.json();
      throw new Error(errorWorkPlace.message || 'No autorizado');
    }
    if (!respuesta.ok) {
      throw new Error('Error en el servidor, Itenta de nuevo mas tarde');
    }

    const dashboardWorkPlace: DashboardWorkPlace = await respuesta.json();
    return dashboardWorkPlace;
  } catch (error) {
    console.error('Error del getDashboard:', error);
    throw error;
  }
}
