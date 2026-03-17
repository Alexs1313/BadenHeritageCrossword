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

import ExplrrLayout from './ExplrrLayout';

const explorCrosswSavedKey = '@baden_explore_saved_v1';
const explorCrosswDefaultThumb = require('../HeritageAssts/imgs/walp1.png');

type ExplorCrosswSavedSet = Record<string, true>;

export default function Exploreartclsscrn() {
  const explorCrosswNav = useNavigation<any>();
  const { height: explorCrosswHeight } = useWindowDimensions();
  const [explorCrosswTab, setExplorCrosswTab] = useState<'all' | 'saved'>(
    'all',
  );
  const [explorCrosswSavedIds, setExplorCrosswSavedIds] =
    useState<ExplorCrosswSavedSet>({});

  const explorCrosswLoadSaved = useCallback(async () => {
    try {
      const explorCrosswRaw = await AsyncStorage.getItem(explorCrosswSavedKey);
      setExplorCrosswSavedIds(
        explorCrosswRaw ? JSON.parse(explorCrosswRaw) : {},
      );
    } catch {
      setExplorCrosswSavedIds({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      explorCrosswLoadSaved();
    }, [explorCrosswLoadSaved]),
  );

  const explorCrosswToggleSaved = useCallback(
    async (explorCrosswId: string) => {
      const explorCrosswNext: ExplorCrosswSavedSet = {
        ...explorCrosswSavedIds,
      };

      if (explorCrosswNext[explorCrosswId])
        delete explorCrosswNext[explorCrosswId];
      else explorCrosswNext[explorCrosswId] = true;

      setExplorCrosswSavedIds(explorCrosswNext);
      await AsyncStorage.setItem(
        explorCrosswSavedKey,
        JSON.stringify(explorCrosswNext),
      );
    },
    [explorCrosswSavedIds],
  );

  const explorCrosswIsSaved = useCallback(
    (explorCrosswId: string) => !!explorCrosswSavedIds[explorCrosswId],
    [explorCrosswSavedIds],
  );

  const explorCrosswSavedList = useMemo(
    () =>
      BADEN_EXPLORE_ARTICLES.filter(
        explorCrosswArticle => explorCrosswSavedIds[explorCrosswArticle.id],
      ),
    [explorCrosswSavedIds],
  );

  const explorCrosswListData =
    explorCrosswTab === 'all' ? BADEN_EXPLORE_ARTICLES : explorCrosswSavedList;

  const explorCrosswOnShare = useCallback(
    async (explorCrosswArticle: ExploreArticle) => {
      try {
        await Share.share({
          message: `${explorCrosswArticle.title}\n\n${
            explorCrosswArticle.body
          }\n\nTrue / False\n${explorCrosswArticle.quizQuestion} (${
            explorCrosswArticle.quizAnswer ? 'True' : 'False'
          })`,
        });
      } catch {}
    },
    [],
  );

  const explorCrosswOpenArticle = useCallback(
    (explorCrosswArticle: ExploreArticle) => {
      explorCrosswNav.navigate('Exploreartclsscrndetails', {
        articleId: explorCrosswArticle.id,
      });
    },
    [explorCrosswNav],
  );

  const explorCrosswRenderCard = useCallback(
    ({ item }: { item: ExploreArticle }) => {
      const explorCrosswSaved = explorCrosswIsSaved(item.id);
      const explorCrosswThumb = item.thumb ?? explorCrosswDefaultThumb;

      return (
        <View style={explorCrosswStyles.explorCrosswCard}>
          <Image
            source={explorCrosswThumb}
            style={explorCrosswStyles.explorCrosswThumb}
            resizeMode="cover"
          />

          <View style={explorCrosswStyles.explorCrosswCardRight}>
            <Text
              style={explorCrosswStyles.explorCrosswCardTitle}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <View style={explorCrosswStyles.explorCrosswCardActions}>
              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => explorCrosswToggleSaved(item.id)}
                style={explorCrosswStyles.explorCrosswIconBtn}
              >
                <Image
                  source={
                    explorCrosswSaved
                      ? require('../HeritageAssts/imgs/heritagecnartcsvd.png')
                      : require('../HeritageAssts/imgs/heritagecnartcsv.png')
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={explorCrosswStyles.explorCrosswOpenBtn}
                onPress={() => explorCrosswOpenArticle(item)}
                activeOpacity={0.8}
              >
                <Text style={explorCrosswStyles.explorCrosswOpenBtnText}>
                  Open
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => explorCrosswOnShare(item)}
                style={explorCrosswStyles.explorCrosswIconBtn}
              >
                <Image
                  source={require('../HeritageAssts/imgs/s_btn.png')}
                  style={explorCrosswStyles.explorCrosswShareIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [
      explorCrosswIsSaved,
      explorCrosswToggleSaved,
      explorCrosswOpenArticle,
      explorCrosswOnShare,
    ],
  );

  const explorCrosswShowEmptySaved =
    explorCrosswTab === 'saved' && explorCrosswSavedList.length === 0;

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswContainer,
          { paddingTop: explorCrosswHeight * 0.07 },
        ]}
      >
        <View style={explorCrosswStyles.explorCrosswHeader}>
          <TouchableOpacity
            onPress={() => explorCrosswNav.goBack()}
            style={explorCrosswStyles.explorCrosswBackBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <View style={explorCrosswStyles.explorCrosswSegmentWrap}>
            <TouchableOpacity
              style={[
                explorCrosswStyles.explorCrosswSegment,
                explorCrosswTab === 'all' &&
                  explorCrosswStyles.explorCrosswSegmentActive,
              ]}
              onPress={() => setExplorCrosswTab('all')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  explorCrosswStyles.explorCrosswSegmentText,
                  explorCrosswTab === 'all' &&
                    explorCrosswStyles.explorCrosswSegmentTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                explorCrosswStyles.explorCrosswSegment,
                explorCrosswTab === 'saved' &&
                  explorCrosswStyles.explorCrosswSegmentActive,
              ]}
              onPress={() => setExplorCrosswTab('saved')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  explorCrosswStyles.explorCrosswSegmentText,
                  explorCrosswTab === 'saved' &&
                    explorCrosswStyles.explorCrosswSegmentTextActive,
                ]}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: 36 }} />
        </View>

        {explorCrosswShowEmptySaved ? (
          <View style={explorCrosswStyles.explorCrosswEmptyWrap}>
            <Image
              source={require('../HeritageAssts/imgs/facts_girl.png')}
              style={explorCrosswStyles.explorCrosswEmptyImg}
              resizeMode="contain"
            />

            <View style={explorCrosswStyles.explorCrosswEmptyCard}>
              <Text style={explorCrosswStyles.explorCrosswEmptyTitle}>
                No saved articles yet
              </Text>
              <Text style={explorCrosswStyles.explorCrosswEmptySub}>
                You haven't saved any articles. Explore the stories of
                Baden-Baden and save the ones you want to read later.
              </Text>
            </View>

            <TouchableOpacity
              style={explorCrosswStyles.explorCrosswExploreBtn}
              onPress={() => setExplorCrosswTab('all')}
              activeOpacity={0.8}
            >
              <Text style={explorCrosswStyles.explorCrosswExploreBtnText}>
                Explore
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={explorCrosswStyles.explorCrosswListContent}
            showsVerticalScrollIndicator={true}
            style={explorCrosswStyles.explorCrosswListScroll}
          >
            {explorCrosswListData.map(explorCrosswItem => (
              <View key={explorCrosswItem.id} style={{ marginBottom: 14 }}>
                {explorCrosswRenderCard({ item: explorCrosswItem })}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  explorCrosswHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  explorCrosswBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorCrosswSegmentWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28,30,34,0.9)',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#2A2D33',
  },
  explorCrosswSegment: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  explorCrosswSegmentActive: {
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#FFFFFF33',
  },
  explorCrosswSegmentText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  explorCrosswSegmentTextActive: {
    color: '#fff',
  },
  explorCrosswListScroll: {
    flex: 1,
  },
  explorCrosswListContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 28,
  },
  explorCrosswCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28,30,34,0.9)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 12,
    overflow: 'hidden',
  },
  explorCrosswThumb: {
    width: 100,
    height: 100,
    borderRadius: 14,
  },
  explorCrosswCardRight: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  explorCrosswCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
    width: '80%',
  },
  explorCrosswCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 8,
    width: '80%',
  },
  explorCrosswIconBtn: {
    padding: 4,
  },
  explorCrosswHeartIcon: {
    color: '#fff',
    fontSize: 22,
  },
  explorCrosswOpenBtn: {
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
  explorCrosswOpenBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  explorCrosswShareIcon: {
    width: 24,
    height: 24,
  },
  explorCrosswEmptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  explorCrosswEmptyImg: {
    width: 280,
    height: 300,
  },
  explorCrosswEmptyCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(28,30,34,0.95)',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 20,
    paddingVertical: 24,
    marginTop: -10,
  },
  explorCrosswEmptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  explorCrosswEmptySub: {
    color: '#fff',
    marginTop: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.95,
  },
  explorCrosswExploreBtn: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#030051',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  explorCrosswExploreBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
