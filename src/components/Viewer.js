import React from 'react';
import { Image, Modal, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';

export default function Viewer({ asset, onClose }) {
  return (
    <Modal visible={!!asset} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}>
        {asset && <Image source={{ uri: asset.uri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />}
        <Press onPress={onClose} style={{ position: 'absolute', top: 44, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(60,60,60,0.8)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={24} color="#fff" />
        </Press>
      </View>
    </Modal>
  );
}
