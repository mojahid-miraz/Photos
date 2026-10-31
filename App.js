import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, Linking, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './src/theme';
import { useAlbums, useLibrary } from './src/storage';
import Press from './src/components/Press';
import LibraryScreen from './src/screens/LibraryScreen';
import AlbumsScreen from './src/screens/AlbumsScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import Viewer from './src/components/Viewer';

export default function App() {
  const t = useTheme();
  const lib = useLibrary();
  const al = useAlbums();
  const [tab, setTab] = useState('library');
  const [openId, setOpenId] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [incoming, setIncoming] = useState(null);
  const byId = useMemo(() => Object.fromEntries(lib.assets.map((a) => [a.id, a])), [lib.assets]);
  const album = al.albums.find((a) => a.id === openId);

  useEffect(() => {
    const ok = (u) => u && (u.startsWith('content://') || u.startsWith('file://'));
    Linking.getInitialURL().then((u) => ok(u) && setIncoming({ uri: u })).catch(() => {});
    const sub = Linking.addEventListener('url', ({ url }) => ok(url) && setIncoming({ uri: url }));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const h = BackHandler.addEventListener('hardwareBackPress', () => { if (openId) { setOpenId(null); return true; } return false; });
    return () => h.remove();
  }, [openId]);

  const Tab = ({ id, icon, label }) => (
    <Press onPress={() => setTab(id)} style={{ alignItems: 'center', flex: 1, paddingVertical: 8 }} scale={0.9}>
      <Ionicons name={tab === id ? icon : `${icon}-outline`} size={24} color={tab === id ? t.tint : t.secondary} />
      <Text style={{ fontSize: 11, marginTop: 2, color: tab === id ? t.tint : t.secondary }}>{label}</Text>
    </Press>
  );

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <View style={{ flex: 1 }}>
          {album ? (
            <AlbumScreen album={album} byId={byId} assets={lib.assets} t={t} onBack={() => setOpenId(null)}
              onAdd={(ids) => al.addAssets(album.id, ids)} onRemove={(ids) => al.removeAssets(album.id, ids)} />
          ) : tab === 'library' ? (
            <LibraryScreen lib={lib} t={t} onSelecting={setSelecting} />
          ) : (
            <AlbumsScreen albums={al.albums} byId={byId} t={t} onOpen={setOpenId} onCreate={al.create} onDelete={al.remove} />
          )}
        </View>
        {!album && !selecting && (
          <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: t.sep, backgroundColor: t.bg }}>
            <Tab id="library" icon="images" label="Library" />
            <Tab id="albums" icon="albums" label="Albums" />
          </View>
        )}
        <Viewer asset={incoming} onClose={() => setIncoming(null)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
