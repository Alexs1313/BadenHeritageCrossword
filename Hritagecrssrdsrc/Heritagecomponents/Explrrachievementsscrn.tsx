// BadenAchievementsScreen.tsx

import { BADEN_ACHIEVEMENTS } from '../dbUttls/badenAchievements';
import { useCrosswordProgress } from '../dbUttls/useCrosswordProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList as BadenList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { BADEN_CROSSWORDS } from '../dbUttls/badenCrosswords';
import ExplrrLayout from './ExplrrLayout';

type ExplorCrosswAchievementId =
  | 'first_step'
  | 'early_scholar'
  | 'steady_progress'
  | 'consistent_mind'
  | 'heritage_keeper'
  | 'legacy_completed';

type ExplorCrosswSeenMap = Record<ExplorCrosswAchievementId, true>;

const explorCrosswAchSeenKey = '@baden_achievements_seen_v1';

function explorCrosswGetUnlockedAchievements(params: {
  completedTotal: number;
  noHintWins: number;
  completedEasy: number;
  completedMedium: number;
  completedHard: number;
}) {
  const {
    completedTotal: explorCrosswCompletedTotal,
    noHintWins: explorCrosswNoHintWins,
    completedEasy: explorCrosswCompletedEasy,
    completedMedium: explorCrosswCompletedMedium,
    completedHard: explorCrosswCompletedHard,
  } = params;

  const explorCrosswTotalEasy = BADEN_CROSSWORDS.reduce(
    (explorCrosswSum, explorCrosswTopic) =>
      explorCrosswSum + (explorCrosswTopic.levels.easy?.length ?? 0),
    0,
  );

  const explorCrosswTotalMedium = BADEN_CROSSWORDS.reduce(
    (explorCrosswSum, explorCrosswTopic) =>
      explorCrosswSum + (explorCrosswTopic.levels.medium?.length ?? 0),
    0,
  );

  const explorCrosswLegacyDone =
    explorCrosswCompletedEasy >= 1 &&
    explorCrosswCompletedMedium >= 1 &&
    explorCrosswCompletedHard >= 1;

  const explorCrosswUnlocked: Record<ExplorCrosswAchievementId, boolean> = {
    first_step: explorCrosswCompletedTotal >= 1,
    early_scholar: explorCrosswCompletedTotal >= 5,
    steady_progress:
      explorCrosswTotalEasy > 0 &&
      explorCrosswCompletedEasy >= explorCrosswTotalEasy,
    consistent_mind: explorCrosswNoHintWins >= 10,
    heritage_keeper:
      explorCrosswTotalMedium > 0 &&
      explorCrosswCompletedMedium >= explorCrosswTotalMedium,
    legacy_completed: explorCrosswLegacyDone,
  };

  return (
    Object.keys(explorCrosswUnlocked) as ExplorCrosswAchievementId[]
  ).filter(explorCrosswId => explorCrosswUnlocked[explorCrosswId]);
}

