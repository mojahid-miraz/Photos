import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';

export default function SelectionBar({ count, onShare, onShow, onDanger, dangerIcon = 'trash-outline', t, bottom = 24 }) {
  const circle = { width: 48, height: 48, borderRadius: 24, backgroundColor: t.glass, alignItems: 'center', justifyContent: 'center', elevation: 4 };
  return (
    <View style={{ position: 'absolute', left: 20, right: 20, bottom, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Press style={circle} onPress={onShare} disabled={!count}><Ionicons name="share-outline" size={24} color={t.tint} /></Press>
      <Press style={{ paddingHorizontal: 20, height: 44, borderRadius: 22, backgroundColor: t.glass, justifyContent: 'center', elevation: 4 }} onPress={onShow} disabled={!count}>
        <Text style={{ color: t.label, fontSize: 16, fontWeight: '600' }}>Show Selected ({count})</Text>
      </Press>
      <Press style={circle} onPress={onDanger} disabled={!count}><Ionicons name={dangerIcon} size={24} color={t.danger} /></Press>
    </View>
  );
}
