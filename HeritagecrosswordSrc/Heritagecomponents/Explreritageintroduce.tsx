import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import ExplrrLayout from './ExplrrLayout';

const Explreritageintroduce = () => {
  const { height: explorCrosswH } = useWindowDimensions();
  const explorCrosswIsSmallPhone = explorCrosswH < 700;
  const explorCrosswNav = useNavigation();
  const [explorCrosswCurrentPage, setExplorCrosswCurrentPage] = useState(0);

  return (
    <ExplrrLayout>
      <View style={explorCrosswStyles.explorCrosswContainer}>
        <ImageBackground
          style={explorCrosswStyles.explorCrosswBlurBack}
          source={require('../HeritageAssts/imgs/badenobrblur.png')}
        >
          {explorCrosswCurrentPage === 0 && (
            <Image source={require('../HeritageAssts/imgs/badenobr1.png')} />
          )}
          {explorCrosswCurrentPage === 1 && (
            <Image source={require('../HeritageAssts/imgs/badenobr2.png')} />
          )}
          {explorCrosswCurrentPage === 2 && (
            <Image source={require('../HeritageAssts/imgs/badenobr3.png')} />
          )}
          {explorCrosswCurrentPage === 3 && (
            <Image source={require('../HeritageAssts/imgs/badenobr4.png')} />
          )}
          {explorCrosswCurrentPage === 4 && (
            <Image
              source={require('../HeritageAssts/imgs/heritagecroon1.png')}
            />
          )}
        </ImageBackground>

        <View style={explorCrosswStyles.explorCrosswWelcView}>
          {explorCrosswCurrentPage === 0 && (
            <Text
              style={[
                explorCrosswStyles.explorCrosswWelcText,
                explorCrosswIsSmallPhone && { fontSize: 18 },
              ]}
            >
              {Platform.OS === 'ios'
                ? 'BadenBabeп: Heritage Word'
                : 'Baden Heritage Explorer'}
            </Text>
          )}

          <Text
            style={[
              explorCrosswStyles.explorCrosswWelcText,
              explorCrosswIsSmallPhone && { fontSize: 18 },
            ]}
          >
            {explorCrosswCurrentPage === 1 && 'Five Thematic Categories'}
            {explorCrosswCurrentPage === 2 && 'Structured Progress'}
            {explorCrosswCurrentPage === 3 && 'Facts and Achievements'}
            {explorCrosswCurrentPage === 4 && 'Articles and Knowledge'}
          </Text>

          <Text
            style={[
              explorCrosswStyles.explorCrosswDescText,
              explorCrosswIsSmallPhone && { fontSize: 16 },
            ]}
          >
            {explorCrosswCurrentPage === 0 &&
              'A curated crossword inspired by the cultural heritage and intellectual tradition of Baden.'}
            {explorCrosswCurrentPage === 1 &&
              'Thermal culture, classical arts, architecture, society, and symbols. Each crossword follows a clear theme.'}
            {explorCrosswCurrentPage === 2 &&
              'Difficulty levels unlock gradually as you complete crosswords and move forward.'}
            {explorCrosswCurrentPage === 3 &&
              'Correct solutions unlock contextual facts and record your progress through achievements.'}
            {explorCrosswCurrentPage === 4 &&
              'Explore short articles about the history, culture, and architecture of Baden.'}
          </Text>
        </View>

        <TouchableOpacity
          style={explorCrosswStyles.explorCrosswNextBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.8}
          onPress={() =>
            explorCrosswCurrentPage === 4
              ? explorCrosswNav.replace('Explreritagehome')
              : setExplorCrosswCurrentPage(explorCrosswCurrentPage + 1)
          }
        >
          <Text
            style={[
              explorCrosswStyles.explorCrosswNextText,
              explorCrosswIsSmallPhone && { fontSize: 16 },
            ]}
          >
            {explorCrosswCurrentPage === 4 ? 'Begin' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </ExplrrLayout>
  );
};

const explorCrosswStyles = StyleSheet.create({
  explorCrosswContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  explorCrosswBlurBack: {
    width: 329,
    height: 359,
    justifyContent: 'center',
    alignItems: 'center',
    top: 25,
  },

  explorCrosswWelcView: {
    width: '85%',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1C1E22A6',
    borderRadius: 22,
    paddingHorizontal: 30,
    minHeight: 180,
    justifyContent: 'center',
  },

  explorCrosswWelcText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 22,
    textAlign: 'center',
  },

  explorCrosswDescText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },

  explorCrosswNextBtn: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },

  explorCrosswNextText: {
    fontSize: 18,
    color: '#C9A24D',
    fontWeight: '700',
  },
});

export default Explreritageintroduce;
