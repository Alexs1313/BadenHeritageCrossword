import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import { useBadenStore } from '../[Heritagecontxtt]/badenContext';
import Toast from 'react-native-toast-message';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import BadenBackground from './ExplrrLayout';
import { useCrosswordProgress } from '../uttils/useCrosswordProgress';
import { BADEN_WALLPAPERS, WallpaperItem } from '../uttils/badenWallpapers';
import { BlurView } from '@react-native-community/blur';
import RNFS from 'react-native-fs';
import ExplrrLayout from './ExplrrLayout';

const explorCrosswOwnedKey = '@baden_wallpapers_owned_v1';

const explorCrosswDefaultOwnedIds = BADEN_WALLPAPERS.slice(0, 2).map(
  explorCrosswWallpaper => explorCrosswWallpaper.id,
);

type ExplorCrosswOwnedMap = Record<string, true>;

function explorCrosswGetDefaultOwned(): ExplorCrosswOwnedMap {
  return explorCrosswDefaultOwnedIds.reduce<ExplorCrosswOwnedMap>(
    (explorCrosswAcc, explorCrosswId) => ({
      ...explorCrosswAcc,
      [explorCrosswId]: true,
    }),
    {},
  );
}

export default function Explrrwallpapersscrn() {
  const explorCrosswNav = useNavigation<any>();
  const {
    coupons: explorCrosswCoupons,
    consumeCoupons: explorCrosswConsumeCoupons,
    reload: explorCrosswReload,
  } = useCrosswordProgress();
  const { height: explorCrosswHeight } = useWindowDimensions();

  const [explorCrosswOwned, setExplorCrosswOwned] =
    useState<ExplorCrosswOwnedMap>({});
  const [explorCrosswPending, setExplorCrosswPending] =
    useState<WallpaperItem | null>(null);
  const [explorCrosswBusy, setExplorCrosswBusy] = useState(false);
  const explorCrosswWallpRef = useRef(null);
  const { isEnabledNotifications: explorCrosswIsEnabledNotifications } =
    useBadenStore();

  const explorCrosswLoadOwned = useCallback(async () => {
    const explorCrosswRaw = await AsyncStorage.getItem(explorCrosswOwnedKey);

    if (explorCrosswRaw) {
      setExplorCrosswOwned(JSON.parse(explorCrosswRaw));
    } else {
      const explorCrosswDefaultOwned = explorCrosswGetDefaultOwned();
      await AsyncStorage.setItem(
        explorCrosswOwnedKey,
        JSON.stringify(explorCrosswDefaultOwned),
      );
      setExplorCrosswOwned(explorCrosswDefaultOwned);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      explorCrosswLoadOwned();
      explorCrosswReload();
    }, [explorCrosswLoadOwned, explorCrosswReload]),
  );

  const explorCrosswShareWallpaperImage = async () => {
    try {
      const explorCrosswTmpUri = await captureRef(explorCrosswWallpRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const explorCrosswImageUri = explorCrosswTmpUri.startsWith('file://')
        ? explorCrosswTmpUri
        : `file://${explorCrosswTmpUri}`;

      const explorCrosswPathToCheck = explorCrosswImageUri.replace(
        'file://',
        '',
      );

      const explorCrosswExistsWallp = await RNFS.exists(
        explorCrosswPathToCheck,
      );

      if (!explorCrosswExistsWallp) return;

      await Share.open({
        url: explorCrosswImageUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch {
      Alert.alert('Error', 'Failed to share the wallpaper. Please try again.');
    }
  };

  const explorCrosswIsOwned = useCallback(
    (explorCrosswId: string) => !!explorCrosswOwned[explorCrosswId],
    [explorCrosswOwned],
  );

  const explorCrosswOpenBuy = useCallback((explorCrosswItem: WallpaperItem) => {
    setExplorCrosswPending(explorCrosswItem);
  }, []);

  const explorCrosswCloseBuy = useCallback(() => {
    if (explorCrosswBusy) return;
    setExplorCrosswPending(null);
  }, [explorCrosswBusy]);

  const explorCrosswConfirmBuy = useCallback(async () => {
    if (!explorCrosswPending) return;
    if (explorCrosswBusy) return;

    const explorCrosswPrice = explorCrosswPending.price;

    if (explorCrosswCoupons < explorCrosswPrice) {
      setExplorCrosswPending(null);
      return;
    }

    setExplorCrosswBusy(true);

    try {
      await explorCrosswConsumeCoupons(explorCrosswPrice);

      const explorCrosswNextOwned: ExplorCrosswOwnedMap = {
        ...explorCrosswOwned,
        [explorCrosswPending.id]: true,
      };

      await AsyncStorage.setItem(
        explorCrosswOwnedKey,
        JSON.stringify(explorCrosswNextOwned),
      );
      setExplorCrosswOwned(explorCrosswNextOwned);
      setExplorCrosswPending(null);

      if (explorCrosswIsEnabledNotifications) {
        Toast.show({
          type: 'success',
          text1: 'Wallpaper Unlocked!',
          text2: 'You can now download your new wallpaper from the collection.',
          position: 'bottom',
        });
      }
    } finally {
      setExplorCrosswBusy(false);
    }
  }, [
    explorCrosswPending,
    explorCrosswBusy,
    explorCrosswCoupons,
    explorCrosswConsumeCoupons,
    explorCrosswOwned,
    explorCrosswIsEnabledNotifications,
  ]);

  const explorCrosswRenderCard = useCallback(
    ({ item }: { item: WallpaperItem }) => {
      const explorCrosswOwnedNow = explorCrosswIsOwned(item.id);
      const explorCrosswCanBuy = explorCrosswCoupons >= item.price;

      return (
        <View style={explorCrosswStyles.explorCrosswCardWrap}>
          <View style={explorCrosswStyles.explorCrosswCard}>
            <Image
              source={item.thumb}
              ref={explorCrosswWallpRef}
              style={[
                explorCrosswStyles.explorCrosswThumb,
                explorCrosswOwnedNow ? {} : { opacity: 0.75 },
              ]}
            />

            {explorCrosswOwnedNow ? (
              <TouchableOpacity
                style={explorCrosswStyles.explorCrosswDownloadBtn}
                activeOpacity={0.9}
                onPress={explorCrosswShareWallpaperImage}
              >
                <Text style={explorCrosswStyles.explorCrosswBtnTxt}>
                  Download
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  explorCrosswStyles.explorCrosswBuyBtn,
                  { opacity: explorCrosswCanBuy ? 1 : 0.65 },
                ]}
                activeOpacity={0.9}
                disabled={!explorCrosswCanBuy}
                onPress={() => explorCrosswOpenBuy(item)}
              >
                <Text style={explorCrosswStyles.explorCrosswBtnTxt}>
                  Get for {item.price}
                </Text>
                <Image
                  source={require('../HeritageAssts/imgs/card_coup.png')}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    },
    [
      explorCrosswIsOwned,
      explorCrosswCoupons,
      explorCrosswOpenBuy,
      explorCrosswShareWallpaperImage,
    ],
  );

  const explorCrosswData = useMemo(() => BADEN_WALLPAPERS, []);

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswContainer,
          Platform.OS === 'android' && !!explorCrosswPending
            ? { filter: 'blur(5px)' }
            : {},
          { paddingTop: explorCrosswHeight * 0.07 },
        ]}
      >
        <View style={explorCrosswStyles.explorCrosswTopBar}>
          <TouchableOpacity
            onPress={() => explorCrosswNav.goBack()}
            style={explorCrosswStyles.explorCrosswBackBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={explorCrosswStyles.explorCrosswTitle}>Wallpapers</Text>

          <View style={explorCrosswStyles.explorCrosswCoupons}>
            <Image source={require('../HeritageAssts/imgs/head_coup.png')} />
            <Text style={explorCrosswStyles.explorCrosswCouponTxt}>
              X {explorCrosswCoupons}
            </Text>
          </View>
        </View>

        <FlatList
          contentContainerStyle={explorCrosswStyles.explorCrosswList}
          data={explorCrosswData}
          scrollEnabled={false}
          renderItem={explorCrosswRenderCard}
          keyExtractor={explorCrosswItem => explorCrosswItem.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 14 }}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          showsVerticalScrollIndicator={false}
        />

        {!!explorCrosswPending && (
          <Modal
            style={explorCrosswStyles.explorCrosswOverlay}
            transparent
            animationType="fade"
            visible
            onRequestClose={explorCrosswCloseBuy}
          >
            <View style={explorCrosswStyles.explorCrosswOverlay}>
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

              <View style={explorCrosswStyles.explorCrosswModal}>
                <Text style={explorCrosswStyles.explorCrosswModalText}>
                  Are you sure you want to exchange your coupons for this
                  wallpaper?
                </Text>
              </View>

              <View style={explorCrosswStyles.explorCrosswModalRow}>
                <TouchableOpacity
                  style={[
                    explorCrosswStyles.explorCrosswModalBtn,
                    explorCrosswStyles.explorCrosswModalConfirm,
                    { opacity: explorCrosswBusy ? 0.6 : 1 },
                  ]}
                  activeOpacity={0.9}
                  onPress={explorCrosswConfirmBuy}
                  disabled={explorCrosswBusy}
                >
                  <Text style={explorCrosswStyles.explorCrosswModalBtnTxt}>
                    Confirm
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    explorCrosswStyles.explorCrosswModalBtn,
                    explorCrosswStyles.explorCrosswModalCancel,
                    { opacity: explorCrosswBusy ? 0.6 : 1 },
                  ]}
                  activeOpacity={0.9}
                  onPress={explorCrosswCloseBuy}
                  disabled={explorCrosswBusy}
                >
                  <Text style={explorCrosswStyles.explorCrosswModalBtnTxt}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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

  explorCrosswTopBar: {
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

  explorCrosswTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  explorCrosswCoupons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  explorCrosswCouponTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  explorCrosswList: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 28,
  },

  explorCrosswCardWrap: {
    flex: 1,
  },

  explorCrosswCard: {
    backgroundColor: '#1c1e22d5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 17,
    overflow: 'hidden',
  },

  explorCrosswThumb: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    resizeMode: 'cover',
    marginBottom: 10,
  },

  explorCrosswBuyBtn: {
    height: 30,
    borderRadius: 18,
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  explorCrosswDownloadBtn: {
    height: 30,
    borderRadius: 18,
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswBtnTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  explorCrosswOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#5655550',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  explorCrosswModal: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#1c1e22ec',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 18,
    paddingVertical: 30,
  },

  explorCrosswModalText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  explorCrosswModalRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 28,
    width: '85%',
  },

  explorCrosswModalBtn: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswModalConfirm: {
    backgroundColor: '#510000',
  },

  explorCrosswModalCancel: {
    backgroundColor: '#0B4B10',
  },

  explorCrosswModalBtnTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
