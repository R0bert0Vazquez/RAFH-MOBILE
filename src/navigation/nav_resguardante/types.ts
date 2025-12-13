import { User } from '@/src/models/types';

export type ResgTabParamList = {
  Inicio: { access_token: string; user: User };
  'Mis Bienes': { access_token: string; user: User };
  Movimientos: { access_token: string; user: User };
  Transferencias: { access_token: string; user: User };
  'Escanear QR': { access_token: string };
  'Mi Perfil': { access_token: string; user: User };
};
