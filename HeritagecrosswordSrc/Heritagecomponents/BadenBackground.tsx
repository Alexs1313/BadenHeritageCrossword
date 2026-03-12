import { ImageBackground, ScrollView } from 'react-native';

const BadenBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageBackground
      source={require('../HeritageAssts/imgs/baden_b.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default BadenBackground;
