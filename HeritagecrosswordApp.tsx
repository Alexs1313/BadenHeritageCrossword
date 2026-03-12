import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';
import BadenHeritageStack from './HeritagecrosswordSrc/Heritageroutter/BadenHeritageStack';
import { ContextProvider } from './HeritagecrosswordSrc/[Heritagecontxtt]/badenContext';

const HeritagecrosswordApp = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <BadenHeritageStack />
      </ContextProvider>
      <Toast position="top" topOffset={45} />
    </NavigationContainer>
  );
};

export default HeritagecrosswordApp;
