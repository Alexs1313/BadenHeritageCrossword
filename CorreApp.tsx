import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';

import { ContextProvider } from './Hritagecrssrdsrc/[Heritagecontxtt]/badenContext';
import Explrrheritagesttack from './Hritagecrssrdsrc/Heritageroutter/Explrrheritagesttack';

const CorreApp = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <Explrrheritagesttack />
        <Toast position="top" topOffset={45} />
      </ContextProvider>
    </NavigationContainer>
  );
};

export default CorreApp;
