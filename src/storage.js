import { useCallback, useEffect, useRef, useState } from 'react';
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

  const busy = useRef(false);
  const load = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      let all = [], after, more = true, first = true;
      while (more && all.length < 30000) {
        const r = await MediaLibrary.getAssetsAsync({ first: first ? 300 : 1000, after, mediaType: ['photo', 'video'], sortBy: [[MediaLibrary.SortBy.creationTime, false]] });
        all = all.concat(r.assets); after = r.endCursor; more = r.hasNextPage;
        setAssets(all);
        if (first) { setLoaded(true); first = false; }
      }
      if (all.length === 0) {
        const seen = new Set();
        const albums = await MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true });
        for (const al of albums) {
          const r = await MediaLibrary.getAssetsAsync({ first: 500, album: al, mediaType: ['photo', 'video'] });
          for (const x of r.assets) if (!seen.has(x.id)) { seen.add(x.id); all.push(x); }
        }
        all.sort((x, y) => y.creationTime - x.creationTime);
        setAssets(all);
      }
      setError('');
    } catch (e) { setError(String((e && e.message) || e)); }
    setLoaded(true);
    busy.current = false;
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

  const debug = `perm=${perm ? perm.status : '?'} granted=${perm ? String(perm.granted) : '?'} access=${(perm && perm.accessPrivileges) || '-'} assets=${assets.length} loaded=${String(loaded)}${error ? ' err=' + error : ''}`;
  return { perm, requestPerm, assets, reload: load, error, loaded, debug };
}
