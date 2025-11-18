import { View, Text, Image } from 'react-native';
import { DataWorkPlace } from '@/src/models/types';

interface HeaderProps {
  dataWorkPlace: DataWorkPlace;
}

export function Header({ dataWorkPlace }: HeaderProps) {
  return (
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
}
