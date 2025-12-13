import {
  View,
  Text,
  Modal,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Access_token } from '@/src/models/types';
import { AreaResponse } from '@/src/models/types_AreaResponse';
import {
  StructureResponse,
  StructureOficina,
} from '@/src/models/types_Structure';
import {
  getAreas,
  getStructure,
} from '@/src/controllers/controllers_gestor/selectOficina.controller';

interface SelectOficinaProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (oficina: {
    id: number;
    nombre: string;
    codigo: string;
    id_dep: number;
  }) => void;
  access_token: string;
}

export function Select_Oficina_DropDown({
  visible,
  onClose,
  onSelect,
  access_token,
}: SelectOficinaProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // --- Estados de Carga ---
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingStructure, setLoadingStructure] = useState(false);

  // --- Estados de Datos (Listas para Dropdowns) ---
  const [itemsArea, setItemsArea] = useState<
    { label: string; value: number }[]
  >([]);
  const [itemsDepto, setItemsDepto] = useState<
    { label: string; value: number }[]
  >([]);
  const [itemsOficina, setItemsOficina] = useState<
    { label: string; value: number }[]
  >([]);

  // --- Cache de Estructura ---
  const [fullStructure, setFullStructure] = useState<StructureResponse>([]);
  const [fullOficinas, setFullOficinas] = useState<StructureOficina[]>([]);

  // --- Estados de Selección (Values) ---
  const [valueArea, setValueArea] = useState<number | null>(null);
  const [valueDepto, setValueDepto] = useState<number | null>(null);
  const [valueOficina, setValueOficina] = useState<number | null>(null);

  // --- Estados de Apertura (Open) ---
  const [openArea, setOpenArea] = useState(false);
  const [openDepto, setOpenDepto] = useState(false);
  const [openOficina, setOpenOficina] = useState(false);

  // --- Funciones de Carga con useCallback (SOLUCIÓN AL ERROR) ---
  const loadAreas = useCallback(async () => {
    setLoadingAreas(true);
    try {
      const credenciales: Access_token = { access_token };
      const response: AreaResponse = await getAreas(credenciales);

      const formattedAreas = response.map((area) => ({
        label: area.area_nombre,
        value: area.id,
      }));
      setItemsArea(formattedAreas);
    } catch (error) {
      console.error('Error cargando áreas:', error);
      Alert.alert('Error', 'No se pudieron cargar las áreas.');
    } finally {
      setLoadingAreas(false);
    }
  }, [access_token]); // Dependencia: si cambia el token, recreamos la función

  const loadStructure = useCallback(
    async (areaId: number) => {
      setLoadingStructure(true);
      try {
        const credenciales: Access_token = { access_token };
        const response: StructureResponse = await getStructure(
          credenciales,
          areaId,
        );

        setFullStructure(response);

        const formattedDeptos = response.map((depto) => ({
          label: depto.dep_nombre,
          value: depto.id,
        }));
        setItemsDepto(formattedDeptos);
      } catch (error) {
        console.error('Error cargando estructura:', error);
        Alert.alert('Error', 'No se pudieron cargar los departamentos.');
      } finally {
        setLoadingStructure(false);
      }
    },
    [access_token],
  );

  // --- Efectos ---
  // 1. Cargar Áreas al abrir el modal
  useEffect(() => {
    if (visible) {
      loadAreas();
    }
  }, [visible, loadAreas]); // Ahora sí incluimos loadAreas sin miedo al loop

  // --- Handlers de Cambio ---
  const handleAreaChange = async (areaId: number | null) => {
    if (!areaId) return;

    setValueDepto(null);
    setValueOficina(null);
    setItemsDepto([]);
    setItemsOficina([]);

    // Llamamos a la función memorizada
    loadStructure(areaId);
  };

  const handleDeptoChange = (deptoId: number | null) => {
    if (!deptoId) return;

    setValueOficina(null);

    const selectedDeptoData = fullStructure.find((d) => d.id === deptoId);

    if (selectedDeptoData && selectedDeptoData.oficinas) {
      const oficinasFormatted = selectedDeptoData.oficinas.map((ofi) => ({
        label: ofi.nombre,
        value: ofi.id,
      }));
      setItemsOficina(oficinasFormatted);
      setFullOficinas(selectedDeptoData.oficinas);
    } else {
      setItemsOficina([]);
    }
  };

  // const handleConfirm = () => {
  //   if (valueOficina && fullOficinas.length > 0) {
  //     const selectedOfiData = fullOficinas.find((o) => o.id === valueOficina);
  //     if (selectedOfiData) {
  //       onSelect({
  //         id: selectedOfiData.id,
  //         nombre: selectedOfiData.nombre,
  //         codigo: selectedOfiData.ofi_codigo,
  //         id_dep: selectedOfiData.id_departamento,
  //       });
  //       onClose();
  //     }
  //   }
  // };

  const handleConfirm = () => {
    if (valueOficina && fullOficinas.length > 0) {
      const selectedOfiData = fullOficinas.find((o) => o.id === valueOficina);
      if (selectedOfiData) {
        // CORRECCIÓN: Cerrar todos los dropdowns explícitamente antes de cerrar el modal
        setOpenArea(false);
        setOpenDepto(false);
        setOpenOficina(false);

        onSelect({
          id: selectedOfiData.id,
          nombre: selectedOfiData.nombre,
          codigo: selectedOfiData.ofi_codigo,
          id_dep: selectedOfiData.id_departamento,
        });
        onClose();
      }
    }
  };

  // --- Control de Z-Index ---
  const onOpenArea = useCallback(() => {
    setOpenDepto(false);
    setOpenOficina(false);
  }, []);

  const onOpenDepto = useCallback(() => {
    setOpenArea(false);
    setOpenOficina(false);
  }, []);

  const onOpenOficina = useCallback(() => {
    setOpenArea(false);
    setOpenDepto(false);
  }, []);

  // --- Estilos Dinámicos "Chingones" ---
  // Colores mejorados para mayor contraste y visibilidad
  const dropdownTheme = {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF', // Gris oscuro vs Blanco puro
    borderColor: isDark ? '#374151' : '#E5E7EB', // Bordes sutiles
    textColor: isDark ? '#F3F4F6' : '#111827', // Texto casi blanco vs casi negro
    placeholderColor: isDark ? '#9CA3AF' : '#6B7280', // Gris medio para placeholder
    separatorColor: isDark ? '#374151' : '#F3F4F6',
  };

  const dropdownStyle = {
    backgroundColor: dropdownTheme.backgroundColor,
    borderColor: dropdownTheme.borderColor,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 50,
  };

  const dropdownContainerStyle = {
    backgroundColor: dropdownTheme.backgroundColor,
    borderColor: dropdownTheme.borderColor,
    borderWidth: 1,
  };

  const textStyle = {
    color: dropdownTheme.textColor,
    fontWeight: '500' as const,
    fontSize: 15,
  };

  const placeholderStyle = {
    color: dropdownTheme.placeholderColor,
    fontSize: 15,
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View
            className="bg-white dark:bg-[#14161A] w-full rounded-t-3xl p-6 shadow-2xl border-t border-gray-200 dark:border-gray-700 h-[85%] md:h-[70%]"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {/* Header del Modal */}
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    Selecciona la Oficina
                  </Text>
                  {/* <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Selecciona dónde realizarás el inventario.
                  </Text> */}
                </View>
                <Pressable
                  onPress={onClose}
                  className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={isDark ? '#fff' : '#374151'}
                  />
                </Pressable>
              </View>

              {/* --- AREA DROPDOWN (Z-Index 3000) --- */}
              <View className="mb-6 z-30">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 ml-1 text-base">
                  Área
                </Text>
                <DropDownPicker
                  open={openArea}
                  value={valueArea}
                  items={itemsArea}
                  setOpen={setOpenArea}
                  setValue={setValueArea}
                  setItems={setItemsArea}
                  onOpen={onOpenArea}
                  onChangeValue={handleAreaChange}
                  loading={loadingAreas}
                  placeholder="Selecciona un Área"
                  searchable={true}
                  searchPlaceholder="Buscar área..."
                  translation={{ NOTHING_TO_SHOW: 'No se encontraron áreas.' }}
                  theme={isDark ? 'DARK' : 'LIGHT'}
                  // listMode="SCROLLVIEW"
                  listMode={Platform.OS === 'ios' ? 'SCROLLVIEW' : 'MODAL'}
                  scrollViewProps={{ nestedScrollEnabled: true }}
                  style={dropdownStyle}
                  dropDownContainerStyle={dropdownContainerStyle}
                  textStyle={textStyle}
                  placeholderStyle={placeholderStyle}
                  zIndex={3000}
                  zIndexInverse={1000}
                  itemSeparator={true}
                  itemSeparatorStyle={{
                    backgroundColor: dropdownTheme.separatorColor,
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: isDark ? '#374151' : '#EFF6FF', // Highlight sutil
                  }}
                  selectedItemLabelStyle={{
                    fontWeight: 'bold',
                    color: isDark ? '#60A5FA' : '#2563EB', // Azul activo
                  }}
                  ArrowDownIconComponent={({ style }) => (
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={24}
                      color={dropdownTheme.placeholderColor}
                      style={style}
                    />
                  )}
                  ArrowUpIconComponent={({ style }) => (
                    <MaterialCommunityIcons
                      name="chevron-up"
                      size={24}
                      color={dropdownTheme.placeholderColor}
                      style={style}
                    />
                  )}
                  TickIconComponent={({ style }) => (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={isDark ? '#60A5FA' : '#2563EB'}
                      style={style}
                    />
                  )}
                />
              </View>

              {/* --- DEPTO DROPDOWN (Z-Index 2000) --- */}
              <View className="mb-6 z-20">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 ml-1 text-base">
                  Departamento
                </Text>
                <DropDownPicker
                  open={openDepto}
                  value={valueDepto}
                  items={itemsDepto}
                  setOpen={setOpenDepto}
                  setValue={setValueDepto}
                  setItems={setItemsDepto}
                  onOpen={onOpenDepto}
                  onChangeValue={handleDeptoChange}
                  loading={loadingStructure}
                  placeholder={
                    valueArea
                      ? 'Selecciona un Departamento'
                      : 'Primero selecciona un Área'
                  }
                  disabled={!valueArea}
                  searchable={true}
                  searchPlaceholder="Buscar departamento..."
                  translation={{
                    NOTHING_TO_SHOW: 'No se encontraron departamentos.',
                  }}
                  theme={isDark ? 'DARK' : 'LIGHT'}
                  // listMode="SCROLLVIEW"
                  listMode={Platform.OS === 'ios' ? 'SCROLLVIEW' : 'MODAL'}
                  scrollViewProps={{ nestedScrollEnabled: true }}
                  style={{
                    ...dropdownStyle,
                    opacity: !valueArea ? 0.5 : 1, // Más transparente si está disabled
                  }}
                  dropDownContainerStyle={dropdownContainerStyle}
                  textStyle={textStyle}
                  placeholderStyle={placeholderStyle}
                  zIndex={2000}
                  zIndexInverse={2000}
                  itemSeparator={true}
                  itemSeparatorStyle={{
                    backgroundColor: dropdownTheme.separatorColor,
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: isDark ? '#374151' : '#EFF6FF',
                  }}
                  selectedItemLabelStyle={{
                    fontWeight: 'bold',
                    color: isDark ? '#60A5FA' : '#2563EB',
                  }}
                />
              </View>

              {/* --- OFICINA DROPDOWN (Z-Index 1000) --- */}
              <View className="mb-10 z-10">
                <Text className="text-gray-700 dark:text-gray-300 font-bold mb-2 ml-1 text-base">
                  Oficina
                </Text>
                <DropDownPicker
                  open={openOficina}
                  value={valueOficina}
                  items={itemsOficina}
                  setOpen={setOpenOficina}
                  setValue={setValueOficina}
                  setItems={setItemsOficina}
                  onOpen={onOpenOficina}
                  placeholder={
                    valueDepto
                      ? 'Selecciona una Oficina'
                      : 'Esperando Departamento...'
                  }
                  disabled={!valueDepto}
                  searchable={true}
                  searchPlaceholder="Buscar oficina..."
                  translation={{
                    NOTHING_TO_SHOW: 'No se encontraron oficinas.',
                  }}
                  theme={isDark ? 'DARK' : 'LIGHT'}
                  // listMode="SCROLLVIEW"
                  listMode={Platform.OS === 'ios' ? 'SCROLLVIEW' : 'MODAL'}
                  scrollViewProps={{ nestedScrollEnabled: true }}
                  // Esto ayuda a que si no cabe abajo, intente abrirse arriba si es necesario,
                  // aunque con el paddingBottom extra ya debería caber abajo.
                  dropDownDirection="BOTTOM"
                  style={{
                    ...dropdownStyle,
                    opacity: !valueDepto ? 0.5 : 1,
                  }}
                  dropDownContainerStyle={dropdownContainerStyle}
                  textStyle={textStyle}
                  placeholderStyle={placeholderStyle}
                  zIndex={1000}
                  zIndexInverse={3000}
                  itemSeparator={true}
                  itemSeparatorStyle={{
                    backgroundColor: dropdownTheme.separatorColor,
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: isDark ? '#374151' : '#EFF6FF',
                  }}
                  selectedItemLabelStyle={{
                    fontWeight: 'bold',
                    color: isDark ? '#60A5FA' : '#2563EB',
                  }}
                />
              </View>

              {/* --- Botón de Confirmar --- */}
              <View className="mt-auto mb-6">
                <Pressable
                  onPress={handleConfirm}
                  disabled={!valueOficina}
                  className={`w-full py-4 rounded-xl shadow-lg flex-row justify-center items-center ${
                    valueOficina
                      ? 'bg-blue-600 dark:bg-blue-600 active:bg-blue-700'
                      : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                >
                  <Text
                    className={`font-bold text-lg mr-2 ${
                      valueOficina
                        ? 'text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    Confirmar Ubicación
                  </Text>
                  {valueOficina && (
                    <MaterialCommunityIcons
                      name="check"
                      size={24}
                      color="white"
                    />
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
