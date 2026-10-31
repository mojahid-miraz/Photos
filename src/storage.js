import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';

const KEY = 'albums:v1';

export function useAlbums() {
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => v && setAlbums(JSON.parse(v))).catch(() => {});
  }, []);
  const save = useCallback((next) => {
    setAlbums(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);
  return {
    albums,
    create: (name) => save([...albums, { id: String(Date.now()), name, assetIds: [] }]),
    remove: (id) => save(albums.filter((a) => a.id !== id)),
    addAssets: (id, ids) => save(albums.map((a) => (a.id === id ? { ...a, assetIds: [...new Set([...a.assetIds, ...ids])] } : a))),
    removeAssets: (id, ids) => save(albums.map((a) => (a.id === id ? { ...a, assetIds: a.assetIds.filter((x) => !ids.includes(x)) } : a))),
  };
}

export function useLibrary() {
  const [perm, setPerm] = useState(null);
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const G = ['photo', 'video'];

  const load = useCallback(async () => {
    try {
      let all = [], after, more = true;
      while (more && all.length < 3000) {
        const r = await MediaLibrary.getAssetsAsync({ first: 500, after, mediaType: ['photo', 'video'], sortBy: [[MediaLibrary.SortBy.creationTime, false]] });
        all = all.concat(r.assets); after = r.endCursor; more = r.hasNextPage;
      }
      setAssets(all); setError('');
    } catch (e) { setError(String((e && e.message) || e)); }
    setLoaded(true);
  }, []);

  const requestPerm = useCallback(async () => {
    try { const r = await MediaLibrary.requestPermissionsAsync(false, G); setPerm(r); return r; }
    catch (e) { setError(String((e && e.message) || e)); }
  }, []);

  useEffect(() => {
    (async () => {
      let r = await MediaLibrary.getPermissionsAsync(false, G);
      setPerm(r);
      if (!r.granted) await requestPerm();
    })().catch((e) => setError(String((e && e.message) || e)));
  }, []);

  useEffect(() => { if (perm && perm.granted) load(); }, [perm && perm.granted]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (st) => {
      if (st !== 'active') return;
      try {
        const r = await MediaLibrary.getPermissionsAsync(false, G);
        setPerm(r);
        if (r.granted) load();
      } catch (e) {}
    });
    return () => sub.remove();
  }, [load]);

  return { perm, requestPerm, assets, reload: load, error, loaded };
}
