import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import BadenBackground from '../BadenHeritageComponents/BadenBackground';
import { BADEN_CROSSWORDS } from '../badenutils/badenCrosswords';

export default function CrosswordTopics() {
  const nav = useNavigation<any>();
  const { height } = useWindowDimensions();

  return (
    <BadenBackground>
      <View style={[s.badnContainer, { paddingTop: height * 0.07 }]}>
        <View style={s.topBadnHeadBar}>
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={s.backBdnButn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={s.heritTtl}>Topics</Text>
          <View style={{ width: 36 }} />
        </View>

        {BADEN_CROSSWORDS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={s.badnCard}
            onPress={() => nav.navigate('CrosswordLevels', { topicId: t.id })}
            activeOpacity={0.9}
          >
            <Image source={t.cover} style={s.cover} />
            <Text style={s.badnCardText}>{t.title}</Text>
            <Image source={require('../HeritageAssts/imgs/play.png')} />
          </TouchableOpacity>
        ))}
      </View>
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  badnContainer: { flex: 1, paddingHorizontal: 18 },
  topBadnHeadBar: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },

  backBdnButn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heritTtl: { color: '#fff', fontSize: 22, fontWeight: '700' },

  badnTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  badnCard: {
    backgroundColor: '#1C1E22A6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2D33',
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    overflow: 'hidden',
    padding: 10,
    justifyContent: 'space-between',
  },
  cover: { width: 104, height: 104, borderRadius: 16, marginRight: 14 },
  badnCardText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
});
