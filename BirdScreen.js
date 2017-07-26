import Expo from 'expo';
import React from 'react';
import { Alert, PanResponder, Text, TouchableHighlight, View, Dimensions } from 'react-native';

import Assets from './Assets';
import Game from './Game';

var {height, width} = Dimensions.get('window');
//// App

// This is the root component of the app. It does any loading required
// then renders `Game`.

class BirdScreen extends React.Component {

  constructor(props) {
      super(props);
  }

  state = {
    loaded: false,
  };

  componentWillMount() {
    // THREE warns about unavailable WebGL extensions.
    console.disableYellowBox = true;

    this.load();
  }

  // Do stuff that needs to be done before first render of scene.
  async load() {
    try {
      // Load assets
      await Promise.all(
        Object.keys(Assets).map(name => Assets[name].downloadAsync())
      );

      // We're good to go!
      this.setState({ loaded: true });
    } catch (e) {
      Alert.alert('Error when loading', e.message);
    }
  }

  onBackPress() {
    if (this.state.loaded) {
      this.setState({ loaded: false });
      this.props.navigator.push('home');
    }
  }

  render() {
    return this.state.loaded
      ? <View style={{backgroundColor: '#35b3c6'}}>
        <View style={{ height: height - 65, width: width}}>
            <Game style={{ flex: 1, height: height - 65, width: width }} />
        </View>
          <TouchableHighlight
            style={{
              height: 45,
              alignSelf: 'stretch',
              backgroundColor: '#75A0D1',
              marginTop: 10,
              marginLeft: 10,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
             }}
             onPress={this.onBackPress.bind(this)}>
            <Text
            style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#FAFAFA',
             }}> Return and Reconnect </Text>
          </TouchableHighlight>
          <Text> </Text>
        </View>
      : <Expo.Components.AppLoading />;
  }
}

export default BirdScreen;
