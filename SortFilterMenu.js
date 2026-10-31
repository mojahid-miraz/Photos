import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';

const SORTS = [['oldest', 'Oldest', 'time-outline'], ['newest', 'Newest', 'time-outline'], ['added', 'Added', 'add-circle-outline']];
const MEDIA = [['photo', 'Photos', 'image-outline'], ['video', 'Videos', 'videocam-outline']];

export default function SortFilterMenu({ visible, onClose, sort, setSort, filter, setFilter, t }) {
  const [media, setMedia] = useState(false);
  const row = { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, gap: 12 };
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View style={{ position: 'absolute', top: 100, right: 16, width: 290, borderRadius: 26, backgroundColor: t.glass, paddingVertical: 8, elevation: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 8 }}>
            {SORTS.map(([k, label, icon]) => (
              <Press key={k} onPress={() => setSort(k)} style={{ alignItems: 'center', padding: 10, borderRadius: 16, backgroundColor: sort === k ? t.sep : 'transparent', minWidth: 80 }}>
                <Ionicons name={icon} size={22} color={t.secondary} />
                <Text style={{ color: t.secondary, fontSize: 13, marginTop: 4 }}>{label}</Text>
              </Press>
            ))}
          </View>
          <View style={{ height: 1, backgroundColor: t.sep, marginHorizontal: 18 }} />
          <Text style={{ color: t.secondary, paddingHorizontal: 18, paddingTop: 12 }}>Filter:</Text>
          <Press scale={0.98} style={row} onPress={() => { setFilter('all'); onClose(); }}>
            <Ionicons name="checkmark" size={18} color={filter === 'all' ? t.label : 'transparent'} />
            <Ionicons name="apps-outline" size={20} color={t.label} />
            <Text style={{ color: t.label, fontSize: 17 }}>All Items</Text>
          </Press>
          <Press scale={0.98} style={row} onPress={() => setMedia(!media)}>
            <View style={{ width: 18 }} />
            <Ionicons name="images-outline" size={20} color={t.label} />
            <Text style={{ color: t.label, fontSize: 17, flex: 1 }}>Media Types</Text>
            <Ionicons name={media ? 'chevron-down' : 'chevron-forward'} size={18} color={t.secondary} />
          </Press>
          {media && MEDIA.map(([k, label, icon]) => (
            <Press key={k} scale={0.98} style={[row, { paddingLeft: 36 }]} onPress={() => { setFilter(k); setMedia(false); onClose(); }}>
              <Ionicons name="checkmark" size={18} color={filter === k ? t.label : 'transparent'} />
              <Ionicons name={icon} size={20} color={t.label} />
              <Text style={{ color: t.label, fontSize: 17 }}>{label}</Text>
            </Press>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
