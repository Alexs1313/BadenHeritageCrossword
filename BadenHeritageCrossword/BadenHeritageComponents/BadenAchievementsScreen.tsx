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
import BadenBackground from './BadenBackground';
import { BADEN_CROSSWORDS } from '../badenutils/badenCrosswords';
import { BADEN_ACHIEVEMENTS } from '../badenutils/badenAchievements';
import { useCrosswordProgress } from '../badenutils/useCrosswordProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AchievementId =
  | 'first_step'
  | 'early_scholar'
  | 'steady_progress'
  | 'consistent_mind'
  | 'heritage_keeper'
  | 'legacy_completed';

type SeenMap = Record<AchievementId, true>;

const ACH_SEEN_KEY = '@baden_achievements_seen_v1';

function getUnlockedAchievements(params: {
  completedTotal: number;
  noHintWins: number;
  completedEasy: number;
  completedMedium: number;
  completedHard: number;
}) {
  const {
    completedTotal,
    noHintWins,
    completedEasy,
    completedMedium,
    completedHard,
  } = params;

  const totalEasy = BADEN_CROSSWORDS.reduce(
    (sum, t) => sum + (t.levels.easy?.length ?? 0),
    0,
  );
  const totalMedium = BADEN_CROSSWORDS.reduce(
    (sum, t) => sum + (t.levels.medium?.length ?? 0),
    0,
  );

  const legacyDone =
    completedEasy >= 1 && completedMedium >= 1 && completedHard >= 1;

  const unlocked: Record<AchievementId, boolean> = {
    first_step: completedTotal >= 1,
    early_scholar: completedTotal >= 5,
    steady_progress: totalEasy > 0 && completedEasy >= totalEasy,
    consistent_mind: noHintWins >= 10,
    heritage_keeper: totalMedium > 0 && completedMedium >= totalMedium,
    legacy_completed: legacyDone,
  };

  return (Object.keys(unlocked) as AchievementId[]).filter(id => unlocked[id]);
}

export default function BadenAchievementsScreen() {
  const nav = useNavigation<any>();
  const {
    completedTotal,
    noHintWins,
    completedEasy,
    completedMedium,
    completedHard,
    reload,
  } = useCrosswordProgress();
  const { height } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      const markSeen = async () => {
        const unlockedIds = getUnlockedAchievements({
          completedTotal,
          noHintWins,
          completedEasy,
          completedMedium,
          completedHard,
        });

        const raw = await AsyncStorage.getItem(ACH_SEEN_KEY);
        const seen: SeenMap = raw ? JSON.parse(raw) : ({} as SeenMap);

        let changed = false;
        const nextSeen: SeenMap = { ...seen };

        unlockedIds.forEach(id => {
          if (!nextSeen[id]) {
            nextSeen[id] = true;
            changed = true;
          }
        });

        if (changed) {
          await AsyncStorage.setItem(ACH_SEEN_KEY, JSON.stringify(nextSeen));
        }
      };

      markSeen();
    }, [
      completedTotal,
      noHintWins,
      completedEasy,
      completedMedium,
      completedHard,
    ]),
  );

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const totalEasy = useMemo(() => {
    return BADEN_CROSSWORDS.reduce(
      (sum, t) => sum + (t.levels.easy?.length ?? 0),
      0,
    );
  }, []);

  const totalMedium = useMemo(() => {
    return BADEN_CROSSWORDS.reduce(
      (sum, t) => sum + (t.levels.medium?.length ?? 0),
      0,
    );
  }, []);

  const legacyDone = useMemo(() => {
    const isEasyLvl = completedEasy >= 1;

    const isMedLvl = completedMedium >= 1;

    const isHardLvl = completedHard >= 1;

    return isEasyLvl && isMedLvl && isHardLvl;
  }, [completedEasy, completedMedium, completedHard]);

  const unlockedMap = useMemo(() => {
    return {
      first_step: completedTotal >= 1,

      early_scholar: completedTotal >= 5,

      steady_progress: totalEasy > 0 && completedEasy >= totalEasy,

      consistent_mind: noHintWins >= 10,

      heritage_keeper: totalMedium > 0 && completedMedium >= totalMedium,

      legacy_completed: legacyDone,
    } as Record<string, boolean>;
  }, [
    completedTotal,
    totalEasy,
    completedEasy,
    noHintWins,
    totalMedium,
    completedMedium,
    legacyDone,
  ]);

  const badenAchieveCard = useCallback(
    ({ item }: any) => {
      const unlocked = unlockedMap[item.id];

      return (
        <View style={[s.heritcrd, { opacity: unlocked ? 1 : 0.85 }]}>
          <Image
            source={unlocked ? item.icon : item.iconLocked}
            style={s.heritIcn}
          />
          <Text style={s.heritNme}>{item.title}</Text>
          <Text style={s.heritDsc}>{item.desc}</Text>
        </View>
      );
    },
    [unlockedMap],
  );

  return (
    <BadenBackground>
      <View style={[s.heritCont, { paddingTop: height * 0.07 }]}>
        <View style={s.topHeadBar}>
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={s.backButn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={s.heritTtl}>Achievements</Text>
          <View style={{ width: 36 }} />
        </View>

        <BadenList
          contentContainerStyle={s.hertLst}
          data={BADEN_ACHIEVEMENTS}
          renderItem={badenAchieveCard}
          keyExtractor={(x: any) => x.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 22 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  heritCont: { flex: 1, paddingHorizontal: 5 },

  topHeadBar: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  backButn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heritTtl: { color: '#fff', fontSize: 22, fontWeight: '700' },

  hertLst: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'center',
  },

  heritcrd: {
    flex: 1,
    backgroundColor: '#1c1e22e1',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 16,
    alignItems: 'center',
  },

  heritIcn: {
    width: 115,
    height: 115,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  heritNme: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  heritDsc: {
    color: '#fff',
    opacity: 0.95,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
});
