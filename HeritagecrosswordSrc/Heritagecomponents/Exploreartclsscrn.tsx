import {
  BADEN_EXPLORE_ARTICLES,
  ExploreArticle,
} from '../uttils/badenExploreArticles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BadenBackground from './BadenBackground';

const SAVED_KEY = '@baden_explore_saved_v1';
const DEFAULT_THUMB = require('../HeritageAssts/imgs/walp1.png');

type SavedSet = Record<string, true>;

export default function Exploreartclsscrn() {
  const nav = useNavigation<any>();
  const { height } = useWindowDimensions();
  const [tab, setTab] = useState<'all' | 'saved'>('all');
  const [savedIds, setSavedIds] = useState<SavedSet>({});

  const loadSaved = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(SAVED_KEY);
      setSavedIds(raw ? JSON.parse(raw) : {});
    } catch {
      setSavedIds({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved]),
  );

  const toggleSaved = useCallback(
    async (id: string) => {
      const next: SavedSet = { ...savedIds };
      if (next[id]) delete next[id];
      else next[id] = true;
      setSavedIds(next);
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
    },
    [savedIds],
  );

  const isSaved = useCallback((id: string) => !!savedIds[id], [savedIds]);

  const savedList = useMemo(
    () => BADEN_EXPLORE_ARTICLES.filter(a => savedIds[a.id]),
    [savedIds],
  );

  const listData = tab === 'all' ? BADEN_EXPLORE_ARTICLES : savedList;

  const onShare = useCallback(async (article: ExploreArticle) => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.body}\n\nTrue / False\n${
          article.quizQuestion
        } (${article.quizAnswer ? 'True' : 'False'})`,
      });
    } catch {}
  }, []);

  const openArticle = useCallback(
    (article: ExploreArticle) => {
      nav.navigate('Exploreartclsscrndetails', { articleId: article.id });
    },
    [nav],
  );

  const renderCard = useCallback(
    ({ item }: { item: ExploreArticle }) => {
      const saved = isSaved(item.id);
      const thumb = item.thumb ?? DEFAULT_THUMB;
      return (
        <View style={s.card}>
          <Image source={thumb} style={s.thumb} resizeMode="cover" />
          <View style={s.cardRight}>
            <Text style={s.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={s.cardActions}>
              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => toggleSaved(item.id)}
                style={s.iconBtn}
              >
                <Image
                  source={
                    saved
                      ? require('../HeritageAssts/imgs/heritagecnartcsvd.png')
                      : require('../HeritageAssts/imgs/heritagecnartcsv.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.openBtn}
                onPress={() => openArticle(item)}
                activeOpacity={0.8}
              >
                <Text style={s.openBtnText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => onShare(item)}
                style={s.iconBtn}
              >
                <Image
                  source={require('../HeritageAssts/imgs/s_btn.png')}
                  style={s.shareIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [isSaved, toggleSaved, openArticle, onShare],
  );

  const showEmptySaved = tab === 'saved' && savedList.length === 0;

  return (
    <BadenBackground>
      <View style={[s.container, { paddingTop: height * 0.07 }]}>
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={s.backBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <View style={s.segmentWrap}>
            <TouchableOpacity
              style={[s.segment, tab === 'all' && s.segmentActive]}
              onPress={() => setTab('all')}
              activeOpacity={0.8}
            >
              <Text
                style={[s.segmentText, tab === 'all' && s.segmentTextActive]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.segment, tab === 'saved' && s.segmentActive]}
              onPress={() => setTab('saved')}
              activeOpacity={0.8}
            >
              <Text
                style={[s.segmentText, tab === 'saved' && s.segmentTextActive]}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: 36 }} />
        </View>

        {showEmptySaved ? (
          <View style={s.emptyWrap}>
            <Image
              source={require('../HeritageAssts/imgs/facts_girl.png')}
              style={s.emptyImg}
              resizeMode="contain"
            />
            <View style={s.emptyCard}>
              <Text style={s.emptyTitle}>No saved articles yet</Text>
              <Text style={s.emptySub}>
                You haven't saved any articles. Explore the stories of
                Baden-Baden and save the ones you want to read later.
              </Text>
            </View>
            <TouchableOpacity
              style={s.exploreBtn}
              onPress={() => setTab('all')}
              activeOpacity={0.8}
            >
              <Text style={s.exploreBtnText}>Explore</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={true}
            style={s.listScroll}
          >
            {listData.map(item => (
              <View key={item.id} style={{ marginBottom: 14 }}>
                {renderCard({ item })}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28,30,34,0.9)',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#2A2D33',
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#FFFFFF33',
  },
  segmentText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#fff',
  },
  listScroll: { flex: 1 },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 28,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28,30,34,0.9)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 12,
    overflow: 'hidden',
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 14,
  },
  cardRight: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
    width: '80%',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 8,
    width: '80%',
  },
  iconBtn: {
    padding: 4,
  },
  heartIcon: {
    color: '#fff',
    fontSize: 22,
  },
  openBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#030051',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C9A24D',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  shareIcon: {
    width: 24,
    height: 24,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  emptyImg: {
    width: 280,
    height: 300,
  },
  emptyCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(28,30,34,0.95)',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 20,
    paddingVertical: 24,
    marginTop: -10,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySub: {
    color: '#fff',
    marginTop: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.95,
  },
  exploreBtn: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#030051',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
