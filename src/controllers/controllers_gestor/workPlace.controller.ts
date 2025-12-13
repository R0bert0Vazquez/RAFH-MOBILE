import { Access_token } from '@/src/models/types';
import { DashboardResponse } from '@/src/models/types_DashboardGestor';

/**
 * @param credenciales - El token del usuario para solicitar la informacion del dashboard
 * @returns Una promesa que se resuelve con el token, regresa la informacion del dashboard
 * @throws Lanza un error si las credenciales son incorrectas o hay un error.
 */
export async function getDashboard(
  credenciales: Access_token,
): Promise<DashboardResponse> {
  try {
    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + '/dashboard',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
      },
    );

    if (respuesta.status === 401) {
      const errorWorkPlace = await respuesta.json();
      throw new Error(errorWorkPlace.message || 'No autorizado');
    }
    if (!respuesta.ok) {
      throw new Error('Error en el servidor, Itenta de nuevo mas tarde');
    }

    const dashboardWorkPlace: DashboardResponse = await respuesta.json();
    // console.log(
    //   'DashboardWorkPlace:',
    //   JSON.stringify(dashboardWorkPlace, null, 2),
    // );
    return dashboardWorkPlace;
  } catch (error) {
    console.error('Error del getDashboard:', error);
    throw error;
  }
}

/** Hace una peticion a la API para aceptar o rechazar un traspaso.
 * @param credenciales - El token del usuario para autorizar la peticion.
 * @param id_traspaso - El ID del traspaso sobre el cual se tomará la decisión.
 * @param estado - El nuevo estado del traspaso ('Aprobado' o 'Rechazado').
 * @returns Una promesa que se resuelve con la respuesta de la API.
 * @throws Lanza un error si las credenciales son incorrectas, el traspaso no existe o hay un error en el servidor.
 */
export async function handleDecision(
  credenciales: Access_token,
  id_traspaso: number,
  nuevoEstado: string,
) {
  try {
    console.log('Credenciales:', credenciales);
    console.log('ID del traspaso:', id_traspaso);
    console.log('Estado:', nuevoEstado);

    const respuesta = await fetch(
      process.env.EXPO_PUBLIC_API_URL + `/traspasos/${id_traspaso}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      },
    );

    if (!respuesta.ok) {
      const errorData = await respuesta.text();
      let mensajeError = `Error ${respuesta.status}: ${respuesta.statusText}`;

      try {
        const errorJson = JSON.parse(errorData);
        console.error('Detalle del error del servidor:', errorJson);
        mensajeError =
          errorJson.message ||
          errorJson.error ||
          `Error ${respuesta.status} en el servidor`;
      } catch (e) {
        console.error('Respuesta de error (texto):', errorData);
        if (errorData) mensajeError = errorData;
      }

      throw new Error(mensajeError);
    }

    const resultado = await respuesta.json();
    return resultado;
  } catch (error) {
    console.error('Error en el getResguardantes:', error);
    throw error;
  }
}
