import { Access_token } from '@/src/models/types';
import { AreaResponse } from '@/src/models/types_AreaResponse';
import { StructureResponse } from '@/src/models/types_Structure';

/**
 * Hace una consulta para obtener las Areas
 * @param credenciales - Access_token del usuario
 * @returns - La respuesta JSON del sevidor
 */
export const getAreas = async (credenciales: Access_token) => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/areas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${credenciales.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error en el servidor, Itenta de nuevo más tarde');
    }
    const areas: AreaResponse = await response.json();
    return areas;
  } catch (error) {
    console.log('Error en getAreas:', error);
    throw error;
  }
};

/**
 * Hace una consulta para obtener los Departamentos y Oficinas del Area que nos manden
 * @param credenciales - Access_token del usuario, y el Id del Area
 * @returns - La respuesta JSON del servidor
 */
export const getStructure = async (
  credenciales: Access_token,
  areaId: number,
) => {
  try {
    const response = await fetch(
      process.env.EXPO_PUBLIC_API_URL + '/areas/' + areaId + '/structure',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${credenciales.access_token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Error en el servidor, Itenta de nuevo más tarde');
    }
    const structureResponse: StructureResponse = await response.json();
    return structureResponse;
  } catch (error) {
    console.log('Error en getStructure:', error);
    throw error;
  }
};
