import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  LayoutAnimation,
} from 'react-native';

import React, { useEffect, useState, useMemo } from 'react';
import { StyleGlobal } from '@/src/components/StyleGlobal';
import { Header } from '@/src/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, DefaultTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import { dataResguardantes } from '@/src/components/dataResguardantes';
import {
  dataBienes,
  iconMap,
  bienEstadosBg,
  bienEstadosTexto,
} from '@/src/components/dataBienes';

import { DataBien, Resguardante } from '@/src/models/types';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const Icon_itch = require('@/assets/icon_itch.png');
const dataWorkPlace = {
  title: 'Instituto Tecnológico de Chetumal',
  image: Icon_itch,
};

const ResguardanteHeader = ({
  itemResguardante,
}: {
  itemResguardante: Resguardante;
}) => {
  const colorScheme = useColorScheme();
  return (
    <>
      <View className="items-center px-4">
        <View className="w-full md:w-full lg:w-full mb-3">
          <View className="bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
            {/* Avatar Principal */}
            <View className="flex-row items-center p-4">
              <View className="relative">
                <View className="w-12 h-12 rounded-2xl items-center justify-center">
                  <MaterialCommunityIcons
                    name="account-check-outline"
                    size={40}
                    color={colorScheme === 'light' ? '#25A4D6' : 'white'}
                  />
                </View>
                <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white bg-green-400" />
              </View>

              <View className="flex-1 ml-4">
                <Text
                  className="text-gray-800 dark:text-slate-400 text-base font-bold"
                  numberOfLines={1}
                >
                  {itemResguardante.res_nombre} {itemResguardante.res_apellidos}
                </Text>

                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-2">
                    Correo:
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_correo}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-2">
                    Teléfono:
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_telefono}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="office-building-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-2">
                    Departamento:
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_departamento}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="domain"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-2">
                    Oficina:
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.id_oficina}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="card-account-details-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-2">
                    RFC:
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_rfc}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="card-account-details-outline"
                    size={14}
                    color="#666"
                  />
                  <Text className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-2">
                    CURP:
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    {itemResguardante.res_curp}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <View className="px-2 py-1 rounded-lg bg-green-500/10">
                  <Text className="text-xs font-bold text-green-600">
                    Activo
                  </Text>
                </View>
                <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {itemResguardante.res_puesto}
                </Text>
              </View>
            </View>

            {/* Separador sutil */}
            <View className="h-px bg-gray-300 dark:bg-gray-700 mx-4" />
            <ResumLevantamiento />
          </View>
        </View>
      </View>
    </>
  );
};

const Filtros = ({
  searchValue,
  onSearchChange,
  filterOpen,
  setFilterOpen,
  filterValue,
  setFilterValue,
  filterItems,
  setFilterItems,
}: {
  searchValue: string;
  onSearchChange: (text: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filterValue: any;
  setFilterValue: (value: any) => void;
  filterItems: any[];
  setFilterItems: (items: any) => void;
}) => {
  const colorScheme = useColorScheme();
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6',
      onSurface: '#94a3b8',
      placeholder: '#94a3b8',
      onSurfaceVariant: '#94a3b8',
    },
  };

  return (
    <>
      <View className="items-center px-4 mb-3">
        <View className="w-full md:w-full lg:w-full">
          <View className="landscape:flex-1 landscape:mt-1">
            <View className="landscape:items-center md:items-center">
              <View className="flex-row landscape:flex-row md:flex-row lg:flex-row items-center mt-1">
                <View className="w-6/12 landscape:w-5/12 md:w-5/12 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600 mr-2 landscape:mr-2 md:mr-2 ">
                  <TextInput
                    mode="flat"
                    returnKeyType="search"
                    theme={customTheme}
                    value={searchValue}
                    onChangeText={onSearchChange}
                    label="Buscar..."
                    left={
                      <TextInput.Icon
                        icon={() => (
                          <MaterialCommunityIcons
                            name="account-search-outline"
                            size={24}
                            color={'#25A4D6'}
                          />
                        )}
                      />
                    }
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  />
                </View>

                <View className="w-6/12 landscape:w-5/12 md:w-5/12 mt-1 md:mt-0 lg:mt-0 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-1 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
                  <DropDownPicker
                    theme="DARK"
                    open={filterOpen}
                    value={filterValue}
                    items={filterItems}
                    setOpen={setFilterOpen as any}
                    setValue={setFilterValue}
                    setItems={setFilterItems}
                    placeholder="Filtrar Movimiento"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    }}
                    containerStyle={{
                      justifyContent: 'flex-end',
                    }}
                    textStyle={{
                      color: 'gray',
                    }}
                    dropDownContainerStyle={{
                      marginTop: '-400%',
                      backgroundColor:
                        colorScheme === 'light' ? 'white' : '#14161A',
                      borderColor: colorScheme === 'light' ? 'gray' : 'gray',
                      borderWidth: 0.5,
                      borderRadius: 10,
                      borderTopStartRadius: 10,
                      borderTopEndRadius: 10,
                    }}
                  ></DropDownPicker>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
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
    <Text
      className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase"
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

