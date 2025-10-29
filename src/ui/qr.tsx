import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function QR() {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: inset.top,
        paddingLeft: inset.left,
        paddingRight: inset.right,
        paddingBottom: inset.bottom,
      }}
    >
      <Text>QR</Text>
    </View>
  );
}
