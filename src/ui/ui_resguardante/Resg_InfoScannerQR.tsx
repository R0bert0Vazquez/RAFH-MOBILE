import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';

import React, { useState, useMemo } from 'react';

import { StyleGlobal } from '@/src/components/StyleGlobal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DataBien } from '@/src/models/types'; // Access_token, RootStackParamList

// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

const dataBienes: DataBien[] = [
  {
    bien_codigo: 'ITCH-B-001',
    bien_nombre: 'Computadora de Escritorio',
    bien_categoria: 'Equipo de Cómputo',
    bien_ubicacion_actual: 'Edificio A - Laboratorio de Sistemas',
    bien_estado: 'Activo',
    bien_modelo: 'OptiPlex 5070',
    bien_marca: 'Dell',
    bien_fecha_adquisision: '2023-08-10',
    bien_valor_monetario: '18500.00',
    bien_id_dep: 'DEP-SISTEMAS',
  },
  {
    bien_codigo: 'ITCH-B-002',
    bien_nombre: 'Proyector Multimedia',
    bien_categoria: 'Equipo Audiovisual',
    bien_ubicacion_actual: 'Aula 201 - Edificio Principal',
    bien_estado: 'Mantenimiento',
    bien_modelo: 'PowerLite 1781W',
    bien_marca: 'Epson',
    bien_fecha_adquisision: '2022-03-15',
    bien_valor_monetario: '12500.00',
    bien_id_dep: 'DEP-AUDIOVISUAL',
  },
  {
    bien_codigo: 'ITCH-B-003',
    bien_nombre: 'Aire Acondicionado',
    bien_categoria: 'Climatización',
    bien_ubicacion_actual: 'Biblioteca - Sala de Estudio',
    bien_estado: 'Inactivo',
    bien_modelo: 'Split Inverter 2T',
    bien_marca: 'Mabe',
    bien_fecha_adquisision: '2021-11-20',
    bien_valor_monetario: '8200.00',
    bien_id_dep: 'DEP-MANTENIMIENTO',
  },
  {
    bien_codigo: 'ITCH-B-004',
    bien_nombre: 'Impresora Láser',
    bien_categoria: 'Equipo de Oficina',
    bien_ubicacion_actual: 'Coordinación Académica',
    bien_estado: 'Activo',
    bien_modelo: 'LaserJet Pro M404n',
    bien_marca: 'HP',
    bien_fecha_adquisision: '2023-01-30',
    bien_valor_monetario: '6500.00',
    bien_id_dep: 'DEP-ADMINISTRATIVO',
  },
  {
    bien_codigo: 'ITCH-B-005',
    bien_nombre: 'Microscopio Binocular',
    bien_categoria: 'Equipo de Laboratorio',
    bien_ubicacion_actual: 'Laboratorio de Química - Edificio C',
    bien_estado: 'Activo',
    bien_modelo: 'CX23',
    bien_marca: 'Olympus',
    bien_fecha_adquisision: '2022-09-05',
    bien_valor_monetario: '15400.00',
    bien_id_dep: 'DEP-QUIMICA',
  },
  {
    bien_codigo: 'ITCH-B-006',
    bien_nombre: 'Pizarra Interactiva',
    bien_categoria: 'Equipo Didáctico',
    bien_ubicacion_actual: 'Aula 105 - Posgrado',
    bien_estado: 'Mantenimiento',
    bien_modelo: 'SMART Board 6052',
    bien_marca: 'Smart Technologies',
    bien_fecha_adquisision: '2021-07-12',
    bien_valor_monetario: '32000.00',
    bien_id_dep: 'DEP-POSGRADO',
  },
];

// type Resg_InfoScannerQRRouteProp = RouteProp<
//   RootStackParamList,
//   'Resg_InfoScannerQR'
// >;
// type Resg_InfoScannerQRNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'Resg_InfoScannerQR'
// >;

const Header = () => (
  <View className="items-center mt-1 mb-1">
    <View className="flex-row items-center">
      <Image
        className="w-12 h-12 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-full mr-2"
        source={dataWorkPlace.image}
      />
      <Text className="text-gray-700 dark:text-slate-100 text-xl sm:text-xl md:text-4xl lg:text-4xl font-extrabold">
        {dataWorkPlace.title}
      </Text>
    </View>
  </View>
);

const bienIconos: { [key: string]: string } = {
  'equipo de cómputo': 'laptop',
  'equipo audiovisual': 'projector',
  climatización: 'air-conditioner',
  'equipo de oficina': 'printer',
  'equipo de laboratorio': 'microscope',
  'equipo didáctico': 'presentation',
  default: 'cube-outline',
};

const bienEstadosBg: { [key: string]: string } = {
  activo: 'bg-green-500/20',
  mantenimiento: 'bg-yellow-500/20',
  inactivo: 'bg-red-500/20',
  default: 'bg-gray-500/20',
};

const bienEstadosTexto: { [key: string]: string } = {
  activo: 'text-green-600',
  mantenimiento: 'text-yellow-600',
  inactivo: 'text-red-600',
  default: 'text-gray-600',
};

