import { useBadenStore } from '../[Heritagecontxtt]/badenContext';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import BadenBackground from './ExplrrLayout';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';

import { useCrosswordProgress } from '../uttils/useCrosswordProgress';
import { BADEN_CROSSWORDS } from '../uttils/badenCrosswords';
import LinearGradient from 'react-native-linear-gradient';
import ExplrrLayout from './ExplrrLayout';

type ExplorCrosswAchievementId =
  | 'first_step'
  | 'early_scholar'
  | 'steady_progress'
  | 'consistent_mind'
  | 'heritage_keeper'
  | 'legacy_completed';

type ExplorCrosswSeenMap = Record<ExplorCrosswAchievementId, true>;

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

const explorCrosswAchSeenKey = '@baden_achievements_seen_v1';

const explorCrosswQuotes = [
  'Progress is built through consistency, not intensity.',
  'Depth matters more than speed.',
  'Calm focus outperforms constant urgency.',
  'Knowledge becomes power only when applied.',
  'Elegance begins with clarity of thought.',
  'Discipline creates freedom over time.',
  'Thoughtful choices shape lasting results.',
  'Mastery grows from patience and precision.',
  'Quiet confidence comes from preparation.',
  'True refinement is never rushed.',
  'Learning is an investment that compounds.',
  'Structure brings calm to complexity.',
  'Meaning emerges through understanding.',
  'Excellence is a habit, not an event.',
  'Reflection sharpens direction.',
  'Small insights lead to enduring growth.',
  'Consistent effort outlives motivation.',
  'Wisdom favors those who listen carefully.',
  'Focus reveals what truly matters.',
  'Progress feels subtle before it feels significant.',
];

const explorCrosswPickRandom = (explorCrosswArr: string[]) =>
  explorCrosswArr[Math.floor(Math.random() * explorCrosswArr.length)];

const explorCrosswMenuIcons: Record<string, ImageSourcePropType | undefined> = {
  crosswords: require('../HeritageAssts/imgs/heritagecricon.png'),
  explore: require('../HeritageAssts/imgs/heritagecart.png'),
  achievements: require('../HeritageAssts/imgs/heritagecachw.png'),
  facts: require('../HeritageAssts/imgs/heritagecrfacts.png'),
  settings: require('../HeritageAssts/imgs/heritagecrsett.png'),
  wallpapers: require('../HeritageAssts/imgs/heritagecwallp.png'),
};

type ExplorCrosswMenuButtonProps = {
  label: string;
  iconSource?: ImageSourcePropType;
  onPress: () => void;
  size?: number | string;
  showBadge?: boolean;
  textSize?: number | string;
  textColor?: string;
  height?: number;
};

