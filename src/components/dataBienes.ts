export const iconMap: { [key: string]: string } = {
  '060200100': 'laptop', // Computadoras, Laptops, Monitor
  '060200200': 'projector', // Proyector
  '060200300': 'air-conditioner', // Aire Acondicionado
  '060200400': 'printer', // Impresora
  '060200500': 'microscope', // Microscopio
  '060200600': 'presentation-play', // Pizarra
  '060200900': 'seat-outline', // Silla
  '060200310': 'sine-wave', // Generador de Frecuencia
  default: 'cube-outline',
};

export const bienEstadosBg: { [key: string]: string } = {
  activo: 'bg-green-500/20',
  mantenimiento: 'bg-yellow-500/20',
  inactivo: 'bg-red-500/20',
  transaccion: 'bg-gray-500/20',
  default: 'bg-gray-500/20',
};

export const bienEstadosTexto: { [key: string]: string } = {
  activo: 'text-green-600',
  mantenimiento: 'text-yellow-600',
  inactivo: 'text-red-600',
  transaccion: 'text-gray-600',
  default: 'text-gray-600',
};
