import React from 'react';
import { Modal, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PhotoGrid from './PhotoGrid';
import Press from './Press';
import { type } from '../theme';

export default function SelectedSheet({ visible, items, selected, onToggle, onDeselectAll, onClose, t }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', paddingTop: 48 }}>
        <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: t.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}>
            <Press onPress={onClose} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="grid-outline" size={20} color={t.label} />
            </Press>
            <Text style={[type.title, { color: t.label }]}>{items.length} Photos Selected</Text>
            <Press onPress={onClose} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: t.tint, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark" size={28} color="#fff" />
            </Press>
          </View>
          <PhotoGrid data={items} selecting selected={selected} onPress={(i) => onToggle(i.id)} t={t} />
          <View style={{ position: 'absolute', bottom: 28, alignSelf: 'center' }}>
            <Press onPress={() => { onDeselectAll(); onClose(); }} style={{ paddingHorizontal: 28, height: 46, borderRadius: 23, backgroundColor: t.glass, justifyContent: 'center', elevation: 4 }}>
              <Text style={{ color: t.label, fontSize: 17, fontWeight: '500' }}>Deselect All</Text>
            </Press>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
