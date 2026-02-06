import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Vibration,
  Platform,
} from 'react-native';
import { BADEN_CROSSWORDS, Difficulty } from '../badenutils/badenCrosswords';
import { useCrosswordProgress } from '../badenutils/useCrosswordProgress';
import BadenBackground from '../BadenHeritageComponents/BadenBackground';
import { BlurView } from '@react-native-community/blur';
import { useBadenStore } from '../HeritageStore/badenContext';
import Toast from 'react-native-toast-message';

type SlotState = 'idle' | 'correct' | 'wrong';

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildLetterBank(answer: string) {
  const base = answer.split('');
  const extraPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const extrasCount = Math.max(8, 16 - base.length);
  const extras: string[] = [];
  for (let i = 0; i < extrasCount; i++) {
    extras.push(extraPool[Math.floor(Math.random() * extraPool.length)]);
  }
  return shuffle([...base, ...extras]);
}

export default function CrosswordGameScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { topicId, difficulty } = route.params as {
    topicId: string;
    difficulty: Difficulty;
  };

  const topic = useMemo(
    () => BADEN_CROSSWORDS.find(t => t.id === topicId)!,
    [topicId],
  );

  const { coupons, applyWin, consumeCoupons, getTopicIndex, setTopicIndex } =
    useCrosswordProgress();

  const idx = getTopicIndex(topicId, difficulty);
  const list = topic.levels[difficulty];
  const item = list[Math.min(idx, list.length - 1)];

  const answer = useMemo(() => item.answer.toUpperCase(), [item.answer]);

  const [picked, setPicked] = useState<string[]>([]);
  const [used, setUsed] = useState<Record<number, boolean>>({});
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [hintUsed, setHintUsed] = useState(false);

  const [slotState, setSlotState] = useState<SlotState[]>(
    Array.from({ length: answer.length }, () => 'idle'),
  );

  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showResult, setShowResult] = useState<null | {
    ok: boolean;
    reward: number;
  }>(null);
  const { isEnabledVibration, isEnabledNotifications } = useBadenStore();
  const { height } = useWindowDimensions();
  const bank = useMemo(() => buildLetterBank(answer), [answer]);

  const canConfirm = picked.length === answer.length;

  const resetFireworksTimer = useCallback(() => {
    if (fireworksTimer.current) clearTimeout(fireworksTimer.current);
    fireworksTimer.current = null;
  }, []);

  useEffect(() => {
    setPicked([]);
    setUsed({});
    setNextIdx(null);
    setHintUsed(false);
    setShowResult(null);
    setSlotState(Array.from({ length: answer.length }, () => 'idle'));
    setShowFireworks(false);
    resetFireworksTimer();
  }, [answer, resetFireworksTimer]);

  useEffect(() => {
    return () => {
      resetFireworksTimer();
    };
  }, [resetFireworksTimer]);

  const flashSlot = useCallback((pos: number, state: SlotState) => {
    setSlotState(prev => {
      const next = [...prev];
      next[pos] = state;
      return next;
    });

    setTimeout(() => {
      setSlotState(prev => {
        const next = [...prev];

        if (next[pos] === state) next[pos] = 'idle';
        return next;
      });
    }, 450);
  }, []);

  const onPick = useCallback(
    (letter: string, i: number) => {
      if (used[i]) return;
      if (picked.length >= answer.length) return;

      const pos = picked.length;
      const expected = answer[pos];
      const okLetter = letter === expected;

      setUsed(prev => ({ ...prev, [i]: true }));
      setPicked(prev => [...prev, letter]);

      if (okLetter) {
        flashSlot(pos, 'correct');
      } else {
        // Vibration and flash for wrong answer
        Vibration.vibrate(60);
        flashSlot(pos, 'wrong');
      }
    },
    [used, picked.length, answer, flashSlot],
  );

  const onBackspace = useCallback(() => {
    if (picked.length === 0) return;

    const lastPos = picked.length - 1;
    const lastLetter = picked[lastPos];

    setPicked(prev => prev.slice(0, -1));

    setSlotState(prev => {
      const next = [...prev];
      next[lastPos] = 'idle';
      return next;
    });

    setUsed(prev => {
      const usedIdxs = Object.keys(prev)
        .map(n => Number(n))
        .filter(k => prev[k]);

      for (let t = usedIdxs.length - 1; t >= 0; t--) {
        const k = usedIdxs[t];
        if (bank[k] === lastLetter) {
          const next = { ...prev };
          next[k] = false;
          return next;
        }
      }
      return prev;
    });
  }, [picked, bank]);

  const onHint = useCallback(async () => {
    setHintUsed(true);

    const cost = 2;
    if (coupons < cost) return;
    if (picked.length >= answer.length) return;

    const pos = picked.length;
    const correct = answer[pos];

    const bankIndex = bank.findIndex((l, i) => l === correct && !used[i]);
    if (bankIndex < 0) return;

    await consumeCoupons(cost);

    setUsed(prev => ({ ...prev, [bankIndex]: true }));
    setPicked(prev => [...prev, correct]);

    flashSlot(pos, 'correct');
  }, [coupons, consumeCoupons, picked.length, answer, bank, used, flashSlot]);

  const onConfirm = useCallback(async () => {
    if (!canConfirm) return;

    const attempt = picked.join('');
    const ok = attempt === answer;

    if (ok) {
      isEnabledNotifications &&
        Toast.show({
          type: 'success',
          text1: 'Correct Answer!',
          text2: 'Congratulations on completing the crossword.',
          position: 'bottom',
        });

      setShowFireworks(true);
      resetFireworksTimer();
      fireworksTimer.current = setTimeout(() => {
        setShowFireworks(false);
      }, 4000);

      const { reward } = await applyWin(topicId, difficulty, idx, {
        usedHint: hintUsed,
      });

      const n = (idx + 1) % list.length;
      setNextIdx(n);
      setShowResult({ ok: true, reward });
      return;
    }

    if (isEnabledVibration) {
      Vibration.vibrate(280);
    }

    setShowResult({ ok: false, reward: 0 });
  }, [
    canConfirm,
    picked,
    answer,
    applyWin,
    topicId,
    difficulty,
    idx,
    list.length,
    hintUsed,
    resetFireworksTimer,
  ]);

  const resetTry = useCallback(() => {
    setPicked([]);
    setUsed({});
    setShowResult(null);
    setHintUsed(false);
    setSlotState(Array.from({ length: answer.length }, () => 'idle'));
  }, [answer.length]);

  const goNext = useCallback(async () => {
    if (nextIdx !== null) {
      await setTopicIndex(topicId, difficulty, nextIdx);
    }
    setHintUsed(false);

    setPicked([]);
    setUsed({});
    setShowResult(null);
    setNextIdx(null);
    setSlotState(Array.from({ length: answer.length }, () => 'idle'));
  }, [nextIdx, setTopicIndex, topicId, difficulty, answer.length]);

  const slotStyleFor = useCallback((st: SlotState) => {
    if (st === 'correct') return s.badenSlotCorrect;
    if (st === 'wrong') return s.badenSlotWrong;
    return null;
  }, []);

  return (
    <BadenBackground>
      <View style={[s.topHeadBar, { paddingTop: height * 0.07 }]}>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={s.backButn}
          activeOpacity={0.5}
        >
          <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
        </TouchableOpacity>

        <Text style={s.badenTtl}>Crosswords</Text>
        <View style={s.badenCoupons}>
          <Image source={require('../HeritageAssts/imgs/head_coup.png')} />
          <Text style={s.badenCouponTxt}>X {coupons}</Text>
        </View>
      </View>

      <View style={s.badenCrd}>
        <Image
          source={topic.cover}
          style={{
            width: 180,
            height: 180,
            borderRadius: 12,
            alignSelf: 'center',
            marginBottom: 35,
          }}
        />

        <Text style={s.badenClue}>{item.clue}</Text>
      </View>

      <View style={s.slotsRow}>
        {Array.from({ length: answer.length }).map((_, i) => (
          <View key={i} style={[s.badenSlot, slotStyleFor(slotState[i])]}>
            <Text style={s.badenSlotTxt}>{picked[i] ?? ''}</Text>
          </View>
        ))}
      </View>

      <View style={s.badenBank}>
        {bank.map((l, i) => {
          const isUsed = !!used[i];
          return (
            <TouchableOpacity
              key={`${l}-${i}`}
              activeOpacity={0.85}
              onPress={() => onPick(l, i)}
              disabled={isUsed}
              style={[s.badenLetterBtn, { opacity: isUsed ? 0.35 : 1 }]}
            >
              <Text style={s.badenLetterTxt}>{l}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.bottomRow}>
        <TouchableOpacity
          onPress={onHint}
          activeOpacity={0.9}
          style={[s.badenHintBtn, { opacity: coupons >= 2 ? 1 : 0.5 }]}
        >
          <Text style={s.badenHintTxt}>Hint for 2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          activeOpacity={0.9}
          style={[s.badenConfirmBtn, { opacity: canConfirm ? 1 : 0.5 }]}
          disabled={!canConfirm}
        >
          <Text style={s.badenConfirmTxt}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBackspace} style={s.backspace}>
          <Image source={require('../HeritageAssts/imgs/clear.png')} />
        </TouchableOpacity>
      </View>

      {showFireworks && (
        <View style={s.fireworksWrap} pointerEvents="none">
          <Image
            source={require('../HeritageAssts/imgs/GreenFirework.gif')}
            style={s.fireworksGif}
          />
        </View>
      )}

      {showResult && (
        <View style={s.overlay}>
          {Platform.OS === 'android' && (
            <BlurView
              blurType="dark"
              blurAmount={1}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
          <View style={s.modal}>
            <Text style={s.modalTitle}>
              {showResult.ok ? 'Well Done! Crossword complete' : 'Try Again'}
            </Text>

            {showResult.ok ? (
              <>
                <Text style={s.modalSub}>
                  {showResult.reward} coupons collected
                </Text>
                <Text style={s.fact}>{item.fact}</Text>

                <TouchableOpacity
                  style={s.nextBtn}
                  onPress={goNext}
                  activeOpacity={0.9}
                >
                  <Text style={s.nextTxt}>Next Crossword</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={s.fact}>Wrong answer. Please try again.</Text>
                <TouchableOpacity
                  style={s.nextBtn}
                  onPress={resetTry}
                  activeOpacity={0.9}
                >
                  <Text style={s.nextTxt}>Continue</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  badenCoupons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badenCouponTxt: { color: '#fff', fontWeight: '700', fontSize: 18 },
  topHeadBar: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  backButn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badenTtl: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  badenCrd: {
    marginTop: 14,
    marginHorizontal: 24,
    borderRadius: 22,
    backgroundColor: '#1C1E22A6',
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2D33',
    paddingBottom: 30,
  },
  badenClue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  slotsRow: {
    marginTop: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  badenSlot: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0C2A66CC',
    borderWidth: 1,
    borderColor: '#2A2D33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badenSlotCorrect: {
    backgroundColor: '#0B4B10',
    borderColor: '#C9A24D',
    borderWidth: 2,
  },
  badenSlotWrong: {
    backgroundColor: '#510000',
    borderColor: '#C9A24D',
    borderWidth: 2,
  },
  badenSlotTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },

  badenBank: {
    marginTop: 14,
    marginHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  badenLetterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1C1E22CC',
    borderWidth: 1,
    borderColor: '#2A2D33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badenLetterTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },

  bottomRow: {
    marginTop: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  badenHintBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B4B10',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badenHintTxt: { color: '#fff', fontWeight: '900' },

  badenConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B1C66',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badenConfirmTxt: { color: '#fff', fontWeight: '900' },

  backspace: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6E6400',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fireworksWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireworksGif: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.9,
  },

  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modal: {
    width: '100%',
    borderRadius: 26,
    backgroundColor: '#1C1E22',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 18,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalSub: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '700',
  },
  fact: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  nextBtn: {
    marginTop: 14,
    height: 36,
    width: 140,
    borderRadius: 18,
    backgroundColor: '#0B1C66',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  nextTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  small: {
    color: '#fff',
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '700',
  },
});
