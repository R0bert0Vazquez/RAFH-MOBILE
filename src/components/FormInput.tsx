import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const FormInput = ({
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
