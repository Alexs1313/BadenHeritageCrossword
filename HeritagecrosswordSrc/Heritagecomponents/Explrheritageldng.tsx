import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { useNavigation } from '@react-navigation/native';

const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1"
  />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loader {
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: visible;
    }

    .loader span {
      width: 50px;
      height: 50px;
      margin: -5px;
      animation: dots_411 1.5s infinite ease-in-out;
      display: inline-flex;
    }

    .loader span:nth-child(1) {
      animation-delay: -0.40s;
    }

    .loader span:nth-child(2) {
      animation-delay: -0.25s;
    }

    .loader span:nth-child(3) {
      animation-delay: -0.10s;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    @keyframes dots_411 {
      5% {
        opacity: 0;
      }

      0%, 80%, 100% {
        transform: scale(0);
      }

      40% {
        transform: scale(0.8);
      }
    }
  </style>
</head>
<body>
  <div class="loader">
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#470BA9"
          d="M158 77c6 23-8 48-28 63-21 16-49 21-68 8-19-12-28-43-20-68s33-45 58-45c26 0 52 20 58 42z"/>
      </svg>
    </span>
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#470BA9"
          d="M158 77c6 23-8 48-28 63-21 16-49 21-68 8-19-12-28-43-20-68s33-45 58-45c26 0 52 20 58 42z"/>
      </svg>
    </span>
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path fill="#470BA9"
          d="M158 77c6 23-8 48-28 63-21 16-49 21-68 8-19-12-28-43-20-68s33-45 58-45c26 0 52 20 58 42z"/>
      </svg>
    </span>
  </div>
</body>
</html>
`;

const Explrheritageldng = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Explreritageintroduce');
    }, 5000);
  }, [navigation]);

  return (
    <ImageBackground
      style={[
        explorCrosswStyles.container,
        Platform.OS === 'ios' && { backgroundColor: '#060500' },
      ]}
      source={
        Platform.OS === 'ios'
          ? null
          : require('../HeritageAssts/imgs/bdnheritgloader.png')
      }
    >
      <ScrollView
        contentContainerStyle={explorCrosswStyles.containerScroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={require('../HeritageAssts/imgs/bdnheritgloaderr.png')}
          />
        </View>

        <View style={explorCrosswStyles.webviewDock}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={explorCrosswStyles.webview}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const explorCrosswStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerScroll: {
    flexGrow: 1,
  },

  logoWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 650,
  },

  webviewDock: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },

  webview: {
    width: 360,
    height: 80,
    backgroundColor: 'transparent',
  },
});

export default Explrheritageldng;
