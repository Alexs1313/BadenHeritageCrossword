import { createStackNavigator } from '@react-navigation/stack';
import BadenHeritageLdng from '../BadenHeritageComponents/BadenHeritageLdng';
import BadenHeritageIntroduce from '../BadenHeritageComponents/BadenHeritageIntroduce';
import BadenHeritageHome from '../BadenHeritageComponents/BadenHeritageHome';
import CrosswordTopics from './CrosswordTopics';
import CrosswordLevels from './CrosswordLevels';
import CrosswordGameScreen from './CrosswordGameScreen';
import BadenWallpapersScreen from '../BadenHeritageComponents/BadenWallpapersScreen';
import BadenFactsScreen from '../BadenHeritageComponents/BadenFactsScreen';
import BadenAchievementsScreen from '../BadenHeritageComponents/BadenAchievementsScreen';

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
    </HeritageStck.Navigator>
  );
};

export default BadenHeritageStack;
