export interface ResguardanteBusquedaItem {
  id: number;
  nombre: string;
  correo: string; // Puede venir "Sin correo registrado" o el email
  cargo: string; // Puede venir "Sin cargo"
  iniciales: string;
  tiene_usuario: boolean;
}

/**
 * Tipo para la respuesta que es un array directo de estos items.
 */
export type ResguardanteBusquedaResponse = ResguardanteBusquedaItem[];
