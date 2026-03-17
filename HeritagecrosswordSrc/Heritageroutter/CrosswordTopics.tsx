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

import { BADEN_CROSSWORDS } from '../uttils/badenCrosswords';
import ExplrrLayout from '../Heritagecomponents/ExplrrLayout';

export default function CrosswordTopics() {
  const explorCrosswNav = useNavigation<any>();
  const { height: explorCrosswHeight } = useWindowDimensions();

  return (
    <ExplrrLayout>
      <View
        style={[
          explorCrosswStyles.explorCrosswBadnContainer,
          { paddingTop: explorCrosswHeight * 0.07 },
        ]}
      >
        <View style={explorCrosswStyles.explorCrosswTopBadnHeadBar}>
          <TouchableOpacity
            onPress={() => explorCrosswNav.goBack()}
            style={explorCrosswStyles.explorCrosswBackBdnBtn}
            activeOpacity={0.5}
          >
            <Image source={require('../HeritageAssts/imgs/back_ar.png')} />
          </TouchableOpacity>

          <Text style={explorCrosswStyles.explorCrosswHeritTitle}>Topics</Text>
          <View style={{ width: 36 }} />
        </View>

        {BADEN_CROSSWORDS.map(explorCrosswTopic => (
          <TouchableOpacity
            key={explorCrosswTopic.id}
            style={explorCrosswStyles.explorCrosswBadnCard}
            onPress={() =>
              explorCrosswNav.navigate('CrosswordLevels', {
                topicId: explorCrosswTopic.id,
              })
            }
            activeOpacity={0.9}
          >
            <Image
              source={explorCrosswTopic.cover}
              style={explorCrosswStyles.explorCrosswCover}
            />
            <Text style={explorCrosswStyles.explorCrosswBadnCardText}>
              {explorCrosswTopic.title}
            </Text>
            <Image source={require('../HeritageAssts/imgs/play.png')} />
          </TouchableOpacity>
        ))}
      </View>
    </ExplrrLayout>
  );
}

const explorCrosswStyles = StyleSheet.create({
  explorCrosswBadnContainer: {
    flex: 1,
    paddingHorizontal: 18,
  },

  explorCrosswTopBadnHeadBar: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },

  explorCrosswBackBdnBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  explorCrosswHeritTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  explorCrosswBadnTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 18,
  },

  explorCrosswBadnCard: {
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

  explorCrosswCover: {
    width: 104,
    height: 104,
    borderRadius: 16,
    marginRight: 14,
  },

  explorCrosswBadnCardText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
