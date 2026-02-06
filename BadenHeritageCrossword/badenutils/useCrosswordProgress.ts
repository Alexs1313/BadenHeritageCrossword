import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Difficulty } from './badenCrosswords';

const KEY = {
  coupons: '@baden_cross_coupons',
  completedEasy: '@baden_cross_completed_easy',
  completedMedium: '@baden_cross_completed_medium',
  completedHard: '@baden_cross_completed_hard',
  progress: '@baden_cross_progress_v1',
  completedSet: '@baden_cross_completed_set_v1',
  completedTotal: '@baden_cross_completed_total',
  noHintWins: '@baden_cross_no_hint_wins',
};

type CompletedSet = Record<string, true>;

const makeCrossId = (topicId: string, diff: Difficulty, idx: number) =>
  `${topicId}:${diff}:${idx}`;

type TopicProgress = Record<string, Record<Difficulty, number>>;
const DEF: TopicProgress = {};
const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export const couponsReward: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
  extreme: 6,
};

export function useCrosswordProgress() {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState(0);
  const [completedEasy, setCompletedEasy] = useState(0);
  const [completedMedium, setCompletedMedium] = useState(0);
  const [completedHard, setCompletedHard] = useState(0);
  const [progress, setProgress] = useState<TopicProgress>(DEF);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [noHintWins, setNoHintWins] = useState(0);

  const load = useCallback(async () => {
    try {
      const [c, e, m, h, t, p, nhRaw] = await Promise.all([
        AsyncStorage.getItem(KEY.coupons),
        AsyncStorage.getItem(KEY.completedEasy),
        AsyncStorage.getItem(KEY.completedMedium),
        AsyncStorage.getItem(KEY.completedHard),
        AsyncStorage.getItem(KEY.completedTotal),
        AsyncStorage.getItem(KEY.progress),
        AsyncStorage.getItem(KEY.noHintWins),
      ]);

      setCoupons(toNum(c));
      setCompletedEasy(toNum(e));
      setCompletedTotal(toNum(t));
      setCompletedMedium(toNum(m));
      setCompletedHard(toNum(h));
      setNoHintWins(toNum(nhRaw));
      setProgress(p ? JSON.parse(p) : DEF);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isUnlocked = useMemo(() => {
    return {
      easy: true,
      medium: completedEasy >= 4,
      hard: completedMedium >= 4,
      extreme: completedHard >= 4,
    } as Record<Difficulty, boolean>;
  }, [completedEasy, completedMedium, completedHard]);

  const getTopicIndex = useCallback(
    (topicId: string, diff: Difficulty) => progress?.[topicId]?.[diff] ?? 0,
    [progress],
  );

  const setTopicIndex = useCallback(
    async (topicId: string, diff: Difficulty, idx: number) => {
      const nextP: TopicProgress = {
        ...progress,
        [topicId]: { ...(progress[topicId] ?? {}), [diff]: idx },
      };
      setProgress(nextP);
      await AsyncStorage.setItem(KEY.progress, JSON.stringify(nextP));
    },
    [progress],
  );

  const applyWin = useCallback(
    async (
      topicId: string,
      diff: Difficulty,
      idx: number,
      opts?: { usedHint?: boolean },
    ) => {
      const crossId = makeCrossId(topicId, diff, idx);

      const [setRaw, cRaw, eRaw, mRaw, hRaw, tRaw, nhRaw] = await Promise.all([
        AsyncStorage.getItem(KEY.completedSet),
        AsyncStorage.getItem(KEY.coupons),
        AsyncStorage.getItem(KEY.completedEasy),
        AsyncStorage.getItem(KEY.completedMedium),
        AsyncStorage.getItem(KEY.completedHard),
        AsyncStorage.getItem(KEY.completedTotal),
        AsyncStorage.getItem(KEY.noHintWins),
      ]);

      const completedSet: CompletedSet = setRaw ? JSON.parse(setRaw) : {};
      const alreadyCompleted = !!completedSet[crossId];

      if (alreadyCompleted) {
        return { reward: 0, firstTime: false };
      }

      const reward = couponsReward[diff];

      const c = toNum(cRaw);
      const e = toNum(eRaw);
      const m = toNum(mRaw);
      const h = toNum(hRaw);
      const t = toNum(tRaw);
      const nh = toNum(nhRaw);

      const nextCoupons = c + reward;
      const nextE = diff === 'easy' ? e + 1 : e;
      const nextM = diff === 'medium' ? m + 1 : m;
      const nextH = diff === 'hard' ? h + 1 : h;

      const nextT = t + 1;

      const usedHint = !!opts?.usedHint;
      const nextNH = usedHint ? nh : nh + 1;

      const nextSet = { ...completedSet, [crossId]: true };

      await Promise.all([
        AsyncStorage.setItem(KEY.completedSet, JSON.stringify(nextSet)),
        AsyncStorage.setItem(KEY.coupons, String(nextCoupons)),
        AsyncStorage.setItem(KEY.completedEasy, String(nextE)),
        AsyncStorage.setItem(KEY.completedMedium, String(nextM)),
        AsyncStorage.setItem(KEY.completedHard, String(nextH)),
        AsyncStorage.setItem(KEY.completedTotal, String(nextT)),
        AsyncStorage.setItem(KEY.noHintWins, String(nextNH)),
      ]);

      setCoupons(nextCoupons);
      setCompletedEasy(nextE);
      setCompletedMedium(nextM);
      setCompletedHard(nextH);
      setCompletedTotal(nextT);
      setNoHintWins(nextNH);

      return { reward, firstTime: true };
    },
    [],
  );

  const consumeCoupons = useCallback(async (delta: number) => {
    const cRaw = await AsyncStorage.getItem(KEY.coupons);
    const c = toNum(cRaw);
    const next = Math.max(0, c - delta);
    await AsyncStorage.setItem(KEY.coupons, String(next));
    setCoupons(next);
  }, []);

  return {
    loading,
    coupons,
    isUnlocked,
    completedEasy,
    completedMedium,
    completedHard,
    getTopicIndex,
    setTopicIndex,
    consumeCoupons,
    applyWin,
    reload: load,
    completedTotal,
    noHintWins,
  };
}
