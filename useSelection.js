import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export function useSelection() {
  const [selected, setSelected] = useState(new Set());
  const toggle = useCallback((id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  return { selected, toggle, clear, setSelected };
}

export async function shareAssets(assets) {
  if (!(await Sharing.isAvailableAsync())) return Alert.alert('Sharing is not available on this device');
  for (const a of assets) {
    try {
      const info = await MediaLibrary.getAssetInfoAsync(a);
      await Sharing.shareAsync(info.localUri || a.uri);
    } catch (e) { Alert.alert('Could not share', String(e.message || e)); break; }
  }
}