export default function Explrrachievementsscrn() {
  const explorCrosswNav = useNavigation<any>();
  const {
    completedTotal: explorCrosswCompletedTotal,
    noHintWins: explorCrosswNoHintWins,
    completedEasy: explorCrosswCompletedEasy,
    completedMedium: explorCrosswCompletedMedium,
    completedHard: explorCrosswCompletedHard,
    reload: explorCrosswReload,
  } = useCrosswordProgress();
  const { height: explorCrosswHeight } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      const explorCrosswMarkSeen = async () => {
        const explorCrosswUnlockedIds = explorCrosswGetUnlockedAchievements({
          completedTotal: explorCrosswCompletedTotal,
          noHintWins: explorCrosswNoHintWins,
          completedEasy: explorCrosswCompletedEasy,
          completedMedium: explorCrosswCompletedMedium,
          completedHard: explorCrosswCompletedHard,
        });

        const explorCrosswRaw = await AsyncStorage.getItem(
          explorCrosswAchSeenKey,
        );
        const explorCrosswSeen: ExplorCrosswSeenMap = explorCrosswRaw
          ? JSON.parse(explorCrosswRaw)
          : ({} as ExplorCrosswSeenMap);

        let explorCrosswChanged = false;
        const explorCrosswNextSeen: ExplorCrosswSeenMap = {
          ...explorCrosswSeen,
        };

        explorCrosswUnlockedIds.forEach(explorCrosswId => {
          if (!explorCrosswNextSeen[explorCrosswId]) {
            explorCrosswNextSeen[explorCrosswId] = true;
            explorCrosswChanged = true;
          }
        });

        if (explorCrosswChanged) {
          await AsyncStorage.setItem(
            explorCrosswAchSeenKey,
            JSON.stringify(explorCrosswNextSeen),
          );
        }
      };

      explorCrosswMarkSeen();
    }, [
      explorCrosswCompletedTotal,
      explorCrosswNoHintWins,
      explorCrosswCompletedEasy,
      explorCrosswCompletedMedium,
      explorCrosswCompletedHard,
    ]),
  );

  useFocusEffect(
    useCallback(() => {
      explorCrosswReload();
    }, [explorCrosswReload]),
  );

  const explorCrosswTotalEasy = useMemo(() => {
    return BADEN_CROSSWORDS.reduce(
      (explorCrosswSum, explorCrosswTopic) =>
        explorCrosswSum + (explorCrosswTopic.levels.easy?.length ?? 0),
      0,
    );
  }, []);

  const explorCrosswTotalMedium = useMemo(() => {
    return BADEN_CROSSWORDS.reduce(
      (explorCrosswSum, explorCrosswTopic) =>
        explorCrosswSum + (explorCrosswTopic.levels.medium?.length ?? 0),
      0,
    );
  }, []);

  const explorCrosswLegacyDone = useMemo(() => {
    const explorCrosswIsEasyLvl = explorCrosswCompletedEasy >= 1;
    const explorCrosswIsMedLvl = explorCrosswCompletedMedium >= 1;
    const explorCrosswIsHardLvl = explorCrosswCompletedHard >= 1;

    return (
      explorCrosswIsEasyLvl && explorCrosswIsMedLvl && explorCrosswIsHardLvl
    );
  }, [
    explorCrosswCompletedEasy,
    explorCrosswCompletedMedium,
    explorCrosswCompletedHard,
  ]);

  const explorCrosswUnlockedMap = useMemo(() => {
    return {
      first_step: explorCrosswCompletedTotal >= 1,
      early_scholar: explorCrosswCompletedTotal >= 5,
      steady_progress:
        explorCrosswTotalEasy > 0 &&
        explorCrosswCompletedEasy >= explorCrosswTotalEasy,
      consistent_mind: explorCrosswNoHintWins >= 10,
      heritage_keeper:
        explorCrosswTotalMedium > 0 &&
        explorCrosswCompletedMedium >= explorCrosswTotalMedium,
      legacy_completed: explorCrosswLegacyDone,
    } as Record<string, boolean>;
  }, [
    explorCrosswCompletedTotal,
    explorCrosswTotalEasy,
    explorCrosswCompletedEasy,
    explorCrosswNoHintWins,
    explorCrosswTotalMedium,
    explorCrosswCompletedMedium,
    explorCrosswLegacyDone,
  ]);

  const explorCrosswProgressMap = useMemo(() => {
    const explorCrosswLegacyCurrent =
      (explorCrosswCompletedEasy >= 1 ? 1 : 0) +
      (explorCrosswCompletedMedium >= 1 ? 1 : 0) +
      (explorCrosswCompletedHard >= 1 ? 1 : 0);

    return {
      first_step: {
        current: Math.min(explorCrosswCompletedTotal, 1),
        total: 1,
      },
      early_scholar: {
        current: Math.min(explorCrosswCompletedTotal, 5),
        total: 5,
      },
      steady_progress: {
        current: explorCrosswCompletedEasy,
        total: explorCrosswTotalEasy || 1,
      },
      consistent_mind: {
        current: Math.min(explorCrosswNoHintWins, 10),
        total: 10,
      },
      heritage_keeper: {
        current: explorCrosswCompletedMedium,
        total: explorCrosswTotalMedium || 1,
      },
      legacy_completed: {
        current: explorCrosswLegacyCurrent,
        total: 3,
      },
    } as Record<string, { current: number; total: number }>;
  }, [
    explorCrosswCompletedTotal,
    explorCrosswNoHintWins,
    explorCrosswCompletedEasy,
    explorCrosswCompletedMedium,
    explorCrosswCompletedHard,
    explorCrosswTotalEasy,
    explorCrosswTotalMedium,
  ]);

  const explorCrosswRenderAchieveCard = useCallback(
    ({ item }: any) => {
      const explorCrosswUnlocked = explorCrosswUnlockedMap[item.id];
      const explorCrosswProgress = explorCrosswProgressMap[item.id] ?? {
        current: 0,
        total: 1,
      };
      const explorCrosswPct =
        explorCrosswProgress.total > 0
          ? explorCrosswProgress.current / explorCrosswProgress.total
          : 0;

      return (
        <View
          style={[
            explorCrosswStyles.explorCrosswHeritCard,
            { opacity: explorCrosswUnlocked ? 1 : 0.85 },
          ]}
        >
          <Image
            source={explorCrosswUnlocked ? item.icon : item.iconLocked}
            style={explorCrosswStyles.explorCrosswHeritIcon}
          />
          <Text style={explorCrosswStyles.explorCrosswHeritName}>
            {item.title}
          </Text>
          <Text style={explorCrosswStyles.explorCrosswHeritDesc}>
            {item.desc}
          </Text>
          <View style={explorCrosswStyles.explorCrosswProgressWrap}>
            <View style={explorCrosswStyles.explorCrosswProgressTrack}>
              <View
                style={[
                  explorCrosswStyles.explorCrosswProgressFill,
                  { width: `${Math.min(100, explorCrosswPct * 100)}%` },
                ]}
              />
            </View>
            <Text style={explorCrosswStyles.explorCrosswProgressLabel}>
              {explorCrosswProgress.current}/{explorCrosswProgress.total}
            </Text>
          </View>
        </View>
      );
    },
    [explorCrosswUnlockedMap, explorCrosswProgressMap],
  );

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswHeritCont,
          { paddingTop: explorCrosswHeight * 0.07 },
        ]}
      >
        <View style={explorCrosswStyles.explorCrosswTopHeadBar}>
          <TouchableOpacity
            onPress={() => explorCrosswNav.goBack()}
            style={explorCrosswStyles.explorCrosswBackBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={explorCrosswStyles.explorCrosswHeritTitle}>
            Achievements
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <BadenList
          contentContainerStyle={explorCrosswStyles.explorCrosswHertList}
          data={BADEN_ACHIEVEMENTS}
          renderItem={explorCrosswRenderAchieveCard}
          keyExtractor={(explorCrosswItem: any) => explorCrosswItem.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 22 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswHeritCont: {
    flex: 1,
    paddingHorizontal: 5,
  },

  explorCrosswTopHeadBar: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  explorCrosswBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswHeritTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  explorCrosswHertList: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'center',
  },

  explorCrosswHeritCard: {
    flex: 1,
    backgroundColor: '#1c1e22e1',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 16,
    alignItems: 'center',
  },

  explorCrosswHeritIcon: {
    width: 115,
    height: 115,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  explorCrosswHeritName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  explorCrosswHeritDesc: {
    color: '#fff',
    opacity: 0.95,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },

  explorCrosswProgressWrap: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },

  explorCrosswProgressTrack: {
    width: '100%',
    height: 15,
    borderRadius: 24,
    backgroundColor: '#919191',
    overflow: 'hidden',
    flexDirection: 'row',
  },

  explorCrosswProgressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#2E7D32',
  },

  explorCrosswProgressLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    position: 'absolute',
    fontStyle: 'italic',
    bottom: 2,
  },
});
