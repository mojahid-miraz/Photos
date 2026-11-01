import React, { memo, useEffect, useRef } from 'react';
import { Animated, FlatList, Image, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Press from './Press';

const fmt = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const Cell = memo(function Cell({ item, size, selecting, selected, onPress, onLongPress, t }) {
  const pop = useRef(new Animated.Value(selected ? 1 : 0)).current;
  useEffect(() => { Animated.spring(pop, { toValue: selected ? 1 : 0, useNativeDriver: true, friction: 5 }).start(); }, [selected]);
  return (
    <Press scale={0.97} hitSlop={0} onPress={() => onPress(item)} onLongPress={() => onLongPress && onLongPress(item)}>
      <View style={{ width: size, height: size, padding: 0.75 }}>
        <Image source={{ uri: item.uri }} resizeMethod="resize" fadeDuration={0} style={{ flex: 1, backgroundColor: t.card, opacity: selected ? 0.8 : 1 }} />
        {item.mediaType === 'video' && (
          <Text style={{ position: 'absolute', left: 8, bottom: 6, color: '#fff', fontSize: 12, fontWeight: '600' }}>{fmt(item.duration)}</Text>
        )}
        {selecting && (
          <View style={{ position: 'absolute', right: 7, bottom: 6, width: 24, height: 24, borderRadius: 12, borderWidth: selected ? 0 : 1.5, borderColor: 'rgba(255,255,255,0.9)', backgroundColor: selected ? '#fff' : 'rgba(0,0,0,0.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ scale: pop }], opacity: pop }}>
              <Ionicons name="checkmark-circle" size={26} color={t.tint} />
            </Animated.View>
          </View>
        )}
      </View>
    </Press>
  );
});

export default function PhotoGrid({ data, selecting, selected, onPress, onLongPress, t, header, footerSpace = 130 }) {
  const { width } = useWindowDimensions();
  const cols = width > 700 ? 6 : 3;
  const size = Math.floor(width / cols);
  return (
    <FlatList
      key={cols}
      data={data}
      numColumns={cols}
      keyExtractor={(i) => i.id}
      extraData={[selected, selecting]}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingBottom: footerSpace }}
      initialNumToRender={30}
      windowSize={7}
      removeClippedSubviews
      renderItem={({ item }) => (
        <Cell item={item} size={size} t={t} selecting={selecting} selected={!!selected && selected.has(item.id)} onPress={onPress} onLongPress={onLongPress} />
      )}
    />
  );
}
