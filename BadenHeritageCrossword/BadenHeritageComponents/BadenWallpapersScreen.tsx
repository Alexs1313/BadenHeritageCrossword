import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import BadenBackground from '../BadenHeritageComponents/BadenBackground';
import { useCrosswordProgress } from '../badenutils/useCrosswordProgress';
import { BADEN_WALLPAPERS, WallpaperItem } from '../badenutils/badenWallpapers';
import { BlurView } from '@react-native-community/blur';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import { useBadenStore } from '../HeritageStore/badenContext';
import Toast from 'react-native-toast-message';

// Constants

const OWNED_KEY = '@baden_wallpapers_owned_v1';

type OwnedMap = Record<string, true>;

export default function BadenWallpapersScreen() {
  const nav = useNavigation<any>();
  const { coupons, consumeCoupons, reload } = useCrosswordProgress();
  const { height } = useWindowDimensions();

  const [owned, setOwned] = useState<OwnedMap>({});
  const [pending, setPending] = useState<WallpaperItem | null>(null);
  const [busy, setBusy] = useState(false);
  const wallpRef = useRef(null);
  const { isEnabledNotifications } = useBadenStore();

  const loadOwned = useCallback(async () => {
    const raw = await AsyncStorage.getItem(OWNED_KEY);
    setOwned(raw ? JSON.parse(raw) : {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOwned();
      reload(); // Refresh coupons on focus
    }, [loadOwned, reload]),
  );

  const shrBadenWllpImage = async () => {
    try {
      const tmpUri = await captureRef(wallpRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      let imageUri = tmpUri.startsWith('file://') ? tmpUri : 'file://' + tmpUri;

      const pathToCheck = imageUri.replace('file://', '');

      const existsWallp = await RNFS.exists(pathToCheck);

      if (!existsWallp) return;

      await Share.open({
        url: imageUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the wallpaper. Please try again.');
    }
  };

  const isOwned = useCallback((id: string) => !!owned[id], [owned]);

  const openBuy = useCallback((item: WallpaperItem) => {
    setPending(item);
  }, []);

  //Close buy modal

  const closeBuy = useCallback(() => {
    if (busy) return;
    setPending(null);
  }, [busy]);

  // Confirm buy
  const confirmBuy = useCallback(async () => {
    if (!pending) return;
    if (busy) return;

    const price = pending.price;

    if (coupons < price) {
      setPending(null);
      return;
    }

    setBusy(true);
    try {
      await consumeCoupons(price);

      const nextOwned: OwnedMap = { ...owned, [pending.id]: true };
      await AsyncStorage.setItem(OWNED_KEY, JSON.stringify(nextOwned));
      setOwned(nextOwned);

      setPending(null);

      if (isEnabledNotifications) {
        Toast.show({
          type: 'success',
          text1: 'Wallpaper Unlocked!',
          text2: 'You can now download your new wallpaper from the collection.',
          position: 'bottom',
        });
      }
    } finally {
      setBusy(false);
    }
  }, [pending, busy, coupons, consumeCoupons, owned]);

  const renderCard = useCallback(
    ({ item }: { item: WallpaperItem }) => {
      const ownedNow = isOwned(item.id);
      const canBuy = coupons >= item.price;

      return (
        <View style={s.badenCardWrap}>
          <View style={s.badenCard}>
            <Image
              source={item.thumb}
              ref={wallpRef}
              style={[s.badenThumb, ownedNow ? {} : { opacity: 0.75 }]}
            />

            {ownedNow ? (
              <TouchableOpacity
                style={s.badenDownloadBtn}
                activeOpacity={0.9}
                onPress={() => shrBadenWllpImage()}
              >
                <Text style={s.badenBtnTxt}>Download</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.badenBuyBtn, { opacity: canBuy ? 1 : 0.65 }]}
                activeOpacity={0.9}
                disabled={!canBuy}
                onPress={() => openBuy(item)}
              >
                <Text style={s.badenBtnTxt}>Get for {item.price}</Text>
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
    [isOwned, coupons, openBuy],
  );

  const data = useMemo(() => BADEN_WALLPAPERS, []);

  return (
    <BadenBackground>
      <View
        style={[
          s.badenContn,
          Platform.OS === 'android' && !!pending ? { filter: 'blur(5px)' } : {},
          { paddingTop: height * 0.07 },
        ]}
      >
        <View style={s.topBadenBar}>
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={s.backHeritBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={s.badenTitle}>Wallpapers</Text>

          <View style={s.badenCoupons}>
            <Image source={require('../HeritageAssts/imgs/head_coup.png')} />
            <Text style={s.badenCouponTxt}>X {coupons}</Text>
          </View>
        </View>

        <FlatList
          contentContainerStyle={s.badenList}
          data={data}
          scrollEnabled={false}
          renderItem={renderCard}
          keyExtractor={x => x.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 14 }}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          showsVerticalScrollIndicator={false}
        />

        {!!pending && (
          <View style={s.badenOverlay}>
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
            <View style={s.badenModal}>
              <Text style={s.badenModalText}>
                Are you sure you want to exchange your coupons for this
                wallpaper?
              </Text>
            </View>

            <View style={s.modalRow}>
              <TouchableOpacity
                style={[
                  s.modalBtn,
                  s.modalConfirm,
                  { opacity: busy ? 0.6 : 1 },
                ]}
                activeOpacity={0.9}
                onPress={confirmBuy}
                disabled={busy}
              >
                <Text style={s.modalBtnTxt}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.modalBtn, s.modalCancel, { opacity: busy ? 0.6 : 1 }]}
                activeOpacity={0.9}
                onPress={closeBuy}
                disabled={busy}
              >
                <Text style={s.modalBtnTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  badenContn: { flex: 1, paddingHorizontal: 5 },

  topBadenBar: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  backHeritBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badenTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  badenCoupons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  badenCouponTxt: { color: '#fff', fontWeight: '700', fontSize: 18 },

  badenList: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 28,
  },
  badenCardWrap: { flex: 1 },
  badenCard: {
    backgroundColor: '#1c1e22d5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 17,
    overflow: 'hidden',
  },
  badenThumb: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  badenBuyBtn: {
    height: 30,
    borderRadius: 18,
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  badenDownloadBtn: {
    height: 30,
    borderRadius: 18,
    backgroundColor: '#030051',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badenBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },

  badenOverlay: {
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
  badenModal: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#1c1e22ec',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 18,
    paddingVertical: 30,
  },
  badenModalText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  modalRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 28,
    width: '85%',
  },
  modalBtn: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirm: { backgroundColor: '#510000' },
  modalCancel: { backgroundColor: '#0B4B10' },
  modalBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
