import { useColorScheme } from 'react-native';
const light = { bg: '#FFFFFF', card: '#F2F2F7', label: '#000000', secondary: '#8E8E93', tint: '#007AFF', sep: 'rgba(60,60,67,0.18)', glass: 'rgba(242,242,247,0.94)', danger: '#FF3B30' };
const dark = { bg: '#000000', card: '#1C1C1E', label: '#FFFFFF', secondary: '#8E8E93', tint: '#0A84FF', sep: 'rgba(84,84,88,0.6)', glass: 'rgba(44,44,46,0.95)', danger: '#FF453A' };
export const useTheme = () => ({ ...(useColorScheme() === 'dark' ? dark : light) });
export const type = {
  large: { fontSize: 34, fontWeight: '700', letterSpacing: 0.3 },
  title: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 17 },
  caption: { fontSize: 13 },
};
