import React, { useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import PhotoGrid from '../components/PhotoGrid';
import Press from '../components/Press';
import SelectionBar from '../components/SelectionBar';
import SelectedSheet from '../components/SelectedSheet';
import Viewer from '../components/Viewer';
import { shareAssets, useSelection } from '../useSelection';
import { type } from '../theme';

export default function LibraryScreen({ lib, t, onSelecting }) {
  const { assets, perm, requestPerm, reload } = lib;
  const [selecting, setSelecting] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState(null);
  const sel = useSelection();
  const chosen = useMemo(() => assets.filter((a) => sel.selected.has(a.id)), [assets, sel.selected]);

  const setMode = (v) => { setSelecting(v); onSelecting(v); if (!v) sel.clear(); };
  useEffect(() => {
    const h = BackHandler.addEventListener('hardwareBackPress', () => { if (selecting) { setMode(false); return true; } return false; });
    return () => h.remove();
  }, [selecting]);

  if (!perm?.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Ionicons name="images" size={64} color={t.tint} />
        <Text style={[type.title, { color: t.label, marginTop: 16 }]}>Access Your Photos</Text>
        <Text style={{ color: t.secondary, textAlign: 'center', marginVertical: 8 }}>Allow access to browse your library.</Text>
        <Press onPress={requestPerm} style={{ backgroundColor: t.tint, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, marginTop: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Allow Access</Text>
        </Press>
      </View>
    );
  }

  const deleteChosen = () => Alert.alert(`Delete ${chosen.length} item(s)?`, 'This removes them from your device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => { try { await MediaLibrary.deleteAssetsAsync(chosen); await reload(); setMode(false); } catch (e) {} } },
  ]);

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}>
      <View>
        <Text style={[type.large, { color: t.label }]}>Library</Text>
        <Text style={{ color: t.secondary, fontSize: 15, fontWeight: '600' }}>{assets.length} Items</Text>
      </View>
      <Press onPress={() => setMode(!selecting)} style={{ height: 40, minWidth: 40, paddingHorizontal: 18, borderRadius: 20, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
        {selecting ? <Ionicons name="close" size={22} color={t.label} /> : <Text style={{ color: t.label, fontSize: 16, fontWeight: '500' }}>Select</Text>}
      </Press>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PhotoGrid data={assets} selecting={selecting} selected={sel.selected} t={t} header={header}
        onLongPress={(i) => { if (!selecting) { setMode(true); sel.toggle(i.id); } }}
        onPress={(i) => (selecting ? sel.toggle(i.id) : setOpen(i))} />
      {selecting && <SelectionBar t={t} count={sel.selected.size} onShare={() => shareAssets(chosen)} onShow={() => setSheet(true)} onDanger={deleteChosen} />}
      <SelectedSheet visible={sheet} items={chosen} selected={sel.selected} onToggle={sel.toggle} onDeselectAll={sel.clear} onClose={() => setSheet(false)} t={t} />
      <Viewer asset={open} onClose={() => setOpen(null)} />
    </View>
  );
}
