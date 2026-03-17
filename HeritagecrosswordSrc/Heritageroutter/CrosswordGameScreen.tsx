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
import { BADEN_CROSSWORDS, Difficulty } from '../uttils/badenCrosswords';
import { useCrosswordProgress } from '../uttils/useCrosswordProgress';

import { BlurView } from '@react-native-community/blur';
import { useBadenStore } from '../[Heritagecontxtt]/badenContext';
import Toast from 'react-native-toast-message';
import ExplrrLayout from '../Heritagecomponents/ExplrrLayout';

type ExplorCrosswSlotState = 'idle' | 'correct' | 'wrong';

function explorCrosswShuffle<T>(explorCrosswArr: T[]) {
  const explorCrosswCopy = [...explorCrosswArr];
  for (
    let explorCrosswIndex = explorCrosswCopy.length - 1;
    explorCrosswIndex > 0;
    explorCrosswIndex--
  ) {
    const explorCrosswRandomIndex = Math.floor(
      Math.random() * (explorCrosswIndex + 1),
    );
    [
      explorCrosswCopy[explorCrosswIndex],
      explorCrosswCopy[explorCrosswRandomIndex],
    ] = [
      explorCrosswCopy[explorCrosswRandomIndex],
      explorCrosswCopy[explorCrosswIndex],
    ];
  }
  return explorCrosswCopy;
}

function explorCrosswBuildLetterBank(explorCrosswAnswer: string) {
  const explorCrosswBase = explorCrosswAnswer.split('');
  const explorCrosswExtraPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const explorCrosswExtrasCount = Math.max(8, 16 - explorCrosswBase.length);
  const explorCrosswExtras: string[] = [];

  for (
    let explorCrosswIndex = 0;
    explorCrosswIndex < explorCrosswExtrasCount;
    explorCrosswIndex++
  ) {
    explorCrosswExtras.push(
      explorCrosswExtraPool[
        Math.floor(Math.random() * explorCrosswExtraPool.length)
      ],
    );
  }

  return explorCrosswShuffle([...explorCrosswBase, ...explorCrosswExtras]);
}