const BienItem = ({ item }: { item: DataBien }) => {
  const colorScheme = useColorScheme();
  const iconName = (bienIconos[item.bien_categoria.toLowerCase()] ||
    bienIconos.default) as any;

  const estadoStyleBg =
    bienEstadosBg[item.bien_estado.toLowerCase()] || bienEstadosBg.default;

  const estadoStyleText =
    bienEstadosTexto[item.bien_estado.toLowerCase()] ||
    bienEstadosTexto.default;

  return (
    <Pressable className="items-center px-4">
      <View className="w-full md:w-11/12 lg:w-11/12 mb-1">
        <View className="bg-white bg-gren dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ">
          <View className="flex-row items-center p-4">
            {/* Icono del Bien */}
            <View className="w-10 h-10 rounded-lg items-center justify-center bg-cyan-500/10 mr-4">
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={colorScheme === 'light' ? '#22d3ee' : 'white'}
              />
            </View>

            {/* Info del Bien */}
            <View className="flex-1">
              <Text
                className="text-gray-700 bg-red dark:text-slate-400 text-md font-semibold"
                numberOfLines={1}
              >
                {item.bien_nombre}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-semibold">Código: </Text>
                {item.bien_codigo}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-semibold">Ubicación: </Text>
                {item.bien_ubicacion_actual}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-semibold">Modelo: </Text>
                {item.bien_modelo}
              </Text>
              <Text
                className="text-gray-500 dark:text-gray-400 text-sm"
                numberOfLines={1}
              >
                <Text className="font-semibold">Marca: </Text>
                {item.bien_marca}
              </Text>
            </View>

            {/* Estado del Bien */}
            <View className="items-end">
              <View className={`px-2 py-1 rounded-lg ${estadoStyleBg}`}>
                <Text className={`text-xs font-bold ${estadoStyleText}`}>
                  {item.bien_estado}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const StatusItem = ({
  iconName,
  label,
  count,
  colorClass,
  color,
}: {
  iconName: string;
  label: string;
  count: number;
  colorClass: string;
  color: string;
}) => (
  <View className="flex-1 items-center px-2 py-3">
    <MaterialCommunityIcons name={iconName as any} size={28} color={color} />
    <Text className={`text-2xl font-bold mt-1 ${colorClass}`}>{count}</Text>
    <Text className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">
      {label}
    </Text>
  </View>
);

const StatusSummaryCard = ({
  counts,
  total,
}: {
  counts: { activo: number; mantenimiento: number; inactivo: number };
  total: number;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg my-4 overflow-hidden">
      <View className="flex-row divide-x divide-gray-200 dark:divide-gray-700">
        <StatusItem
          iconName="apps"
          label="Total"
          count={total}
          colorClass="text-blue-500 dark:text-blue-400"
          color={colorScheme === 'light' ? '#3b82f6' : '#60a5fa'}
        />
        <StatusItem
          iconName="check-circle-outline"
          label="Activos"
          count={counts.activo}
          colorClass="text-green-600 dark:text-green-500"
          color={colorScheme === 'light' ? '#16a34a' : '#22c55e'}
        />
        <StatusItem
          iconName="progress-wrench"
          label="Manten."
          count={counts.mantenimiento}
          colorClass="text-yellow-600 dark:text-yellow-500"
          color={colorScheme === 'light' ? '#ca8a04' : '#eab308'}
        />
        <StatusItem
          iconName="close-circle-outline"
          label="Inactivos"
          count={counts.inactivo}
          colorClass="text-red-600 dark:text-red-500"
          color={colorScheme === 'light' ? '#dc2626' : '#ef4444'}
        />
      </View>
    </View>
  );
};

const generatePdfHtml = (data: DataBien[]) => {
  const styles = `
    <style>
      body { font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; }
      @page { margin: 20mm; }
      h1 { text-align: center; color: #25A4D6; font-size: 24px; }
      h2 { text-align: center; color: #555; font-size: 18px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; font-size: 11px; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      .footer { text-align: center; font-size: 8px; color: #777; position: fixed; bottom: 10mm; width: 100%; }
    </style>
  `;

  // Filas de la tabla
  const tableRows = data
    .map(
      (bien) => `
    <tr>
      <td>${bien.bien_codigo}</td>
      <td>${bien.bien_nombre}</td>
      <td>${bien.bien_marca}</td>
      <td>${bien.bien_modelo}</td>
      <td>${bien.bien_ubicacion_actual}</td>
      <td>${bien.bien_estado}</td>
    </tr>
  `,
    )
    .join(''); // Une todas las filas

  // Plantilla HTML completa
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Bienes</title>
        ${styles}
      </head>
      <body>
        <h1>RAFH</h1>
        <h2>Reporte de Levantamiento de Inventario</h2>
        <h3>${dataWorkPlace.title}</h3>
        <p>Reporte generado el: ${new Date().toLocaleString('es-MX')}</p>
        <p>Total de bienes encontrados: ${data.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div class="footer">
          RAFH - Reporte de Inventario
        </div>
      </body>
    </html>
  `;
};

export function Resg_InfoScannerQR() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  //   const navigation = useNavigation<InfoScannerQRNavigationProp>();
  // const route = useRoute<Resg_InfoScannerQRRouteProp>();

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  // const scannerQRRespuesta = route.params;
  // const { access_token, scannedData } = scannerQRRespuesta;
  // console.log(
  //   'Obteniendo la información de los bienes escaneados:' + scannedData,
  // );

  // --- NOTA IMPORTANTE ---
  // Actualmente, la lista y el PDF usan 'dataBienes' (datos de ejemplo).
  // En el futuro, aquí deberías tomar 'scannedData',
  // hacer un fetch a tu API para obtener los detalles de esos códigos,
  // y guardar esa respuesta en un estado (ej. const [listaBienes, setListaBienes] = useState<DataBien[]>([]))
  // Por ahora, seguimos con 'dataBienes' como pediste.
  const datosParaMostrar = dataBienes; // <- Reemplazar esto con los datos de la API

  const statusCounts = useMemo(() => {
    return datosParaMostrar.reduce(
      (acc, bien) => {
        const estado = bien.bien_estado.toLowerCase();
        if (estado === 'activo') {
          acc.activo += 1;
        } else if (estado === 'mantenimiento') {
          acc.mantenimiento += 1;
        } else if (estado === 'inactivo') {
          acc.inactivo += 1;
        }
        return acc;
      },
      { activo: 0, mantenimiento: 0, inactivo: 0 },
    );
  }, [datosParaMostrar]); // Se recalcula solo si 'datosParaMostrar' cambia

  const handleGeneratePdf = async () => {
    if (isLoadingPdf) return; // Evitar doble click

    setIsLoadingPdf(true);
    try {
      // 1. Generar HTML
      const htmlContent = generatePdfHtml(datosParaMostrar);

      // 2. Definir ruta del archivo
      // Usamos FileSystem.cacheDirectory para guardar el archivo temporalmente
      const fileUri = `${FileSystem.cacheDirectory}reporte_bienes_${Date.now()}.pdf`;

      // 3. Crear el PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612, // Ancho de página estándar (Letter)
        height: 792, // Alto de página estándar (Letter)
      });
      console.log('PDF generado en:', uri);

      // 4. Mover el archivo a nuestra ruta (esto es más robusto en Android)
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // 5. Comprobar si se puede compartir
      if (!(await Sharing.isAvailableAsync())) {
        alert(
          'La función de compartir no está disponible en este dispositivo.',
        );
        setIsLoadingPdf(false);
        return;
      }

      // 6. Compartir el archivo
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Descargar Reporte de Bienes',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error('Error generando el PDF:', error);
      alert('Hubo un error al generar el PDF. Intenta de nuevo.');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <StyleGlobal>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}
      >
        <FlatList
          data={datosParaMostrar}
          ListHeaderComponent={
            <>
              <Header />

              <View className="px-4 md:px-6 lg:px-8 pt-4 pb-2">
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons
                    name="clipboard-list"
                    size={40}
                    color={colorScheme === 'light' ? '#6b7280' : 'white'}
                  />
                  <View className="flex-1 ml-2">
                    <Text className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-slate-200">
                      Resumen del Levantamiento
                    </Text>
                    <Text className="text-base md:text-lg text-gray-500 dark:text-slate-400">
                      Se encontraron {datosParaMostrar.length} bienes.
                    </Text>
                  </View>
                </View>

                <StatusSummaryCard
                  counts={statusCounts}
                  total={datosParaMostrar.length}
                />

                <Pressable
                  onPress={handleGeneratePdf}
                  disabled={isLoadingPdf}
                  className={`flex-row items-center justify-center rounded-lg p-3.5 my-2 ${
                    isLoadingPdf
                      ? 'bg-gray-400 dark:bg-gray-600'
                      : 'bg-green-600 dark:bg-green-700 active:bg-green-800'
                  } shadow-md`}
                >
                  {isLoadingPdf ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <MaterialCommunityIcons
                      name="file-pdf-box"
                      size={24}
                      color="white"
                      className="mr-2"
                    />
                  )}
                  <Text className="text-white text-center font-bold text-base md:text-lg">
                    {isLoadingPdf
                      ? 'Generando PDF...'
                      : 'Descargar Reporte en PDF'}
                  </Text>
                </Pressable>

                <Text className="text-xl md:text-2xl px-1 pt-4 pb-2 font-bold text-gray-700 dark:text-slate-300">
                  Bienes Encontrados:
                </Text>
              </View>
            </>
          }
          renderItem={({ item }) => <BienItem item={item} />}
          keyExtractor={(item) => item.bien_codigo}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <ActivityIndicator size="large" color="#25A4D6" />
              <Text className="text-lg text-gray-500 dark:text-slate-400 mt-4">
                Cargando bienes...
              </Text>
            </View>
          }
        />
      </View>
    </StyleGlobal>
  );
}
