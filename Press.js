import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export default function Press({ onPress, onLongPress, style, children, scale = 0.94, hitSlop = 8, disabled }) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (x) => Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  return (
    <Pressable disabled={disabled} onPress={onPress} onLongPress={onLongPress} hitSlop={hitSlop} onPressIn={() => to(scale)} onPressOut={() => to(1)}>
      <Animated.View style={[style, { transform: [{ scale: v }], opacity: disabled ? 0.4 : 1 }]}>{children}</Animated.View>
    </Pressable>
  );
}
