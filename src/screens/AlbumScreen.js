import React, { useMemo, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PhotoGrid from '../components/PhotoGrid';
import Press from '../components/Press';
import SelectionBar from '../components/SelectionBar';
import SelectedSheet from '../components/SelectedSheet';
import SortFilterMenu from '../components/SortFilterMenu';
import Viewer from '../components/Viewer';
import { shareAssets, useSelection } from '../useSelection';
import { type } from '../theme';

const Btn = ({ children, onPress, t }) => (
  <Press onPress={onPress} style={{ height: 40, minWidth: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>{children}</Press>
);

export default function AlbumScreen({ album, byId, assets, onBack, onAdd, onRemove, t }) {
  const [sort, setSort] = useState('added');
  const [filter, setFilter] = useState('all');
  const [menu, setMenu] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(false);
  const [open, setOpen] = useState(null);
  const sel = useSelection();
  const pick = useSelection();

  const items = useMemo(() => {
    let l = album.assetIds.map((id) => byId[id]).filter(Boolean);
    if (filter !== 'all') l = l.filter((a) => a.mediaType === filter);
    if (sort === 'oldest') l = [...l].sort((a, b) => a.creationTime - b.creationTime);
    else if (sort === 'newest') l = [...l].sort((a, b) => b.creationTime - a.creationTime);
    return l;
  }, [album, byId, sort, filter]);
  const chosen = items.filter((a) => sel.selected.has(a.id));
  const exit = () => { setSelecting(false); sel.clear(); };

  const header = (
    <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
      <Text style={[type.large, { color: t.label }]} numberOfLines={1}>{album.name}</Text>
      <Text style={{ color: t.secondary, fontSize: 15, fontWeight: '600' }}>{items.length} Items</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
        <Btn t={t} onPress={onBack}><Ionicons name="chevron-back" size={22} color={t.label} /></Btn>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Btn t={t} onPress={() => (selecting ? exit() : setSelecting(true))}>
            {selecting ? <Ionicons name="close" size={22} color={t.label} /> : <Text style={{ color: t.label, fontSize: 16 }}>Select</Text>}
          </Btn>
          <Btn t={t} onPress={() => setMenu(true)}><Ionicons name="ellipsis-horizontal" size={22} color={t.label} /></Btn>
        </View>
      </View>
      <PhotoGrid data={items} selecting={selecting} selected={sel.selected} t={t} header={header}
        onPress={(i) => (selecting ? sel.toggle(i.id) : setOpen(i))}
        onLongPress={(i) => { setSelecting(true); sel.toggle(i.id); }} />
      {!selecting && (
        <View style={{ position: 'absolute', right: 20, bottom: 24 }}>
          <Press onPress={() => { pick.clear(); setPicker(true); }} style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.tint, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
            <Ionicons name="add" size={30} color="#fff" />
          </Press>
        </View>
      )}
      {selecting && <SelectionBar t={t} count={sel.selected.size} dangerIcon="remove-circle-outline" onShare={() => shareAssets(chosen)} onShow={() => setSheet(true)} onDanger={() => { onRemove(chosen.map((a) => a.id)); exit(); }} />}
      <SelectedSheet visible={sheet} items={chosen} selected={sel.selected} onToggle={sel.toggle} onDeselectAll={sel.clear} onClose={() => setSheet(false)} t={t} />
      <SortFilterMenu visible={menu} onClose={() => setMenu(false)} sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} t={t} />
      <Viewer asset={open} onClose={() => setOpen(null)} />
      <Modal visible={picker} animationType="slide" onRequestClose={() => setPicker(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }}>
            <Press onPress={() => setPicker(false)}><Text style={{ color: t.tint, fontSize: 17 }}>Cancel</Text></Press>
            <Text style={[type.title, { color: t.label }]}>{pick.selected.size} Selected</Text>
            <Press onPress={() => { onAdd([...pick.selected]); setPicker(false); }}><Text style={{ color: t.tint, fontSize: 17, fontWeight: '700' }}>Add</Text></Press>
          </View>
          <PhotoGrid data={assets} selecting selected={pick.selected} onPress={(i) => pick.toggle(i.id)} t={t} footerSpace={20} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
