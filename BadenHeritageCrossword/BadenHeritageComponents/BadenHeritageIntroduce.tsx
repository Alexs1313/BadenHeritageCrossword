import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import BadenBackground from './BadenBackground';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const BadenHeritageIntroduce = () => {
  const { height: badenH } = useWindowDimensions();
  const sPhone = badenH < 700;
  const badenNav = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <BadenBackground>
      <View style={stSheet.badenContainer}>
        <ImageBackground
          style={stSheet.badenBlurBack}
          source={require('../HeritageAssts/imgs/badenobrblur.png')}
        >
          {currentPage === 0 && (
            <Image source={require('../HeritageAssts/imgs/badenobr1.png')} />
          )}
          {currentPage === 1 && (
            <Image source={require('../HeritageAssts/imgs/badenobr2.png')} />
          )}
          {currentPage === 2 && (
            <Image source={require('../HeritageAssts/imgs/badenobr3.png')} />
          )}
          {currentPage === 3 && (
            <Image source={require('../HeritageAssts/imgs/badenobr4.png')} />
          )}
        </ImageBackground>

        <View style={stSheet.badenWelcView}>
          <Text style={[stSheet.badenWelcText, sPhone && { fontSize: 18 }]}>
            {currentPage === 0 && 'Baden Heritage Crossword'}
            {currentPage === 1 && 'Five Thematic Categories'}
            {currentPage === 2 && 'Structured Progress'}
            {currentPage === 3 && 'Facts and Achievements'}
          </Text>
          <Text style={[stSheet.badenDescText, sPhone && { fontSize: 16 }]}>
            {currentPage === 0 &&
              'A curated crossword inspired by the cultural heritage and intellectual tradition of Baden.'}
            {currentPage === 1 &&
              'Thermal culture, classical arts, architecture, society, and symbols. Each crossword follows a clear theme.'}
            {currentPage === 2 &&
              ' Difficulty levels unlock gradually as you complete crosswords and move forward.'}
            {currentPage === 3 &&
              ' Correct solutions unlock contextual facts and record your progress through achievements.'}
          </Text>
        </View>

        <TouchableOpacity
          style={stSheet.badenNextBtn}
          onPress={() =>
            currentPage === 3
              ? badenNav.replace('BadenHeritageHome')
              : setCurrentPage(currentPage + 1)
          }
        >
          <Text style={[stSheet.badenNextText, sPhone && { fontSize: 16 }]}>
            {currentPage === 3 ? 'Start' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </BadenBackground>
  );
};

const stSheet = StyleSheet.create({
  badenContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  badenBlurBack: {
    width: 329,
    height: 359,
    justifyContent: 'center',
    alignItems: 'center',
    top: 25,
  },
  badenWelcView: {
    width: '85%',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1C1E22A6',
    borderRadius: 22,
    paddingHorizontal: 30,
  },
  badenWelcText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 22,
    textAlign: 'center',
  },
  badenDescText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  badenNextBtn: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  badenNextText: {
    fontSize: 18,
    color: '#C9A24D',
    fontWeight: '700',
  },
});

export default BadenHeritageIntroduce;
