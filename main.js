import Expo from 'expo';
import React from 'react';
import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@expo/ex-navigation';
import HomeScreen from './HomeScreen.js';
import GameScreen from './GameScreen.js';

const Router = createRouter(() => ({
  home: () => HomeScreen,
  game: () => GameScreen,
}));

class App extends React.Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute="home" />
      </NavigationProvider>
    );
  }
}

Expo.registerRootComponent(App);
