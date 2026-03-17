import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Difficulty } from '../uttils/badenCrosswords';
import { useCrosswordProgress } from '../uttils/useCrosswordProgress';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import ExplrrLayout from '../Heritagecomponents/ExplrrLayout';

const explorCrosswDifficultyLabel: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  extreme: 'Extreme',
};

export default function CrosswordLevels() {
  const explorCrosswNav = useNavigation<any>();
  const explorCrosswRoute = useRoute<any>();
  const { topicId: explorCrosswTopicId } = explorCrosswRoute.params;
  const { isUnlocked: explorCrosswIsUnlocked, reload: explorCrosswReload } =
    useCrosswordProgress();

  useFocusEffect(
    useCallback(() => {
      explorCrosswReload();
    }, [explorCrosswReload]),
  );

  const explorCrosswLevelBtn = (
    explorCrosswDiff: Difficulty,
    explorCrosswBg: string,
  ) => {
    const explorCrosswUnlocked = explorCrosswIsUnlocked[explorCrosswDiff];

    return (
      <TouchableOpacity
        key={explorCrosswDiff}
        activeOpacity={0.9}
        disabled={!explorCrosswUnlocked}
        onPress={() =>
          explorCrosswNav.navigate('CrosswordGameScreen', {
            topicId: explorCrosswTopicId,
            difficulty: explorCrosswDiff,
          })
        }
        style={[
          explorCrosswStyles.explorCrosswBtn,
          {
            backgroundColor: explorCrosswBg,
            opacity: explorCrosswUnlocked ? 1 : 0.5,
          },
        ]}
      >
        <Text style={explorCrosswStyles.explorCrosswBtnText}>
          {explorCrosswDifficultyLabel[explorCrosswDiff]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ExplrrLayout>
      <View style={explorCrosswStyles.explorCrosswBdnCont}>
        <View style={explorCrosswStyles.explorCrosswTopHeadBar}>
          <TouchableOpacity
            onPress={() => explorCrosswNav.goBack()}
            style={explorCrosswStyles.explorCrosswBackBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={explorCrosswStyles.explorCrosswBadenTitle}>
            Crosswords
          </Text>
        </View>

        <Text style={explorCrosswStyles.explorCrosswBadenSub}>
          New difficulty levels unlock after 4 completed crosswords.
        </Text>

        <View style={{ height: 26 }} />

        <Image source={require('../HeritageAssts/imgs/topicsWm.png')} />

        {explorCrosswLevelBtn('easy', '#075100')}
        {explorCrosswLevelBtn('medium', '#030051')}
        {explorCrosswLevelBtn('hard', '#706C00')}
        {explorCrosswLevelBtn('extreme', '#510000')}
      </View>
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswBdnCont: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 5,
    alignItems: 'center',
  },

  explorCrosswBadenTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
  },

  explorCrosswBadenSub: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },

  explorCrosswTopHeadBar: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    width: '100%',
  },

  explorCrosswBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 14,
  },

  explorCrosswBtn: {
    width: '70%',
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  explorCrosswBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
});
