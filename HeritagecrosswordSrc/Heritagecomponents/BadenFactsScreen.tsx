import BadenBackground from './BadenBackground';

import { useNavigation } from '@react-navigation/native';

import React, { useCallback } from 'react';

import {
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

// Utils
import { BADEN_FACTS } from '../uttils/badenFacts';

export default function BadenFactsScreen() {
  const nav = useNavigation<any>();
  const { height } = useWindowDimensions();

  const onShare = useCallback(async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch {}
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: { id: string; text: string } }) => {
      return (
        <View style={s.factCard}>
          <Text style={s.factText}>{item.text}</Text>

          <TouchableOpacity
            style={s.shareBtn}
            activeOpacity={0.6}
            onPress={() => onShare(item.text)}
          >
            <Image source={require('../HeritageAssts/imgs/s_btn.png')} />
          </TouchableOpacity>
        </View>
      );
    },
    [onShare],
  );

  return (
    <BadenBackground>
      <View style={[s.topBadenBar, { paddingTop: height * 0.07 }]}>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={s.backBadenBtn}
          activeOpacity={0.5}
        >
          <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
        </TouchableOpacity>

        <Text style={s.badenTitle}>Facts</Text>

        <View style={{ width: 36 }} />
      </View>

      <FlatList
        contentContainerStyle={s.bdnlist}
        data={BADEN_FACTS}
        keyExtractor={x => x.id}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
      />
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  topBadenBar: {
    paddingTop: 70,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  backBadenBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badenTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },

  bdnlist: { paddingHorizontal: 14, paddingTop: 15, paddingBottom: 28 },

  factCard: {
    backgroundColor: '#1C1E22A6',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 56,
  },
  factText: {
    color: '#fff',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  shareBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyFactsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  emptyFactsImg: { width: 300, height: 340, resizeMode: 'contain' },

  emptyFactsCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#1c1e22ec',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 18,
    paddingVertical: 24,
    marginTop: -10,
  },
  emptyFactsTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyFactsSub: {
    color: '#fff',
    marginTop: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 20,
  },
});
