import { DataBien } from '@/src/models/types_BienesResponse';

/**
 * Este es tu arreglo de 'dataBienes' actualizado para que coincida
 * con la nueva interface de DataBien.
 * He rellenado los campos que faltaban con datos de ejemplo.
 */
export const dataBienes: DataBien[] = [
  // 1. El ejemplo original
  {
    bien_codigo: 'I060200310-93-23-00001',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '" RCA "',
    bien_modelo: '504B/440',
    bien_serie: '3271',
    bien_descripcion:
      'GENERADOR DE FRECUENCIA ACUSTICA RANGO 0.01 HZ.CAT. 2154F  BODEGA # 1',
    bien_tipo_adquisicion: '3',
    bien_fecha_alta: '1993-07-13T16:47:11.000000Z',
    bien_valor_monetario: '1.14',
    bien_clave: '060200310',
    bien_y: '93',
    bien_secuencia: '00001',
    bien_provedor: 'SIN PROVEDOR',
    bien_numero_factura: '0',
    bien_estado: 'Activo',
  },
  // 2. Computadora
  {
    bien_codigo: 'I060200100-23-01-00015',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"DELL"',
    bien_modelo: 'OPTIPLEX 7090',
    bien_serie: 'DX-58291',
    bien_descripcion:
      'COMPUTADORA DE ESCRITORIO DELL OPTIPLEX 7090 CORE I5 16GB RAM 512GB SSD',
    bien_tipo_adquisicion: '1',
    bien_fecha_alta: '2023-08-10T10:00:00.000000Z',
    bien_valor_monetario: '18500.00',
    bien_clave: '060200100',
    bien_y: '23',
    bien_secuencia: '00015',
    bien_provedor: 'DELL MEXICO',
    bien_numero_factura: 'F-12345',
    bien_estado: 'Activo',
  },
  // 3. Proyector
  {
    bien_codigo: 'I060200200-22-05-00007',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"EPSON"',
    bien_modelo: 'POWERLITE 1781W',
    bien_serie: 'EP-92842',
    bien_descripcion: 'PROYECTOR MULTIMEDIA EPSON POWERLITE 1781W WIFI',
    bien_tipo_adquisicion: '3',
    bien_fecha_alta: '2022-03-15T11:30:00.000000Z',
    bien_valor_monetario: '12500.00',
    bien_clave: '060200200',
    bien_y: '22',
    bien_secuencia: '00007',
    bien_provedor: 'EPSON MEXICO',
    bien_numero_factura: 'F-23456',
    bien_estado: 'Mantenimiento',
  },
  // 4. Aire Acondicionado
  {
    bien_codigo: 'I060200300-21-02-00011',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"MABE"',
    bien_modelo: 'SPLIT INVERTER 2T',
    bien_serie: 'MB-48572',
    bien_descripcion: 'AIRE ACONDICIONADO TIPO MINISPLIT MABE 2 TONELADAS',
    bien_tipo_adquisicion: '2',
    bien_fecha_alta: '2021-11-20T16:00:00.000000Z',
    bien_valor_monetario: '8200.00',
    bien_clave: '060200300',
    bien_y: '21',
    bien_secuencia: '00011',
    bien_provedor: 'SIN PROVEDOR',
    bien_numero_factura: '0',
    bien_estado: 'Inactivo',
  },
  // 5. Impresora Láser
  {
    bien_codigo: 'I060200400-23-01-00030',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"HP"',
    bien_modelo: 'LASERJET PRO M404N',
    bien_serie: 'HP-LJ-98372',
    bien_descripcion: 'IMPRESORA LASER MONOCROMATICA HP M404N RED',
    bien_tipo_adquisicion: '1',
    bien_fecha_alta: '2023-01-30T14:15:00.000000Z',
    bien_valor_monetario: '6500.00',
    bien_clave: '060200400',
    bien_y: '23',
    bien_secuencia: '00030',
    bien_provedor: 'HP STORE',
    bien_numero_factura: 'F-45678',
    bien_estado: 'Activo',
  },
  // 6. Microscopio
  {
    bien_codigo: 'I060200500-22-09-00005',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"OLYMPUS"',
    bien_modelo: 'CX23',
    bien_serie: 'OL-CX-51512',
    bien_descripcion: 'MICROSCOPIO BINOCULAR OLYMPUS CX23 LED',
    bien_tipo_adquisicion: '4',
    bien_fecha_alta: '2022-09-05T09:00:00.000000Z',
    bien_valor_monetario: '15400.00',
    bien_clave: '060200500',
    bien_y: '22',
    bien_secuencia: '00005',
    bien_provedor: 'EQUIPOS DE LAB S.A.',
    bien_numero_factura: 'F-56789',
    bien_estado: 'Transaccion',
  },
  // 7. Pizarra Interactiva
  {
    bien_codigo: 'I060200600-21-07-00002',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"SMART"',
    bien_modelo: 'SMART BOARD 6052',
    bien_serie: 'SM-6052-88271',
    bien_descripcion: 'PIZARRA INTERACTIVA SMART BOARD 6052 52 PULGADAS',
    bien_tipo_adquisicion: '1',
    bien_fecha_alta: '2021-07-12T13:00:00.000000Z',
    bien_valor_monetario: '32000.00',
    bien_clave: '060200600',
    bien_y: '21',
    bien_secuencia: '00002',
    bien_provedor: 'SIN PROVEDOR',
    bien_numero_factura: '0',
    bien_estado: 'Inactivo',
  },
  // 8. Laptop Lenovo
  {
    bien_codigo: 'I060200100-23-03-00022',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"LENOVO"',
    bien_modelo: 'THINKPAD E14',
    bien_serie: 'LV-E14-72721',
    bien_descripcion: 'LAPTOP LENOVO THINKPAD E14 CORE I7 16GB RAM 1TB SSD',
    bien_tipo_adquisicion: '1',
    bien_fecha_alta: '2023-03-20T10:20:00.000000Z',
    bien_valor_monetario: '24500.00',
    bien_clave: '060200100',
    bien_y: '23',
    bien_secuencia: '00022',
    bien_provedor: 'LENOVO MEXICO',
    bien_numero_factura: 'F-78901',
    bien_estado: 'Activo',
  },
  // 9. Silla de Oficina
  {
    bien_codigo: 'I060200900-20-11-00104',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"HERMAN MILLER"',
    bien_modelo: 'AERON',
    bien_serie: 'HM-AERON-3031',
    bien_descripcion: 'SILLA DE OFICINA ERGONOMICA HERMAN MILLER AERON',
    bien_tipo_adquisicion: '5',
    bien_fecha_alta: '2020-11-05T17:00:00.000000Z',
    bien_valor_monetario: '21000.00',
    bien_clave: '060200900',
    bien_y: '20',
    bien_secuencia: '00104',
    bien_provedor: 'SIN PROVEDOR',
    bien_numero_factura: '0',
    bien_estado: 'Activo',
  },
  // 10. Monitor Samsung
  {
    bien_codigo: 'I060200100-22-06-00080',
    bien_ubicacion_actual: 'ALM',
    bien_marca: '"SAMSUNG"',
    bien_modelo: 'ODYSSEY G5 27"',
    bien_serie: 'SS-G5-48482',
    bien_descripcion: 'MONITOR GAMING CURVO SAMSUNG ODYSSEY G5 27 PULGADAS QHD',
    bien_tipo_adquisicion: '1',
    bien_fecha_alta: '2022-06-15T12:45:00.000000Z',
    bien_valor_monetario: '7800.00',
    bien_clave: '060200100',
    bien_y: '22',
    bien_secuencia: '00080',
    bien_provedor: 'SAMSUNG MEXICO',
    bien_numero_factura: 'F-90123',
    bien_estado: 'Mantenimiento',
  },
];

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
