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
import BadenBackground from './BadenBackground';
import {
  BADEN_EXPLORE_ARTICLES,
  ExploreArticle,
} from '../uttils/badenExploreArticles';
import { useCrosswordProgress } from '../uttils/useCrosswordProgress';

const SAVED_KEY = '@baden_explore_saved_v1';
const QUIZ_DONE_KEY = '@baden_explore_quiz_done_v1';
const DEFAULT_THUMB = require('../HeritageAssts/imgs/walp1.png');

type QuizDoneSet = Record<string, true>;
type SavedSet = Record<string, true>;

type NavParams = { Exploreartclsscrndetails: { articleId: string } };

export default function Exploreartclsscrndetails() {
  const nav = useNavigation<any>();
  const route = useRoute<RouteProp<NavParams, 'Exploreartclsscrndetails'>>();
  const { height } = useWindowDimensions();
  const articleId = route.params?.articleId ?? '';
  const article = BADEN_EXPLORE_ARTICLES.find(a => a.id === articleId) ?? null;

  const { addCoupons, reload } = useCrosswordProgress();
  const [quizDoneIds, setQuizDoneIds] = useState<QuizDoneSet>({});
  const [savedIds, setSavedIds] = useState<SavedSet>({});
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(
    null,
  );
  const [quizJustRewarded, setQuizJustRewarded] = useState(false);

  const loadQuizDone = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(QUIZ_DONE_KEY);
      setQuizDoneIds(raw ? JSON.parse(raw) : {});
    } catch {
      setQuizDoneIds({});
    }
  }, []);

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
      loadQuizDone();
      loadSaved();
      reload();
    }, [loadQuizDone, loadSaved, reload]),
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

  const onShare = useCallback(async (a: ExploreArticle) => {
    try {
      await Share.share({
        message: `${a.title}\n\n${a.body}\n\nTrue / False\n${a.quizQuestion} (${
          a.quizAnswer ? 'True' : 'False'
        })`,
      });
    } catch {}
  }, []);

  const answerTrueFalse = useCallback(
    async (a: ExploreArticle, userAnswer: boolean) => {
      const correct = userAnswer === a.quizAnswer;
      const alreadyDone = !!quizDoneIds[a.id];

      if (alreadyDone) {
        setQuizFeedback(correct ? 'correct' : 'wrong');
        return;
      }

      if (correct) {
        await addCoupons(1);
        const nextDone: QuizDoneSet = { ...quizDoneIds, [a.id]: true };
        setQuizDoneIds(nextDone);
        await AsyncStorage.setItem(QUIZ_DONE_KEY, JSON.stringify(nextDone));
        setQuizFeedback('correct');
        setQuizJustRewarded(true);
      } else {
        setQuizFeedback('wrong');
      }
    },
    [quizDoneIds, addCoupons],
  );

  if (!article) {
    return (
      <BadenBackground>
        <View style={[s.container, { paddingTop: height * 0.07 }]}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>
          <Text style={s.errorText}>Article not found.</Text>
        </View>
      </BadenBackground>
    );
  }

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
        </View>

        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View
            style={{
              borderRadius: 22,
              backgroundColor: '#1C1E22A6',
              borderWidth: 1,
              borderColor: '#2A2D33',
              padding: 20,
              paddingVertical: 4,
              paddingTop: 0,
            }}
          >
            <View style={s.headerRow}>
              <Image
                source={article.thumb ?? DEFAULT_THUMB}
                style={s.thumb}
                resizeMode="cover"
              />
              <View style={s.titleWrap}>
                <Text style={s.title} numberOfLines={2}>
                  {article.title}
                </Text>
              </View>
            </View>
            <Text style={s.body}>{article.body}</Text>
            <Text style={s.quizLabel}>True or False</Text>
            <Text style={s.quizQuestion}>{article.quizQuestion}</Text>
            <View style={s.trueFalseRow}>
              <TouchableOpacity
                style={[
                  s.trueFalseBtn,
                  quizFeedback === 'correct' &&
                    article.quizAnswer === true &&
                    s.trueFalseBtnCorrect,
                  quizFeedback === 'wrong' &&
                    article.quizAnswer !== true &&
                    s.trueFalseBtnWrong,
                  quizFeedback !== null && s.trueFalseBtnDisabled,
                ]}
                onPress={() =>
                  quizFeedback === null && answerTrueFalse(article, true)
                }
                activeOpacity={0.8}
                disabled={quizFeedback !== null}
              >
                <Text style={s.trueFalseBtnText}>True</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.trueFalseBtn,
                  quizFeedback === 'correct' &&
                    article.quizAnswer === false &&
                    s.trueFalseBtnCorrect,
                  quizFeedback === 'wrong' &&
                    article.quizAnswer !== false &&
                    s.trueFalseBtnWrong,
                  quizFeedback !== null && s.trueFalseBtnDisabled,
                ]}
                onPress={() =>
                  quizFeedback === null && answerTrueFalse(article, false)
                }
                activeOpacity={0.8}
                disabled={quizFeedback !== null}
              >
                <Text style={s.trueFalseBtnText}>False</Text>
              </TouchableOpacity>
            </View>

            {quizFeedback === 'correct' && quizJustRewarded && (
              <Text style={s.quizRewardText}>
                Well done! 1 ticket received!
              </Text>
            )}
            {quizFeedback === 'wrong' && (
              <Text style={s.quizWrongText}>Incorrect.</Text>
            )}
            <View style={s.bottomBar}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSaved(article.id)}
                style={s.bottomIcon}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Image
                  source={
                    isSaved(article.id)
                      ? require('../HeritageAssts/imgs/heritagecnartcsvd.png')
                      : require('../HeritageAssts/imgs/heritagecnartcsv.png')
                  }
                  style={s.bottomIconImg}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => nav.navigate('CrosswordTopics')}
                style={s.testYourselfBtn}
              >
                <Text style={s.testYourselfBtnText}>Test Yourself</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onShare(article)}
                style={s.bottomIcon}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Image
                  source={require('../HeritageAssts/imgs/s_btn.png')}
                  style={s.bottomIconImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  thumb: {
    width: 135,
    height: 135,
    borderRadius: 23,
    left: -20,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  body: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 20,
  },
  quizLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  quizQuestion: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  trueFalseRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
    marginTop: 5,
    justifyContent: 'center',
  },
  trueFalseBtn: {
    width: 98,
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#030051',
    backgroundColor: 'rgba(3,0,81,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trueFalseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  trueFalseBtnCorrect: {
    backgroundColor: '#164D0B',
    borderColor: '#FFFFFF33',
  },
  trueFalseBtnWrong: {
    backgroundColor: '#4D0B0B',
    borderColor: '#FFFFFF33',
  },
  trueFalseBtnDisabled: {
    opacity: 0.8,
  },
  quizRewardText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 3,
  },
  quizWrongText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 3,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  bottomIcon: {
    padding: 8,
  },
  bottomIconImg: {
    width: 28,
    height: 28,
  },
  testYourselfBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#030051',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  testYourselfBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