const StatusSummaryCard = ({
  counts,
  total,
}: {
  counts: {
    activo: number;
    mantenimiento: number;
    inactivo: number;
    transaccion: number;
  };
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
          label="Mantenimiento"
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
        <StatusItem
          iconName="transfer"
          label="Transaccion"
          count={counts.transaccion}
          colorClass="text-gray-600 dark:text-gray-500"
          color={colorScheme === 'light' ? '#4b5563' : '#6b7280'}
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
      <td>${bien.bien_secuencia}</td>
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
              <th>Secuencia</th>
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

const ResumLevantamiento = () => {
  const colorScheme = useColorScheme();
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

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
        } else if (estado === 'transaccion') {
          acc.transaccion += 1;
        }
        return acc;
      },
      { activo: 0, mantenimiento: 0, inactivo: 0, transaccion: 0 },
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
    <>
      <View className="px-4 md:px-6 lg:px-8 pt-2 pb-2">
        <View className="flex-row items-center mb-1">
          <MaterialCommunityIcons
            name="clipboard-list"
            size={40}
            color={colorScheme === 'light' ? '#6b7280' : 'white'}
          />
          <View className="flex-1 ml-2">
            <Text className="text-xl md:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-slate-200">
              Bienes Asignados
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
            {isLoadingPdf ? 'Generando PDF...' : 'Descargar Reporte en PDF'}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const FormInput = ({
  label,
  icon,
  value,
  onChangeText,
  disabled = false,
  keyboardType = 'default',
  theme,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  keyboardType?: any;
  theme: any;
}) => (
  <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
    <TextInput
      mode="flat"
      theme={theme}
      label={label}
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      keyboardType={keyboardType}
      left={
        <TextInput.Icon
          icon={() => (
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={disabled ? '#9ca3af' : '#10b981'} // gris si disabled, esmeralda si no
            />
          )}
        />
      }
      style={{ backgroundColor: 'transparent' }}
    />
  </View>
);

const EditModal = ({
  visible,
  onClose,
  onConfirmEdit,
  bien,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirmEdit: (updatedBien: DataBien) => void;
  bien: DataBien | null;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // --- Estado interno para el formulario ---
  const [formData, setFormData] = useState<Partial<DataBien>>({});

  // --- Cargar datos en el formulario cuando el modal se abre ---
  useEffect(() => {
    if (bien) {
      setFormData(bien); // Copia los datos del bien al estado del formulario
    } else {
      setFormData({}); // Limpia el formulario si no hay bien
    }
  }, [bien]); // Este efecto se ejecuta cada vez que 'bien' cambia

  // --- Handler para actualizar el estado del formulario ---
  const handleInputChange = (field: keyof DataBien, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Tema para los TextInputs
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#10b981', // Verde Esmeralda
      background: isDarkMode ? '#2d2d2d' : '#f0f0f0',
      onSurface: 'gray',
      onSurfaceVariant: 'gray',
    },
  };

  if (!bien) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-black/60 px-5 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-1">
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={50}
                color="#10b981" // Verde Esmeralda
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-4">
              Editar Información del Bien
            </Text>

            {/* --- Formulario de Edición --- */}
            <View>
              {/* Código (Deshabilitado) */}
              <FormInput
                label="Código del Bien"
                icon="barcode-scan"
                value={formData.bien_codigo || ''}
                onChangeText={() => {}} // No hace nada
                disabled={true}
                theme={customTheme}
              />

              {/* Secuencia (Deshabilitado) */}
              <FormInput
                label="Secuencia"
                icon="pencil-outline"
                value={formData.bien_secuencia || ''}
                onChangeText={(val) => handleInputChange('bien_secuencia', val)}
                disabled={true}
                theme={customTheme}
              />

              {/* Ubicación (Deshabilitado) */}
              <FormInput
                label="Ubicación Actual"
                icon="map-marker-outline"
                value={formData.bien_ubicacion_actual || ''}
                onChangeText={(val) =>
                  handleInputChange('bien_ubicacion_actual', val)
                }
                disabled={true}
                theme={customTheme}
              />

              {/* Marca */}
              <FormInput
                label="Marca"
                icon="tag-outline"
                value={formData.bien_marca || ''}
                onChangeText={(val) => handleInputChange('bien_marca', val)}
                theme={customTheme}
              />

              {/* Modelo */}
              <FormInput
                label="Modelo"
                icon="cog-outline"
                value={formData.bien_modelo || ''}
                onChangeText={(val) => handleInputChange('bien_modelo', val)}
                theme={customTheme}
              />

              {/* Serie */}
              <FormInput
                label="Serie"
                icon="cube-outline"
                value={formData.bien_serie || ''}
                onChangeText={(val) => handleInputChange('bien_serie', val)}
                theme={customTheme}
              />

              {/* Descripción */}
              <FormInput
                label="Descripción"
                icon="text-box-outline"
                value={formData.bien_descripcion || ''}
                onChangeText={(val) =>
                  handleInputChange('bien_descripcion', val)
                }
                theme={customTheme}
              />

              {/* Tipo de Adqusición */}
              <FormInput
                label="Tipo de Adquisición"
                icon="file-document-outline"
                value={formData.bien_tipo_adquisicion || ''}
                onChangeText={(val) =>
                  handleInputChange('bien_tipo_adquisicion', val)
                }
                theme={customTheme}
              />

              {/* Valor Monetario */}
              <FormInput
                label="Valor Monetario"
                icon="cash"
                value={String(formData.bien_valor_monetario || '')}
                onChangeText={(val) =>
                  handleInputChange('bien_valor_monetario', val)
                }
                keyboardType="numeric"
                theme={customTheme}
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onConfirmEdit(formData as DataBien)}
                className="flex-1 bg-emerald-600 rounded-lg p-4 ml-2 active:bg-emerald-700"
              >
                <Text
                  className="text-white text-center font-bold text-lg"
                  numberOfLines={1}
                >
                  Guardar Cambios
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const TransferModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bien: DataBien | null;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const modalBackgroundColor = isDarkMode ? '#14161A' : '#f1f5f9';
  const modalBorderColor = isDarkMode ? 'e5e7eb' : '#e5e7eb';
  const modalTextColor = 'gray';
  const modalSearchBgColor = isDarkMode ? '#14161A' : '#ffffff';
  const modalSearchBorderColor = isDarkMode ? '#334155' : '#e2e8f0';

  const [searchUser, setSearchUser] = useState('');
  const [officeOpen, setOfficeOpen] = useState(false);
  const [officeValue, setOfficeValue] = useState(null);
  const [officeItems, setOfficeItems] = useState([
    {
      label: 'Sistemas y Computación',
      value: 'sistemas',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
    {
      label: 'Mantenimiento de Equipo',
      value: 'manto',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
    {
      label: 'Dirección General',
      value: 'dir',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
    {
      label: 'Recursos Financieros',
      value: 'fin',
      icon: () => (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={18}
          color="gray"
        />
      ),
    },
  ]);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25A4D6',
      background: colorScheme === 'light' ? '#f0f0f0' : '#2d2d2d',
      onSurface: 'gray',
      onSurfaceVariant: 'gray',
    },
  };

  if (!bien) return null; // No renderizar nada si no hay un bien seleccionado

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-black/60 px-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="account-switch-outline"
                size={50}
                color="#25A4D6"
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
              Traspasar Bien
            </Text>
            <Text
              className="text-gray-600 dark:text-slate-400 text-base text-center mb-4"
              numberOfLines={4}
            >
              Vas a traspasar el bien:{' '}
              <Text className="font-bold">{bien.bien_descripcion}</Text>.
            </Text>

            {/* --- Controles de Búsqueda --- */}
            <View style={{ zIndex: 1000 }}>
              {/* TextInput de Búsqueda */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
                <TextInput
                  mode="flat"
                  theme={customTheme}
                  value={searchUser}
                  onChangeText={setSearchUser}
                  label="Buscar resguardante..."
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="account-search"
                          size={24}
                          color={'#25A4D6'}
                        />
                      )}
                    />
                  }
                  style={{ backgroundColor: 'transparent' }}
                />
              </View>

              {/* Dropdown de Oficinas */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-6">
                <DropDownPicker
                  theme={colorScheme === 'light' ? 'LIGHT' : 'DARK'}
                  open={officeOpen}
                  value={officeValue}
                  items={officeItems}
                  setOpen={setOfficeOpen}
                  setValue={setOfficeValue}
                  setItems={setOfficeItems}
                  placeholder="Filtrar por oficina..."
                  listMode="MODAL"
                  modalAnimationType="slide"
                  modalTitle="Selecciona una Oficina"
                  searchable={true}
                  searchPlaceholder="Buscar oficina..."
                  translation={{
                    NOTHING_TO_SHOW: 'No se encontraron oficinas.',
                  }}
                  modalContentContainerStyle={{
                    backgroundColor: modalBackgroundColor,
                  }}
                  modalTitleStyle={{
                    color: modalTextColor,
                    fontWeight: 'bold',
                  }}
                  searchContainerStyle={{
                    borderBottomColor: modalBorderColor,
                  }}
                  searchTextInputStyle={{
                    color: modalTextColor,
                    backgroundColor: modalSearchBgColor,
                    borderColor: modalSearchBorderColor,
                    borderRadius: 8,
                    borderWidth: 1,
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  textStyle={{ color: 'gray' }}
                />
              </View>
            </View>

            {/* --- Lista de Resguardantes (Simulada) --- */}
            <View className="h-24 mb-6 items-center justify-center border border-dashed border-gray-400 dark:border-gray-600 rounded-lg">
              <Text className="text-gray-500 dark:text-gray-400">
                (Aquí aparecerá la lista de resguardantes)
              </Text>
            </View>

            {/* --- Fila de Botones --- */}
            <View className="flex-row justify-between">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                className="flex-1 bg-green-600 rounded-lg p-4 ml-2 active:bg-green-700"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const RequestModal = ({
  visible,
  onClose,
  onConfirm,
  bien,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bien: DataBien | null;
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const modalBackgroundColor = isDarkMode ? '#14161A' : '#f1f5f9';
  // const modalBorderColor = isDarkMode ? 'e5e7eb' : '#e5e7eb';
  const modalTextColor = 'gray';

  // --- Estados internos para el formulario ---
  const [requestTypeOpen, setRequestTypeOpen] = useState(false);
  const [requestTypeValue, setRequestTypeValue] = useState(null);
  const [justification, setJustification] = useState('');

  const [requestTypeItems, setRequestTypeItems] = useState([
    {
      label: 'Solicitar Mantenimiento',
      value: 'mantenimiento',
      icon: () => (
        <MaterialCommunityIcons name="cogs" size={18} color="#f59e0b" />
      ), // color-yellow-500
    },
    {
      label: 'Solicitar Baja de Bien',
      value: 'baja',
      icon: () => (
        <MaterialCommunityIcons
          name="archive-arrow-down-outline"
          size={18}
          color="#ef4444" // color-red-500
        />
      ),
    },
    {
      label: 'Otra Solicitud',
      value: 'otra',
      icon: () => (
        <MaterialCommunityIcons
          name="comment-question-outline"
          size={18}
          color="gray"
        />
      ),
    },
  ]);

  // Tema para el TextInput de justificación
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#a855f7', // Púrpura, a juego con el botón
      background: isDarkMode ? '#2d2d2d' : '#f0f0f0',
      onSurface: 'gray',
      onSurfaceVariant: 'gray',
    },
  };

  if (!bien) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-black/60 px-5" // <--- Clases movidas aquí
          keyboardShouldPersistTaps="handled" // <--- Buena práctica
        >
          {/* <View className="flex-1 justify-center items-center bg-black/60 px-5"> */}
          <View className="w-full max-w-2xl bg-white dark:bg-[#14161A] border-2 border-gray-200 dark:border-1 dark:border-gray-700 rounded-xl shadow-xl p-6">
            <View className="items-center mb-4">
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={50}
                color="#a855f7" // Púrpura
              />
            </View>

            <Text className="text-gray-700 dark:text-slate-300 text-xl md:text-2xl font-bold text-center mb-2">
              Generar Solicitud
            </Text>
            <Text
              className="text-gray-600 dark:text-slate-400 text-base text-center mb-4"
              numberOfLines={2}
            >
              Estás generando una solicitud para el bien:{' '}
              <Text className="font-bold">{bien.bien_descripcion}</Text>.
            </Text>

            {/* --- Controles del Formulario --- */}
            <View style={{ zIndex: 1000 }}>
              {/* Dropdown de Tipo de Solicitud */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-3">
                <DropDownPicker
                  theme={colorScheme === 'light' ? 'LIGHT' : 'DARK'}
                  open={requestTypeOpen}
                  value={requestTypeValue}
                  items={requestTypeItems}
                  setOpen={setRequestTypeOpen}
                  setValue={setRequestTypeValue}
                  setItems={setRequestTypeItems}
                  placeholder="Selecciona un tipo de solicitud"
                  listMode="MODAL"
                  modalTitle="Tipo de Solicitud"
                  modalContentContainerStyle={{
                    backgroundColor: modalBackgroundColor,
                  }}
                  modalTitleStyle={{
                    color: modalTextColor,
                    fontWeight: 'bold',
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  textStyle={{ color: 'gray' }}
                  dropDownContainerStyle={{
                    backgroundColor:
                      colorScheme === 'light' ? '#f3f4f6' : '#2d2d2d',
                    borderColor:
                      colorScheme === 'light' ? '#f3f4f6' : '#2d2d2d',
                    borderWidth: 0.2,
                  }}
                />
              </View>

              {/* TextInput de Justificación */}
              <View className="bg-gray-100 dark:bg-[#2d2d2d] rounded-lg mb-6">
                <TextInput
                  mode="flat"
                  returnKeyType="send"
                  theme={customTheme}
                  value={justification}
                  onChangeText={setJustification}
                  label="Motivo o Justificación"
                  // multiline
                  numberOfLines={4}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name="comment-text-outline"
                          size={24}
                          color={'#a855f7'}
                        />
                      )}
                    />
                  }
                  style={{
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
            </View>

            {/* --- Fila de Botones --- */}
            <View className="flex-row justify-between">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-lg p-4 mr-2 active:bg-gray-300 dark:active:bg-gray-500"
              >
                <Text className="text-gray-800 dark:text-white text-center font-bold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                className="flex-1 bg-purple-600 rounded-lg p-4 ml-2 active:bg-purple-700"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Enviar Solicitud
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ========================================================================
// ==================         NUEVO BIENITEM         ==================
// ========================================================================
// --- Helper para las filas de detalles ---
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => {
  if (!value) return null; // No mostrar la fila si no hay valor

  return (
    <View className="flex-row items-center mb-1.5">
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color="#6b7280" // text-gray-500
        style={{ width: 20 }}
      />
      <Text
        className="text-sm text-gray-700 dark:text-slate-300 ml-2"
        numberOfLines={1}
      >
        <Text className="font-bold">{label}: </Text>
        <Text className="font-light">{value}</Text>
      </Text>
    </View>
  );
};

// --- El nuevo BienItem Chingón ---
const BienItem = ({
  item,
  onTransferPress,
  onEditPress,
  onRequestPress,
}: {
  item: DataBien;
  onTransferPress: (item: DataBien) => void;
  onRequestPress: (item: DataBien) => void;
  onEditPress: (item: DataBien) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // --- Lógica de Icono y Estado ---
  const iconName = (iconMap[item.bien_clave] || iconMap.default) as any;
  const estadoKey = item.bien_estado.toLowerCase();
  const estadoStyleBg = bienEstadosBg[estadoKey] || bienEstadosBg.default;
  const estadoStyleText =
    bienEstadosTexto[estadoKey] || bienEstadosTexto.default;

  const estadoDotColor = {
    activo: 'bg-green-500',
    mantenimiento: 'bg-yellow-500',
    inactivo: 'bg-red-500',
    transaccion: 'bg-gray-500',
  }[estadoKey];

  const iconBgColor = isDark ? 'bg-blue-900/40' : 'bg-blue-100/80';
  const iconColor = isDark ? '#60a5fa' : '#2563eb';

  // --- Función de Toggle con Animación ---
  const toggleExpand = () => {
    // ¡La magia!
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    // La tarjeta principal, en lugar de ser Pressable, contiene el Pressable
    <View className="px-4 mb-3">
      <View className="w-full bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/5 overflow-hidden">
        {/* === SECCIÓN SUPERIOR (HEADER) === */}
        <Pressable
          onPress={toggleExpand}
          className="p-4"
          android_ripple={{ color: isDark ? '#333' : '#eee' }}
        >
          {/* Fila de Icono, Título y Estado */}
          <View className="flex-row items-center">
            {/* Icono */}
            <View
              className={`w-12 h-12 rounded-lg items-center justify-center ${iconBgColor} mr-3`}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={28}
                color={iconColor}
              />
            </View>

            {/* Código y Descripción */}
            <View className="flex-1 mr-2">
              <Text
                className="text-base font-bold text-gray-800 dark:text-slate-200"
                numberOfLines={1}
              >
                {item.bien_codigo}
              </Text>
              <Text
                className="text-sm text-gray-500 dark:text-slate-400"
                numberOfLines={4}
              >
                {item.bien_descripcion}
              </Text>
            </View>

            {/* Píldora de Estado */}
            <View
              className={`flex-row items-center rounded-full px-2.5 py-1 ${estadoStyleBg}`}
            >
              <View
                className={`w-2 h-2 rounded-full ${estadoDotColor} mr-1.5`}
              />
              <Text
                className={`text-xs font-bold uppercase ${estadoStyleText}`}
              >
                {item.bien_estado}
              </Text>
            </View>
          </View>

          {/* === SECCIÓN DE RESUMEN (SIEMPRE VISIBLE) === */}
          <View className="flex-row justify-between mt-4">
            {/* Marca y Modelo */}
            <View className="flex-1 mr-2">
              <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                Marca / Modelo
              </Text>
              <Text
                className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                numberOfLines={2}
              >
                {item.bien_marca.replace(/"/g, '')} / {item.bien_modelo}
              </Text>
            </View>
            {/* Ubicación */}
            <View className="flex-1 ml-2">
              <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                Ubicación
              </Text>
              <Text
                className="text-sm font-semibold text-gray-700 dark:text-slate-300"
                numberOfLines={1}
              >
                {item.bien_ubicacion_actual}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* === SECCIÓN EXPANDIBLE (DETALLES) === */}
        {isExpanded && (
          <View className="px-4 pb-4">
            <View className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
            <DetailRow icon="barcode" label="Serie" value={item.bien_serie} />
            <DetailRow
              icon="cash"
              label="Valor"
              value={`$ ${Number(item.bien_valor_monetario).toFixed(2)}`}
            />
            <DetailRow
              icon="calendar-check"
              label="Fecha Alta"
              value={new Date(item.bien_fecha_alta).toLocaleDateString(
                'es-MX',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                },
              )}
            />
            <DetailRow
              icon="key-variant"
              label="Clave"
              value={item.bien_clave}
            />
            <DetailRow
              icon="file-document-outline"
              label="Factura"
              value={item.bien_numero_factura}
            />
            <DetailRow
              icon="truck-delivery-outline"
              label="Proveedor"
              value={item.bien_provedor}
            />
            <DetailRow
              icon="tag-outline"
              label="Tipo Adquisición"
              value={item.bien_tipo_adquisicion}
            />
            <DetailRow
              icon="counter"
              label="Secuencia"
              value={item.bien_secuencia}
            />
          </View>
        )}

        {/* === SECCIÓN DE BOTONES (PIE DE PÁGINA) === */}
        <View className="flex-row border-t border-gray-200 dark:border-gray-700">
          {/* Botón de Editar */}
          <Pressable
            onPress={() => onEditPress(item)}
            className="flex-1 flex-row items-center justify-center p-3 active:bg-emerald-100 dark:active:bg-emerald-700 border-r border-gray-200 dark:border-gray-700"
          >
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={18}
              color="#10b981" // emerald-500
            />
            <Text className="text-emerald-500 dark:text-emerald-400 font-bold text-sm ml-1.5">
              Editar
            </Text>
          </Pressable>

          {/* Botón de Traspasar */}
          <Pressable
            onPress={() => onTransferPress(item)}
            className="flex-1 flex-row items-center justify-center p-3 active:bg-blue-100 dark:active:bg-blue-700 border-r border-gray-200 dark:border-gray-700"
          >
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={18}
              color="#3B82F6" // blue-500
            />
            <Text className="text-blue-500 dark:text-blue-400 font-bold text-sm ml-1.5">
              Traspasar
            </Text>
          </Pressable>

          {/* Botón de Movimiento */}
          <Pressable
            onPress={() => onRequestPress(item)}
            className="flex-1 flex-row items-center justify-center p-3 active:bg-purple-100 dark:active:bg-purple-700"
          >
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={18}
              color="#c084fc" // purple-500
            />
            <Text className="text-purple-500 dark:text-purple-400 font-bold text-sm ml-1.5">
              Mover a...
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// ========================================================================
// ==================       FIN DEL NUEVO BIENITEM       ==================
// ========================================================================

export function Gest_InfoResguardante(res_id_usuario: string) {
  const insets = useSafeAreaInsets();
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const miResguardante = dataResguardantes[0];

  const [valueTextInp, setValueTextInp] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [itemsTipo, setTipo] = useState([
    {
      label: 'Sin filtro',
      value: 'sin-filtro',
      icon: () => (
        <MaterialCommunityIcons
          name="filter-variant-remove"
          size={18}
          color={'gray'}
        />
      ),
    },
    {
      label: 'Activo',
      value: 'activo',
      icon: () => (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={18}
          color="#4ade80"
        />
      ),
    },
    {
      label: 'Inactivo',
      value: 'inactivo',
      icon: () => (
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={18}
          color="#ef4444"
        />
      ),
    },
    {
      label: 'Mantenimiento',
      value: 'mantenimiento',
      icon: () => (
        <MaterialCommunityIcons
          name="progress-wrench"
          size={18}
          color="#FFA500"
        />
      ),
    },
    {
      label: 'Transaccion',
      value: 'transaccion',
      icon: () => (
        <MaterialCommunityIcons name="transfer" size={18} color="gray" />
      ),
    },
  ]);

  const [isTransferModalVisible, setTransferModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isRequestModalVisible, setRequestModalVisible] = useState(false);
  const [selectedBien, setSelectedBien] = useState<DataBien | null>(null);

  const displayedData = useMemo(() => {
    let filteredData = dataBienes;
    const searchTerm = valueTextInp.toLowerCase().trim();

    if (value && value !== 'sin-filtro') {
      filteredData = filteredData.filter(
        (bien) => bien.bien_estado.toLowerCase() === value,
      );
    }

    if (searchTerm.length > 0) {
      filteredData = filteredData.filter((bien) => {
        return Object.entries(bien).some(([key, fieldValue]) => {
          if (key === 'bien_estado') {
            return false;
          }
          return String(fieldValue).toLowerCase().includes(searchTerm);
        });
      });
    }

    return filteredData;
  }, [value, valueTextInp]); // Se recalcula si 'value' (dropdown) o 'valueTextInp' (buscador) cambian

  const EmptyListComponent = () => {
    let message = 'No hay bienes asignados para mostrar.';
    const searchTerm = valueTextInp.trim();

    if (searchTerm.length > 0) {
      message = `No se encontraron bienes que coincidan con "${searchTerm}".`;
    } else if (value && value !== 'sin-filtro') {
      const filterLabel =
        itemsTipo.find((item) => item.value === value)?.label || value;
      message = `No hay bienes con el estado: "${filterLabel}".`;
    }

    return (
      <View className="items-center pt-20">
        <View className="w-10/12 landscape:w-10/12 md:w-10/12 items-center p-4 bg-white dark:bg-[#14161A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ios:shadow-sm shadow-gray-600">
          <MaterialCommunityIcons
            name="information-outline"
            size={50}
            color="gray"
          />
          <Text className="text-gray-500 dark:text-slate-400 text-xl text-center mt-2">
            {message}
          </Text>
        </View>
      </View>
    );
  };

  const handleOpenTransfer = (bien: DataBien) => {
    setSelectedBien(bien);
    setTransferModalVisible(true);
  };
  const handleCloseTransfer = () => {
    setTransferModalVisible(false);
    setSelectedBien(null);
  };
  const handleConfirmTransfer = () => {
    // Lógica para enviar a la API...
    console.log('Confirmado traspaso de:', selectedBien?.bien_codigo);
    handleCloseTransfer();
  };

  const handleOpenEdit = (bien: DataBien) => {
    setSelectedBien(bien);
    setEditModalVisible(true);
  };
  const handleCloseEdit = () => {
    setEditModalVisible(false);
    setSelectedBien(null);
  };
  const handleConfirmEdit = (updatedBien: DataBien) => {
    // Aquí iría tu lógica de API para enviar la solicitud
    console.log(
      'Confirmado Editado correctamente para:',
      selectedBien?.bien_codigo,
    );
    console.log('Nuevos datos:', updatedBien);
    // Aquí llamarías a tu API: await updateBienAPI(updatedBien);
    // Y luego, al recibir éxito, refrescarías la lista
    handleCloseEdit();
  };

  const handleOpenRequest = (bien: DataBien) => {
    setSelectedBien(bien);
    setRequestModalVisible(true);
  };
  const handleCloseRequest = () => {
    setRequestModalVisible(false);
    setSelectedBien(null);
  };
  const handleConfirmRequest = () => {
    // Lógica para enviar a la API
    console.log('Confirmado solicitud de:', selectedBien?.bien_codigo);
    handleCloseRequest();
  };

  return (
    <StyleGlobal>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingBehavior}
      >
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
            data={displayedData}
            ListHeaderComponent={
              <>
                <Header dataWorkPlace={dataWorkPlace} />
                <ResguardanteHeader itemResguardante={miResguardante} />
                <Filtros
                  searchValue={valueTextInp}
                  onSearchChange={setValueTextInp}
                  filterOpen={open}
                  setFilterOpen={setOpen}
                  filterValue={value}
                  setFilterValue={setValue}
                  filterItems={itemsTipo}
                  setFilterItems={setTipo}
                />
              </>
            }
            renderItem={({ item }) => (
              <BienItem
                item={item}
                onTransferPress={handleOpenTransfer}
                onEditPress={handleOpenEdit}
                onRequestPress={handleOpenRequest}
              />
            )}
            keyExtractor={(item) => item.bien_codigo}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={EmptyListComponent}
          />
        </View>
      </KeyboardAvoidingView>

      <TransferModal
        visible={isTransferModalVisible}
        bien={selectedBien}
        onClose={handleCloseTransfer}
        onConfirm={handleConfirmTransfer}
      />

      <EditModal
        visible={isEditModalVisible}
        bien={selectedBien}
        onClose={handleCloseEdit}
        onConfirmEdit={handleConfirmEdit}
      />

      <RequestModal
        visible={isRequestModalVisible}
        bien={selectedBien}
        onClose={handleCloseRequest}
        onConfirm={handleConfirmRequest}
      />
    </StyleGlobal>
  );
}
