import { View, Text, Image } from 'react-native';
import { DataWorkPlace } from '@/src/models/types';

interface HeaderProps {
  dataWorkPlace: DataWorkPlace;
}

export function Header({ dataWorkPlace }: HeaderProps) {
  return (
    <View className="items-center mt-1 mb-2">
      <View className="flex-row items-center">
        <Image
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full mr-2"
          source={dataWorkPlace.image}
        />
        <Text className="text-gray-700 dark:text-slate-100 text-xl sm:text-xl md:text-4xl lg:text-4xl font-extrabold">
          {dataWorkPlace.title}
        </Text>
      </View>
    </View>
  );
}
