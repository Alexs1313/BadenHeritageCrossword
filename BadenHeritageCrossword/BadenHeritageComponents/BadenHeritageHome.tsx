import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import BadenBackground from './BadenBackground';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { useBadenStore } from '../HeritageStore/badenContext';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

import { useCrosswordProgress } from '../badenutils/useCrosswordProgress';
import { BADEN_CROSSWORDS } from '../badenutils/badenCrosswords';

type AchievementId =
  | 'first_step'
  | 'early_scholar'
  | 'steady_progress'
  | 'consistent_mind'
  | 'heritage_keeper'
  | 'legacy_completed';

type SeenMap = Record<AchievementId, true>;

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

const ACH_SEEN_KEY = '@baden_achievements_seen_v1';
// Quotes array

const BADEN_QUOTES = [
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

const pickRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const BadenHeritageHome = () => {
  const { height: badenH } = useWindowDimensions();
  const sPhone = badenH < 700;

  const navigation = useNavigation<any>();
  const [quote, setQuote] = useState(() => pickRandom(BADEN_QUOTES));

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [badenTrack, setBadenTrack] = useState(0);
  const [badenSound, setBBadenSound] = useState(null);
  const badenTrackList = [
    'monument_music-aristocratic-spin-waltz-191526.mp3',
    'monument_music-aristocratic-spin-waltz-191526.mp3',
  ];
  const {
    isEnabledVibration,
    setIsEnabledVibration,
    isEnabledSound,
    setIsEnabledSound,
    isEnabledNotifications,
    setIsEnabledNotifications,
  } = useBadenStore();

  const [hasNewAchievement, setHasNewAchievement] = useState(false);
  const {
    completedTotal,
    noHintWins,
    completedEasy,
    completedMedium,
    completedHard,
    reload,
  } = useCrosswordProgress();

  const checkAchievementsDot = useCallback(async () => {
    try {
      await reload();

      const unlockedIds = getUnlockedAchievements({
        completedTotal,
        noHintWins,
        completedEasy,
        completedMedium,
        completedHard,
      });

      const raw = await AsyncStorage.getItem(ACH_SEEN_KEY);
      const seen: SeenMap = raw ? JSON.parse(raw) : ({} as SeenMap);

      const hasNew = unlockedIds.some(id => !seen[id]);
      setHasNewAchievement(hasNew);
    } catch {
      setHasNewAchievement(false);
    }
  }, [
    reload,
    completedTotal,
    noHintWins,
    completedEasy,
    completedMedium,
    completedHard,
  ]);

  useFocusEffect(
    useCallback(() => {
      loadBadenBgMusic();
      loadBadenVibration();
      loadBadenNotifications();

      checkAchievementsDot();
    }, []),
  );

  useEffect(() => {
    setQuote(pickRandom(BADEN_QUOTES));
  }, []);

  useEffect(() => {
    badenPlayMusic(badenTrack);

    return () => {
      if (badenSound) {
        badenSound.stop(() => {
          badenSound.release();
        });
      }
    };
  }, [badenTrack]);

  const badenPlayMusic = trackIndex => {
    if (badenSound) {
      badenSound.stop(() => {
        badenSound.release();
      });
    }

    const trackName = badenTrackList[trackIndex];

    const nextSound = new Sound(trackName, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('Error', err);
        return;
      }

      nextSound.play(success => {
        if (success) {
          setBadenTrack(prev => (prev + 1) % badenTrackList.length);
        } else {
          console.log('Error');
        }
      });

      setBBadenSound(nextSound);
    });
  };

  useEffect(() => {
    const syncToggleFromStorage = async () => {
      try {
        const raw = await AsyncStorage.getItem('baden_bg_music');
        const enabled = JSON.parse(raw);
        setIsEnabledSound(enabled);
        if (badenSound) badenSound.setVolume(enabled ? 1 : 0);
      } catch (e) {
        console.error('mus error', e);
      }
    };

    syncToggleFromStorage();
  }, [badenSound, isEnabledSound]);

  // fetch settings from storage

  const loadBadenBgMusic = async () => {
    try {
      const musicValue = await AsyncStorage.getItem('baden_bg_music');
      const parsedJSON = musicValue ? JSON.parse(musicValue) : null;
      if (typeof parsedJSON === 'boolean') setIsEnabledSound(parsedJSON);
    } catch {
      console.log('catch err');
    }
  };

  const loadBadenVibration = async () => {
    try {
      const vibrValue = await AsyncStorage.getItem('baden_vibration');

      const parsedJSON = vibrValue ? JSON.parse(vibrValue) : null;

      if (typeof parsedJSON === 'boolean') setIsEnabledVibration(parsedJSON);
    } catch {
      console.log('catch err');
    }
  };

  const loadBadenNotifications = async () => {
    try {
      const notifValue = await AsyncStorage.getItem('baden_notifications');

      const parsedJSON = notifValue ? JSON.parse(notifValue) : null;

      if (typeof parsedJSON === 'boolean')
        setIsEnabledNotifications(parsedJSON);
    } catch {
      console.log('catch err');
    }
  };

  // Toggle handlers

  const toggleBadenVibration = async (value: boolean) => {
    if (isEnabledNotifications) {
      Toast.show({
        type: 'success',
        text1: `Vibration ${value ? 'enabled' : 'disabled'}`,
        position: 'top',
        visibilityTime: 2000,
      });
    }
    try {
      await AsyncStorage.setItem('baden_vibration', JSON.stringify(value));
      setIsEnabledVibration(value);
    } catch {}
  };

  const toggleBadenNotifications = async (value: boolean) => {
    Toast.show({
      type: 'success',
      text1: `Notifications ${value ? 'enabled' : 'disabled'}`,
      position: 'top',
      visibilityTime: 2000,
    });

    try {
      await AsyncStorage.setItem('baden_notifications', JSON.stringify(value));
      setIsEnabledNotifications(value);
    } catch {}
  };

  const toggleBadenMusic = async (value: boolean) => {
    if (isEnabledNotifications) {
      Toast.show({
        type: 'success',
        text1: `Sound ${value ? 'enabled' : 'disabled'}`,
        position: 'top',
        visibilityTime: 2000,
      });
    }
    try {
      await AsyncStorage.setItem('baden_bg_music', JSON.stringify(value));
      setIsEnabledSound(value);
    } catch {}
  };

  const shrBadenDailyQuote = () => {
    Share.share({
      message: `Baden Heritage Crossword App Daily Quote:\n\n"${quote}"`,
    });
  };

  return (
    <BadenBackground>
      <View
        style={[
          stSheet.badenContainer,
          Platform.OS === 'android' ? { filter: 'blur(5px)' } : {},
        ]}
      >
        <Image source={require('../HeritageAssts/imgs/hm_lg.png')} />

        <View style={stSheet.badenWelcView}>
          <View style={{ width: '100%', alignItems: 'center', right: 50 }}>
            <Text style={[stSheet.badenDescText, sPhone && { fontSize: 16 }]}>
              {quote}
            </Text>

            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => shrBadenDailyQuote()}
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

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={[stSheet.badenNextBtn, { width: 203 }]}
            onPress={() => navigation.navigate('CrosswordTopics')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                stSheet.badenNextText,
                sPhone && { fontSize: 16 },
                { fontSize: 18 },
              ]}
            >
              Crosswords
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stSheet.badenNextBtn}
            onPress={() => navigation.navigate('BadenWallpapersScreen')}
            activeOpacity={0.8}
          >
            <Text style={[stSheet.badenNextText, sPhone && { fontSize: 15 }]}>
              Wallpapers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stSheet.badenNextBtn}
            onPress={() => navigation.navigate('BadenAchievementsScreen')}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[stSheet.badenNextText, sPhone && { fontSize: 15 }]}>
                Achievements
              </Text>

              {hasNewAchievement && <View style={stSheet.redDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={stSheet.badenNextBtn}
            onPress={() => navigation.navigate('BadenFactsScreen')}
            activeOpacity={0.8}
          >
            <Text style={[stSheet.badenNextText, sPhone && { fontSize: 15 }]}>
              Facts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stSheet.badenNextBtn}
            onPress={() => setSettingsOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={[stSheet.badenNextText, sPhone && { fontSize: 15 }]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* SETTINGS MODAL */}
        {settingsOpen && (
          <View style={stSheet.badelModaloverlay}>
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
            <View style={stSheet.badelModalBox}>
              <Text style={stSheet.badelModalTitle}>Settings</Text>

              <TouchableOpacity
                style={stSheet.badelCloseBtn}
                activeOpacity={0.7}
                onPress={() => setSettingsOpen(false)}
              >
                <Image source={require('../HeritageAssts/imgs/cls.png')} />
              </TouchableOpacity>

              <View style={stSheet.settingsList}>
                <TouchableOpacity
                  style={stSheet.badenSettingWrap}
                  activeOpacity={0.7}
                  onPress={() => toggleBadenMusic(!isEnabledSound)}
                >
                  <Text style={stSheet.badenSettingText}>Music</Text>
                  <Image
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    source={
                      isEnabledSound
                        ? require('../HeritageAssts/imgs/music_on.png')
                        : require('../HeritageAssts/imgs/music_off.png')
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={stSheet.badenSettingWrap}
                  activeOpacity={0.7}
                  onPress={() => toggleBadenVibration(!isEnabledVibration)}
                >
                  <Text style={stSheet.badenSettingText}>Vibration</Text>
                  <Image
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    source={
                      isEnabledVibration
                        ? require('../HeritageAssts/imgs/vibration_on.png')
                        : require('../HeritageAssts/imgs/vibration_off.png')
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={stSheet.badenSettingWrap}
                  activeOpacity={0.7}
                  onPress={() =>
                    toggleBadenNotifications(!isEnabledNotifications)
                  }
                >
                  <Text style={stSheet.badenSettingText}>Notifications</Text>
                  <Image
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    source={
                      isEnabledNotifications
                        ? require('../HeritageAssts/imgs/bell_on.png')
                        : require('../HeritageAssts/imgs/bell_off.png')
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={stSheet.badenSettingWrap}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSettingsOpen(false);
                    setAboutOpen(true);
                  }}
                >
                  <Text style={stSheet.badenSettingText}>About App</Text>
                  <Image
                    source={require('../HeritageAssts/imgs/info.png')}
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              </View>

              <View style={stSheet.badenBottomShare}>
                <Image source={require('../HeritageAssts/imgs/s_btn.png')} />
              </View>
            </View>
          </View>
        )}

        {/* ABOUT MODAL */}
        {aboutOpen && (
          <View style={stSheet.badelModaloverlay}>
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
            <View style={[stSheet.badelModalBox, { paddingBottom: 22 }]}>
              <Text style={stSheet.badelModalTitle}>About App</Text>

              <TouchableOpacity
                style={stSheet.badelCloseBtn}
                activeOpacity={0.7}
                onPress={() => setAboutOpen(false)}
              >
                <Image source={require('../HeritageAssts/imgs/cls.png')} />
              </TouchableOpacity>

              <Text style={[stSheet.aboutText, sPhone && { fontSize: 14 }]}>
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
    </BadenBackground>
  );
};

const stSheet = StyleSheet.create({
  badenContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  badenWelcView: {
    width: '90%',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1C1E22A6',
    borderRadius: 22,
    paddingHorizontal: 20,
    marginTop: 40,
  },

  badenDescText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    fontStyle: 'italic',
    width: '65%',
  },

  badenNextBtn: {
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
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FF2D2D',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badenNextText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  badelModaloverlay: {
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

  badelModalBox: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#1C1E22D9',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 22,
    paddingTop: 26,
  },

  badelModalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  badelCloseBtn: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsList: {
    marginTop: 18,
  },

  badenSettingWrap: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  badenSettingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },

  badenBottomShare: {
    marginTop: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  aboutText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 20,
    opacity: 0.95,
  },
});

export default BadenHeritageHome;
