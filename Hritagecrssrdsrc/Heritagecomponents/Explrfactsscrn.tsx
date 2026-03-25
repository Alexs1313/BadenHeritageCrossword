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

import { BADEN_FACTS } from '../dbUttls/badenFacts';

import ExplrrLayout from './ExplrrLayout';

export default function Explrfactsscrn() {
  const explorCrosswNav = useNavigation<any>();
  const { height: explorCrosswHeight } = useWindowDimensions();

  const explorCrosswOnShare = useCallback(async (explorCrosswText: string) => {
    try {
      await Share.share({ message: explorCrosswText });
    } catch {}
  }, []);

  const explorCrosswRenderItem = useCallback(
    ({ item }: { item: { id: string; text: string } }) => {
      return (
        <View style={explorCrosswStyles.explorCrosswFactCard}>
          <Text style={explorCrosswStyles.explorCrosswFactText}>
            {item.text}
          </Text>

          <TouchableOpacity
            style={explorCrosswStyles.explorCrosswShareBtn}
            activeOpacity={0.6}
            onPress={() => explorCrosswOnShare(item.text)}
          >
            <Image source={require('../HeritageAssts/imgs/s_btn.png')} />
          </TouchableOpacity>
        </View>
      );
    },
    [explorCrosswOnShare],
  );

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswTopBadenBar,
          { paddingTop: explorCrosswHeight * 0.07 },
        ]}
      >
        <TouchableOpacity
          onPress={() => explorCrosswNav.goBack()}
          style={explorCrosswStyles.explorCrosswBackBadenBtn}
          activeOpacity={0.5}
        >
          <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
        </TouchableOpacity>

        <Text style={explorCrosswStyles.explorCrosswBadenTitle}>Facts</Text>

        <View style={{ width: 36 }} />
      </View>

      <FlatList
        contentContainerStyle={explorCrosswStyles.explorCrosswBdnList}
        data={BADEN_FACTS}
        keyExtractor={explorCrosswItem => explorCrosswItem.id}
        renderItem={explorCrosswRenderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
      />
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswTopBadenBar: {
    paddingTop: 70,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  explorCrosswBackBadenBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswBadenTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  explorCrosswBdnList: {
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 28,
  },

  explorCrosswFactCard: {
    backgroundColor: '#1C1E22A6',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2D33',
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 56,
  },

  explorCrosswFactText: {
    color: '#fff',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  explorCrosswShareBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswEmptyFactsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  explorCrosswEmptyFactsImg: {
    width: 300,
    height: 340,
    resizeMode: 'contain',
  },

  explorCrosswEmptyFactsCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#1c1e22ec',
    borderWidth: 1,
    borderColor: '#2A2D33',
    padding: 18,
    paddingVertical: 24,
    marginTop: -10,
  },

  explorCrosswEmptyFactsTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  explorCrosswEmptyFactsSub: {
    color: '#fff',
    marginTop: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 20,
  },
});
