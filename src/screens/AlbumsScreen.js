import React, { useState } from 'react';
import { FlatList, Image, Modal, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from '../components/Press';
import { type } from '../theme';

export default function AlbumsScreen({ albums, byId, onOpen, onCreate, onDelete, t }) {
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const { width } = useWindowDimensions();
  const size = (width - 16 * 3) / 2;
  const submit = () => { if (name.trim()) onCreate(name.trim()); setName(''); setNaming(false); };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={[type.large, { color: t.label }]}>Albums</Text>
        <Press onPress={() => setNaming(true)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="add" size={24} color={t.tint} />
        </Press>
      </View>
      <FlatList data={albums} numColumns={2} keyExtractor={(a) => a.id} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ color: t.secondary, textAlign: 'center', marginTop: 60 }}>No albums yet. Tap + to create one.</Text>}
        renderItem={({ item, index }) => {
          const cover = byId[item.assetIds[item.assetIds.length - 1]];
          return (
            <Press scale={0.97} hitSlop={0} onPress={() => onOpen(item.id)} onLongPress={() => onDelete(item.id)} style={{ width: size, marginRight: index % 2 === 0 ? 16 : 0, marginBottom: 20 }}>
              <View style={{ width: size, height: size, borderRadius: 14, backgroundColor: t.card, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                {cover ? <Image source={{ uri: cover.uri }} style={{ width: '100%', height: '100%' }} /> : <Ionicons name="images-outline" size={36} color={t.secondary} />}
              </View>
              <Text style={{ color: t.label, fontSize: 15, fontWeight: '600', marginTop: 6 }} numberOfLines={1}>{item.name}</Text>
              <Text style={{ color: t.secondary, fontSize: 13 }}>{item.assetIds.length}</Text>
            </Press>
          );
        }} />
      <Modal visible={naming} transparent animationType="fade" onRequestClose={() => setNaming(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 }}>
          <View style={{ backgroundColor: t.bg, borderRadius: 20, padding: 20 }}>
            <Text style={[type.title, { color: t.label, textAlign: 'center' }]}>New Album</Text>
            <TextInput autoFocus value={name} onChangeText={setName} placeholder="Title" placeholderTextColor={t.secondary} onSubmitEditing={submit}
              style={{ backgroundColor: t.card, color: t.label, borderRadius: 10, padding: 12, marginVertical: 16, fontSize: 17 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 24 }}>
              <Press onPress={() => setNaming(false)}><Text style={{ color: t.tint, fontSize: 17 }}>Cancel</Text></Press>
              <Press onPress={submit}><Text style={{ color: t.tint, fontSize: 17, fontWeight: '700' }}>Save</Text></Press>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
