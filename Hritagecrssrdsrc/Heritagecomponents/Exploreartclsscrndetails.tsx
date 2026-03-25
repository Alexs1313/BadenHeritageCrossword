// details screen

import {
  useFocusEffect,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

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

import {
  BADEN_EXPLORE_ARTICLES,
  ExploreArticle,
} from '../dbUttls/badenExploreArticles';
import { useCrosswordProgress } from '../dbUttls/useCrosswordProgress';
import ExplrrLayout from './ExplrrLayout';

const explorCrosswSavedKey = '@baden_explore_saved_v1';
const explorCrosswQuizDoneKey = '@baden_explore_quiz_done_v1';
const explorCrosswDefaultThumb = require('../HeritageAssts/imgs/walp1.png');

type ExplorCrosswQuizDoneSet = Record<string, true>;
type ExplorCrosswSavedSet = Record<string, true>;

type ExplorCrosswNavParams = {
  Exploreartclsscrndetails: { articleId: string };
};

export default function Exploreartclsscrndetails() {
  const explorCrosswNav = useNavigation<any>();
  const explorCrosswRoute =
    useRoute<RouteProp<ExplorCrosswNavParams, 'Exploreartclsscrndetails'>>();
  const { height: explorCrosswHeight } = useWindowDimensions();
  const explorCrosswArticleId = explorCrosswRoute.params?.articleId ?? '';
  const explorCrosswArticle =
    BADEN_EXPLORE_ARTICLES.find(
      explorCrosswItem => explorCrosswItem.id === explorCrosswArticleId,
    ) ?? null;

  const { addCoupons: explorCrosswAddCoupons, reload: explorCrosswReload } =
    useCrosswordProgress();

  const [explorCrosswQuizDoneIds, setExplorCrosswQuizDoneIds] =
    useState<ExplorCrosswQuizDoneSet>({});
  const [explorCrosswSavedIds, setExplorCrosswSavedIds] =
    useState<ExplorCrosswSavedSet>({});
  const [explorCrosswQuizFeedback, setExplorCrosswQuizFeedback] = useState<
    'correct' | 'wrong' | null
  >(null);
  const [explorCrosswQuizJustRewarded, setExplorCrosswQuizJustRewarded] =
    useState(false);

  const explorCrosswLoadQuizDone = useCallback(async () => {
    try {
      const explorCrosswRaw = await AsyncStorage.getItem(
        explorCrosswQuizDoneKey,
      );
      setExplorCrosswQuizDoneIds(
        explorCrosswRaw ? JSON.parse(explorCrosswRaw) : {},
      );
    } catch {
      setExplorCrosswQuizDoneIds({});
    }
  }, []);

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
      explorCrosswLoadQuizDone();
      explorCrosswLoadSaved();
      explorCrosswReload();
    }, [explorCrosswLoadQuizDone, explorCrosswLoadSaved, explorCrosswReload]),
  );

  const explorCrosswToggleSaved = useCallback(
    async (explorCrosswId: string) => {
      const explorCrosswNext: ExplorCrosswSavedSet = {
        ...explorCrosswSavedIds,
      };

      if (explorCrosswNext[explorCrosswId]) {
        delete explorCrosswNext[explorCrosswId];
      } else {
        explorCrosswNext[explorCrosswId] = true;
      }

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

  const explorCrosswOnShare = useCallback(
    async (explorCrosswItem: ExploreArticle) => {
      try {
        await Share.share({
          message: `${explorCrosswItem.title}\n\n${
            explorCrosswItem.body
          }\n\nTrue / False\n${explorCrosswItem.quizQuestion} (${
            explorCrosswItem.quizAnswer ? 'True' : 'False'
          })`,
        });
      } catch {}
    },
    [],
  );

  const explorCrosswAnswerTrueFalse = useCallback(
    async (
      explorCrosswItem: ExploreArticle,
      explorCrosswUserAnswer: boolean,
    ) => {
      const explorCrosswCorrect =
        explorCrosswUserAnswer === explorCrosswItem.quizAnswer;
      const explorCrosswAlreadyDone =
        !!explorCrosswQuizDoneIds[explorCrosswItem.id];

      if (explorCrosswAlreadyDone) {
        setExplorCrosswQuizFeedback(explorCrosswCorrect ? 'correct' : 'wrong');
        return;
      }

      if (explorCrosswCorrect) {
        await explorCrosswAddCoupons(1);

        const explorCrosswNextDone: ExplorCrosswQuizDoneSet = {
          ...explorCrosswQuizDoneIds,
          [explorCrosswItem.id]: true,
        };

        setExplorCrosswQuizDoneIds(explorCrosswNextDone);
        await AsyncStorage.setItem(
          explorCrosswQuizDoneKey,
          JSON.stringify(explorCrosswNextDone),
        );
        setExplorCrosswQuizFeedback('correct');
        setExplorCrosswQuizJustRewarded(true);
      } else {
        setExplorCrosswQuizFeedback('wrong');
      }
    },
    [explorCrosswQuizDoneIds, explorCrosswAddCoupons],
  );

  if (!explorCrosswArticle) {
    return (
      <ExplrrLayout>
        <View
          style={[
            explorCrosswStyles.explorCrosswContainer,
            { paddingTop: explorCrosswHeight * 0.07 },
          ]}
        >
          <TouchableOpacity
            onPress={() => explorCrosswNav.goBack()}
            style={explorCrosswStyles.explorCrosswBackBtn}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={explorCrosswStyles.explorCrosswErrorText}>
            Article not found.
          </Text>
        </View>
      </ExplrrLayout>
    );
  }

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
        </View>

        <ScrollView
          style={explorCrosswStyles.explorCrosswScroll}
          contentContainerStyle={explorCrosswStyles.explorCrosswScrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={explorCrosswStyles.explorCrosswContentCard}>
            <View style={explorCrosswStyles.explorCrosswHeaderRow}>
              <Image
                source={explorCrosswArticle.thumb ?? explorCrosswDefaultThumb}
                style={explorCrosswStyles.explorCrosswThumb}
                resizeMode="cover"
              />
              <View style={explorCrosswStyles.explorCrosswTitleWrap}>
                <Text
                  style={explorCrosswStyles.explorCrosswTitle}
                  numberOfLines={2}
                >
                  {explorCrosswArticle.title}
                </Text>
              </View>
            </View>

            <Text style={explorCrosswStyles.explorCrosswBody}>
              {explorCrosswArticle.body}
            </Text>

            <Text style={explorCrosswStyles.explorCrosswQuizLabel}>
              True or False
            </Text>

            <Text style={explorCrosswStyles.explorCrosswQuizQuestion}>
              {explorCrosswArticle.quizQuestion}
            </Text>

            <View style={explorCrosswStyles.explorCrosswTrueFalseRow}>
              <TouchableOpacity
                style={[
                  explorCrosswStyles.explorCrosswTrueFalseBtn,
                  explorCrosswQuizFeedback === 'correct' &&
                    explorCrosswArticle.quizAnswer === true &&
                    explorCrosswStyles.explorCrosswTrueFalseBtnCorrect,
                  explorCrosswQuizFeedback === 'wrong' &&
                    explorCrosswArticle.quizAnswer !== true &&
                    explorCrosswStyles.explorCrosswTrueFalseBtnWrong,
                  explorCrosswQuizFeedback !== null &&
                    explorCrosswStyles.explorCrosswTrueFalseBtnDisabled,
                ]}
                onPress={() =>
                  explorCrosswQuizFeedback === null &&
                  explorCrosswAnswerTrueFalse(explorCrosswArticle, true)
                }
                activeOpacity={0.8}
                disabled={explorCrosswQuizFeedback !== null}
              >
                <Text style={explorCrosswStyles.explorCrosswTrueFalseBtnText}>
                  True
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  explorCrosswStyles.explorCrosswTrueFalseBtn,
                  explorCrosswQuizFeedback === 'correct' &&
                    explorCrosswArticle.quizAnswer === false &&
                    explorCrosswStyles.explorCrosswTrueFalseBtnCorrect,
                  explorCrosswQuizFeedback === 'wrong' &&
                    explorCrosswArticle.quizAnswer !== false &&
                    explorCrosswStyles.explorCrosswTrueFalseBtnWrong,
                  explorCrosswQuizFeedback !== null &&
                    explorCrosswStyles.explorCrosswTrueFalseBtnDisabled,
                ]}
                onPress={() =>
                  explorCrosswQuizFeedback === null &&
                  explorCrosswAnswerTrueFalse(explorCrosswArticle, false)
                }
                activeOpacity={0.8}
                disabled={explorCrosswQuizFeedback !== null}
              >
                <Text style={explorCrosswStyles.explorCrosswTrueFalseBtnText}>
                  False
                </Text>
              </TouchableOpacity>
            </View>

            {explorCrosswQuizFeedback === 'correct' &&
              explorCrosswQuizJustRewarded && (
                <Text style={explorCrosswStyles.explorCrosswQuizRewardText}>
                  Well done! 1 ticket received!
                </Text>
              )}

            {explorCrosswQuizFeedback === 'wrong' && (
              <Text style={explorCrosswStyles.explorCrosswQuizWrongText}>
                Incorrect.
              </Text>
            )}

            <View style={explorCrosswStyles.explorCrosswBottomBar}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => explorCrosswToggleSaved(explorCrosswArticle.id)}
                style={explorCrosswStyles.explorCrosswBottomIcon}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Image
                  source={
                    explorCrosswIsSaved(explorCrosswArticle.id)
                      ? require('../HeritageAssts/imgs/heritagecnartcsvd.png')
                      : require('../HeritageAssts/imgs/heritagecnartcsv.png')
                  }
                  style={explorCrosswStyles.explorCrosswBottomIconImg}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => explorCrosswNav.navigate('CrosswordTopics')}
                style={explorCrosswStyles.explorCrosswTestYourselfBtn}
              >
                <Text
                  style={explorCrosswStyles.explorCrosswTestYourselfBtnText}
                >
                  Test Yourself
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => explorCrosswOnShare(explorCrosswArticle)}
                style={explorCrosswStyles.explorCrosswBottomIcon}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Image
                  source={require('../HeritageAssts/imgs/s_btn.png')}
                  style={explorCrosswStyles.explorCrosswBottomIconImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  explorCrosswHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  explorCrosswBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorCrosswErrorText: {
    color: '#fff',
    fontSize: 16,
  },
  explorCrosswScroll: {
    flex: 1,
  },
  explorCrosswScrollContent: {
    paddingBottom: 24,
  },
  explorCrosswContentCard: {
    borderRadius: 22,
    backgroundColor: '#1C1E22A6',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 20,
    paddingVertical: 4,
    paddingTop: 0,
  },
  explorCrosswHeaderRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  explorCrosswThumb: {
    width: 135,
    height: 135,
    borderRadius: 23,
    left: -20,
  },
  explorCrosswTitleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  explorCrosswTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  explorCrosswBody: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 20,
  },
  explorCrosswQuizLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  explorCrosswQuizQuestion: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  explorCrosswTrueFalseRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
    marginTop: 5,
    justifyContent: 'center',
  },
  explorCrosswTrueFalseBtn: {
    width: 98,
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#030051',
    backgroundColor: 'rgba(3,0,81,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorCrosswTrueFalseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  explorCrosswTrueFalseBtnCorrect: {
    backgroundColor: '#164D0B',
    borderColor: '#FFFFFF33',
  },
  explorCrosswTrueFalseBtnWrong: {
    backgroundColor: '#4D0B0B',
    borderColor: '#FFFFFF33',
  },
  explorCrosswTrueFalseBtnDisabled: {
    opacity: 0.8,
  },
  explorCrosswQuizRewardText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 3,
  },
  explorCrosswQuizWrongText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 3,
  },
  explorCrosswBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  explorCrosswBottomIcon: {
    padding: 8,
  },
  explorCrosswBottomIconImg: {
    width: 28,
    height: 28,
  },
  explorCrosswTestYourselfBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#030051',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  explorCrosswTestYourselfBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
