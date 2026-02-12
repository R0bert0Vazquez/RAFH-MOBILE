import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  AreaItem,
  DepartamentoItem,
  OficinaSimple,
} from '@/src/models/types_SelectOfficeInCascade';

import { useSelectOfficeInCascadeControllers } from '@/src/controllers/controllers_gestor/selectOfficeInCascade.controller';

interface SelectOfficeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (oficina: { id: number; nombre: string; codigo: string }) => void;
  access_token: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function Select_Office_In_Cascade({
  visible,
  onClose,
  onSelect,
  access_token,
  onSuccess,
  onError,
}: SelectOfficeProps) {
  // HOOK: Usamos el hook aqui dentro para tener acceso a las funciones del controlador
  const { getAreas, getEstructuraArea } = useSelectOfficeInCascadeControllers();

  const [step, setStep] = useState(1); // 1: Area, 2: Depto, 3: Oficina
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [deptos, setDeptos] = useState<DepartamentoItem[]>([]);
  const [oficinas, setOficinas] = useState<OficinaSimple[]>([]);

  const [selectedArea, setSelectedArea] = useState<AreaItem | null>(null);
  const [selectedDepto, setSelectedDepto] = useState<DepartamentoItem | null>(
    null,
  );
  const [selectedOficina, setSelectedOficina] = useState<OficinaSimple | null>(
    null,
  );

  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setAreas([]);
      setDeptos([]);
      setOficinas([]);
      setSelectedArea(null);
      setSelectedDepto(null);
      setSelectedOficina(null);
      loadAreas();
    }
  }, [visible]);

  const loadAreas = async () => {
    setLoadingData(true);
    try {
      const data = await getAreas({ access_token: access_token });
      setAreas(data);
    } catch (e: any) {
      console.error(e);
      // Filtramos error de auth
      if (e.message !== 'Unauthenticated.') {
        onError('No se pudieron cargar las áreas');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSelectArea = async (area: AreaItem) => {
    setSelectedArea(area);
    setLoadingData(true);
    try {
      const data = await getEstructuraArea(
        { access_token: access_token },
        area.id,
      );
      setDeptos(data);
      setStep(2);
    } catch (e: any) {
      console.error('Error cargando departamentos', e);
      if (e.message !== 'Unauthenticated.') {
        onError('Error cargando departamentos');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleSelectDepto = (depto: DepartamentoItem) => {
    setSelectedDepto(depto);
    setOficinas(depto.oficinas || []);
    setStep(3);
  };

  const handleSelectOffice = () => {
    if (!selectedOficina) return;
    setSubmitting(true);

    onSelect({
      id: selectedOficina.id,
      nombre: selectedOficina.nombre,
      codigo: selectedOficina.ofi_codigo,
    });

    onClose();
    setSubmitting(false);
  };

  const renderList = (
    data: any[],
    keyName: string,
    onSelect: (item: any) => void,
  ) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      className="w-full max-h-[300px]"
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          className="p-4 border-b border-gray-200 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 flex-row justify-between items-center"
        >
          <Text className="text-gray-800 dark:text-gray-200">
            {item[keyName] || item.nombre}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
        </Pressable>
      )}
    />
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-[#14161A] rounded-t-3xl p-5 h-[80%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Seleccione la oficina
            </Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons name="close" size={28} color="gray" />
            </Pressable>
          </View>

          <Text className="text-gray-500 mb-4"></Text>

          {/* Breadcrumbs */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            <Text
              className={
                step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'
              }
            >
              1. Área
            </Text>
            <Text className="text-gray-400">{'>'}</Text>
            <Text
              className={
                step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'
              }
            >
              2. Depto
            </Text>
            <Text className="text-gray-400">{'>'}</Text>
            <Text
              className={
                step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'
              }
            >
              3. Oficina
            </Text>
          </View>

          {/* Selección Actual */}
          {(selectedArea || selectedDepto) && (
            <View className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
              {selectedArea && (
                <Text className="text-xs text-gray-500">
                  Área: {selectedArea.area_nombre}
                </Text>
              )}
              {selectedDepto && (
                <Text className="text-xs text-gray-500">
                  Depto: {selectedDepto.dep_nombre}
                </Text>
              )}
              {selectedOficina && (
                <Text className="text-sm font-bold text-blue-600 mt-1">
                  Oficina: {selectedOficina.nombre}
                </Text>
              )}
            </View>
          )}

          {loadingData ? (
            <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
          ) : (
            <>
              {step === 1 && renderList(areas, 'area_nombre', handleSelectArea)}
              {step === 2 &&
                renderList(deptos, 'dep_nombre', handleSelectDepto)}
              {step === 3 && (
                <>
                  <Text className="mb-2 font-bold text-gray-700 dark:text-gray-300">
                    Selecciona la Oficina:
                  </Text>
                  <FlatList
                    data={oficinas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => setSelectedOficina(item)}
                        className={`p-4 mb-2 rounded-lg border ${selectedOficina?.id === item.id ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <Text
                          className={`font-medium ${selectedOficina?.id === item.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {item.nombre}
                        </Text>
                      </Pressable>
                    )}
                  />
                </>
              )}
            </>
          )}

          <View className="flex-row gap-3 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {step > 1 && (
              <Pressable
                onPress={() => setStep(step - 1)}
                className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"
              >
                <Text className="text-center font-bold text-gray-700 dark:text-white">
                  Atrás
                </Text>
              </Pressable>
            )}
            {step === 3 && (
              <Pressable
                onPress={handleSelectOffice}
                disabled={!selectedOficina || submitting}
                className={`p-4 rounded-xl flex-1 ${!selectedOficina ? 'bg-gray-300' : 'bg-purple-600'}`}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center font-bold text-white">
                    Confirmar Oficina
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
