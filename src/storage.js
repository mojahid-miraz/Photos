import { useCallback, useEffect, useState } from 'react';
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
  const [perm, requestPerm] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState([]);
  const reload = useCallback(async () => {
    if (!perm?.granted) return;
    let all = [], after, more = true;
    while (more && all.length < 3000) {
      const r = await MediaLibrary.getAssetsAsync({ first: 500, after, mediaType: ['photo', 'video'], sortBy: [[MediaLibrary.SortBy.creationTime, false]] });
      all = all.concat(r.assets); after = r.endCursor; more = r.hasNextPage;
    }
    setAssets(all);
  }, [perm?.granted]);
  useEffect(() => { reload(); }, [reload]);
  return { perm, requestPerm, assets, reload };
}