export default function CrosswordGameScreen() {
  const explorCrosswNav = useNavigation<any>();
  const explorCrosswRoute = useRoute<any>();
  const { topicId: explorCrosswTopicId, difficulty: explorCrosswDifficulty } =
    explorCrosswRoute.params as {
      topicId: string;
      difficulty: Difficulty;
    };

  const explorCrosswTopic = useMemo(
    () =>
      BADEN_CROSSWORDS.find(
        explorCrosswTopicItem =>
          explorCrosswTopicItem.id === explorCrosswTopicId,
      )!,
    [explorCrosswTopicId],
  );

  const {
    coupons: explorCrosswCoupons,
    applyWin: explorCrosswApplyWin,
    consumeCoupons: explorCrosswConsumeCoupons,
    getTopicIndex: explorCrosswGetTopicIndex,
    setTopicIndex: explorCrosswSetTopicIndex,
  } = useCrosswordProgress();

  const explorCrosswIdx = explorCrosswGetTopicIndex(
    explorCrosswTopicId,
    explorCrosswDifficulty,
  );
  const explorCrosswList = explorCrosswTopic.levels[explorCrosswDifficulty];
  const explorCrosswItem =
    explorCrosswList[Math.min(explorCrosswIdx, explorCrosswList.length - 1)];

  const explorCrosswAnswer = useMemo(
    () => explorCrosswItem.answer.toUpperCase(),
    [explorCrosswItem.answer],
  );

  const [explorCrosswPicked, setExplorCrosswPicked] = useState<string[]>([]);
  const [explorCrosswUsed, setExplorCrosswUsed] = useState<
    Record<number, boolean>
  >({});
  const [explorCrosswNextIdx, setExplorCrosswNextIdx] = useState<number | null>(
    null,
  );
  const [explorCrosswHintUsed, setExplorCrosswHintUsed] = useState(false);

  const [explorCrosswSlotState, setExplorCrosswSlotState] = useState<
    ExplorCrosswSlotState[]
  >(Array.from({ length: explorCrosswAnswer.length }, () => 'idle'));

  const [explorCrosswShowFireworks, setExplorCrosswShowFireworks] =
    useState(false);
  const explorCrosswFireworksTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [explorCrosswShowResult, setExplorCrosswShowResult] = useState<null | {
    ok: boolean;
    reward: number;
  }>(null);

  const {
    isEnabledVibration: explorCrosswIsEnabledVibration,
    isEnabledNotifications: explorCrosswIsEnabledNotifications,
  } = useBadenStore();

  const { height: explorCrosswHeight } = useWindowDimensions();

  const explorCrosswBank = useMemo(
    () => explorCrosswBuildLetterBank(explorCrosswAnswer),
    [explorCrosswAnswer],
  );

  const explorCrosswCanConfirm =
    explorCrosswPicked.length === explorCrosswAnswer.length;

  const explorCrosswResetFireworksTimer = useCallback(() => {
    if (explorCrosswFireworksTimer.current) {
      clearTimeout(explorCrosswFireworksTimer.current);
    }
    explorCrosswFireworksTimer.current = null;
  }, []);

  useEffect(() => {
    setExplorCrosswPicked([]);
    setExplorCrosswUsed({});
    setExplorCrosswNextIdx(null);
    setExplorCrosswHintUsed(false);
    setExplorCrosswShowResult(null);
    setExplorCrosswSlotState(
      Array.from({ length: explorCrosswAnswer.length }, () => 'idle'),
    );
    setExplorCrosswShowFireworks(false);
    explorCrosswResetFireworksTimer();
  }, [explorCrosswAnswer, explorCrosswResetFireworksTimer]);

  useEffect(() => {
    return () => {
      explorCrosswResetFireworksTimer();
    };
  }, [explorCrosswResetFireworksTimer]);

  const explorCrosswFlashSlot = useCallback(
    (explorCrosswPos: number, explorCrosswState: ExplorCrosswSlotState) => {
      setExplorCrosswSlotState(explorCrosswPrev => {
        const explorCrosswNext = [...explorCrosswPrev];
        explorCrosswNext[explorCrosswPos] = explorCrosswState;
        return explorCrosswNext;
      });

      setTimeout(() => {
        setExplorCrosswSlotState(explorCrosswPrev => {
          const explorCrosswNext = [...explorCrosswPrev];

          if (explorCrosswNext[explorCrosswPos] === explorCrosswState) {
            explorCrosswNext[explorCrosswPos] = 'idle';
          }

          return explorCrosswNext;
        });
      }, 450);
    },
    [],
  );

  const explorCrosswOnPick = useCallback(
    (explorCrosswLetter: string, explorCrosswIndex: number) => {
      if (explorCrosswUsed[explorCrosswIndex]) return;
      if (explorCrosswPicked.length >= explorCrosswAnswer.length) return;

      const explorCrosswPos = explorCrosswPicked.length;
      const explorCrosswExpected = explorCrosswAnswer[explorCrosswPos];
      const explorCrosswOkLetter = explorCrosswLetter === explorCrosswExpected;

      setExplorCrosswUsed(explorCrosswPrev => ({
        ...explorCrosswPrev,
        [explorCrosswIndex]: true,
      }));
      setExplorCrosswPicked(explorCrosswPrev => [
        ...explorCrosswPrev,
        explorCrosswLetter,
      ]);

      if (explorCrosswOkLetter) {
        explorCrosswFlashSlot(explorCrosswPos, 'correct');
      } else {
        if (explorCrosswIsEnabledVibration) {
          Vibration.vibrate(180);
        }
        explorCrosswFlashSlot(explorCrosswPos, 'wrong');
      }
    },
    [
      explorCrosswUsed,
      explorCrosswPicked.length,
      explorCrosswAnswer,
      explorCrosswFlashSlot,
      explorCrosswIsEnabledVibration,
    ],
  );

  const explorCrosswOnBackspace = useCallback(() => {
    if (explorCrosswPicked.length === 0) return;

    const explorCrosswLastPos = explorCrosswPicked.length - 1;
    const explorCrosswLastLetter = explorCrosswPicked[explorCrosswLastPos];

    setExplorCrosswPicked(explorCrosswPrev => explorCrosswPrev.slice(0, -1));

    setExplorCrosswSlotState(explorCrosswPrev => {
      const explorCrosswNext = [...explorCrosswPrev];
      explorCrosswNext[explorCrosswLastPos] = 'idle';
      return explorCrosswNext;
    });

    setExplorCrosswUsed(explorCrosswPrev => {
      const explorCrosswUsedIndexes = Object.keys(explorCrosswPrev)
        .map(explorCrosswNum => Number(explorCrosswNum))
        .filter(explorCrosswKey => explorCrosswPrev[explorCrosswKey]);

      for (
        let explorCrosswIndex = explorCrosswUsedIndexes.length - 1;
        explorCrosswIndex >= 0;
        explorCrosswIndex--
      ) {
        const explorCrosswKey = explorCrosswUsedIndexes[explorCrosswIndex];
        if (explorCrosswBank[explorCrosswKey] === explorCrosswLastLetter) {
          const explorCrosswNext = { ...explorCrosswPrev };
          explorCrosswNext[explorCrosswKey] = false;
          return explorCrosswNext;
        }
      }

      return explorCrosswPrev;
    });
  }, [explorCrosswPicked, explorCrosswBank]);

  const explorCrosswOnHint = useCallback(async () => {
    setExplorCrosswHintUsed(true);

    const explorCrosswCost = 2;
    if (explorCrosswCoupons < explorCrosswCost) return;
    if (explorCrosswPicked.length >= explorCrosswAnswer.length) return;

    const explorCrosswPos = explorCrosswPicked.length;
    const explorCrosswCorrect = explorCrosswAnswer[explorCrosswPos];

    const explorCrosswBankIndex = explorCrosswBank.findIndex(
      (explorCrosswLetter, explorCrosswIndex) =>
        explorCrosswLetter === explorCrosswCorrect &&
        !explorCrosswUsed[explorCrosswIndex],
    );

    if (explorCrosswBankIndex < 0) return;

    await explorCrosswConsumeCoupons(explorCrosswCost);

    setExplorCrosswUsed(explorCrosswPrev => ({
      ...explorCrosswPrev,
      [explorCrosswBankIndex]: true,
    }));
    setExplorCrosswPicked(explorCrosswPrev => [
      ...explorCrosswPrev,
      explorCrosswCorrect,
    ]);

    explorCrosswFlashSlot(explorCrosswPos, 'correct');
  }, [
    explorCrosswCoupons,
    explorCrosswConsumeCoupons,
    explorCrosswPicked.length,
    explorCrosswAnswer,
    explorCrosswBank,
    explorCrosswUsed,
    explorCrosswFlashSlot,
  ]);

  const explorCrosswOnConfirm = useCallback(async () => {
    if (!explorCrosswCanConfirm) return;

    const explorCrosswAttempt = explorCrosswPicked.join('');
    const explorCrosswOk = explorCrosswAttempt === explorCrosswAnswer;

    if (explorCrosswOk) {
      explorCrosswIsEnabledNotifications &&
        Toast.show({
          type: 'success',
          text1: 'Correct Answer!',
          text2: 'Congratulations on completing the crossword.',
          position: 'bottom',
        });

      setExplorCrosswShowFireworks(true);
      explorCrosswResetFireworksTimer();
      explorCrosswFireworksTimer.current = setTimeout(() => {
        setExplorCrosswShowFireworks(false);
      }, 4000);

      const { reward: explorCrosswReward } = await explorCrosswApplyWin(
        explorCrosswTopicId,
        explorCrosswDifficulty,
        explorCrosswIdx,
        {
          usedHint: explorCrosswHintUsed,
        },
      );

      const explorCrosswNewNextIdx =
        (explorCrosswIdx + 1) % explorCrosswList.length;
      setExplorCrosswNextIdx(explorCrosswNewNextIdx);
      setExplorCrosswShowResult({
        ok: true,
        reward: explorCrosswReward,
      });
      return;
    }

    if (explorCrosswIsEnabledVibration) {
      Vibration.vibrate(280);
    }

    setExplorCrosswShowResult({ ok: false, reward: 0 });
  }, [
    explorCrosswCanConfirm,
    explorCrosswPicked,
    explorCrosswAnswer,
    explorCrosswApplyWin,
    explorCrosswTopicId,
    explorCrosswDifficulty,
    explorCrosswIdx,
    explorCrosswList.length,
    explorCrosswHintUsed,
    explorCrosswResetFireworksTimer,
    explorCrosswIsEnabledNotifications,
    explorCrosswIsEnabledVibration,
  ]);

  const explorCrosswResetTry = useCallback(() => {
    setExplorCrosswPicked([]);
    setExplorCrosswUsed({});
    setExplorCrosswShowResult(null);
    setExplorCrosswHintUsed(false);
    setExplorCrosswSlotState(
      Array.from({ length: explorCrosswAnswer.length }, () => 'idle'),
    );
  }, [explorCrosswAnswer.length]);

  const explorCrosswGoNext = useCallback(async () => {
    if (explorCrosswNextIdx === 0) {
      explorCrosswNav.navigate('CrosswordTopics');
      return;
    }

    if (explorCrosswNextIdx !== null) {
      await explorCrosswSetTopicIndex(
        explorCrosswTopicId,
        explorCrosswDifficulty,
        explorCrosswNextIdx,
      );
    }

    setExplorCrosswHintUsed(false);
    setExplorCrosswPicked([]);
    setExplorCrosswUsed({});
    setExplorCrosswShowResult(null);
    setExplorCrosswNextIdx(null);
    setExplorCrosswSlotState(
      Array.from({ length: explorCrosswAnswer.length }, () => 'idle'),
    );
  }, [
    explorCrosswNextIdx,
    explorCrosswSetTopicIndex,
    explorCrosswTopicId,
    explorCrosswDifficulty,
    explorCrosswAnswer.length,
    explorCrosswNav,
  ]);

  const explorCrosswSlotStyleFor = useCallback(
    (explorCrosswState: ExplorCrosswSlotState) => {
      if (explorCrosswState === 'correct') {
        return explorCrosswStyles.explorCrosswBadenSlotCorrect;
      }
      if (explorCrosswState === 'wrong') {
        return explorCrosswStyles.explorCrosswBadenSlotWrong;
      }
      return null;
    },
    [],
  );

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswTopHeadBar,
          { paddingTop: explorCrosswHeight * 0.07 },
        ]}
      >
        <TouchableOpacity
          onPress={() => explorCrosswNav.goBack()}
          style={explorCrosswStyles.explorCrosswBackBtn}
          activeOpacity={0.5}
        >
          <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
        </TouchableOpacity>

        <Text style={explorCrosswStyles.explorCrosswBadenTitle}>
          Crosswords
        </Text>

        <View style={explorCrosswStyles.explorCrosswBadenCoupons}>
          <Image source={require('../HeritageAssts/imgs/head_coup.png')} />
          <Text style={explorCrosswStyles.explorCrosswBadenCouponTxt}>
            X {explorCrosswCoupons}
          </Text>
        </View>
      </View>

      <View style={explorCrosswStyles.explorCrosswBadenCard}>
        <Image
          source={explorCrosswTopic.cover}
          style={{
            width: 180,
            height: 180,
            borderRadius: 12,
            alignSelf: 'center',
            marginBottom: 35,
          }}
        />

        <Text style={explorCrosswStyles.explorCrosswBadenClue}>
          {explorCrosswItem.clue}
        </Text>
      </View>

      <View style={explorCrosswStyles.explorCrosswSlotsRow}>
        {Array.from({ length: explorCrosswAnswer.length }).map(
          (_, explorCrosswIndex) => (
            <View
              key={explorCrosswIndex}
              style={[
                explorCrosswStyles.explorCrosswBadenSlot,
                explorCrosswSlotStyleFor(
                  explorCrosswSlotState[explorCrosswIndex],
                ),
              ]}
            >
              <Text style={explorCrosswStyles.explorCrosswBadenSlotTxt}>
                {explorCrosswPicked[explorCrosswIndex] ?? ''}
              </Text>
            </View>
          ),
        )}
      </View>

      <View style={explorCrosswStyles.explorCrosswBadenBank}>
        {explorCrosswBank.map((explorCrosswLetter, explorCrosswIndex) => {
          const explorCrosswIsUsed = !!explorCrosswUsed[explorCrosswIndex];

          return (
            <TouchableOpacity
              key={`${explorCrosswLetter}-${explorCrosswIndex}`}
              activeOpacity={0.85}
              onPress={() =>
                explorCrosswOnPick(explorCrosswLetter, explorCrosswIndex)
              }
              disabled={explorCrosswIsUsed}
              style={[
                explorCrosswStyles.explorCrosswBadenLetterBtn,
                { opacity: explorCrosswIsUsed ? 0.35 : 1 },
              ]}
            >
              <Text style={explorCrosswStyles.explorCrosswBadenLetterTxt}>
                {explorCrosswLetter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={explorCrosswStyles.explorCrosswBottomRow}>
        <TouchableOpacity
          onPress={explorCrosswOnHint}
          activeOpacity={0.9}
          style={[
            explorCrosswStyles.explorCrosswBadenHintBtn,
            { opacity: explorCrosswCoupons >= 2 ? 1 : 0.5 },
          ]}
        >
          <Text style={explorCrosswStyles.explorCrosswBadenHintTxt}>
            Hint for 2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={explorCrosswOnConfirm}
          activeOpacity={0.9}
          style={[
            explorCrosswStyles.explorCrosswBadenConfirmBtn,
            { opacity: explorCrosswCanConfirm ? 1 : 0.5 },
          ]}
          disabled={!explorCrosswCanConfirm}
        >
          <Text style={explorCrosswStyles.explorCrosswBadenConfirmTxt}>
            Confirm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={explorCrosswOnBackspace}
          style={explorCrosswStyles.explorCrosswBackspace}
        >
          <Image source={require('../HeritageAssts/imgs/clear.png')} />
        </TouchableOpacity>
      </View>

      {explorCrosswShowFireworks && (
        <View
          style={explorCrosswStyles.explorCrosswFireworksWrap}
          pointerEvents="none"
        >
          <Image
            source={require('../HeritageAssts/imgs/GreenFirework.gif')}
            style={explorCrosswStyles.explorCrosswFireworksGif}
          />
        </View>
      )}

      {explorCrosswShowResult && (
        <View style={explorCrosswStyles.explorCrosswOverlay}>
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

          <View style={explorCrosswStyles.explorCrosswModal}>
            <Text style={explorCrosswStyles.explorCrosswModalTitle}>
              {explorCrosswShowResult.ok
                ? 'Well Done! Crossword complete'
                : 'Try Again'}
            </Text>

            {explorCrosswShowResult.ok ? (
              <>
                <Text style={explorCrosswStyles.explorCrosswModalSub}>
                  {explorCrosswShowResult.reward} coupons collected
                </Text>
                <Text style={explorCrosswStyles.explorCrosswFact}>
                  {explorCrosswItem.fact}
                </Text>

                <TouchableOpacity
                  style={explorCrosswStyles.explorCrosswNextBtn}
                  onPress={explorCrosswGoNext}
                  activeOpacity={0.9}
                >
                  <Text style={explorCrosswStyles.explorCrosswNextTxt}>
                    Next Crossword
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={explorCrosswStyles.explorCrosswFact}>
                  Wrong answer. Please try again.
                </Text>
                <TouchableOpacity
                  style={explorCrosswStyles.explorCrosswNextBtn}
                  onPress={explorCrosswResetTry}
                  activeOpacity={0.9}
                >
                  <Text style={explorCrosswStyles.explorCrosswNextTxt}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswBadenCoupons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  explorCrosswBadenCouponTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  explorCrosswTopHeadBar: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },

  explorCrosswBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswBadenTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  explorCrosswBadenCard: {
    marginTop: 14,
    marginHorizontal: 24,
    borderRadius: 22,
    backgroundColor: '#1C1E22A6',
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2D33',
    paddingBottom: 30,
  },

  explorCrosswBadenClue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  explorCrosswSlotsRow: {
    marginTop: 34,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },

  explorCrosswBadenSlot: {
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

  explorCrosswBadenSlotCorrect: {
    backgroundColor: '#0B4B10',
    borderColor: '#C9A24D',
    borderWidth: 2,
  },

  explorCrosswBadenSlotWrong: {
    backgroundColor: '#510000',
    borderColor: '#C9A24D',
    borderWidth: 2,
  },

  explorCrosswBadenSlotTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  explorCrosswBadenBank: {
    marginTop: 14,
    marginHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },

  explorCrosswBadenLetterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1C1E22CC',
    borderWidth: 1,
    borderColor: '#2A2D33',
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswBadenLetterTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  explorCrosswBottomRow: {
    marginTop: 16,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 30,
  },

  explorCrosswBadenHintBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B4B10',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswBadenHintTxt: {
    color: '#fff',
    fontWeight: '900',
  },

  explorCrosswBadenConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B1C66',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswBadenConfirmTxt: {
    color: '#fff',
    fontWeight: '900',
  },

  explorCrosswBackspace: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6E6400',
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswFireworksWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswFireworksGif: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.9,
  },

  explorCrosswOverlay: {
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

  explorCrosswModal: {
    width: '100%',
    borderRadius: 26,
    backgroundColor: '#1C1E22',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 18,
  },

  explorCrosswModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },

  explorCrosswModalSub: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '700',
  },

  explorCrosswFact: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  explorCrosswNextBtn: {
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

  explorCrosswNextTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  explorCrosswSmall: {
    color: '#fff',
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '700',
  },
});
