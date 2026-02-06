import { NavigationContainer } from '@react-navigation/native';
import BadenHeritageStack from './BadenHeritageCrossword/BadenHeritageRoute/BadenHeritageStack';
import { ContextProvider } from './BadenHeritageCrossword/HeritageStore/badenContext';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <BadenHeritageStack />
      </ContextProvider>
      <Toast position="top" topOffset={45} />
    </NavigationContainer>
  );
};

export default App;
