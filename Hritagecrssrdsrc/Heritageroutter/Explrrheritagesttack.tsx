import { createStackNavigator } from '@react-navigation/stack';

import CrosswordTopics from './CrosswordTopics';
import CrosswordLevels from './CrosswordLevels';
import CrosswordGameScreen from './CrosswordGameScreen';

import BadenFactsScreen from '../Heritagecomponents/Explrfactsscrn';

import Exploreartclsscrn from '../Heritagecomponents/Exploreartclsscrn';
import Exploreartclsscrndetails from '../Heritagecomponents/Exploreartclsscrndetails';
import Explrrachievementsscrn from '../Heritagecomponents/Explrrachievementsscrn';
import Explrfactsscrn from '../Heritagecomponents/Explrfactsscrn';
import Explrrwallpapersscrn from '../Heritagecomponents/Explrrwallpapersscrn';
import Explrheritageldng from '../Heritagecomponents/Explrheritageldng';
import Explreritageintroduce from '../Heritagecomponents/Explreritageintroduce';
import Explreritagehome from '../Heritagecomponents/Explreritagehome';

const HeritageStck = createStackNavigator();

const Explrrheritagesttack = () => {
  return (
    <HeritageStck.Navigator screenOptions={{ headerShown: false }}>
      <HeritageStck.Screen
        name="Explrheritageldng"
        component={Explrheritageldng}
      />
      <HeritageStck.Screen
        name="Explreritageintroduce"
        component={Explreritageintroduce}
      />
      <HeritageStck.Screen
        name="Explreritagehome"
        component={Explreritagehome}
      />
      <HeritageStck.Screen name="CrosswordTopics" component={CrosswordTopics} />
      <HeritageStck.Screen name="CrosswordLevels" component={CrosswordLevels} />
      <HeritageStck.Screen
        name="CrosswordGameScreen"
        component={CrosswordGameScreen}
      />
      <HeritageStck.Screen
        name="Explrrwallpapersscrn"
        component={Explrrwallpapersscrn}
      />
      <HeritageStck.Screen
        name="BadenFactsScreen"
        component={BadenFactsScreen}
      />
      <HeritageStck.Screen name="Explrfactsscrn" component={Explrfactsscrn} />
      <HeritageStck.Screen
        name="Explrrachievementsscrn"
        component={Explrrachievementsscrn}
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

export default Explrrheritagesttack;
