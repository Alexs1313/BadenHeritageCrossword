import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';

import { ContextProvider } from './HeritagecrosswordSrc/[Heritagecontxtt]/badenContext';
import Explrrheritagesttack from './HeritagecrosswordSrc/Heritageroutter/Explrrheritagesttack';

const HeritagecrosswordApp = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <Explrrheritagesttack />
      </ContextProvider>
      <Toast position="top" topOffset={45} />
    </NavigationContainer>
  );
};

export default HeritagecrosswordApp;
