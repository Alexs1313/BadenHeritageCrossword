import { createStackNavigator } from '@react-navigation/stack';
import BadenHeritageLdng from '../Heritagecomponents/BadenHeritageLdng';
import BadenHeritageIntroduce from '../Heritagecomponents/BadenHeritageIntroduce';
import BadenHeritageHome from '../Heritagecomponents/BadenHeritageHome';
import CrosswordTopics from './CrosswordTopics';
import CrosswordLevels from './CrosswordLevels';
import CrosswordGameScreen from './CrosswordGameScreen';
import BadenWallpapersScreen from '../Heritagecomponents/BadenWallpapersScreen';
import BadenFactsScreen from '../Heritagecomponents/BadenFactsScreen';
import BadenAchievementsScreen from '../Heritagecomponents/BadenAchievementsScreen';
import Exploreartclsscrn from '../Heritagecomponents/Exploreartclsscrn';
import Exploreartclsscrndetails from '../Heritagecomponents/Exploreartclsscrndetails';

const HeritageStck = createStackNavigator();

const BadenHeritageStack = () => {
  return (
    <HeritageStck.Navigator screenOptions={{ headerShown: false }}>
      <HeritageStck.Screen
        name="BadenHeritageLdng"
        component={BadenHeritageLdng}
      />
      <HeritageStck.Screen
        name="BadenHeritageIntroduce"
        component={BadenHeritageIntroduce}
      />
      <HeritageStck.Screen
        name="BadenHeritageHome"
        component={BadenHeritageHome}
      />
      <HeritageStck.Screen name="CrosswordTopics" component={CrosswordTopics} />
      <HeritageStck.Screen name="CrosswordLevels" component={CrosswordLevels} />
      <HeritageStck.Screen
        name="CrosswordGameScreen"
        component={CrosswordGameScreen}
      />
      <HeritageStck.Screen
        name="BadenWallpapersScreen"
        component={BadenWallpapersScreen}
      />
      <HeritageStck.Screen
        name="BadenFactsScreen"
        component={BadenFactsScreen}
      />
      <HeritageStck.Screen
        name="BadenAchievementsScreen"
        component={BadenAchievementsScreen}
      />
      <HeritageStck.Screen
        name="Exploreartclsscrn"
        component={Exploreartclsscrn}
      />
      <HeritageStck.Screen
        name="Exploreartclsscrndetails"
        component={Exploreartclsscrndetails}
      />
    </HeritageStck.Navigator>
  );
};

export default BadenHeritageStack;
