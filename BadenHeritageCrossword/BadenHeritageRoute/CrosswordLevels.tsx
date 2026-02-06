import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Difficulty } from '../badenutils/badenCrosswords';
import { useCrosswordProgress } from '../badenutils/useCrosswordProgress';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BadenBackground from '../BadenHeritageComponents/BadenBackground';

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  extreme: 'Extreme',
};

export default function CrosswordLevels() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { topicId } = route.params;
  const { isUnlocked, reload } = useCrosswordProgress();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const levelBtn = (diff: Difficulty, bg: string) => {
    const unlocked = isUnlocked[diff];

    return (
      <TouchableOpacity
        key={diff}
        activeOpacity={0.9}
        disabled={!unlocked}
        onPress={() =>
          nav.navigate('CrosswordGameScreen', { topicId, difficulty: diff })
        }
        style={[s.btn, { backgroundColor: bg, opacity: unlocked ? 1 : 0.5 }]}
      >
        <Text style={s.btnText}>{difficultyLabel[diff]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <BadenBackground>
      <View style={s.bdnCont}>
        <View style={s.topHeadBar}>
          <TouchableOpacity
            onPress={() => nav.goBack()}
            style={s.backButn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={s.badenTtl}>Crosswords</Text>
        </View>

        <Text style={s.badenSub}>
          New difficulty levels unlock after 4 completed crosswords.
        </Text>

        <View style={{ height: 26 }} />

        <Image source={require('../HeritageAssts/imgs/topicsWm.png')} />

        {levelBtn('easy', '#075100')}
        {levelBtn('medium', '#030051')}
        {levelBtn('hard', '#706C00')}
        {levelBtn('extreme', '#510000')}
      </View>
    </BadenBackground>
  );
}

const s = StyleSheet.create({
  bdnCont: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  badenTtl: { color: '#FFFFFF', fontWeight: '700', fontSize: 22 },
  badenSub: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  topHeadBar: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
    width: '100%',
  },

  backButn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '70%',
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
});