const ExplorCrosswMenuButton = ({
  label: explorCrosswLabel,
  iconSource: explorCrosswIconSource,
  onPress: explorCrosswOnPress,
  size: explorCrosswSize = 150,
  showBadge: explorCrosswShowBadge = false,
  textSize: explorCrosswTextSize = 18,
  height: explorCrosswHeight = 61,
}: ExplorCrosswMenuButtonProps) => (
  <TouchableOpacity
    onPress={explorCrosswOnPress}
    activeOpacity={0.8}
    style={{ width: explorCrosswSize }}
  >
    <LinearGradient
      colors={['#030051', '#030051']}
      style={[
        explorCrosswStyles.explorCrosswMenuBtn,
        { height: explorCrosswHeight },
      ]}
    >
      <View
        style={{
          padding: 10,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Image
            source={explorCrosswIconSource}
            style={explorCrosswStyles.explorCrosswMenuBtnIcon}
            resizeMode="contain"
          />
        </View>

        <View style={explorCrosswStyles.explorCrosswMenuBtnContent}>
          <Text
            style={[
              explorCrosswStyles.explorCrosswMenuBtnText,
              {
                fontSize:
                  typeof explorCrosswTextSize === 'number'
                    ? explorCrosswTextSize
                    : 18,
              },
            ]}
            numberOfLines={1}
          >
            {explorCrosswLabel}
          </Text>
          {/* {explorCrosswShowBadge && <View style={explorCrosswStyles.explorCrosswRedDot} />} */}
        </View>

        <Image source={require('../HeritageAssts/imgs/heritagecnextarr.png')} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const Explreritagehome = () => {
  const { height: explorCrosswWindowHeight } = useWindowDimensions();
  const explorCrosswSmallPhone = explorCrosswWindowHeight < 700;

  const explorCrosswNavigation = useNavigation<any>();
  const [explorCrosswQuote, setExplorCrosswQuote] = useState(() =>
    explorCrosswPickRandom(explorCrosswQuotes),
  );

  const [explorCrosswSettingsOpen, setExplorCrosswSettingsOpen] =
    useState(false);
  const [explorCrosswAboutOpen, setExplorCrosswAboutOpen] = useState(false);

  const [explorCrosswTrack, setExplorCrosswTrack] = useState(0);
  const [explorCrosswSound, setExplorCrosswSound] = useState<any>(null);

  const explorCrosswTrackList = [
    'monument_music-aristocratic-spin-waltz-191526.mp3',
    'monument_music-aristocratic-spin-waltz-191526.mp3',
  ];

  const {
    isEnabledVibration: explorCrosswIsEnabledVibration,
    setIsEnabledVibration: setExplorCrosswIsEnabledVibration,
    isEnabledSound: explorCrosswIsEnabledSound,
    setIsEnabledSound: setExplorCrosswIsEnabledSound,
    isEnabledNotifications: explorCrosswIsEnabledNotifications,
    setIsEnabledNotifications: setExplorCrosswIsEnabledNotifications,
  } = useBadenStore();

  const [explorCrosswHasNewAchievement, setExplorCrosswHasNewAchievement] =
    useState(false);

  const {
    completedTotal: explorCrosswCompletedTotal,
    noHintWins: explorCrosswNoHintWins,
    completedEasy: explorCrosswCompletedEasy,
    completedMedium: explorCrosswCompletedMedium,
    completedHard: explorCrosswCompletedHard,
    reload: explorCrosswReload,
  } = useCrosswordProgress();

  useFocusEffect(
    useCallback(() => {
      explorCrosswLoadBadenBgMusic();
      explorCrosswLoadBadenVibration();
      explorCrosswLoadBadenNotifications();

      explorCrosswReload();
    }, [explorCrosswReload]),
  );

  useEffect(() => {
    const explorCrosswRun = async () => {
      try {
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

        setExplorCrosswHasNewAchievement(
          explorCrosswUnlockedIds.some(
            explorCrosswId => !explorCrosswSeen[explorCrosswId],
          ),
        );
      } catch {
        setExplorCrosswHasNewAchievement(false);
      }
    };

    explorCrosswRun();
  }, [
    explorCrosswCompletedTotal,
    explorCrosswNoHintWins,
    explorCrosswCompletedEasy,
    explorCrosswCompletedMedium,
    explorCrosswCompletedHard,
  ]);

  const explorCrosswCheckAchievementsDot = useCallback(async () => {
    try {
      await explorCrosswReload();

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

      const explorCrosswHasNew = explorCrosswUnlockedIds.some(
        explorCrosswId => !explorCrosswSeen[explorCrosswId],
      );

      setExplorCrosswHasNewAchievement(explorCrosswHasNew);
    } catch {
      setExplorCrosswHasNewAchievement(false);
    }
  }, [
    explorCrosswReload,
    explorCrosswCompletedTotal,
    explorCrosswNoHintWins,
    explorCrosswCompletedEasy,
    explorCrosswCompletedMedium,
    explorCrosswCompletedHard,
  ]);

  useFocusEffect(
    useCallback(() => {
      explorCrosswLoadBadenBgMusic();
      explorCrosswLoadBadenVibration();
      explorCrosswLoadBadenNotifications();

      explorCrosswCheckAchievementsDot();
    }, [explorCrosswCheckAchievementsDot]),
  );

  useEffect(() => {
    setExplorCrosswQuote(explorCrosswPickRandom(explorCrosswQuotes));
  }, []);

  useEffect(() => {
    explorCrosswPlayMusic(explorCrosswTrack);

    return () => {
      if (explorCrosswSound) {
        explorCrosswSound.stop(() => {
          explorCrosswSound.release();
        });
      }
    };
  }, [explorCrosswTrack]);

  const explorCrosswPlayMusic = (explorCrosswTrackIndex: number) => {
    if (explorCrosswSound) {
      explorCrosswSound.stop(() => {
        explorCrosswSound.release();
      });
    }

    const explorCrosswTrackName = explorCrosswTrackList[explorCrosswTrackIndex];

    const explorCrosswNextSound = new Sound(
      explorCrosswTrackName,
      Sound.MAIN_BUNDLE,
      explorCrosswErr => {
        if (explorCrosswErr) {
          console.log('Error', explorCrosswErr);
          return;
        }

        explorCrosswNextSound.play(explorCrosswSuccess => {
          if (explorCrosswSuccess) {
            setExplorCrosswTrack(
              explorCrosswPrev =>
                (explorCrosswPrev + 1) % explorCrosswTrackList.length,
            );
          } else {
            console.log('Error');
          }
        });

        setExplorCrosswSound(explorCrosswNextSound);
      },
    );
  };

  useEffect(() => {
    const explorCrosswSyncToggleFromStorage = async () => {
      try {
        const explorCrosswRaw = await AsyncStorage.getItem('baden_bg_music');
        const explorCrosswEnabled = JSON.parse(explorCrosswRaw as string);
        setExplorCrosswIsEnabledSound(explorCrosswEnabled);

        if (explorCrosswSound) {
          explorCrosswSound.setVolume(explorCrosswEnabled ? 1 : 0);
        }
      } catch (explorCrosswError) {
        console.error('mus error', explorCrosswError);
      }
    };

    explorCrosswSyncToggleFromStorage();
  }, [explorCrosswSound, explorCrosswIsEnabledSound]);

  const explorCrosswLoadBadenBgMusic = async () => {
    try {
      const explorCrosswMusicValue = await AsyncStorage.getItem(
        'baden_bg_music',
      );
      const explorCrosswParsedJson = explorCrosswMusicValue
        ? JSON.parse(explorCrosswMusicValue)
        : null;

      if (typeof explorCrosswParsedJson === 'boolean') {
        setExplorCrosswIsEnabledSound(explorCrosswParsedJson);
      }
    } catch {
      console.log('catch err');
    }
  };

  const explorCrosswLoadBadenVibration = async () => {
    try {
      const explorCrosswVibrationValue = await AsyncStorage.getItem(
        'baden_vibration',
      );

      const explorCrosswParsedJson = explorCrosswVibrationValue
        ? JSON.parse(explorCrosswVibrationValue)
        : null;

      if (typeof explorCrosswParsedJson === 'boolean') {
        setExplorCrosswIsEnabledVibration(explorCrosswParsedJson);
      }
    } catch {
      console.log('catch err');
    }
  };

  const explorCrosswLoadBadenNotifications = async () => {
    try {
      const explorCrosswNotificationValue = await AsyncStorage.getItem(
        'baden_notifications',
      );

      const explorCrosswParsedJson = explorCrosswNotificationValue
        ? JSON.parse(explorCrosswNotificationValue)
        : null;

      if (typeof explorCrosswParsedJson === 'boolean') {
        setExplorCrosswIsEnabledNotifications(explorCrosswParsedJson);
      }
    } catch {
      console.log('catch err');
    }
  };

  const explorCrosswToggleBadenVibration = async (
    explorCrosswValue: boolean,
  ) => {
    if (explorCrosswIsEnabledNotifications) {
      Toast.show({
        type: 'success',
        text1: `Vibration ${explorCrosswValue ? 'enabled' : 'disabled'}`,
        position: 'top',
        visibilityTime: 2000,
      });
    }

    try {
      await AsyncStorage.setItem(
        'baden_vibration',
        JSON.stringify(explorCrosswValue),
      );
      setExplorCrosswIsEnabledVibration(explorCrosswValue);
    } catch {}
  };

  const explorCrosswToggleBadenNotifications = async (
    explorCrosswValue: boolean,
  ) => {
    Toast.show({
      type: 'success',
      text1: `Notifications ${explorCrosswValue ? 'enabled' : 'disabled'}`,
      position: 'top',
      visibilityTime: 2000,
    });

    try {
      await AsyncStorage.setItem(
        'baden_notifications',
        JSON.stringify(explorCrosswValue),
      );
      setExplorCrosswIsEnabledNotifications(explorCrosswValue);
    } catch {}
  };

  const explorCrosswToggleBadenMusic = async (explorCrosswValue: boolean) => {
    if (explorCrosswIsEnabledNotifications) {
      Toast.show({
        type: 'success',
        text1: `Sound ${explorCrosswValue ? 'enabled' : 'disabled'}`,
        position: 'top',
        visibilityTime: 2000,
      });
    }

    try {
      await AsyncStorage.setItem(
        'baden_bg_music',
        JSON.stringify(explorCrosswValue),
      );
      setExplorCrosswIsEnabledSound(explorCrosswValue);
    } catch {}
  };

  const explorCrosswShareDailyQuote = () => {
    Share.share({
      message: `Baden Heritage Crossword App Daily Quote:\n\n"${explorCrosswQuote}"`,
    });
  };

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswContainer,
          Platform.OS === 'android' &&
            explorCrosswAboutOpen &&
            explorCrosswSettingsOpen && { filter: 'blur(5px)' },
        ]}
      >
        <Image source={require('../HeritageAssts/imgs/hm_lg.png')} />

        <View style={explorCrosswStyles.explorCrosswWelcView}>
          <View style={{ width: '100%', alignItems: 'center', right: 50 }}>
            <Text
              style={[
                explorCrosswStyles.explorCrosswDescText,
                explorCrosswSmallPhone && { fontSize: 16 },
              ]}
            >
              {explorCrosswQuote}
            </Text>

            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={explorCrosswShareDailyQuote}
              activeOpacity={0.8}
            >
              <Image source={require('../HeritageAssts/imgs/s_btn.png')} />
            </TouchableOpacity>
          </View>

          <Image
            source={require('../HeritageAssts/imgs/vote_h.png')}
            style={{ position: 'absolute', bottom: 0, right: 10 }}
          />
        </View>

        <View style={explorCrosswStyles.explorCrosswMenuWrap}>
          <View style={explorCrosswStyles.explorCrosswMenuColumn}>
            <ExplorCrosswMenuButton
              label="Crosswords"
              iconSource={explorCrosswMenuIcons.crosswords}
              onPress={() => explorCrosswNavigation.navigate('CrosswordTopics')}
              size={'90%'}
            />
            <ExplorCrosswMenuButton
              label="Explore"
              iconSource={explorCrosswMenuIcons.explore}
              onPress={() =>
                explorCrosswNavigation.navigate('Exploreartclsscrn')
              }
              size={'80%'}
              height={54}
            />
          </View>

          <View style={explorCrosswStyles.explorCrosswMenuGrid}>
            <ExplorCrosswMenuButton
              label="Achievements"
              iconSource={explorCrosswMenuIcons.achievements}
              onPress={() =>
                explorCrosswNavigation.navigate('Explrrachievementsscrn')
              }
              size={'48%'}
              showBadge={explorCrosswHasNewAchievement}
              textSize={12}
              height={50}
            />
            <ExplorCrosswMenuButton
              label="Facts"
              iconSource={explorCrosswMenuIcons.facts}
              onPress={() => explorCrosswNavigation.navigate('Explrfactsscrn')}
              size={'48%'}
              textSize={12}
              height={50}
            />
            <ExplorCrosswMenuButton
              label="Settings"
              iconSource={explorCrosswMenuIcons.settings}
              onPress={() => setExplorCrosswSettingsOpen(true)}
              size={'48%'}
              textSize={12}
              height={50}
            />
            <ExplorCrosswMenuButton
              label="Wallpapers"
              iconSource={explorCrosswMenuIcons.wallpapers}
              onPress={() =>
                explorCrosswNavigation.navigate('Explrrwallpapersscrn')
              }
              size={'48%'}
              textSize={12}
              height={50}
            />
          </View>
        </View>

        {explorCrosswSettingsOpen && (
          <View style={explorCrosswStyles.explorCrosswModalOverlay}>
            {Platform.OS === 'ios' && (
              <BlurView
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                }}
                blurType="dark"
                blurAmount={1}
              />
            )}

            <View style={explorCrosswStyles.explorCrosswModalBox}>
              <Text style={explorCrosswStyles.explorCrosswModalTitle}>
                Settings
              </Text>

              <TouchableOpacity
                style={explorCrosswStyles.explorCrosswCloseBtn}
                activeOpacity={0.7}
                onPress={() => setExplorCrosswSettingsOpen(false)}
              >
                <Image source={require('../HeritageAssts/imgs/cls.png')} />
              </TouchableOpacity>

              <View style={explorCrosswStyles.explorCrosswSettingsList}>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={explorCrosswStyles.explorCrosswSettingWrap}
                    activeOpacity={0.7}
                    onPress={() =>
                      explorCrosswToggleBadenMusic(!explorCrosswIsEnabledSound)
                    }
                  >
                    <Text style={explorCrosswStyles.explorCrosswSettingText}>
                      Music
                    </Text>
                    <Image
                      style={{ width: 24, height: 24, resizeMode: 'contain' }}
                      source={
                        explorCrosswIsEnabledSound
                          ? require('../HeritageAssts/imgs/music_on.png')
                          : require('../HeritageAssts/imgs/music_off.png')
                      }
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={explorCrosswStyles.explorCrosswSettingWrap}
                  activeOpacity={0.7}
                  onPress={() =>
                    explorCrosswToggleBadenVibration(
                      !explorCrosswIsEnabledVibration,
                    )
                  }
                >
                  <Text style={explorCrosswStyles.explorCrosswSettingText}>
                    Vibration
                  </Text>
                  <Image
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    source={
                      explorCrosswIsEnabledVibration
                        ? require('../HeritageAssts/imgs/vibration_on.png')
                        : require('../HeritageAssts/imgs/vibration_off.png')
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={explorCrosswStyles.explorCrosswSettingWrap}
                  activeOpacity={0.7}
                  onPress={() =>
                    explorCrosswToggleBadenNotifications(
                      !explorCrosswIsEnabledNotifications,
                    )
                  }
                >
                  <Text style={explorCrosswStyles.explorCrosswSettingText}>
                    Notifications
                  </Text>
                  <Image
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    source={
                      explorCrosswIsEnabledNotifications
                        ? require('../HeritageAssts/imgs/bell_on.png')
                        : require('../HeritageAssts/imgs/bell_off.png')
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={explorCrosswStyles.explorCrosswSettingWrap}
                  activeOpacity={0.7}
                  onPress={() => {
                    setExplorCrosswSettingsOpen(false);
                    setExplorCrosswAboutOpen(true);
                  }}
                >
                  <Text style={explorCrosswStyles.explorCrosswSettingText}>
                    About App
                  </Text>
                  <Image
                    source={require('../HeritageAssts/imgs/info.png')}
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              </View>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    Linking.openURL(
                      'https://apps.apple.com/us/app/badenbabe%D0%BF-heritage-explorer/id6760485949',
                    )
                  }
                  style={explorCrosswStyles.explorCrosswBottomShare}
                >
                  <Image source={require('../HeritageAssts/imgs/s_btn.png')} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {explorCrosswAboutOpen && (
          <View style={explorCrosswStyles.explorCrosswModalOverlay}>
            {Platform.OS === 'ios' && (
              <BlurView
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                }}
                blurType="dark"
                blurAmount={1}
              />
            )}

            <View
              style={[
                explorCrosswStyles.explorCrosswModalBox,
                { paddingBottom: 22 },
              ]}
            >
              <Text style={explorCrosswStyles.explorCrosswModalTitle}>
                About App
              </Text>

              <TouchableOpacity
                style={explorCrosswStyles.explorCrosswCloseBtn}
                activeOpacity={0.7}
                onPress={() => setExplorCrosswAboutOpen(false)}
              >
                <Image source={require('../HeritageAssts/imgs/cls.png')} />
              </TouchableOpacity>

              <Text
                style={[
                  explorCrosswStyles.explorCrosswAboutText,
                  explorCrosswSmallPhone && { fontSize: 14 },
                ]}
              >
                This app is a calm, thoughtful crossword experience inspired by
                European heritage and cultural depth.
                {'\n\n'}
                It invites you to slow down, focus, and engage with language
                through carefully curated word puzzles. Each crossword is built
                around clear thematic categories, drawing from history,
                architecture, art, society, and cultural symbols. The goal is
                not speed or competition, but clarity of thought, curiosity, and
                quiet satisfaction from solving well-designed challenges.
                {'\n\n'}
                The app is designed for users who appreciate structure, meaning,
                and a refined atmosphere. Clean visuals, balanced difficulty,
                and intentional pacing help create a focused and enjoyable
                experience.
                {'\n\n'}
                Whether you spend a few minutes or a longer session, the app
                offers a moment of concentration and mental engagement — simple,
                elegant, and purposeful.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ExplrrLayout>
  );
};

const explorCrosswStyles = StyleSheet.create({
  explorCrosswContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  explorCrosswWelcView: {
    width: '93%',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1C1E22A6',
    borderRadius: 22,
    paddingHorizontal: 20,
    marginTop: 40,
  },

  explorCrosswDescText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    fontStyle: 'italic',
    width: '65%',
  },

  explorCrosswMenuWrap: {
    width: '85%',
    alignItems: 'center',
  },
  explorCrosswMenuColumn: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  explorCrosswMenuGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  explorCrosswMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF33',
    borderRadius: 16,
    overflow: 'hidden',
  },
  explorCrosswMenuBtnSmall: {
    width: '48%',
    marginBottom: 12,
  },
  explorCrosswMenuBtnIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorCrosswMenuBtnIcon: {
    width: 28,
    height: 28,
  },
  explorCrosswMenuBtnIconPlaceholder: {
    backgroundColor: '#C9A24D',
    borderRadius: 8,
  },
  explorCrosswMenuBtnSeparator: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(155, 19, 19, 0.98)',
  },
  explorCrosswMenuBtnContent: {},
  explorCrosswMenuBtnText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  explorCrosswMenuBtnTextSmall: {
    fontSize: 12,
  },
  explorCrosswMenuBtnText16: {
    fontSize: 16,
  },
  explorCrosswMenuBtnChevron: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  explorCrosswNextBtn: {
    width: 184,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#C9A24D',
    borderRadius: 16,
  },
  explorCrosswRedDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FF2D2D',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    position: 'absolute',
    top: 4,
    right: -14,
  },
  explorCrosswNextText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  explorCrosswModalOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  explorCrosswModalBox: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#1C1E22D9',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 22,
    paddingTop: 26,
  },

  explorCrosswModalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  explorCrosswCloseBtn: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswSettingsList: {
    marginTop: 18,
  },

  explorCrosswSettingWrap: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  explorCrosswSettingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },

  explorCrosswBottomShare: {
    marginTop: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswAboutText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 20,
    opacity: 0.95,
  },
});

export default Explreritagehome;
