import Expo from 'expo';
import React from 'react';
import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@expo/ex-navigation';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';

const styles = StyleSheet.create({
  button: {
     height: 45,
     alignSelf: 'stretch',
     backgroundColor: '#75A0D1',
     marginTop: 10,
     marginLeft: 10,
     marginRight: 10,
     alignItems: 'center',
     justifyContent: 'center',
  },
  containerStyle: {
     flex: 1,
     justifyContent: 'flex-end',
     paddingTop: 24,
     marginLeft: 10,
     backgroundColor: '#F7F7F7',
     paddingBottom: 10,
  }
});

class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onReturnPress = this.onReturnPress.bind(this);
  }

  onReturnPress() {
    this.props.navigator.push('home');
  }

  onBirdPress() {
    this.props.navigator.push('bird');
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <TouchableHighlight style={styles.button} onPress={this.onBirdPress.bind(this)}>
          <Text>Play Flappy Plane</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button}>
          <Text>Play Physics Pool</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.onReturnPress}>
          <Text>Return and Reconnect</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default GameScreen;
